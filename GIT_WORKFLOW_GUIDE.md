# 🌳 Git Workflow Guide - Avoiding Merge Conflicts

## 🎯 **Best Practices for Safe Branch Development**

This guide ensures you can work on `arazet` branch safely, push updates regularly, and merge to `main` without losing any changes.

## 📋 **Recommended Workflow Steps**

### **1. 🔄 Always Start Fresh - Sync Both Branches**

```bash
# Switch to main and get latest changes
git checkout main
git pull origin main

# Switch to arazet and sync with main
git checkout arazet
git pull origin arazet
git merge main  # This brings main's latest changes into arazet
git push origin arazet  # Push the synced arazet branch
```

**Why this matters**: This ensures `arazet` has all the latest changes from `main` before you start working.

### **2. 🛠️ Development Cycle on Arazet**

```bash
# Make sure you're on arazet
git checkout arazet

# Make your changes (edit files, add features, etc.)
# ... do your development work ...

# Check what changed
git status
git diff

# Add and commit your changes
git add .
git commit -m "feat: describe what you added/changed"

# Push to arazet immediately (backup your work)
git push origin arazet
```

**Best Practice**: Commit and push frequently (every 30-60 minutes of work) to avoid losing progress.

### **3. 🔄 Regular Sync During Development**

**Do this every few hours or before starting a new feature:**

```bash
# Get latest main changes
git checkout main
git pull origin main

# Switch back to arazet and merge main
git checkout arazet
git merge main

# If there are conflicts, resolve them now (easier with fewer changes)
# Then push the updated arazet
git push origin arazet
```

### **4. 🚀 Final Merge to Main (When Feature Complete)**

```bash
# Final sync before merging
git checkout main
git pull origin main

git checkout arazet
git merge main  # Make sure arazet has latest main changes
git push origin arazet

# Now merge arazet into main
git checkout main
git merge arazet  # This should be a "fast-forward" merge (no conflicts)
git push origin main

# Optional: Update arazet to match main
git checkout arazet
git merge main
git push origin arazet
```

## 🛡️ **Conflict Prevention Strategies**

### **Strategy 1: Frequent Syncing**
- Sync `arazet` with `main` at least once per day
- Always sync before starting new features
- Sync after completing each feature

### **Strategy 2: Small, Focused Commits**
```bash
# Instead of one big commit:
git commit -m "feat: add massive feature with 50 file changes"

# Do multiple focused commits:
git commit -m "feat: add user authentication context"
git commit -m "feat: add login form component" 
git commit -m "feat: add logout functionality"
git commit -m "feat: add protected routes"
```

### **Strategy 3: Communication**
- Let team members know which files/features you're working on
- Avoid multiple people editing the same files simultaneously
- Use feature branches for experimental work

## ⚠️ **Handling Merge Conflicts (If They Happen)**

### **When You See a Conflict:**
```bash
# Git will show something like:
# CONFLICT (content): Merge conflict in components/navigation.tsx
# Automatic merge failed; fix conflicts and then commit the result.

# 1. Check which files have conflicts
git status

# 2. Open the conflicted file(s) in VS Code
# Look for conflict markers:
# <<<<<<< HEAD
# Your changes
# =======
# Other changes  
# >>>>>>> branch-name

# 3. Choose which changes to keep (or combine them)
# Remove the conflict markers (<<<<<<< ======= >>>>>>>)

# 4. Add the resolved files
git add components/navigation.tsx

# 5. Complete the merge
git commit -m "resolve: merge conflict in navigation component"

# 6. Push the resolved changes
git push origin arazet
```

## 🎯 **Daily Workflow Template**

### **Morning Routine:**
```bash
git checkout main
git pull origin main
git checkout arazet  
git merge main
git push origin arazet
```

### **During Development:**
```bash
# Every hour or after completing a feature:
git add .
git commit -m "descriptive message"
git push origin arazet
```

### **End of Day:**
```bash
# Save your work
git add .
git commit -m "wip: end of day progress on [feature]"
git push origin arazet

# Optional: sync with main for tomorrow
git checkout main
git pull origin main
git checkout arazet
git merge main
git push origin arazet
```

## 🚨 **Emergency Recovery Commands**

### **If You Made Changes on Wrong Branch:**
```bash
# If you accidentally worked on main:
git stash  # Save your changes temporarily
git checkout arazet
git stash pop  # Apply your changes to arazet
```

### **If You Want to Undo Last Commit:**
```bash
# Undo last commit but keep changes
git reset --soft HEAD~1

# Undo last commit and discard changes (CAREFUL!)
git reset --hard HEAD~1
```

### **If You Want to Start Over:**
```bash
# Reset arazet to match main exactly
git checkout arazet
git reset --hard main
git push --force-with-lease origin arazet
```

## ✅ **Pre-Merge Checklist**

Before merging `arazet` to `main`, verify:

- [ ] `arazet` is synced with latest `main`
- [ ] All tests pass (`npm run build`, `npm run lint`)
- [ ] No console errors in development
- [ ] All features work as expected
- [ ] Commit messages are descriptive
- [ ] No sensitive data in commits

## 🔧 **Useful Git Commands**

```bash
# See branch status
git status
git log --oneline -5

# Compare branches
git diff main..arazet
git log --oneline main..arazet

# See all branches
git branch -a

# Check which files changed
git diff --name-only HEAD~1

# See commit history with graph
git log --graph --oneline --all
```

## 🎯 **Key Principles**

1. **Always sync before starting new work**
2. **Commit and push frequently**
3. **Keep commits small and focused**
4. **Test before merging to main**
5. **Communicate with your team**
6. **When in doubt, ask for help**

---

**Remember**: It's better to sync too often than to deal with complex merge conflicts later! 🚀