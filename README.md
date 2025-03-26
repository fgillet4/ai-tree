# ai-tree

A CLI tool for generating tree diagrams of software architecture with ignore file support, similar to the Unix `tree` command but optimized for AI understanding of codebases.

## Installation

You can use the tool directly with npx:

```bash
npx ai-tree
```

Or install it globally:

```bash
npm install -g ai-tree
```

## Usage

```bash
# Generate a tree diagram for the current directory
ai-tree

# Generate a tree diagram for a specific directory
ai-tree --root ./my-project

# Generate a tree diagram with a maximum depth
ai-tree --depth 3

# Generate a tree diagram with a custom ignore file
ai-tree --ignore .my-treeignore

# Output the tree diagram to a file
ai-tree --output project-structure.md --format markdown

# Automatically create a markdown file in the current directory
ai-tree --markdown

# Create a default .treeignore file
ai-tree --create-ignore

# Show only directories
ai-tree --only-dirs

# Include only files matching a pattern
ai-tree --pattern "**/*.js"
```

## .treeignore File

The `.treeignore` file works like `.gitignore` and allows you to specify patterns to exclude from the tree. Create a `.treeignore` file in your project root with patterns like:

```
# Exclude node_modules
node_modules/

# Exclude all JavaScript files
*.js

# Exclude a specific directory
src/generated/
```

You can create a default `.treeignore` file with:

```bash
ai-tree --create-ignore
```

## Output Formats

ai-tree supports multiple output formats:

- **console** (default): Colorized tree view in the terminal
- **markdown**: Markdown-formatted tree diagram suitable for documentation
- **json**: JSON representation of the tree structure for programmatic use

Example:

```bash
# Generate a markdown representation
ai-tree --format markdown --output structure.md
```

## Options

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--root` | `-r` | Root directory to scan | Current directory |
| `--depth` | `-d` | Maximum depth to scan | 10 |
| `--ignore` | `-i` | Path to .treeignore file | .treeignore |
| `--output` | `-o` | Output file path | (stdout) |
| `--format` | `-f` | Output format (console, markdown, json) | console |
| `--create-ignore` | | Create a default .treeignore file | |
| `--no-summary` | | Skip generating summary | |
| `--only-dirs` | | Show only directories | |
| `--pattern` | | Include only files matching pattern | |
| `--markdown` | `-m` | Create a markdown file in the current directory | |

## Use with AI Tools

ai-tree is designed to help AI tools understand your project structure. You can use it to:

1. Generate a project structure for AI to analyze
2. Focus on specific parts of your codebase
3. Exclude irrelevant files to get more targeted AI responses

Example workflow:

```bash
# Generate a markdown view of your project
ai-tree --format markdown --output structure.md

# Share the structure.md file with AI tools
```

## License

MIT