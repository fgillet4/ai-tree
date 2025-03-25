const fs = require('fs').promises;
const path = require('path');
const glob = require('glob');
const ignoreParser = require('./ignoreParser');

/**
 * Scan a directory recursively to get all files and directories
 * 
 * @param {string} rootDir - Root directory to scan
 * @param {string[]} ignorePatterns - Patterns to ignore
 * @param {number} maxDepth - Maximum depth to scan
 * @param {boolean} onlyDirs - Show only directories, not files
 * @param {string} pattern - Glob pattern to match files
 * @returns {Promise<Array>} Array of file paths
 */
async function scanDirectory(rootDir, ignorePatterns = [], maxDepth = 10, onlyDirs = false, pattern = null) {
  const ignoreChecker = ignoreParser.createIgnoreChecker(ignorePatterns);
  const relativeRootDir = path.relative(process.cwd(), rootDir) || '.';
  
  // Use glob for pattern matching if provided
  if (pattern) {
    return new Promise((resolve, reject) => {
      glob(pattern, { 
        cwd: rootDir,
        dot: true,
        nodir: !onlyDirs,
        ignore: ignorePatterns
      }, (err, matches) => {
        if (err) {
          reject(err);
          return;
        }
        
        // Convert matches to full paths and filter by maxDepth
        const results = matches
          .filter(file => {
            const depth = file.split(path.sep).length;
            return depth <= maxDepth;
          })
          .map(file => path.join(relativeRootDir, file));
          
        resolve(results);
      });
    });
  }
  
  // Otherwise do manual recursive scanning
  const results = [];
  
  async function scan(dir, currentDepth = 0) {
    if (currentDepth > maxDepth) return;
    
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(rootDir, fullPath);
      
      // Skip if matched by ignore patterns
      if (ignoreChecker(relativePath)) continue;
      
      if (entry.isDirectory()) {
        results.push(fullPath);
        await scan(fullPath, currentDepth + 1);
      } else if (!onlyDirs) {
        results.push(fullPath);
      }
    }
  }
  
  await scan(rootDir);
  return results.map(file => path.relative(process.cwd(), file));
}

module.exports = {
  scanDirectory
};