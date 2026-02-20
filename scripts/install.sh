#!/usr/bin/env bash

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory and template directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SHHS_ROOT="$(dirname "$SCRIPT_DIR")"
TEMPLATE_DIR="$SHHS_ROOT/template"

# Target directory (where installation happens)
TARGET_DIR="${1:-.}"

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Self-Healing Hybrid Swarm — Installation             ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Validate template directory exists
if [ ! -d "$TEMPLATE_DIR" ]; then
    echo -e "${RED}✗ Error: Template directory not found at $TEMPLATE_DIR${NC}"
    echo -e "${YELLOW}  Make sure you're running this from the SHHS repository${NC}"
    exit 1
fi

# Ensure target directory exists
if [ ! -d "$TARGET_DIR" ]; then
    echo -e "${RED}✗ Error: Target directory '$TARGET_DIR' does not exist${NC}"
    exit 1
fi

cd "$TARGET_DIR"
TARGET_DIR="$(pwd)"

echo -e "${BLUE}Installing to: ${NC}$TARGET_DIR"
echo ""

# Function to copy file if it doesn't exist
copy_if_missing() {
    local src="$1"
    local dest="$2"
    local description="$3"

    if [ -f "$dest" ]; then
        echo -e "${YELLOW}⊙ Skipping $description (already exists)${NC}"
        return 0
    fi

    cp "$src" "$dest"
    echo -e "${GREEN}✓ Installed $description${NC}"
}

# Function to copy directory
copy_directory() {
    local src="$1"
    local dest="$2"
    local description="$3"

    if [ -d "$dest" ]; then
        echo -e "${YELLOW}⊙ Skipping $description (already exists)${NC}"
        echo -e "${YELLOW}  To update, remove '$dest' and re-run installation${NC}"
        return 0
    fi

    cp -r "$src" "$dest"
    echo -e "${GREEN}✓ Installed $description${NC}"
}

# Install .ai directory
echo -e "${BLUE}[1/3] Installing AI governance structure${NC}"
copy_directory "$TEMPLATE_DIR/.ai" "$TARGET_DIR/.ai" ".ai directory"
echo ""

# Install CLAUDE.md
echo -e "${BLUE}[2/3] Installing governance files${NC}"
copy_if_missing "$TEMPLATE_DIR/CLAUDE.md" "$TARGET_DIR/CLAUDE.md" "CLAUDE.md"
copy_if_missing "$TEMPLATE_DIR/ARCHITECTURE.md" "$TARGET_DIR/ARCHITECTURE.md" "ARCHITECTURE.md"
copy_if_missing "$TEMPLATE_DIR/README.ai.md" "$TARGET_DIR/README.ai.md" "README.ai.md"
echo ""

# Check if .gitignore exists and .ai is not ignored
echo -e "${BLUE}[3/3] Validating setup${NC}"

if [ -f "$TARGET_DIR/.gitignore" ]; then
    if grep -q "^\.ai" "$TARGET_DIR/.gitignore" 2>/dev/null; then
        echo -e "${YELLOW}⚠ Warning: .ai directory is in .gitignore${NC}"
        echo -e "${YELLOW}  Consider tracking .ai for team collaboration${NC}"
    else
        echo -e "${GREEN}✓ .gitignore configuration looks good${NC}"
    fi
else
    echo -e "${YELLOW}⊙ No .gitignore found${NC}"
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  Installation Complete                                 ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo ""
echo -e "  1. Review ${GREEN}CLAUDE.md${NC} to understand the governance model"
echo -e "  2. Update ${GREEN}ARCHITECTURE.md${NC} with your system design"
echo -e "  3. Start by loading the ${GREEN}Root Architect${NC} agent:"
echo -e "     ${YELLOW}cat .ai/agents/architect.md${NC}"
echo -e "  4. Bootstrap your architecture using the architect"
echo ""
echo -e "${BLUE}Documentation:${NC}"
echo -e "  • README.ai.md — Quick reference guide"
echo -e "  • .ai/agents/ — All agent role definitions"
echo -e "  • .ai/memory/ — Patterns and anti-patterns"
echo ""
echo -e "${YELLOW}Pro tip:${NC} Commit the .ai directory to version control for team collaboration"
echo ""
