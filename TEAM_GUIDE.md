# Team Development Guide for ntwanaAfrika

## 🌟 Branch Strategy

### Working with the `arazet` Branch

We use the `arazet` branch for development to avoid merge conflicts and ensure smooth team collaboration.

#### For Team Members:

1. **Clone the repository** (first time):
   ```bash
   git clone https://github.com/CassieGeraldine/ntwanaAfrika.git
   cd ntwanaAfrika
   ```

2. **Switch to the arazet branch**:
   ```bash
   git checkout arazet
   git pull origin arazet
   ```

3. **Create your feature branch** from arazet:
   ```bash
   git checkout -b feature/your-feature-name
   # Work on your feature
   git add .
   git commit -m "feat: your feature description"
   git push -u origin feature/your-feature-name
   ```

4. **Create Pull Request** to merge into `arazet` branch
5. **After review**, merge to `arazet`
6. **When ready for production**, create PR from `arazet` to `main`

## 🔒 Security Setup

### Environment Variables Setup

1. **Copy the environment template**:
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in your API keys** in `.env.local`:
   - Get Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Get Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/)
   - Get Firebase config from your Firebase project settings

3. **NEVER commit `.env.local`** - it contains sensitive API keys!

### Security Validation

Before committing, always run the security check:
```bash
./tools/security-check.sh
```

This script will:
- ✅ Verify `.env.local` is ignored
- 🔍 Scan for accidentally committed API keys
- 📁 Check `.gitignore` coverage
- 🚀 Ensure no sensitive files are staged

## 🛠️ Development Workflow

### Daily Development

1. **Start your work**:
   ```bash
   git checkout arazet
   git pull origin arazet
   git checkout -b feature/your-work
   ```

2. **Before committing**:
   ```bash
   # Run security check
   ./tools/security-check.sh
   
   # If all good, commit
   git add .
   git commit -m "feat: describe your changes"
   ```

3. **Push and create PR**:
   ```bash
   git push -u origin feature/your-work
   # Create PR to arazet branch on GitHub
   ```

### Code Review Process

1. All PRs must target the `arazet` branch first
2. Require at least 1 review before merging
3. Run security checks on each PR
4. Test Firebase integration works correctly

### Production Deployment

1. Create PR from `arazet` → `main`
2. Final testing and review
3. Merge to `main` for production deployment

## 🔥 Firebase Setup for New Team Members

### Quick Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment**:
   ```bash
   cp .env.example .env.local
   # Fill in your Firebase project credentials
   ```

3. **Enable Firebase features**:
   - Authentication (Email/Password + Google + Anonymous)
   - Firestore Database
   - Analytics (optional)

4. **Update Firestore security rules** (see `FIREBASE_SETUP.md`)

### Firebase Project Access

- **Project ID**: `twana-afrika`
- **Console**: https://console.firebase.google.com/project/twana-afrika
- Ask project admin to add you as a collaborator

## 🚨 Security Best Practices

### ✅ DO:
- Use `.env.local` for all API keys
- Run `./tools/security-check.sh` before commits
- Create feature branches from `arazet`
- Review PRs carefully for security issues
- Keep Firebase rules restrictive

### ❌ DON'T:
- Commit API keys or secrets
- Push directly to `main` branch
- Share `.env.local` files
- Hardcode credentials in source code
- Skip security checks

## 📞 Need Help?

- **Firebase Issues**: See `FIREBASE_SETUP.md`
- **Security Concerns**: Run `./tools/security-check.sh`
- **Git Problems**: Check this guide or ask team lead
- **API Setup**: See `.env.example` for required keys

---

Happy coding! 🎓✨