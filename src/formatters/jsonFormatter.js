/**
 * Format a tree structure for JSON output
 * 
 * @param {Object} tree - Tree structure
 * @param {Object} options - Format options
 * @returns {string} Formatted JSON
 */
function format(tree, options = {}) {
    // Create output structure
    const output = {
      name: tree.name,
      path: tree.path,
      type: tree.type,
      children: tree.children
    };
    
    // Add stats if summary is requested
    if (options.summary) {
      const treeStats = require('../core/treeBuilder').getTreeStats(tree);
      output.stats = {
        files: treeStats.files,
        directories: treeStats.directories,
        maxDepth: treeStats.maxDepth,
        total: treeStats.total
      };
      
      // Add extensions summary
      output.extensions = getExtensionsSummary(tree);
    }
    
    // Format with indentation for readability
    return JSON.stringify(output, null, 2);
  }
  
  /**
   * Get a summary of file extensions in the tree
   * 
   * @param {Object} tree - Tree structure
   * @returns {Object} Extensions summary
   */
  function getExtensionsSummary(tree) {
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
    return extensions;
  }
  
  module.exports = {
    format
  };