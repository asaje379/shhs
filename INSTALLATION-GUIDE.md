# SHHS — Installation et Mise en Place

**Version:** 1.0.0
**Date:** 2026-02-24

---

## Fichiers Créés

Cette mise à jour complète SHHS avec les briques suivantes:

### 1. Gouvernance Centrale

| Fichier | Description |
|---------|-------------|
| `.ai/governance/constitution.md` | Constitution immuable (TDD, E2E, Knowledge Curator obligatoires) |
| `.ai/governance/definition-of-done.md` | Conditions de merge obligatoires (6 gates) |

### 2. Nouveaux Agents

| Fichier | Rôle |
|---------|------|
| `.ai/agents/knowledge-curator.md` | Valide faisabilité technique via Context7 |
| `.ai/agents/fitness-enforcer.md` | Détecte violations architecturales automatiquement |

### 3. Knowledge Base

| Fichier | Usage |
|---------|-------|
| `.ai/knowledge/knowledge-base.md` | Cache des contraintes techniques vérifiées |
| `.ai/knowledge/validation-reports/` | Rapports de validation du Knowledge Curator |

### 4. Fitness Functions

| Fichier | Description |
|---------|-------------|
| `.ai/architecture/governance/fitness/README.md` | Guide d'utilisation des fitness functions |
| `.ai/architecture/governance/fitness/rules.json` | Règles architecturales automatisées |
| `.ai/architecture/governance/fitness/config.json` | Configuration (mode DETECT/PREVENT) |
| `.ai/architecture/governance/fitness/exemptions.json` | Exemptions temporaires |
| `.ai/reports/fitness-results.json` | Format des résultats d'exécution |

### 5. Skills (Procédures Obligatoires)

| Fichier | Workflow |
|---------|----------|
| `.ai/skills/tdd/skill.md` | Procédure TDD (RED → GREEN → REFACTOR) |
| `.ai/skills/playwright/skill.md` | Tests E2E avec Playwright |
| `.ai/skills/context7/skill.md` | Queries de documentation live via Context7 |

### 6. Mise à Jour Documentation

| Fichier | Changements |
|---------|-------------|
| `CLAUDE.md` | Ajout Knowledge Curator, Fitness Enforcer, Skills, Constitution |
| `SHHS-COMPLETION-ANALYSIS.md` | Auto-analyse critique du système complété |

---

## Installation dans un Nouveau Projet

### Étape 1: Copier Structure `.ai/`

```bash
# Depuis le répertoire de votre projet
cp -r /path/to/shhs/.ai .
```

Structure copiée:
```
.ai/
├── agents/
│   ├── architect.md
│   ├── domain-architect.md
│   ├── developer.md
│   ├── static-reviewer.md
│   ├── qa.md
│   ├── debt-observer.md
│   ├── architecture-reviewer.md
│   ├── knowledge-curator.md          ← NOUVEAU
│   └── fitness-enforcer.md           ← NOUVEAU
├── governance/
│   ├── constitution.md               ← NOUVEAU
│   └── definition-of-done.md         ← NOUVEAU
├── architecture/
│   └── governance/
│       ├── fitness/
│       │   ├── README.md             ← NOUVEAU
│       │   ├── rules.json            ← NOUVEAU
│       │   ├── config.json           ← NOUVEAU
│       │   └── exemptions.json       ← NOUVEAU
├── knowledge/
│   ├── knowledge-base.md             ← NOUVEAU
│   └── validation-reports/           ← NOUVEAU
├── skills/
│   ├── tdd/skill.md                  ← NOUVEAU
│   ├── playwright/skill.md           ← NOUVEAU
│   └── context7/skill.md             ← NOUVEAU
├── ADR/
├── contracts/
├── features/
├── memory/
│   ├── patterns.md
│   └── anti-patterns.md
├── reports/
│   └── fitness-results.json          ← NOUVEAU
└── debt/
```

