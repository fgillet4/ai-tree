/**
 * Format a tree structure for markdown output
 * 
 * @param {Object} tree - Tree structure
 * @param {Object} options - Format options
 * @returns {string} Formatted tree
 */
function format(tree, options = {}) {
    let output = `# ${tree.name} Project Structure\n\n`;
    
    // Add summary if requested
    if (options.summary) {
      const stats = require('../core/treeBuilder').getTreeStats(tree);
      output += `## Summary\n\n`;
      output += `- Total files: ${stats.files}\n`;
      output += `- Total directories: ${stats.directories}\n`;
      output += `- Max depth: ${stats.maxDepth}\n\n`;
    }
    
    output += `## Directory Structure\n\n`;
    output += '```\n';
    output += tree.name + '\n';
    
    // Generate tree structure
    for (let i = 0; i < tree.children.length; i++) {
      const child = tree.children[i];
      const isLast = i === tree.children.length - 1;
      output += formatNode(child, '', isLast);
    }
    
    output += '```\n\n';
    
    // Add file extensions summary if requested
    if (options.summary) {
      output += generateExtensionsSummary(tree);
    }
    
    return output;
  }
  
  /**
   * Format a single node in the tree
   * 
   * @param {Object} node - Tree node
   * @param {string} prefix - Line prefix for indentation
   * @param {boolean} isLast - Whether this is the last child
   * @returns {string} Formatted node
   */
  function formatNode(node, prefix, isLast) {
    const connector = isLast ? '└── ' : '├── ';
    const newPrefix = prefix + (isLast ? '    ' : '│   ');
    
    let output = `${prefix}${connector}${node.name}\n`;
    
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      const isChildLast = i === node.children.length - 1;
      output += formatNode(child, newPrefix, isChildLast);
    }
    
    return output;
  }
  
  /**
   * Generate a summary of file extensions in the tree
   * 
   * @param {Object} tree - Tree structure
   * @returns {string} Extensions summary
   */
  function generateExtensionsSummary(tree) {
    const extensions = {};
    
    function collectExtensions(node) {
      if (node.type === 'file') {
        const extMatch = node.name.match(/\.([^.]+)$/);
        const ext = extMatch ? `.${extMatch[1].toLowerCase()}` : '(no extension)';
        
        if (!extensions[ext]) {
          extensions[ext] = 0;
        }
        extensions[ext]++;
      }
      
      for (const child of node.children) {
        collectExtensions(child);
      }
    }
    
    collectExtensions(tree);
    
    let output = '## File Types\n\n';
    output += '| Extension | Count |\n';
    output += '|-----------|-------|\n';
    
    Object.entries(extensions)
      .sort((a, b) => b[1] - a[1])
      .forEach(([ext, count]) => {
        output += `| ${ext} | ${count} |\n`;
      });
    
    return output;
  }
  
  module.exports = {
    format
  };