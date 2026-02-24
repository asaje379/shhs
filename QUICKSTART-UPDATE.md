# SHHS — Mise à Jour Rapide

## Installation Initiale

```bash
# Dans votre projet
npx create-shhs
```

Crée:
- `.ai/` — Structure gouvernance
- `CLAUDE.md` — Règles agents
- `ARCHITECTURE.md` — Template architecture
- `.ai/.shhs-version` — Version tracker

---

## Mise à Jour

### Vérifier Version

```bash
# Voir version installée
cat .ai/.shhs-version

# Voir version disponible
npm view create-shhs version
```

### Update Simple

```bash
# Mettre à jour vers latest
npx create-shhs update
```

**Comportement:**
- ✅ Met à jour agents framework (architect, developer, etc.)
- ✅ Met à jour gouvernance (constitution, definition of done)
- ✅ Met à jour skills (TDD, Playwright, Context7)
- ✅ **Préserve** vos ADRs, features, rapports, ARCHITECTURE.md
- ⚠️  Skip fichiers modifiés (use `--force` to overwrite)

### Preview Changes (Dry Run)

```bash
npx create-shhs update --dry-run
```

Affiche ce qui sera modifié sans appliquer.

### Force Update (Overwrite)

```bash
npx create-shhs update --force
```

Écrase même fichiers modifiés (crée backups `.backup-*`).

---

## Que Faire si Conflit?

**Conflit détecté:**
```
⚠ Conflict: CLAUDE.md has local changes
  Manual merge required or use --force to overwrite
```

**Options:**

1. **Force + restaurer:**
   ```bash
   npx create-shhs update --force
   # Récupère depuis backup si besoin
   cp CLAUDE.md.backup-* CLAUDE.md.old
   # Merge manuellement
   ```

2. **Merge manuel:**
   ```bash
   # Comparer
   diff CLAUDE.md node_modules/create-shhs/template/CLAUDE.md
   # Merger manuellement
   vim CLAUDE.md
   # Re-run update
   npx create-shhs update
   ```

---

## Nettoyage Backups

```bash
# Lister backups
find . -name "*.backup-*"

# Supprimer tous backups
find . -name "*.backup-*" -delete

# Supprimer backups > 30 jours
find . -name "*.backup-*" -mtime +30 -delete
```

---

## Documentation Complète

- **Installation:** [INSTALLATION-GUIDE.md](INSTALLATION-GUIDE.md)
- **Mise à jour:** [UPDATE-GUIDE.md](UPDATE-GUIDE.md)
- **Analysis:** [SHHS-COMPLETION-ANALYSIS.md](SHHS-COMPLETION-ANALYSIS.md)

---

**Support:** https://github.com/asaje379/shhs/issues
