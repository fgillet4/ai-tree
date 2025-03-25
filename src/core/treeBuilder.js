const path = require('path');

/**
 * Build a tree structure from an array of file paths
 * 
 * @param {string[]} files - Array of file paths
 * @param {string} rootDir - Root directory
 * @returns {Object} Tree structure
 */
function buildTree(files, rootDir) {
  const tree = {
    name: path.basename(rootDir),
    path: rootDir,
    type: 'directory',
    children: {}
  };
  
  // Sort files to ensure directories come before their contents
  files.sort();
  
  for (const file of files) {
    addToTree(tree, file, rootDir);
  }
  
  // Convert children from object to array for easier rendering
  return processTree(tree);
}

/**
 * Add a file to the tree structure
 * 
 * @param {Object} tree - Tree structure
 * @param {string} filePath - File path
 * @param {string} rootDir - Root directory
 */
function addToTree(tree, filePath, rootDir) {
  // Get path relative to root directory
  const relativePath = path.relative(rootDir, filePath);
  if (!relativePath) return; // Skip root dir
  
  const parts = relativePath.split(path.sep);
  let current = tree;
  
  // Build tree structure for each part of the path
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const isLast = i === parts.length - 1;
    const isFile = isLast && !filePath.endsWith(path.sep);
    const itemPath = path.join(rootDir, ...parts.slice(0, i + 1));
    
    if (!current.children[part]) {
      current.children[part] = {
        name: part,
        path: itemPath,
        type: isFile ? 'file' : 'directory',
        children: {}
      };
    }
    
    current = current.children[part];
  }
}

/**
 * Process tree to convert children from object to array for easier rendering
 * 
 * @param {Object} node - Tree node
 * @returns {Object} Processed node
 */
function processTree(node) {
  // Convert children object to array
  const childrenArray = Object.values(node.children)
    .map(child => processTree(child))
    .sort((a, b) => {
      // Sort directories first, then by name
      if (a.type === 'directory' && b.type === 'file') return -1;
      if (a.type === 'file' && b.type === 'directory') return 1;
      return a.name.localeCompare(b.name);
    });
  
  return {
    name: node.name,
    path: node.path,
    type: node.type,
    children: childrenArray
  };
}

/**
 * Get stats about a tree (number of files, dirs, etc.)
 * 
 * @param {Object} tree - Tree structure
 * @returns {Object} Stats
 */
function getTreeStats(tree) {
  let files = 0;
  let directories = 0;
  let maxDepth = 0;
  
  function traverse(node, depth = 0) {
    if (node.type === 'file') {
      files++;
    } else {
      directories++;
    }
    
    maxDepth = Math.max(maxDepth, depth);
    
    for (const child of node.children) {
      traverse(child, depth + 1);
    }
  }
  
  traverse(tree);
  
  return {
    files,
    directories,
    maxDepth,
    total: files + directories
  };
}

module.exports = {
  buildTree,
  getTreeStats
};