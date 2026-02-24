#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  bold: '\x1b[1m',
  cyan: '\x1b[36m'
};

const c = (color, text) => `${colors[color]}${text}${colors.reset}`;

// Parse arguments
const args = process.argv.slice(2);
const targetDir = args[0] || process.cwd();

// Flags
const flags = {
  force: args.includes('--force') || args.includes('-f'),
  dryRun: args.includes('--dry-run'),
  help: args.includes('--help') || args.includes('-h')
};

// Help
if (flags.help) {
  console.log(`
${c('blue', '╔════════════════════════════════════════════════════════╗')}
${c('blue', '║  Self-Healing Hybrid Swarm — Update Tool              ║')}
${c('blue', '╚════════════════════════════════════════════════════════╝')}

${c('bold', 'Usage:')}
  npx create-shhs update [directory] [options]

${c('bold', 'Arguments:')}
  [directory]    Target directory (default: current directory)

${c('bold', 'Options:')}
  -f, --force    Force update all files (overwrite local changes)
  --dry-run      Show what would be updated without applying changes
  -h, --help     Show this help message

${c('bold', 'Examples:')}
  npx create-shhs update               # Update current directory
  npx create-shhs update --dry-run     # Preview changes
  npx create-shhs update --force       # Force update all files

${c('bold', 'What gets updated:')}
  .ai/agents/            Agent definitions (core agents only)
  .ai/governance/        Constitution & Definition of Done
  .ai/skills/            Skills (TDD, Playwright, Context7)
  .ai/architecture/      Fitness functions
  .ai/knowledge/         Knowledge base template
  CLAUDE.md              Governance rules (if unchanged)

${c('bold', 'What gets preserved:')}
  .ai/ADR/               Your architectural decisions
  .ai/contracts/         Your contracts
  .ai/features/          Your feature contracts
  .ai/reports/           Your reports
  .ai/debt/              Your debt reports
  .ai/memory/            Your patterns and anti-patterns
  ARCHITECTURE.md        Your architecture

${c('blue', 'Documentation:')} https://github.com/asaje379/shhs
`);
  process.exit(0);
}

console.log(`
${c('blue', '╔════════════════════════════════════════════════════════╗')}
${c('blue', '║  Self-Healing Hybrid Swarm — Update                    ║')}
${c('blue', '╚════════════════════════════════════════════════════════╝')}
`);

// Resolve target
const target = path.resolve(targetDir);

// Validate target
if (!fs.existsSync(target)) {
  console.log(`${c('red', '✗ Error:')} Directory does not exist: ${target}`);
  process.exit(1);
}

// Check if SHHS is installed
const shhsMarkerPath = path.join(target, '.ai');
if (!fs.existsSync(shhsMarkerPath)) {
  console.log(`${c('red', '✗ Error:')} SHHS not found in this directory`);
  console.log(`${c('yellow', '  Install first with:')} npx create-shhs`);
  process.exit(1);
}

console.log(`${c('blue', 'Target:')} ${target}`);
console.log(`${c('blue', 'Mode:')} ${flags.dryRun ? c('yellow', 'DRY RUN') : c('green', 'UPDATE')}`);
console.log('');

// Template source
const templateDir = path.join(__dirname, '..', 'template');

if (!fs.existsSync(templateDir)) {
  console.log(`${c('red', '✗ Error:')} Template directory not found`);
  process.exit(1);
}

// Version tracking
const versionFile = path.join(target, '.ai', '.shhs-version');
let currentVersion = '0.0.0';
if (fs.existsSync(versionFile)) {
  currentVersion = fs.readFileSync(versionFile, 'utf-8').trim();
}

const newVersion = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf-8')
).version;

console.log(`${c('cyan', 'Current version:')} ${currentVersion}`);
console.log(`${c('cyan', 'Available version:')} ${newVersion}`);
console.log('');

if (currentVersion === newVersion && !flags.force) {
  console.log(`${c('green', '✓ Already up to date!')}`);
  console.log(`${c('yellow', '  Use --force to reinstall anyway')}`);
  process.exit(0);
}

