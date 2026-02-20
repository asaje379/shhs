# NPM Publishing Guide

This guide explains how to publish SHHS to NPM for `npx create-shhs` usage.

---

## Prerequisites

1. **NPM Account**
   ```bash
   npm login
   ```

2. **Package Name Available**
   - Check: `npm view create-shhs`
   - If taken, update `package.json` name field

3. **Version Updated**
   - Follow semantic versioning
   - Update `version` in `package.json`

---

## Pre-Publishing Checklist

### 1. Verify Package Structure

```bash
# Check what will be published
npm pack --dry-run

# Should include:
# ✓ bin/install.js
# ✓ template/
# ✓ README.md
# ✓ LICENSE
# ✓ package.json
```

### 2. Test Installation Locally

```bash
# Test CLI locally
node bin/install.js --help

# Test installation
mkdir /tmp/test-npm-install
node bin/install.js /tmp/test-npm-install
ls -la /tmp/test-npm-install
rm -rf /tmp/test-npm-install
```

### 3. Test as NPM Package

```bash
# Create tarball
npm pack

# Install locally
mkdir /tmp/test-npx
cd /tmp/test-npx
npm install /path/to/shhs/create-shhs-1.0.0.tgz
npx create-shhs

# Cleanup
cd ..
rm -rf /tmp/test-npx
rm /path/to/shhs/create-shhs-*.tgz
```

### 4. Verify Metadata

Check `package.json` has:
- ✅ Correct `name`
- ✅ Correct `version`
- ✅ Valid `description`
- ✅ Correct `repository` URL
- ✅ Valid `homepage` URL
- ✅ Valid `bugs` URL
- ✅ `bin` pointing to correct file
- ✅ `files` includes necessary directories
- ✅ `keywords` for discoverability

---

## Publishing Steps

### 1. Update Version

```bash
# Bump version (patch, minor, or major)
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0
```

This automatically:
- Updates `package.json`
- Creates git tag
- Commits the change

### 2. Publish to NPM

```bash
# Dry run first (recommended)
npm publish --dry-run

# Publish for real
npm publish

# For scoped packages
npm publish --access public
```

### 3. Verify Publication

```bash
# Check package info
npm view create-shhs

# Test installation
mkdir /tmp/verify-npx
cd /tmp/verify-npx
npx create-shhs
ls -la
cd ..
rm -rf /tmp/verify-npx
```

### 4. Push Git Tags

```bash
# Push version tag
git push origin --tags

# Or push everything
git push origin main --tags
```

---

## Post-Publishing

### 1. Update Documentation URLs

If this is the first publish, update these files with the actual NPM package name:

- `README.md`
- `docs/setup.md`
- `INSTALLATION.md`
- `QUICKSTART.md`
- `bin/install.js` (help text)

Replace `your-org/shhs` with actual repo URL.

### 2. Create GitHub Release

```bash
# Using GitHub CLI
gh release create v1.0.0 --title "v1.0.0" --notes "Initial release"

# Or manually via GitHub web UI
```

### 3. Announce

- Update repository README with NPM badge
- Tweet/announce on social media
- Update documentation sites

---

## NPM Badge

Add to README.md:

```markdown
[![npm version](https://badge.fury.io/js/create-shhs.svg)](https://www.npmjs.com/package/create-shhs)
[![npm downloads](https://img.shields.io/npm/dm/create-shhs.svg)](https://www.npmjs.com/package/create-shhs)
```

---

## Updating Published Package

### Patch Release (Bug Fixes)

```bash
# Fix bugs
# Update version
npm version patch

# Publish
npm publish

# Push tags
git push origin --tags
```

### Minor Release (New Features)

```bash
# Add features
# Update version
npm version minor

# Publish
npm publish

# Push tags
git push origin --tags
```

### Major Release (Breaking Changes)

```bash
# Make breaking changes
# Update CHANGELOG
# Update version
npm version major

# Publish
npm publish

# Push tags
git push origin --tags
```

---

## Troubleshooting

### "Package name already exists"

Change the package name in `package.json`:
```json
{
  "name": "@your-org/create-shhs"
}
```

Then publish as scoped package:
```bash
npm publish --access public
```

### "Need to login"

```bash
npm login
# Enter credentials
```

### "403 Forbidden"

You don't have publish rights. Check:
- Package name isn't taken
- You're logged in: `npm whoami`
- You have 2FA enabled (if required)

### "Files not included"

Check `package.json` `files` field:
```json
{
  "files": [
    "bin/",
    "template/",
    "README.md",
    "LICENSE"
  ]
}
```

---

## Best Practices

### 1. Semantic Versioning

- **Patch** (1.0.x): Bug fixes, no breaking changes
- **Minor** (1.x.0): New features, backward compatible
- **Major** (x.0.0): Breaking changes

### 2. Changelog

Maintain `CHANGELOG.md`:
```markdown
# Changelog

## [1.0.1] - 2024-02-20
### Fixed
- Fixed installation path issues

## [1.0.0] - 2024-02-20
### Added
- Initial release
- NPX installation support
```

### 3. Testing Before Publish

Always test with `npm pack` and local installation before publishing.

### 4. README on NPM

The `README.md` is displayed on npmjs.com. Ensure it:
- Explains what the package does
- Shows installation examples
- Links to full documentation

---

## Unpublishing (Use with Caution)

```bash
# Unpublish specific version (within 72 hours)
npm unpublish create-shhs@1.0.0

# Unpublish entire package (use extreme caution)
npm unpublish create-shhs --force
```

**Warning:** Unpublishing is permanent and should be avoided. Use deprecation instead:

```bash
npm deprecate create-shhs@1.0.0 "This version has critical bugs. Use 1.0.1+"
```

---

## Automation (CI/CD)

### GitHub Actions Publish Workflow

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to NPM

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Set `NPM_TOKEN` in GitHub repository secrets.

---

## Quick Reference

```bash
# Publish workflow
npm version patch           # Update version
npm publish --dry-run       # Test
npm publish                 # Publish
git push origin --tags      # Push tags

# Test installation
npx create-shhs

# Check package
npm view create-shhs
```

---

**Ready to publish? Follow the checklist above and run `npm publish`!**
