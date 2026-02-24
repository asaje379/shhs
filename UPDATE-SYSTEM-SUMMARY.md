# SHHS — Système de Mise à Jour (Résumé)

**Date:** 2026-02-24
**Status:** ✅ IMPLÉMENTÉ

---

## Ton Besoin

> "Y a t-il un moyen de faire en sorte de mettre à jour un projet avec shhs (shhs précédent ou non) de sorte à tout mettre à jour ?"

**Réponse:** OUI, maintenant implémenté.

---

## Solution Livrée

### 1. Commande Update

```bash
npx create-shhs update [options]
```

**Options:**
- `--dry-run` — Prévisualiser sans appliquer
- `--force` — Forcer update même si modifié localement

### 2. Versioning Automatique

**Fichier:** `.ai/.shhs-version`

Contient version installée (ex: `1.1.0`).

**Process:**
1. Install crée `.ai/.shhs-version` avec version actuelle
2. Update compare installed vs available
3. Si différent → propose update
4. Si identique → message "Already up to date"

### 3. Mise à Jour Intelligente

**Toujours mis à jour** (framework core):
- `.ai/agents/*.md` (agents framework)
- `.ai/governance/*.md` (constitution, definition of done)
- `.ai/skills/*/skill.md` (TDD, Playwright, Context7)
- `.ai/architecture/governance/fitness/README.md`

**Toujours préservé** (user content):
- `.ai/ADR/*.md` (vos décisions)
- `.ai/contracts/` (vos contrats)
- `.ai/features/` (vos feature contracts)
- `.ai/reports/` (vos rapports)
- `ARCHITECTURE.md` (votre architecture)

**Conditionnel** (updated si non modifié):
- `CLAUDE.md` (si vous avez modifié → skip)
- `.ai/memory/patterns.md` (préservé si modifié)

### 4. Gestion Conflits

**Détection:**
```
⚠ Conflict: CLAUDE.md has local changes
  Manual merge required or use --force to overwrite
```

**Résolution:**
- Option 1: `--force` (écrase + crée backup)
- Option 2: Merge manuel

### 5. Backups Automatiques

Avant overwrite:
```
CLAUDE.md → CLAUDE.md.backup-1709030400000
```

Nettoyage:
```bash
find . -name "*.backup-*" -delete
```

---

## Fichiers Créés

### 1. Script Update

**[bin/update.js](bin/update.js)** — 400+ lignes

**Features:**
- Compare versions (installed vs available)
- Détecte modifications locales (hash MD5)
- Update sélectif (framework vs user content)
- Backups automatiques
- Dry run mode
- Force mode
- Stats summary

### 2. Intégration Install

**[bin/install.js](bin/install.js)** — Modifié

**Ajouts:**
- Détection commande `update` → délègue à `update.js`
- Crée `.ai/.shhs-version` à l'installation
- Help message mis à jour

### 3. Version Tracking

**`.ai/.shhs-version`**
- Root: [.ai/.shhs-version](.ai/.shhs-version)
- Template: [template/.ai/.shhs-version](template/.ai/.shhs-version)

### 4. Documentation

- **[UPDATE-GUIDE.md](UPDATE-GUIDE.md)** — Guide complet (3000+ lignes)
  - Scénarios utilisation
  - Gestion conflits
  - Best practices
  - FAQ
  - Changelog

- **[QUICKSTART-UPDATE.md](QUICKSTART-UPDATE.md)** — Quick reference
  - Commandes essentielles
  - Résolution conflits rapide

### 5. Package.json

Mis à jour:
- Inclut `UPDATE-GUIDE.md` dans files distribués
- Inclut `INSTALLATION-GUIDE.md` dans files distribués

---

## Workflow Typique

### Installation Initiale

```bash
# Projet nouveau
cd /path/to/project
npx create-shhs

# .ai/.shhs-version créé automatiquement → "1.1.0"
```

### 3 Mois Plus Tard (SHHS v1.2.0 disponible)

```bash
cd /path/to/project

# Prévisualiser
npx create-shhs update --dry-run

# Output:
# Current version: 1.1.0
# Available version: 1.2.0
#
# → Would update .ai/agents/architect.md
# → Would create .ai/agents/new-agent.md
# → Would preserve ARCHITECTURE.md (user file)
# ⊙ Would skip CLAUDE.md (locally modified)

# Appliquer si OK
npx create-shhs update

# Output:
# ✓ Updated: 12 files
# ✓ Created: 2 files
# → Preserved: 8 files
# ⊙ Skipped: 1 file (use --force)
```

