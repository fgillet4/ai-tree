const path = require('path');
const fs = require('fs');

/**
 * Check if a path exists
 * 
 * @param {string} filePath - Path to check
 * @returns {boolean} Whether the path exists
 */
function pathExists(filePath) {
  try {
    fs.accessSync(filePath);
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Check if a path is a directory
 * 
 * @param {string} filePath - Path to check
 * @returns {boolean} Whether the path is a directory
 */
function isDirectory(filePath) {
  try {
    return fs.statSync(filePath).isDirectory();
  } catch (err) {
    return false;
  }
}

/**
 * Check if a path is a file
 * 
 * @param {string} filePath - Path to check
 * @returns {boolean} Whether the path is a file
 */
function isFile(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
}

/**
 * Normalize a path for the current platform
 * 
 * @param {string} filePath - Path to normalize
 * @returns {string} Normalized path
 */
function normalizePath(filePath) {
  return path.normalize(filePath).replace(/\\/g, '/');
}

/**
 * Get the extension of a file
 * 
 * @param {string} filePath - File path
 * @returns {string} File extension
 */
function getExtension(filePath) {
  return path.extname(filePath).toLowerCase();
}

/**
 * Get a relative path from base to target
 * 
 * @param {string} basePath - Base path
 * @param {string} targetPath - Target path
 * @returns {string} Relative path
 */
function getRelativePath(basePath, targetPath) {
  // Ensure paths are absolute
  basePath = path.resolve(basePath);
  targetPath = path.resolve(targetPath);
  
  // Calculate relative path
  return path.relative(basePath, targetPath);
}

module.exports = {
  pathExists,
  isDirectory,
  isFile,
  normalizePath,
  getExtension,
  getRelativePath
};