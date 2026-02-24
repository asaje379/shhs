# SHHS — Guide de Mise à Jour

**Version:** 1.1.0
**Date:** 2026-02-24

---

## Vue d'Ensemble

SHHS intègre maintenant un **système de versioning et de mise à jour automatique** similaire à npm ou git.

```bash
# Installer SHHS
npx create-shhs

# Mettre à jour vers la dernière version
npx create-shhs update

# Prévisualiser les changements sans appliquer
npx create-shhs update --dry-run

# Forcer la mise à jour (écraser modifications locales)
npx create-shhs update --force
```

---

## Comment Ça Marche

### 1. Versioning

Chaque installation SHHS inclut un fichier `.ai/.shhs-version` contenant la version installée.

**Exemple:**
```
.ai/.shhs-version
> 1.1.0
```

### 2. Détection Automatique

La commande `update` compare:
- **Version installée** (`.ai/.shhs-version`)
- **Version disponible** (latest npm package)

Si versions identiques → message "Already up to date"

### 3. Mise à Jour Sélective

**Fichiers TOUJOURS mis à jour** (framework core):
- `.ai/agents/*.md` — Définitions agents (Architect, Developer, etc.)
- `.ai/governance/*.md` — Constitution, Definition of Done
- `.ai/skills/*/skill.md` — Procédures (TDD, Playwright, Context7)
- `.ai/architecture/governance/fitness/README.md` — Documentation fitness functions

**Fichiers PRÉSERVÉS** (contenu utilisateur):
- `.ai/ADR/*.md` — Vos décisions architecturales
- `.ai/contracts/*.md` — Vos contrats publics
- `.ai/features/*.feature` — Vos feature contracts
- `.ai/reports/*` — Vos rapports
- `.ai/debt/*` — Vos rapports de dette
- `ARCHITECTURE.md` — Votre architecture

**Fichiers CONDITIONNELS** (mis à jour si non modifiés):
- `CLAUDE.md` — Si vous n'avez pas modifié, mis à jour
- `.ai/memory/patterns.md` — Préservé si modifié
- `.ai/architecture/governance/fitness/config.json` — Préservé (config spécifique projet)
- `.ai/architecture/governance/fitness/exemptions.json` — Préservé (exemptions projet)

---

## Scénarios d'Utilisation

### Scénario 1: Mise à Jour Simple

**Situation:** SHHS 1.0.0 installé, vous voulez passer à 1.1.0

```bash
cd /path/to/your/project
npx create-shhs update
```

**Résultat:**
```
╔════════════════════════════════════════════════════════╗
║  Self-Healing Hybrid Swarm — Update                    ║
╚════════════════════════════════════════════════════════╝

Target: /path/to/your/project
Mode: UPDATE

Current version: 1.0.0
Available version: 1.1.0

[1/3] Updating core files

✓ Updated .ai/agents/architect.md
✓ Updated .ai/agents/knowledge-curator.md (new)
✓ Updated .ai/agents/fitness-enforcer.md (new)
✓ Updated .ai/governance/constitution.md (new)
...

[2/3] Checking user-modifiable files

→ Preserving ARCHITECTURE.md (user file)
⊙ Skipping CLAUDE.md (locally modified, use --force to overwrite)

[3/3] Updating version

✓ Version updated: 1.0.0 → 1.1.0

╔════════════════════════════════════════════════════════╗
║  Update Summary                                        ║
╚════════════════════════════════════════════════════════╝

✓ Updated:    15 files
✓ Created:    5 files (new features)
→ Preserved:  8 files (user content)
⊙ Skipped:    1 file (modified locally)
```

### Scénario 2: Prévisualisation (Dry Run)

**Situation:** Vous voulez voir ce qui sera changé avant d'appliquer

```bash
npx create-shhs update --dry-run
```

**Résultat:**
```
Mode: DRY RUN

→ Would update .ai/agents/architect.md
→ Would create .ai/agents/knowledge-curator.md
→ Would preserve ARCHITECTURE.md (user file)
...

This was a dry run. No files were modified.
Run without --dry-run to apply changes.
```

### Scénario 3: Force Update (Écraser Modifications)

