# Task 08: GitHub Deployment & Configuration

## Overview
Complete setup for deploying MeldUI to GitHub, including repository configuration, GitHub Actions workflows, and package publishing.

## Prerequisites
- All Phase 5 changes completed (changesets, workflows, documentation)
- Repository exists at: https://github.com/meldui/meldui
- Local changes ready to commit

---

## Step 1: Commit and Push Changes to GitHub

### 1.1 Review Current Status
```bash
git status
```

Verify all expected changes are present:
- Modified package.json files (root, vue, tabler-vue)
- 45 Vue component files with icon replacements
- New directories: `.changeset/`, `.github/`
- New files: `README.md`, `RELEASING.md`, `.npmrc.example`

### 1.2 Stage All Changes
```bash
git add .
```

### 1.3 Create Commit
```bash
git commit -m "feat: Phase 5 publishing setup

- Added changesets for version management
- Configured GitHub Packages publishing
- Replaced lucide-vue-next with @meldui/tabler-vue (45 components)
- Added GitHub Actions workflows (CI, release, publish, storybook deploy)
- Created README.md and RELEASING.md documentation
- Added .npmrc.example for GitHub Packages authentication"
```

### 1.4 Push to Main Branch
```bash
git push origin main
```

**Expected Result:** Code pushed successfully to GitHub main branch.

---

## Step 2: Configure GitHub Repository Settings

### 2.1 Enable GitHub Pages
1. Navigate to: `https://github.com/meldui/meldui/settings/pages`
2. Under "Build and deployment":
   - **Source:** Select "GitHub Actions"
3. Click "Save"

**Expected Result:** GitHub Pages configured to deploy from Actions.

**Storybook URL:** `https://meldui.github.io/meldui/`

### 2.2 Enable Actions Permissions
1. Navigate to: `https://github.com/meldui/meldui/settings/actions`
2. Under "Workflow permissions":
   - Select "Read and write permissions"
   - Check "Allow GitHub Actions to create and approve pull requests"
3. Click "Save"

**Expected Result:** Workflows can write to repository and create PRs.

### 2.3 Verify GitHub Packages Enabled
1. Navigate to: `https://github.com/meldui/meldui/settings`
2. Check that "Packages" section is available
3. No additional configuration needed (enabled by default)

**Expected Result:** Repository can publish packages.

---

## Step 3: Verify Workflows Execute Successfully

### 3.1 Check Actions Tab
1. Navigate to: `https://github.com/meldui/meldui/actions`
2. Verify workflows are running:
   - **CI** - Lint, typecheck, and build verification
   - **Deploy Storybook to GitHub Pages** - Documentation deployment

### 3.2 Monitor Workflow Completion
Wait for all workflows to complete:
- ✅ Green checkmark = success
- ❌ Red X = failure (check logs)

### 3.3 Verify Storybook Deployment
Once "Deploy Storybook" workflow completes:
1. Visit: `https://meldui.github.io/meldui/`
2. Confirm Storybook loads correctly
3. Test a few component pages

**Expected Result:** All workflows pass, Storybook is live.

---

## Step 4: Create First Changeset

### 4.1 Run Changeset Command
```bash
pnpm changeset
```

### 4.2 Answer Prompts

**Question:** Which packages would you like to include?
```
Use spacebar to select both:
[x] @meldui/vue
[x] @meldui/tabler-vue
```

**Question:** What kind of change is this?
```
Choose: minor (for 0.1.0 initial release)
OR
Choose: major (if releasing as 1.0.0)
```

**Question:** Please enter a summary for this change:
```
Initial release with Vue 3 components and Tabler icon system
```

### 4.3 Commit the Changeset
```bash
git add .changeset/*.md
git commit -m "chore: add changeset for initial release"
git push origin main
```

**Expected Result:** Changeset file created and pushed to repository.

---

## Step 5: Publish First Release

### Option A: GitHub Actions Release Workflow (Recommended)

1. Navigate to: `https://github.com/meldui/meldui/actions/workflows/release.yml`
2. Click "Run workflow" dropdown
3. Select branch: `main`
4. Choose version type:
   - `patch` - 0.1.0 → 0.1.1
   - `minor` - 0.1.0 → 0.2.0
   - `major` - 0.1.0 → 1.0.0
5. Click "Run workflow"

**Expected Result:** Workflow creates version PR or publishes directly based on changesets.

### Option B: Manual Command Line Release

```bash
# Step 1: Version the packages
pnpm changeset:version

# Step 2: Commit version changes
git add .
git commit -m "chore: version packages"
git push origin main

# Step 3: Publish to GitHub Packages
pnpm release
```

**Note:** This requires npm authentication configured locally.

