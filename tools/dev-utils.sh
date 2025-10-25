#!/bin/bash

# ntwanaAfrika Development Utilities
# Common development tasks for team collaboration

function show_help() {
    echo "🛠️  ntwanaAfrika Development Utilities"
    echo "====================================="
    echo ""
    echo "Available commands:"
    echo "  setup          - Run team setup script"
    echo "  dev            - Start development server"
    echo "  build          - Build for production"
    echo "  test           - Run tests (when available)"
    echo "  lint           - Run code linting"
    echo "  clean          - Clean node_modules and reinstall"
    echo "  check-env      - Check environment variables"
    echo "  git-setup      - Setup git hooks and config"
    echo "  help           - Show this help message"
    echo ""
    echo "Usage: ./tools/dev-utils.sh <command>"
}

function setup_project() {
    echo "🚀 Running team setup..."
    ./tools/setup-team.sh
}

function start_dev() {
    echo "🚀 Starting development server..."
    npm run dev
}

function build_project() {
    echo "🏗️  Building project..."
    npm run build
}

function run_tests() {
    echo "🧪 Running tests..."
    if [ -f "package.json" ] && grep -q "test" package.json; then
        npm test
    else
        echo "No tests configured yet. Consider adding test scripts!"
    fi
}

function lint_code() {
    echo "🔍 Running linter..."
    npm run lint
}

function clean_install() {
    echo "🧹 Cleaning node_modules and reinstalling..."
    rm -rf node_modules package-lock.json
    npm install
}

function check_env() {
    echo "�� Checking environment variables..."
    if [ -f ".env.local" ]; then
        echo "✅ .env.local exists"
        source .env.local
        
        echo ""
        echo "Environment variables status:"
        
        if [ -n "$GOOGLE_API_KEY" ] && [ "$GOOGLE_API_KEY" != "your_gemini_api_key_here" ]; then
            echo "✅ GOOGLE_API_KEY is configured"
        else
            echo "❌ GOOGLE_API_KEY is not configured"
        fi
        
        if [ -n "$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY" ] && [ "$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY" != "your_google_maps_api_key_here" ]; then
            echo "✅ NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is configured"
        else
            echo "❌ NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not configured"
        fi
    else
        echo "❌ .env.local not found. Run 'setup' command first."
    fi
}

function setup_git() {
    echo "🔧 Setting up git configuration..."
    
    # Check if git is initialized
    if [ ! -d ".git" ]; then
        echo "❌ Not a git repository"
        return 1
    fi
    
    # Set up useful git aliases
    git config alias.st status
    git config alias.co checkout
    git config alias.br branch
    git config alias.ci commit
    git config alias.unstage 'reset HEAD --'
    git config alias.last 'log -1 HEAD'
    git config alias.visual '!gitk'
    
    echo "✅ Git aliases configured"
    echo "  git st     - git status"
    echo "  git co     - git checkout"
    echo "  git br     - git branch"
    echo "  git ci     - git commit"
    echo "  git last   - show last commit"
}

# Main script logic
case "$1" in
    "setup")
        setup_project
        ;;
    "dev")
        start_dev
        ;;
    "build")
        build_project
        ;;
    "test")
        run_tests
        ;;
    "lint")
        lint_code
        ;;
    "clean")
        clean_install
        ;;
    "check-env")
        check_env
        ;;
    "git-setup")
        setup_git
        ;;
    "help"|"--help"|"-h"|"")
        show_help
        ;;
    *)
        echo "❌ Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