**Situation:** Vous avez modifié `CLAUDE.md` mais voulez la version officielle

```bash
npx create-shhs update --force
```

**Résultat:**
```
✓ Updated CLAUDE.md (backup created, was modified)

Backups created:
  • CLAUDE.md.backup-1709030400000
  • .ai/agents/architect.md.backup-1709030400000

To clean up backups:
  find . -name "*.backup-*" -delete
```

**Note:** Vos modifications sont sauvegardées dans `.backup-*` files.

### Scénario 4: Déjà à Jour

**Situation:** Version installée = version disponible

```bash
npx create-shhs update
```

**Résultat:**
```
Current version: 1.1.0
Available version: 1.1.0

✓ Already up to date!
  Use --force to reinstall anyway
```

---

## Gestion des Conflits

### Qu'est-ce qu'un Conflit?

Un conflit survient quand:
1. Fichier a été modifié localement
2. Nouvelle version SHHS modifie aussi ce fichier
3. Merge automatique impossible

**Exemple:**
```
⚠ Conflict: .ai/architecture/governance/fitness/rules.json has local changes
  Manual merge required or use --force to overwrite

Conflicts requiring manual merge:
  • .ai/architecture/governance/fitness/rules.json
```

### Résolution Manuelle

**Option 1: Merge manuel**

```bash
# 1. Voir la nouvelle version
cat node_modules/create-shhs/template/.ai/architecture/governance/fitness/rules.json

# 2. Comparer avec votre version
diff .ai/architecture/governance/fitness/rules.json \
     node_modules/create-shhs/template/.ai/architecture/governance/fitness/rules.json

# 3. Merger manuellement (copier règles pertinentes)
vim .ai/architecture/governance/fitness/rules.json

# 4. Re-exécuter update
npx create-shhs update
```

**Option 2: Force update + restauration sélective**

```bash
# 1. Force update (crée backup)
npx create-shhs update --force

# 2. Restaurer vos règles custom depuis backup
cp .ai/architecture/governance/fitness/rules.json.backup-* \
   .ai/architecture/governance/fitness/rules.json.old

# 3. Merge manuel
# Combiner rules.json (nouveau) + rules.json.old (vos custom rules)
```

---

## Fichiers Particuliers

### `.ai/architecture/governance/fitness/rules.json`

**Type:** Merge Required

**Pourquoi:** Vous avez probablement ajouté vos propres fitness rules custom. La mise à jour peut ajouter de nouvelles rules framework.

**Stratégie:**
- Update ajoute nouvelles rules standard
- Préserve vos rules custom
- Si conflit détecté, merge manuel requis

**Format merge:**
```json
{
  "rules": [
    // ⬇️ SHHS framework rules (updated)
    { "id": "cross-domain-db-access", ... },
    { "id": "max-module-dependencies", ... },

    // ⬇️ Your custom rules (preserved)
    { "id": "your-custom-rule-1", ... },
    { "id": "your-custom-rule-2", ... }
  ]
}
```

### `CLAUDE.md`

**Type:** Conditional Update

**Logique:**
- Si non modifié → mis à jour automatiquement
- Si modifié → skipped (use `--force` to overwrite)

**Cas d'usage:**
- **Ne touchez jamais CLAUDE.md** → toujours à jour automatiquement
- **Vous avez ajouté notes projet-specific** → préservé, merge manuel si nouvelles features SHHS

### `.ai/memory/patterns.md` & `anti-patterns.md`

**Type:** User Content (Preserved)

**Stratégie:**
- Template fournit exemples initiaux
- Une fois installé, 100% contenu utilisateur
- Jamais mis à jour automatiquement

**Si vous voulez récupérer templates originaux:**
```bash
# Voir template SHHS officiel
cat node_modules/create-shhs/template/.ai/memory/patterns.md

# Copier manuellement si pertinent
```

---

## Best Practices

### 1. Commitez Avant Update

```bash
git status  # Vérifier état
git add .
git commit -m "chore: before SHHS update"

npx create-shhs update

git status  # Voir ce qui a changé
git diff    # Review changes
git add .
git commit -m "chore: update SHHS to v1.1.0"
```

### 2. Utilisez Dry Run en Premier

