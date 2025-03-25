const fs = require('fs');
const ignore = require('ignore');
const path = require('path');

/**
 * Parse an ignore file and return the patterns
 * 
 * @param {string} ignorePath - Path to the ignore file
 * @returns {string[]} Array of ignore patterns
 */
function parseIgnoreFile(ignorePath) {
  try {
    const content = fs.readFileSync(ignorePath, 'utf8');
    const patterns = content
      .split('\n')
      .map(line => line.trim())
      // Remove comments and empty lines
      .filter(line => line && !line.startsWith('#'));
    
    return patterns;
  } catch (err) {
    console.warn(`Warning: Couldn't read ignore file at ${ignorePath}:`, err.message);
    return [];
  }
}

/**
 * Create a function that checks if a path should be ignored
 * 
 * @param {string[]} patterns - Array of ignore patterns
 * @returns {Function} Function that checks if a path should be ignored
 */
function createIgnoreChecker(patterns) {
  if (!patterns || patterns.length === 0) {
    return () => false; // Don't ignore anything if no patterns
  }
  
  const ig = ignore().add(patterns);
  
  return (filePath) => {
    // Normalize path for cross-platform compatibility
    const normalizedPath = filePath.split(path.sep).join('/');
    return ig.ignores(normalizedPath);
  };
}

/**
 * Generate a default .treeignore file content
 * 
 * @returns {string} Default ignore file content
 */
function generateDefaultIgnore() {
  return `# Default .treeignore file for ai-tree
# Lines starting with # are comments

# Node.js
node_modules/
npm-debug.log
package-lock.json
yarn.lock
yarn-error.log

# Build output
dist/
build/
out/
.next/
.nuxt/
.cache/

# Common directories to ignore
.git/
.github/
.vscode/
.idea/
.DS_Store
coverage/
tmp/
temp/

# Environment variables
.env
.env.local
.env.development
.env.test
.env.production

# Logs
logs/
*.log

# Common large file types
*.zip
*.tar.gz
*.tgz
*.rar
*.jar
*.war
*.ear
*.iso
*.dmg
*.exe
*.dll
*.so
*.dylib

# Common binary formats
*.jpg
*.jpeg
*.png
*.gif
*.ico
*.pdf
*.mp3
*.mp4
*.mov
*.avi
*.7z

# Add your custom ignore patterns below
`;
}

module.exports = {
  parseIgnoreFile,
  createIgnoreChecker,
  generateDefaultIgnore
};