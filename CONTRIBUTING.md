# Contributing to SHHS

Thank you for your interest in contributing to Self-Healing Hybrid Swarm!

## How to Contribute

### Reporting Issues

- Check existing issues first
- Provide clear reproduction steps
- Include environment details (OS, shell version)

### Suggesting Enhancements

- Open an issue describing the enhancement
- Explain the use case and benefits
- Discuss before implementing large changes

### Submitting Changes

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Update template files in `/template` if modifying governance
   - Update documentation if changing behavior
   - Test installation script on sample projects

4. **Test thoroughly**
   ```bash
   # Test installation in a temporary directory
   mkdir /tmp/test-project
   ./scripts/install.sh /tmp/test-project
   ```

5. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```

6. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## Development Guidelines

### Template Files

Files in `/template` must be:
- **Project-agnostic** — No hardcoded assumptions
- **Generic** — Work across tech stacks
- **Well-documented** — Include comments explaining purpose

### Agent Roles

When modifying agent definitions:
- Maintain role separation principles
- Keep responsibilities clear and focused
- Update [CLAUDE.md](template/CLAUDE.md) if roles change

### Installation Script

`scripts/install.sh` must be:
- **Idempotent** — Safe to run multiple times
- **Non-destructive** — Never overwrite existing files
- **Clear** — Provide helpful output messages

### Documentation

- Update [docs/setup.md](docs/setup.md) for installation changes
- Update [README.md](README.md) for feature additions
- Keep examples accurate and tested

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow

## Questions?

Open an issue or start a discussion. We're here to help!

---

**Thank you for contributing to SHHS!**
