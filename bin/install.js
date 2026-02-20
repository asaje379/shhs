#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  bold: '\x1b[1m'
};

const c = (color, text) => `${colors[color]}${text}${colors.reset}`;

// Parse arguments
const args = process.argv.slice(2);
const targetDir = args[0] || process.cwd();

// Help flag
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
${c('blue', '╔════════════════════════════════════════════════════════╗')}
${c('blue', '║  Self-Healing Hybrid Swarm — NPX Installer            ║')}
${c('blue', '╚════════════════════════════════════════════════════════╝')}

${c('bold', 'Usage:')}
  npx create-shhs [directory]

${c('bold', 'Arguments:')}
  [directory]    Target directory (default: current directory)

${c('bold', 'Examples:')}
  npx create-shhs               # Install in current directory
  npx create-shhs .             # Install in current directory
  npx create-shhs /path/to/app  # Install in specific directory

${c('bold', 'Options:')}
  -h, --help     Show this help message

${c('bold', 'What gets installed:')}
  .ai/              AI governance structure
  CLAUDE.md         Governance rules
  ARCHITECTURE.md   Architecture template
  README.ai.md      Quick reference guide

${c('blue', 'Documentation:')} https://github.com/your-org/shhs
`);
  process.exit(0);
}

console.log(`
${c('blue', '╔════════════════════════════════════════════════════════╗')}
${c('blue', '║  Self-Healing Hybrid Swarm — Installation             ║')}
${c('blue', '╚════════════════════════════════════════════════════════╝')}
`);

// Resolve target directory
const target = path.resolve(targetDir);

// Validate target exists
if (!fs.existsSync(target)) {
  console.log(`${c('red', '✗ Error:')} Target directory does not exist: ${target}`);
  console.log(`${c('yellow', '  Tip:')} Create it first with: mkdir -p ${targetDir}`);
  process.exit(1);
}

console.log(`${c('blue', 'Installing to:')} ${target}\n`);

// Template source (in the NPM package)
const templateDir = path.join(__dirname, '..', 'template');

if (!fs.existsSync(templateDir)) {
  console.log(`${c('red', '✗ Error:')} Template directory not found`);
  console.log(`${c('yellow', '  This should not happen. Please report this issue.')}`);
  process.exit(1);
}

// Helper: Copy file if it doesn't exist
function copyIfMissing(src, dest, description) {
  if (fs.existsSync(dest)) {
    console.log(`${c('yellow', '⊙ Skipping')} ${description} (already exists)`);
    return false;
  }

  fs.copyFileSync(src, dest);
  console.log(`${c('green', '✓ Installed')} ${description}`);
  return true;
}

// Helper: Copy directory recursively
function copyDirRecursive(src, dest, description) {
  if (fs.existsSync(dest)) {
    console.log(`${c('yellow', '⊙ Skipping')} ${description} (already exists)`);
    console.log(`${c('yellow', '  To update, remove')} '${dest}' ${c('yellow', 'and re-run installation')}`);
    return false;
  }

  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath, entry.name);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }

  console.log(`${c('green', '✓ Installed')} ${description}`);
  return true;
}

// Install .ai directory
console.log(`${c('blue', '[1/3] Installing AI governance structure')}`);
copyDirRecursive(
  path.join(templateDir, '.ai'),
  path.join(target, '.ai'),
  '.ai directory'
);
console.log('');

// Install governance files
console.log(`${c('blue', '[2/3] Installing governance files')}`);
copyIfMissing(
  path.join(templateDir, 'CLAUDE.md'),
  path.join(target, 'CLAUDE.md'),
  'CLAUDE.md'
);
copyIfMissing(
  path.join(templateDir, 'ARCHITECTURE.md'),
  path.join(target, 'ARCHITECTURE.md'),
  'ARCHITECTURE.md'
);
copyIfMissing(
  path.join(templateDir, 'README.ai.md'),
  path.join(target, 'README.ai.md'),
  'README.ai.md'
);
console.log('');

// Validate setup
console.log(`${c('blue', '[3/3] Validating setup')}`);

const gitignorePath = path.join(target, '.gitignore');
if (fs.existsSync(gitignorePath)) {
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
  if (gitignoreContent.match(/^\.ai$/m)) {
    console.log(`${c('yellow', '⚠ Warning:')} .ai directory is in .gitignore`);
    console.log(`${c('yellow', '  Consider tracking .ai for team collaboration')}`);
  } else {
    console.log(`${c('green', '✓')} .gitignore configuration looks good`);
  }
} else {
  console.log(`${c('yellow', '⊙')} No .gitignore found`);
}

// Check if git repo
let isGitRepo = false;
try {
  execSync('git rev-parse --git-dir', { cwd: target, stdio: 'ignore' });
  isGitRepo = true;
} catch (e) {
  // Not a git repo
}

if (!isGitRepo) {
  console.log(`${c('yellow', '⊙')} Not a git repository`);
  console.log(`${c('yellow', '  Consider initializing with:')} git init`);
}

console.log('');

// Success message
console.log(`${c('green', '╔════════════════════════════════════════════════════════╗')}`);
console.log(`${c('green', '║  Installation Complete                                 ║')}`);
console.log(`${c('green', '╚════════════════════════════════════════════════════════╝')}`);
console.log('');

console.log(`${c('blue', 'Next Steps:')}`);
console.log('');
console.log(`  1. Review ${c('green', 'CLAUDE.md')} to understand the governance model`);
console.log(`  2. Update ${c('green', 'ARCHITECTURE.md')} with your system design`);
console.log(`  3. Start by loading the ${c('green', 'Root Architect')} agent:`);
console.log(`     ${c('yellow', 'cat .ai/agents/architect.md')}`);
console.log(`  4. Bootstrap your architecture using the architect`);
console.log('');

console.log(`${c('blue', 'Documentation:')}`);
console.log(`  • README.ai.md — Quick reference guide`);
console.log(`  • .ai/agents/ — All agent role definitions`);
console.log(`  • .ai/memory/ — Patterns and anti-patterns`);
console.log('');

if (isGitRepo) {
  console.log(`${c('yellow', 'Pro tip:')} Commit the .ai directory to version control for team collaboration`);
  console.log('');
  console.log(`${c('blue', 'To commit:')}`);
  console.log(`  ${c('yellow', 'git add .ai CLAUDE.md ARCHITECTURE.md README.ai.md')}`);
  console.log(`  ${c('yellow', 'git commit -m "chore: add SHHS AI governance system"')}`);
  console.log('');
}

console.log(`${c('blue', '📚 Full documentation:')} https://github.com/your-org/shhs`);
console.log('');
