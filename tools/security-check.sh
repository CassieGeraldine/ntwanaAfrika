#!/bin/bash

# Security Check Script for ntwanaAfrika
# This script helps ensure no API keys or secrets are accidentally committed

echo "🔒 Security Check for ntwanaAfrika"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Flag to track if any issues found
ISSUES_FOUND=false

echo -e "\n📋 Checking for potentially sensitive files..."

# Check if .env.local exists and is ignored
if [ -f ".env.local" ]; then
    if git check-ignore .env.local > /dev/null 2>&1; then
        echo -e "${GREEN}✅ .env.local exists and is properly ignored${NC}"
    else
        echo -e "${RED}❌ CRITICAL: .env.local exists but is NOT ignored by git!${NC}"
        ISSUES_FOUND=true
    fi
else
    echo -e "${YELLOW}⚠️  .env.local not found - create it from .env.example${NC}"
fi

# Check if .env.example exists
if [ -f ".env.example" ]; then
    echo -e "${GREEN}✅ .env.example template exists for team${NC}"
else
    echo -e "${YELLOW}⚠️  .env.example template missing${NC}"
fi

echo -e "\n🔍 Scanning for potential API keys in tracked files..."

# Search for common API key patterns in tracked files
API_KEY_PATTERNS=(
    "AIza[0-9A-Za-z_-]{35}"  # Google API keys
    "sk-[a-zA-Z0-9]{48}"     # OpenAI API keys
    "firebase[a-zA-Z0-9_-]+" # Firebase keys
    "[a-zA-Z0-9]{32,}"       # Generic long strings that might be keys
)

FOUND_KEYS=false
for pattern in "${API_KEY_PATTERNS[@]}"; do
    if git ls-files | xargs grep -l "$pattern" 2>/dev/null; then
        echo -e "${RED}❌ Potential API keys found in tracked files!${NC}"
        git ls-files | xargs grep -n "$pattern" 2>/dev/null
        FOUND_KEYS=true
        ISSUES_FOUND=true
    fi
done

if [ "$FOUND_KEYS" = false ]; then
    echo -e "${GREEN}✅ No API key patterns found in tracked files${NC}"
fi

echo -e "\n📁 Checking .gitignore coverage..."

REQUIRED_IGNORES=(
    ".env.local"
    ".env"
    "node_modules"
    ".next"
    "*.log"
)

for ignore in "${REQUIRED_IGNORES[@]}"; do
    if grep -q "^${ignore}" .gitignore; then
        echo -e "${GREEN}✅ ${ignore} is ignored${NC}"
    else
        echo -e "${RED}❌ ${ignore} is NOT in .gitignore${NC}"
        ISSUES_FOUND=true
    fi
done

echo -e "\n🚀 Git status check..."
if git status --porcelain | grep -q "\.env\.local"; then
    echo -e "${RED}❌ CRITICAL: .env.local is staged for commit!${NC}"
    echo "Run: git reset HEAD .env.local"
    ISSUES_FOUND=true
else
    echo -e "${GREEN}✅ No sensitive files staged for commit${NC}"
fi

echo -e "\n📊 Summary"
echo "=========="

if [ "$ISSUES_FOUND" = true ]; then
    echo -e "${RED}❌ SECURITY ISSUES FOUND!${NC}"
    echo "Please fix the issues above before committing."
    exit 1
else
    echo -e "${GREEN}✅ All security checks passed!${NC}"
    echo "Your repository is secure for team collaboration."
    exit 0
fi