### Si Conflit sur CLAUDE.md

```bash
# Option 1: Force update
npx create-shhs update --force
# CLAUDE.md.backup-XXX créé
# Restaurer vos notes si besoin

# Option 2: Merge manuel
diff CLAUDE.md node_modules/create-shhs/template/CLAUDE.md
vim CLAUDE.md  # Merger
npx create-shhs update  # Re-run
```

---

## Garanties

### ✅ Ce Qui Est Garanti

1. **Version tracking:** Chaque install a `.ai/.shhs-version`
2. **Update sélectif:** Framework updated, user content preserved
3. **Backups automatiques:** Avant overwrite
4. **Dry run:** Preview sans appliquer
5. **Idempotence:** Re-run safe (skip si déjà à jour)
6. **No data loss:** Backups before overwrite

### ⚠️ Limitations Actuelles

1. **Pas de merge automatique:** Si conflit → intervention manuelle
2. **Pas de rollback one-click:** Downgrade via `npx create-shhs@1.0.0 update --force`
3. **Pas de partial update:** Tout ou rien (contournable via copie manuelle)
4. **Hash simple (MD5):** Détection modification, mais pas de 3-way merge

---

## Améliorations Futures Possibles

### Phase 2 (Optionnel)

1. **Smart Merge:** 3-way merge pour `rules.json`, `CLAUDE.md`
2. **Selective Update:** `npx create-shhs update --only agents,skills`
3. **Rollback Command:** `npx create-shhs rollback 1.0.0`
4. **Update Hooks:** Scripts custom pre-update, post-update
5. **Diff Viewer:** `npx create-shhs diff` (compare installed vs available)

**Effort estimé:** 1-2 semaines

---

## Testing

### Test Scénario 1: Fresh Install

```bash
cd /tmp/test-project
npx create-shhs
cat .ai/.shhs-version  # Should be 1.1.0
```

### Test Scénario 2: Update (Same Version)

```bash
cd /tmp/test-project
npx create-shhs update
# Expected: "Already up to date"
```

### Test Scénario 3: Dry Run

```bash
npx create-shhs update --dry-run
# Expected: List of files that would be updated
```

### Test Scénario 4: Force Update

```bash
echo "custom" >> CLAUDE.md
npx create-shhs update --force
# Expected: CLAUDE.md updated, backup created
ls -la | grep backup
```

### Test Scénario 5: Conflict Detection

```bash
echo "custom" >> CLAUDE.md
npx create-shhs update
# Expected: "Skipping CLAUDE.md (locally modified)"
```

---

## Documentation Mapping

| Besoin | Fichier |
|--------|---------|
| "Comment j'update?" | [QUICKSTART-UPDATE.md](QUICKSTART-UPDATE.md) |
| "Comment ça marche en détail?" | [UPDATE-GUIDE.md](UPDATE-GUIDE.md) |
| "Quoi de neuf dans v1.1.0?" | [COMPLETION-SUMMARY.md](COMPLETION-SUMMARY.md) |
| "Comment j'installe?" | [INSTALLATION-GUIDE.md](INSTALLATION-GUIDE.md) |

---

## Intégration CI/CD (Bonus)

### GitHub Actions: Auto-Check Updates

```yaml
name: Check SHHS Updates

on:
  schedule:
    - cron: '0 9 * * 1'  # Every Monday 9am

jobs:
  check-updates:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Check for SHHS updates
        run: |
          CURRENT=$(cat .ai/.shhs-version)
          LATEST=$(npm view create-shhs version)

          if [ "$CURRENT" != "$LATEST" ]; then
            echo "::warning::SHHS update available: $CURRENT → $LATEST"
            echo "Run: npx create-shhs update"
          fi
```

---

## Résumé Final

**Question:** "Comment mettre à jour SHHS?"

**Réponse:** `npx create-shhs update`

**Features livrées:**
- ✅ Versioning automatique
- ✅ Update intelligent (framework vs user)
- ✅ Backups automatiques
- ✅ Dry run
- ✅ Force mode
- ✅ Détection conflits
- ✅ Documentation complète

**Status:** Production-ready ✅

---

**END OF UPDATE SYSTEM SUMMARY**