### Étape 2: Copier CLAUDE.md

```bash
cp /path/to/shhs/CLAUDE.md .
```

### Étape 3: Adapter Fitness Rules

Éditer `.ai/architecture/governance/fitness/rules.json` selon votre architecture:

```json
{
  "rules": [
    {
      "id": "your-custom-rule",
      "description": "...",
      "condition": { ... },
      "threshold": N,
      "severity": "BLOCK|WARN",
      "scope": "src/**/*.ts"
    }
  ]
}
```

### Étape 4: Bootstrap Knowledge Base

Remplir `.ai/knowledge/knowledge-base.md` avec votre stack:

```markdown
### React Server Components — Version 18.x

#### Hard Constraints

| Constraint | Evidence | Impact |
|------------|----------|--------|
| Cannot use useState | [React Docs](https://react.dev/...) | ... |
```

### Étape 5: Configurer Mode Fitness

Démarrer en mode DETECT (`.ai/architecture/governance/fitness/config.json`):

```json
{
  "mode": "DETECT",
  ...
}
```

Cela permet d'établir une baseline sans bloquer les merges.

---

## Workflow d'Adoption Progressive

### Phase 1: Observation (Semaine 1-2)

**Objectif:** Établir baseline

**Actions:**
1. Activer Fitness Enforcer en mode DETECT
2. Exécuter sur codebase existante
3. Générer `.ai/reports/fitness-baseline.json`
4. Identifier violations existantes

**Commande:**
```bash
# À implémenter: fitness-enforcer CLI
fitness-enforcer --mode detect --baseline
```

### Phase 2: Nouveaux Développements (Semaine 3-4)

**Objectif:** Appliquer gouvernance sur nouveau code uniquement

**Actions:**
1. Activer TDD skill pour nouvelles features
2. Knowledge Curator valide nouvelles décisions architecturales
3. Fitness Enforcer en DETECT pour nouveau code
4. Legacy code exempt (via `exemptions.json`)

### Phase 3: Cleanup Legacy (Mois 2-3)

**Objectif:** Réduire violations baseline de 20% par mois

**Actions:**
1. Prioriser violations BLOCK-severity
2. Créer ADRs pour migrations
3. Tracker progrès via fitness metrics

### Phase 4: Enforcement Strict (Mois 4+)

**Objectif:** Activer mode PREVENT

**Actions:**
1. Passer Fitness Enforcer en mode PREVENT
2. Bloquer merges sur violations BLOCK
3. Tous les gates obligatoires
4. Zero exemptions pour nouveau code

---

## Intégration CI/CD

### GitHub Actions (Exemple)

Créer `.github/workflows/shhs-gates.yml`:

```yaml
name: SHHS Governance Gates

on: pull_request

jobs:
  gate-1-knowledge-validation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Knowledge Curator Validation
        run: echo "Manual validation required if ADR added"

  gate-2-contract-validation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Validate Feature Contracts
        run: |
          npm run test:cucumber

  gate-3-structural-compliance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Static Review
        run: npm run lint:architecture

  gate-4-fitness-enforcement:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Fitness Functions
        run: |
          # À implémenter
          npm run fitness:enforce -- --mode prevent

  gate-5-behavioral-compliance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run All Tests
        run: |
          npm test -- --coverage
          npm run test:e2e
      - name: Upload Coverage
        uses: codecov/codecov-action@v3

  gate-6-domain-approval:
    runs-on: ubuntu-latest
    steps:
      - name: Domain Architect Review Required
        run: echo "Manual review required - enforce via branch protection"
```

### Branch Protection

Configuration GitHub:

- ✅ Require status checks to pass
- ✅ Require reviews (Domain Architect)
- ✅ Require linear history
- ✅ Include administrators

---

## Commandes NPM (À Implémenter)

Ajouter dans `package.json`:

