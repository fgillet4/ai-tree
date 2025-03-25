const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Default configuration for the tool
 */
const DEFAULT_CONFIG = {
  depth: 10,
  ignoreFile: '.treeignore',
  format: 'console',
  summary: true,
  onlyDirs: false
};

/**
 * Load configuration from file
 * 
 * @param {string} configPath - Path to config file
 * @returns {Object} Loaded configuration
 */
function loadConfig(configPath) {
  try {
    if (!configPath) {
      // Check for config in standard locations
      const locations = [
        path.join(process.cwd(), '.aitreerc'),
        path.join(process.cwd(), '.aitreerc.json'),
        path.join(os.homedir(), '.aitreerc'),
        path.join(os.homedir(), '.aitreerc.json')
      ];
      
      for (const location of locations) {
        if (fs.existsSync(location)) {
          configPath = location;
          break;
        }
      }
    }
    
    if (!configPath || !fs.existsSync(configPath)) {
      return DEFAULT_CONFIG;
    }
    
    const content = fs.readFileSync(configPath, 'utf8');
    return { ...DEFAULT_CONFIG, ...JSON.parse(content) };
  } catch (err) {
    console.warn(`Warning: Couldn't load config from ${configPath}:`, err.message);
    return DEFAULT_CONFIG;
  }
}

/**
 * Save configuration to file
 * 
 * @param {Object} config - Configuration to save
 * @param {string} configPath - Path to save config to
 * @returns {boolean} Whether saving was successful
 */
function saveConfig(config, configPath) {
  try {
    const configToSave = { ...DEFAULT_CONFIG, ...config };
    fs.writeFileSync(configPath, JSON.stringify(configToSave, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error: Couldn't save config to ${configPath}:`, err.message);
    return false;
  }
}

/**
 * Merge configuration with command line options
 * 
 * @param {Object} config - Base configuration
 * @param {Object} options - Command line options
 * @returns {Object} Merged configuration
 */
function mergeWithOptions(config, options) {
  const merged = { ...config };
  
  // Only override config with options that are explicitly set
  Object.keys(options).forEach(key => {
    if (options[key] !== undefined) {
      merged[key] = options[key];
    }
  });
  
  return merged;
}

module.exports = {
  DEFAULT_CONFIG,
  loadConfig,
  saveConfig,
  mergeWithOptions
};