**Expected Result:**
- Package versions updated in package.json files
- CHANGELOG.md files created/updated
- Packages published to GitHub Packages
- Git tags created (e.g., `@meldui/vue@0.1.0`)

---

## Step 6: Verify Package Publication

### 6.1 Check GitHub Packages
1. Navigate to: `https://github.com/orgs/meldui/packages` or repository packages tab
2. Verify packages are listed:
   - `@meldui/vue`
   - `@meldui/tabler-vue`
3. Click each package to see version and details

### 6.2 Test Package Installation

Create a test project and install:

```bash
# Create .npmrc file
echo "@meldui:registry=https://npm.pkg.github.com" > .npmrc
echo "//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN" >> .npmrc

# Install packages
npm install @meldui/vue @meldui/tabler-vue vue
```

**Expected Result:** Packages install successfully.

---

## Step 7: Document User Installation

### 7.1 Generate GitHub Token (for users)

Users need a personal access token to install packages:

1. Go to: `https://github.com/settings/tokens`
2. Click "Generate new token" → "Generate new token (classic)"
3. Token settings:
   - Name: "MeldUI Package Access"
   - Expiration: Choose appropriate duration
   - Scopes: Check `read:packages`
4. Click "Generate token"
5. Copy token immediately (can't view again)

### 7.2 Configure .npmrc (for users)

Create `.npmrc` in project root:
```
@meldui:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

Replace `YOUR_GITHUB_TOKEN` with the token from Step 7.1.

### 7.3 Install Packages (for users)
```bash
pnpm add @meldui/vue @meldui/tabler-vue vue
```

---

## GitHub Actions Workflows Overview

### Workflow 1: CI (`ci.yml`)
- **Triggers:** Push to main, pull requests
- **Purpose:** Quality checks before merge
- **Jobs:**
  - Lint and format check (Biome)
  - TypeScript type checking
  - Build packages and verify artifacts

### Workflow 2: Deploy Storybook (`deploy-storybook.yml`)
- **Triggers:** Push to main (Vue/Storybook changes), manual dispatch
- **Purpose:** Keep documentation up-to-date
- **Output:** `https://meldui.github.io/meldui/`

### Workflow 3: Release (`release.yml`)
- **Triggers:** Manual workflow dispatch
- **Purpose:** Create release PR or publish packages
- **Uses:** Changesets action for automation

### Workflow 4: Publish (`publish.yml`)
- **Triggers:** Tag push (e.g., `@meldui/vue@0.1.0`)
- **Purpose:** Auto-publish to GitHub Packages
- **Authentication:** Uses `GITHUB_TOKEN`

---

## Future Release Workflow

For subsequent releases:

1. **Make changes** to packages
2. **Create changeset:** `pnpm changeset`
3. **Commit changeset:** Git add, commit, push
4. **Release:**
   - Option A: Use GitHub Actions "Release" workflow
   - Option B: Run `pnpm release` locally
5. **Verify:** Check GitHub Packages for new version

---

## Troubleshooting

### Issue: Storybook Deployment Fails
**Solution:** Check that:
- GitHub Pages source is set to "GitHub Actions"
- Workflow has permissions to deploy
- Build completes without errors

### Issue: Package Publishing Fails
**Solution:** Check that:
- `GITHUB_TOKEN` has packages:write permission
- Workflow permissions set to "Read and write"
- Package names use correct scope (`@meldui`)

### Issue: CI Workflow Fails
**Solution:** Common causes:
- Build errors (check logs)
- Type errors (run `pnpm typecheck` locally)
- Lint/format issues (run `pnpm check:fix`)

### Issue: Cannot Install Packages
**Solution:** Verify:
- `.npmrc` configured correctly
- GitHub token has `read:packages` scope
- Token not expired
- Registry URL matches: `https://npm.pkg.github.com`

---

## Completion Checklist

- [ ] Code committed and pushed to GitHub
- [ ] GitHub Pages enabled and configured
- [ ] Actions permissions configured
- [ ] All workflows run successfully
- [ ] Storybook deployed and accessible
- [ ] First changeset created
- [ ] Packages published to GitHub Packages
- [ ] Package versions verified on GitHub
- [ ] Test installation successful
- [ ] Documentation updated

---

## Success Criteria

✅ GitHub repository contains all Phase 5 changes
✅ CI workflow passes on all commits
✅ Storybook automatically deploys to GitHub Pages
✅ Packages published to GitHub Packages
✅ Users can install packages with proper .npmrc configuration
✅ Release workflow documented and tested

---

## Next Steps

After completing this task:
- Monitor CI workflow on future commits
- Create changesets for new features/fixes
- Use release workflow for version bumps
- Keep Storybook documentation updated
- Consider Phase 6: React package setup
