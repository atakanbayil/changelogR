# How to Change Branch Names in Git

## Overview
Changing branch names involves updating both local and remote branch references. This guide covers all methods for renaming branches safely.

## Quick Methods

### **Method 1: Rename Current Branch**
```bash
# Rename the branch you're currently on
git branch -m new-branch-name

# Example
git branch -m feature/user-authentication
```

### **Method 2: Rename Specific Branch**
```bash
# Rename any branch (even if not on it)
git branch -m old-branch-name new-branch-name

# Example
git branch -m feature-auth feature/user-authentication
```

### **Method 3: Complete Remote Rename**
```bash
# 1. Rename local branch
git branch -m old-name new-name

# 2. Delete old remote branch
git push origin --delete old-name

# 3. Push new branch
git push origin new-name

# 4. Set upstream
git push origin -u new-name
```

## Step-by-Step Examples

### **Example 1: Rename Feature Branch**
```bash
# Current state
git branch
# * feature-auth
#   main
#   develop

# Rename to follow naming convention
git branch -m feature-auth feature/user-authentication
git push origin --delete feature-auth
git push origin feature/user-authentication
git push origin -u feature/user-authentication

# Verify
git branch -a
# * feature/user-authentication
#   main
#   develop
#   remotes/origin/feature/user-authentication
```

### **Example 2: Rename with Conventional Naming**
```bash
# Rename to follow conventional commit naming
git branch -m feat-auth feat/user-authentication
git push origin --delete feat-auth
git push origin feat/user-authentication
```

### **Example 3: Rename Multiple Branches**
```bash
# Rename multiple branches systematically
git branch -m feature-login feature/user-login
git branch -m feature-signup feature/user-signup
git branch -m feature-profile feature/user-profile

# Push all renamed branches
git push origin --delete feature-login feature-signup feature-profile
git push origin feature/user-login feature/user-signup feature/user-profile
```

## Advanced Techniques

### **One-Liner Remote Rename**
```bash
# Rename remote branch in one command
git push origin :old-branch-name new-branch-name

# Example
git push origin :feature-auth feature/user-authentication
```

### **Rename Branch with History Preservation**
```bash
# Create new branch with old history
git checkout -b new-branch-name old-branch-name

# Delete old branch
git branch -D old-branch-name

# Push new branch
git push origin new-branch-name
```

### **Rename Branch in Pull Request**
```bash
# If you have an open PR, you need to:
# 1. Rename the branch
git branch -m old-name new-name

# 2. Force push to update PR
git push --force-with-lease origin new-name

# 3. The PR will automatically update to the new branch name
```

## Safety and Best Practices

### **Before Renaming**
```bash
# Check current branch
git branch --show-current

# List all branches
git branch -a

# Check if branch has uncommitted changes
git status

# Create backup
git checkout -b backup/old-branch-name
```

### **After Renaming**
```bash
# Verify the rename
git branch -a

# Check remote tracking
git branch -vv

# Test the branch
git checkout new-branch-name
git status
```

### **Force Push Safely**
```bash
# Use --force-with-lease instead of --force
git push --force-with-lease origin new-branch-name

# This prevents overwriting others' work
```

## Troubleshooting

### **Common Issues**

#### **1. "Branch not found"**
```bash
# Check if branch exists
git branch -a | grep branch-name

# Check remote branches
git ls-remote --heads origin
```

#### **2. "Cannot delete remote branch"**
```bash
# Check if you have permissions
git push origin --delete branch-name

# If you don't have permissions, ask admin to delete
```

#### **3. "Upstream branch gone"**
```bash
# Reset upstream after rename
git branch --unset-upstream
git push origin -u new-branch-name
```

#### **4. "Refusing to delete current branch"**
```bash
# Switch to different branch first
git checkout main
git branch -D branch-to-delete
```

### **Recovery Commands**
```bash
# Find deleted branches
git reflog

# Recover deleted branch
git checkout -b recovered-branch commit-hash

# Check remote status
git remote show origin
```

## Git Aliases for Branch Management

### **Add to .gitconfig**
```bash
[alias]
    # Rename current branch
    branch-rename = !sh -c 'git branch -m \"$1\" && git push origin --delete \"$2\" && git push origin \"$1\" && git push origin -u \"$1\"' -
    
    # List branches with more info
    branches = !git branch -a --format=\"%(HEAD) %(color:yellow)%(refname:short)%(color:reset) - %(contents:subject) %(color:green)(%(committerdate:relative)) [%(authorname)]\" --sort=-committerdate
    
    # Show branch info
    branch-info = !sh -c 'echo \"Current branch: $(git branch --show-current)\"; echo \"Remote tracking: $(git branch -vv | grep \"*\" | awk \"{print \\$4}\")\"' -
```

### **Usage:**
```bash
git branch-rename "new-name" "old-name"
git branches
git branch-info
```

## Complete Workflow Examples

### **Workflow 1: Rename Feature Branch**
```bash
# 1. Check current state
git branch --show-current
git status

# 2. Rename local branch
git branch -m feature-auth feature/user-authentication

# 3. Delete old remote branch
git push origin --delete feature-auth

# 4. Push new branch
git push origin feature/user-authentication

# 5. Set upstream
git push origin -u feature/user-authentication

# 6. Verify
git branch -vv
```

### **Workflow 2: Rename with PR Update**
```bash
# 1. Rename branch
git branch -m old-name new-name

# 2. Force push to update PR
git push --force-with-lease origin new-name

# 3. Check PR status
gh pr status

# 4. Update PR if needed
gh pr edit --title "New PR title"
```

### **Workflow 3: Batch Rename**
```bash
# Rename multiple branches
for branch in feature-login feature-signup feature-profile; do
    new_name="feature/user-${branch#feature-}"
    git branch -m "$branch" "$new_name"
    git push origin --delete "$branch"
    git push origin "$new_name"
done
```

## Best Practices

### **1. Use Descriptive Names**
```bash
# Good names
feature/user-authentication
bugfix/login-validation
hotfix/security-patch

# Avoid generic names
feature
bugfix
temp
```

### **2. Follow Naming Conventions**
```bash
# Conventional naming
feat/user-authentication
fix/login-bug
docs/api-documentation
test/auth-validation
```

### **3. Check Before Renaming**
```bash
# Always check current state
git status
git branch -a
git log --oneline -5
```

### **4. Communicate Changes**
```bash
# If working with team, communicate branch renames
# Update documentation
# Notify team members
```

## Quick Reference

### **Local Branch Only**
```bash
git branch -m new-name
```

### **Local and Remote**
```bash
git branch -m old-name new-name
git push origin --delete old-name
git push origin new-name
git push origin -u new-name
```

### **One-Liner Remote Rename**
```bash
git push origin :old-name new-name
```

### **Check Current Branch**
```bash
git branch --show-current
```

### **List All Branches**
```bash
git branch -a
```

This comprehensive guide covers all aspects of branch renaming, from simple local renames to complex remote operations, ensuring you can safely and effectively manage your branch names! 