```json
{
  "scripts": {
    "validate:all": "npm run validate:contract && npm run validate:structure && npm run validate:behavior",
    "validate:contract": "cucumber-js .ai/features",
    "validate:structure": "npm run lint:architecture && npm run fitness:enforce",
    "validate:behavior": "npm test && npm run test:e2e",
    "fitness:enforce": "node scripts/fitness-enforcer.js",
    "fitness:baseline": "node scripts/fitness-enforcer.js --baseline",
    "lint:architecture": "eslint --config .ai/configs/eslint-architecture.js src",
    "test:e2e": "playwright test"
  }
}
```

---

## Outils Requis

### Minimum (Manuel)

- Git
- Node.js
- NPM
- Éditeur de texte

**Usage:** Suivre workflows manuellement, documenter dans `.ai/reports/`

### Recommandé (Semi-Automatique)

- Jest / Vitest (tests)
- Cucumber.js (feature contracts)
- Playwright (E2E tests)
- ESLint (layer violations)
- Madge (dependency analysis)

**Usage:** Automatiser gates 2-5 partiellement

### Idéal (Full Automation)

- Tout ci-dessus +
- Fitness Enforcer CLI (à développer)
- Context7 MCP integration
- SHHS Dashboard (HTML reports)
- GitHub Actions workflows

**Usage:** Full CI/CD automation, zero intervention manuelle

---

## FAQ

### Q: Dois-je implémenter TOUS les fichiers immédiatement?

**R:** Non. Adoption progressive recommandée:

1. **Semaine 1:** Constitution + Definition of Done (gouvernance)
2. **Semaine 2:** Skills TDD + Playwright (discipline tests)
3. **Semaine 3:** Knowledge Curator + Knowledge Base (validation technique)
4. **Semaine 4:** Fitness Enforcer (mode DETECT)
5. **Mois 2+:** Fitness Enforcer mode PREVENT

### Q: Que faire si je n'ai pas accès à Context7?

**R:** Fallback manuel:

1. Consulter documentation officielle directement
2. Documenter quotes + URLs dans `.ai/knowledge/knowledge-base.md`
3. Knowledge Curator fonctionne en mode manuel
4. Réactiver Context7 quand disponible

### Q: Comment gérer legacy code avec violations?

**R:** Exemptions temporaires:

1. Créer ADR documentant plan de migration
2. Ajouter exemption dans `.ai/architecture/governance/fitness/exemptions.json`
3. Fixer expiration date (ex: 3 mois)
4. Tracker progrès via fitness metrics

### Q: Fitness Enforcer est-il exécutable actuellement?

**R:** Non, c'est de la documentation. Pour l'implémenter:

1. Parser `rules.json`
2. Analyser imports via TypeScript compiler API
3. Calculer métriques via Madge
4. Générer `fitness-results.json`

**Effort estimé:** 1-2 semaines développeur

### Q: TDD est vraiment obligatoire pour TOUT?

**R:** Oui, selon Constitution Article II. Si TDD impraticable:

1. Feature mal scoped (décomposer)
2. Manque de compétence (formation requise)
3. Contrainte technique réelle (Knowledge Curator valide)

Pas de bypass pour "gain de temps".

---

## Support et Contributions

### Documentation

- Constitution: `.ai/governance/constitution.md`
- Agents: `.ai/agents/*.md`
- Skills: `.ai/skills/*/skill.md`
- Analysis: `SHHS-COMPLETION-ANALYSIS.md`

### Prochaines Étapes Recommandées

1. **Implémenter Fitness Enforcer CLI**
   - Parser rules.json
   - Intégration Madge + ESLint
   - Génération rapports

2. **Context7 Integration**
   - MCP server connection
   - Cache local
   - Fallback web scraping

3. **Migration Toolkit**
   - Baseline analysis
   - Automated exemptions
   - Progress dashboard

4. **GitHub Actions Templates**
   - Copy-paste ready workflows
   - Branch protection configs

---

**END OF INSTALLATION GUIDE**