// Files to update (always safe to update)
const updateableFiles = [
  // Core agents (framework-defined, should be updated)
  { src: '.ai/agents/architect.md', dest: '.ai/agents/architect.md', type: 'agent' },
  { src: '.ai/agents/domain-architect.md', dest: '.ai/agents/domain-architect.md', type: 'agent' },
  { src: '.ai/agents/developer.md', dest: '.ai/agents/developer.md', type: 'agent' },
  { src: '.ai/agents/static-reviewer.md', dest: '.ai/agents/static-reviewer.md', type: 'agent' },
  { src: '.ai/agents/qa.md', dest: '.ai/agents/qa.md', type: 'agent' },
  { src: '.ai/agents/debt-observer.md', dest: '.ai/agents/debt-observer.md', type: 'agent' },
  { src: '.ai/agents/architecture-reviewer.md', dest: '.ai/agents/architecture-reviewer.md', type: 'agent' },
  { src: '.ai/agents/knowledge-curator.md', dest: '.ai/agents/knowledge-curator.md', type: 'agent' },
  { src: '.ai/agents/fitness-enforcer.md', dest: '.ai/agents/fitness-enforcer.md', type: 'agent' },

  // Governance (core rules, should be updated)
  { src: '.ai/governance/constitution.md', dest: '.ai/governance/constitution.md', type: 'governance' },
  { src: '.ai/governance/definition-of-done.md', dest: '.ai/governance/definition-of-done.md', type: 'governance' },

  // Skills (procedures, should be updated)
  { src: '.ai/skills/tdd/skill.md', dest: '.ai/skills/tdd/skill.md', type: 'skill' },
  { src: '.ai/skills/playwright/skill.md', dest: '.ai/skills/playwright/skill.md', type: 'skill' },
  { src: '.ai/skills/context7/skill.md', dest: '.ai/skills/context7/skill.md', type: 'skill' },

  // Fitness functions (core rules, should be updated)
  { src: '.ai/architecture/governance/fitness/README.md', dest: '.ai/architecture/governance/fitness/README.md', type: 'fitness' },
  { src: '.ai/architecture/governance/fitness/rules.json', dest: '.ai/architecture/governance/fitness/rules.json', type: 'fitness', merge: true },
  { src: '.ai/architecture/governance/fitness/config.json', dest: '.ai/architecture/governance/fitness/config.json', type: 'fitness', preserve: true },
  { src: '.ai/architecture/governance/fitness/exemptions.json', dest: '.ai/architecture/governance/fitness/exemptions.json', type: 'fitness', preserve: true },

  // Knowledge base (template only, preserve if exists)
  { src: '.ai/knowledge/knowledge-base.md', dest: '.ai/knowledge/knowledge-base.md', type: 'knowledge', preserve: true },

  // Reports format (schema, should be updated)
  { src: '.ai/reports/fitness-results.json', dest: '.ai/reports/fitness-results.json', type: 'schema' },
];

// Files to check for changes (user might have modified)
const checkFiles = [
  { src: 'CLAUDE.md', dest: 'CLAUDE.md', type: 'doc' },
  { src: '.ai/memory/patterns.md', dest: '.ai/memory/patterns.md', type: 'memory', preserve: true },
  { src: '.ai/memory/anti-patterns.md', dest: '.ai/memory/anti-patterns.md', type: 'memory', preserve: true },
];

// Helper: Calculate file hash
function getFileHash(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf-8');
  return crypto.createHash('md5').update(content).digest('hex');
}

// Helper: Check if file was modified by user
function isModifiedByUser(destPath, srcPath) {
  if (!fs.existsSync(destPath)) return false;

  const destHash = getFileHash(destPath);
  const srcHash = getFileHash(srcPath);

  return destHash !== srcHash;
}

// Update statistics
const stats = {
  updated: [],
  created: [],
  skipped: [],
  preserved: [],
  conflicts: []
};

// Process updates
console.log(`${c('blue', '[1/3] Updating core files')}`);
console.log('');

for (const file of updateableFiles) {
  const srcPath = path.join(templateDir, file.src);
  const destPath = path.join(target, file.dest);

  if (!fs.existsSync(srcPath)) {
    console.log(`${c('yellow', '⊙ Warning:')} Source file not found: ${file.src}`);
    continue;
  }

  // Check if file should be preserved
  if (file.preserve && fs.existsSync(destPath) && !flags.force) {
    console.log(`${c('cyan', '→ Preserving')} ${file.dest} (user file)`);
    stats.preserved.push(file.dest);
    continue;
  }

  // Check if file needs merge (e.g., rules.json - user might have added custom rules)
  if (file.merge && fs.existsSync(destPath) && !flags.force) {
    const modified = isModifiedByUser(destPath, srcPath);
    if (modified) {
      console.log(`${c('yellow', '⚠ Conflict:')} ${file.dest} has local changes`);
      console.log(`${c('yellow', '  Manual merge required or use --force to overwrite')}`);
      stats.conflicts.push(file.dest);
      continue;
    }
  }

  // Check if file exists
  if (fs.existsSync(destPath)) {
    const modified = isModifiedByUser(destPath, srcPath);

    if (modified && !flags.force) {
      console.log(`${c('yellow', '⊙ Skipping')} ${file.dest} (locally modified, use --force to overwrite)`);
      stats.skipped.push(file.dest);
      continue;
    }

    if (!flags.dryRun) {
      // Create backup
      const backupPath = `${destPath}.backup-${Date.now()}`;
      fs.copyFileSync(destPath, backupPath);

      // Update file
      fs.copyFileSync(srcPath, destPath);
      console.log(`${c('green', '✓ Updated')} ${file.dest} ${c('yellow', '(backup created)')}`);
      stats.updated.push(file.dest);
    } else {
      console.log(`${c('cyan', '→ Would update')} ${file.dest}`);
    }
  } else {
    // Create directory if needed
    const dir = path.dirname(destPath);
    if (!fs.existsSync(dir)) {
      if (!flags.dryRun) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }

    if (!flags.dryRun) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`${c('green', '✓ Created')} ${file.dest}`);
      stats.created.push(file.dest);
    } else {
      console.log(`${c('cyan', '→ Would create')} ${file.dest}`);
    }
  }
}