```bash
# Prévisualiser
npx create-shhs update --dry-run

# Si OK, appliquer
npx create-shhs update
```

### 3. Backups Automatiques

L'updater crée automatiquement backups:
```
CLAUDE.md.backup-1709030400000
.ai/agents/architect.md.backup-1709030400000
```

**Nettoyage périodique:**
```bash
# Lister backups
find . -name "*.backup-*"

# Supprimer backups > 30 jours
find . -name "*.backup-*" -mtime +30 -delete
```

### 4. Review Changelog

Avant update, consultez releases notes:
```bash
# Voir dernières releases GitHub
open https://github.com/asaje379/shhs/releases

# Ou via npm
npm view create-shhs versions
```

---

## Migration Entre Versions Majeures

### Versioning Sémantique

SHHS suit semver:
- **1.0.0 → 1.0.1** (patch): Bug fixes, typos
- **1.0.0 → 1.1.0** (minor): Nouvelles features, backward compatible
- **1.0.0 → 2.0.0** (major): Breaking changes

### Breaking Changes (Major Updates)

**Exemple: 1.x → 2.0**

Changements potentiels:
- Agents renommés
- Structure `.ai/` réorganisée
- Constitution modifiée (nouvelles règles obligatoires)

**Process de migration:**

```bash
# 1. Lire migration guide
cat node_modules/create-shhs/MIGRATION-v2.md

# 2. Dry run pour voir impact
npx create-shhs update --dry-run

# 3. Créer branche migration
git checkout -b migration/shhs-v2

# 4. Appliquer update
npx create-shhs update

# 5. Résoudre conflits manuellement
# (suivre migration guide)

# 6. Tester
npm test
npm run validate:all  # Si vous avez ces scripts

# 7. Merge si OK
git checkout main
git merge migration/shhs-v2
```

---

## FAQ

### Q: L'update va-t-il écraser mon ARCHITECTURE.md?

**R:** Non, jamais. `ARCHITECTURE.md` est considéré 100% contenu utilisateur.

---

### Q: Que faire si update échoue?

**R:** Restaurer depuis backup:

```bash
# Trouver backup le plus récent
ls -lt | grep backup

# Restaurer
cp CLAUDE.md.backup-1709030400000 CLAUDE.md

# Re-essayer avec --dry-run
npx create-shhs update --dry-run
```

---

### Q: Puis-je update seulement certains fichiers?

**R:** Pas directement, mais contournement:

```bash
# 1. Update avec --dry-run pour voir liste
npx create-shhs update --dry-run > changes.txt

# 2. Copier manuellement fichiers voulus
cp node_modules/create-shhs/template/.ai/agents/architect.md \
   .ai/agents/architect.md

# 3. Update version manuellement
echo "1.1.0" > .ai/.shhs-version
```

---

### Q: Update fonctionne-t-il sans internet?

**R:** Oui, si package déjà dans cache npm:

```bash
# Télécharger d'abord
npm pack create-shhs

# Plus tard, offline
npx create-shhs update
```

---

### Q: Puis-je downgrade vers version précédente?

**R:** Oui, en spécifiant version npm:

```bash
# Downgrade vers 1.0.0
npx create-shhs@1.0.0 update --force
```

**Attention:** Downgrade peut perdre nouvelles features.

---

## Changelog (Résumé)

### v1.1.0 (2026-02-24)

**Nouvelles Features:**
- ✅ Constitution (`.ai/governance/constitution.md`)
- ✅ Knowledge Curator agent
- ✅ Fitness Enforcer agent
- ✅ Skills (TDD, Playwright, Context7)
- ✅ Definition of Done (6 merge gates)
- ✅ Fitness functions (8 règles automatisées)

**Breaking Changes:** Aucun

**Migration Required:** Non (backward compatible)

---

## Support

**Documentation:**
- Installation: `INSTALLATION-GUIDE.md`
- Updates: Ce fichier (`UPDATE-GUIDE.md`)
- Complétion Analysis: `SHHS-COMPLETION-ANALYSIS.md`

**Issues:**
- GitHub: https://github.com/asaje379/shhs/issues

---

**END OF UPDATE GUIDE**
