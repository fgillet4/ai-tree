#!/usr/bin/env node

const { program } = require('commander');
const path = require('path');
const fs = require('fs');
const fileScanner = require('../src/core/fileScanner');
const treeBuilder = require('../src/core/treeBuilder');
const ignoreParser = require('../src/core/ignoreParser');
const consoleFormatter = require('../src/formatters/consoleFormatter');
const markdownFormatter = require('../src/formatters/markdownFormatter');
const jsonFormatter = require('../src/formatters/jsonFormatter');
const { version } = require('../package.json');

program
  .name('ai-tree')
  .description('Generate tree diagrams of software architecture with ignore file support')
  .version(version)
  .option('-r, --root <path>', 'Root directory to scan', process.cwd())
  .option('-d, --depth <number>', 'Maximum depth to scan', 10)
  .option('-i, --ignore <path>', 'Path to .treeignore file', '.treeignore')
  .option('-o, --output <path>', 'Output file path')
  .option('-f, --format <type>', 'Output format (console, markdown, json)', 'console')
  .option('-m, --markdown', 'Create a markdown file (project-tree.md) in the current directory')
  .option('--create-ignore', 'Create a default .treeignore file in the current directory')
  .option('--no-summary', 'Skip generating summary at the end')
  .option('--only-dirs', 'Show only directories, not files')
  .option('--pattern <glob>', 'Include only files matching pattern')
  .parse(process.argv);

const options = program.opts();

// Handle creating a default ignore file
if (options.createIgnore) {
  const defaultIgnorePath = path.join(__dirname, '../templates/defaultIgnore.txt');
  const targetPath = path.join(process.cwd(), '.treeignore');
  
  if (fs.existsSync(targetPath)) {
    console.log('A .treeignore file already exists. Use --force to overwrite.');
    process.exit(1);
  } else {
    try {
      const defaultIgnoreContent = fs.readFileSync(defaultIgnorePath, 'utf8');
      fs.writeFileSync(targetPath, defaultIgnoreContent);
      console.log('.treeignore file created successfully.');
      process.exit(0);
    } catch (err) {
      console.error('Failed to create .treeignore file:', err);
      process.exit(1);
    }
  }
}

// Process scanning
async function run() {
  // Parse ignore patterns from .treeignore file
  const rootPath = path.resolve(options.root);
  const ignorePath = path.resolve(options.ignore);
  
  let ignorePatterns = [];
  if (fs.existsSync(ignorePath)) {
    ignorePatterns = ignoreParser.parseIgnoreFile(ignorePath);
    console.log(`Using ignore patterns from ${ignorePath}`);
  } else {
    console.log('No .treeignore file found. Processing all files.');
  }

  // Scan files and build tree
  console.log(`Scanning ${rootPath}...`);
  const files = await fileScanner.scanDirectory(
    rootPath, 
    ignorePatterns, 
    parseInt(options.depth),
    options.onlyDirs,
    options.pattern
  );
  
  const tree = treeBuilder.buildTree(files, rootPath);
  
  // Format and output the result
  let formattedOutput;
  switch (options.format) {
    case 'markdown':
      formattedOutput = markdownFormatter.format(tree, options);
      break;
    case 'json':
      formattedOutput = jsonFormatter.format(tree, options);
      break;
    case 'console':
    default:
      formattedOutput = consoleFormatter.format(tree, options);
      break;
  }
  
  // Output to specified file if provided
  if (options.output) {
    fs.writeFileSync(options.output, formattedOutput);
    console.log(`Output written to ${options.output}`);
  } else {
    console.log(formattedOutput);
  }
  
  // Additionally create markdown file if requested
  if (options.markdown) {
    const mdFormatter = require('../src/formatters/markdownFormatter');
    const mdOutput = mdFormatter.format(tree, { ...options, summary: true });
    const mdOutputPath = path.join(process.cwd(), 'project-tree.md');
    fs.writeFileSync(mdOutputPath, mdOutput);
    console.log(`\nMarkdown tree created at ${mdOutputPath}`);
  }
  
  if (options.summary) {
    console.log(`\nSummary: Processed ${files.length} files in ${rootPath}`);
  }
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});