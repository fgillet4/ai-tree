const chalk = require('chalk');
const path = require('path');

/**
 * Format a tree structure for console output
 * 
 * @param {Object} tree - Tree structure
 * @param {Object} options - Format options
 * @returns {string} Formatted tree
 */
function format(tree, options = {}) {
  let output = `${chalk.bold(tree.name)}\n`;
  
  // Generate tree structure
  output += formatNode(tree, '', true, options);
  
  return output;
}

/**
 * Format a single node in the tree
 * 
 * @param {Object} node - Tree node
 * @param {string} prefix - Line prefix for indentation
 * @param {boolean} isRoot - Whether this is the root node
 * @param {Object} options - Format options
 * @returns {string} Formatted node
 */
function formatNode(node, prefix = '', isRoot = false, options = {}) {
  let output = '';
  
  if (isRoot) {
    // Skip the root node itself
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      const isLast = i === node.children.length - 1;
      output += formatNodeLine(child, prefix, isLast, options);
    }
  } else {
    // Process children
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      const isLast = i === node.children.length - 1;
      output += formatNodeLine(child, prefix, isLast, options);
    }
  }
  
  return output;
}

/**
 * Format a single line in the tree
 * 
 * @param {Object} node - Tree node
 * @param {string} prefix - Line prefix for indentation
 * @param {boolean} isLast - Whether this is the last child
 * @param {Object} options - Format options
 * @returns {string} Formatted line
 */
function formatNodeLine(node, prefix, isLast, options) {
  // Generate the symbols for the tree structure
  const connector = isLast ? '└── ' : '├── ';
  const newPrefix = prefix + (isLast ? '    ' : '│   ');
  
  // Format the node name based on type
  let nodeName = node.name;
  if (node.type === 'directory') {
    nodeName = chalk.blue.bold(nodeName);
  } else {
    const ext = path.extname(nodeName).toLowerCase();
    
    // Color different file types
    if (['.js', '.ts', '.jsx', '.tsx'].includes(ext)) {
      nodeName = chalk.yellow(nodeName);
    } else if (['.json', '.yml', '.yaml', '.xml', '.toml'].includes(ext)) {
      nodeName = chalk.cyan(nodeName);
    } else if (['.md', '.txt', '.log'].includes(ext)) {
      nodeName = chalk.green(nodeName);
    } else if (['.html', '.css', '.scss', '.sass', '.less'].includes(ext)) {
      nodeName = chalk.magenta(nodeName);
    } else if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.ico'].includes(ext)) {
      nodeName = chalk.red(nodeName);
    }
  }
  
  let output = `${prefix}${connector}${nodeName}\n`;
  
  // Process children recursively
  output += formatNode(node, newPrefix, false, options);
  
  return output;
}

module.exports = {
  format
};