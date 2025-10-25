# 🛠️ ntwanaAfrika Development Tools

This folder contains tools and scripts to help the development team collaborate efficiently on the ntwanaAfrika project.

## 📁 Available Tools

### `setup-team.sh`
Automated setup script for new team members. This script:
- Checks system requirements (Node.js, npm)
- Installs project dependencies
- Creates environment configuration from template
- Validates environment setup

**Usage:**
```bash
./tools/setup-team.sh
```

### `dev-utils.sh`
Development utilities for common tasks. Available commands:

```bash
# Show help
./tools/dev-utils.sh help

# Setup project (runs setup-team.sh)
./tools/dev-utils.sh setup

# Start development server
./tools/dev-utils.sh dev

# Build for production
./tools/dev-utils.sh build

# Run linting
./tools/dev-utils.sh lint

# Clean install dependencies
./tools/dev-utils.sh clean

# Check environment variables status
./tools/dev-utils.sh check-env

# Setup git aliases and configuration
./tools/dev-utils.sh git-setup
```

## 🚀 Quick Start for New Team Members

1. **Clone the repository:**
   ```bash
   git clone https://github.com/CassieGeraldine/ntwanaAfrika.git
   cd ntwanaAfrika
   ```

2. **Run the team setup:**
   ```bash
   ./tools/setup-team.sh
   ```

3. **Configure your environment:**
   - Edit `.env.local` with your API keys
   - Get Google Gemini AI API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Get Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/)

4. **Start development:**
   ```bash
   ./tools/dev-utils.sh dev
   ```

## 🔑 Required API Keys

### Google Gemini AI
- Used for the AI tutor feature
- Get your key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- Set in `.env.local` as `GOOGLE_API_KEY` and `GEMINI_API_KEY`

### Google Maps Platform
- Used for location-based marketplace features
- Get your key from [Google Cloud Console](https://console.cloud.google.com/)
- Enable these APIs:
  - Maps JavaScript API
  - Places API
  - Geocoding API
  - Directions API
- Set in `.env.local` as `GOOGLE_MAPS_API_KEY` and `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

## 🤝 Team Collaboration Guidelines

### Git Workflow
1. Always pull latest changes before starting work
2. Create feature branches for new features: `git checkout -b feature/your-feature-name`
3. Use descriptive commit messages
4. Push your branch and create a pull request
5. Get code review before merging

### Development Standards
- Use TypeScript for type safety
- Follow the existing code style
- Run linter before committing: `./tools/dev-utils.sh lint`
- Test your changes in development mode
- Update documentation when needed

### Environment Management
- Never commit `.env.local` file
- Use `.env.example` as template for required variables
- Ask team lead for API keys if needed
- Use `./tools/dev-utils.sh check-env` to verify your setup

## 📞 Getting Help

- **Technical Issues:** Create a GitHub issue
- **Setup Problems:** Ask in team chat or contact project maintainer
- **API Keys:** Contact team lead for shared development keys

## 🔄 Common Workflows

### Starting Work on a New Feature
```bash
git pull origin main
git checkout -b feature/your-feature-name
./tools/dev-utils.sh dev
# Make your changes
./tools/dev-utils.sh lint
git add .
git commit -m "Add your feature description"
git push origin feature/your-feature-name
# Create pull request on GitHub
```

### Troubleshooting Development Issues
```bash
# Check environment
./tools/dev-utils.sh check-env

# Clean install if having dependency issues
./tools/dev-utils.sh clean

# Check if project builds correctly
./tools/dev-utils.sh build
```

## 📚 Additional Resources

- [Project README](../README.md) - Main project documentation
- [Google Maps Setup Guide](../GOOGLE_MAPS_SETUP.md) - Detailed Maps API setup
- [Career Image Generator Setup](../CAREER_IMAGE_GENERATOR.md) - AI image generation setup
- [Next.js Documentation](https://nextjs.org/docs) - Framework documentation
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - TypeScript guide

Happy coding! 🚀