console.log('');

// Check CLAUDE.md and other user-modifiable files
console.log(`${c('blue', '[2/3] Checking user-modifiable files')}`);
console.log('');

for (const file of checkFiles) {
  const srcPath = path.join(templateDir, file.src);
  const destPath = path.join(target, file.dest);

  if (!fs.existsSync(destPath)) {
    // File doesn't exist, create it
    if (!flags.dryRun) {
      const dir = path.dirname(destPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.copyFileSync(srcPath, destPath);
      console.log(`${c('green', '✓ Created')} ${file.dest}`);
      stats.created.push(file.dest);
    } else {
      console.log(`${c('cyan', '→ Would create')} ${file.dest}`);
    }
    continue;
  }

  if (file.preserve && !flags.force) {
    console.log(`${c('cyan', '→ Preserving')} ${file.dest} (user file)`);
    stats.preserved.push(file.dest);
    continue;
  }

  const modified = isModifiedByUser(destPath, srcPath);

  if (modified) {
    if (flags.force) {
      if (!flags.dryRun) {
        const backupPath = `${destPath}.backup-${Date.now()}`;
        fs.copyFileSync(destPath, backupPath);
        fs.copyFileSync(srcPath, destPath);
        console.log(`${c('green', '✓ Updated')} ${file.dest} ${c('yellow', '(backup created, was modified)')}`);
        stats.updated.push(file.dest);
      } else {
        console.log(`${c('cyan', '→ Would update')} ${file.dest} ${c('yellow', '(is modified)')}`);
      }
    } else {
      console.log(`${c('yellow', '⊙ Skipping')} ${file.dest} (locally modified, use --force to overwrite)`);
      stats.skipped.push(file.dest);
    }
  } else {
    // File unchanged, update it
    if (!flags.dryRun) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`${c('green', '✓ Updated')} ${file.dest}`);
      stats.updated.push(file.dest);
    } else {
      console.log(`${c('cyan', '→ Would update')} ${file.dest}`);
    }
  }
}

console.log('');

// Update version file
console.log(`${c('blue', '[3/3] Updating version')}`);
console.log('');

if (!flags.dryRun) {
  fs.writeFileSync(versionFile, newVersion, 'utf-8');
  console.log(`${c('green', '✓ Version updated:')} ${currentVersion} → ${newVersion}`);
} else {
  console.log(`${c('cyan', '→ Would update version:')} ${currentVersion} → ${newVersion}`);
}

console.log('');

// Summary
console.log(`${c('green', '╔════════════════════════════════════════════════════════╗')}`);
console.log(`${c('green', '║  Update Summary                                        ║')}`);
console.log(`${c('green', '╚════════════════════════════════════════════════════════╝')}`);
console.log('');

console.log(`${c('green', '✓ Updated:')}    ${stats.updated.length} files`);
console.log(`${c('green', '✓ Created:')}    ${stats.created.length} files`);
console.log(`${c('cyan', '→ Preserved:')}  ${stats.preserved.length} files (user content)`);
console.log(`${c('yellow', '⊙ Skipped:')}    ${stats.skipped.length} files (modified locally)`);
console.log(`${c('yellow', '⚠ Conflicts:')}  ${stats.conflicts.length} files (manual merge needed)`);
console.log('');

if (stats.conflicts.length > 0) {
  console.log(`${c('yellow', 'Conflicts requiring manual merge:')}`);
  stats.conflicts.forEach(file => console.log(`  • ${file}`));
  console.log('');
}

if (stats.skipped.length > 0 && !flags.force) {
  console.log(`${c('yellow', 'Skipped files (use --force to update):')}`);
  stats.skipped.forEach(file => console.log(`  • ${file}`));
  console.log('');
}

if (flags.dryRun) {
  console.log(`${c('cyan', 'This was a dry run. No files were modified.')}`);
  console.log(`${c('cyan', 'Run without --dry-run to apply changes.')}`);
  console.log('');
}

// Backups info
const backupFiles = fs.readdirSync(target, { recursive: true })
  .filter(file => file.includes('.backup-'));

if (backupFiles.length > 0 && !flags.dryRun) {
  console.log(`${c('yellow', 'Backups created:')}`);
  backupFiles.slice(0, 5).forEach(file => console.log(`  • ${file}`));
  if (backupFiles.length > 5) {
    console.log(`  ... and ${backupFiles.length - 5} more`);
  }
  console.log('');
  console.log(`${c('yellow', 'To clean up backups:')}`);
  console.log(`  find . -name "*.backup-*" -delete`);
  console.log('');
}

console.log(`${c('blue', '📚 Changelog:')} See SHHS release notes for what changed`);
console.log('');
