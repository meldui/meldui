# Release Process

This document describes how to release new versions of MeldUI packages to GitHub Packages.

## Prerequisites

- You must have push access to the GitHub repository
- All tests must pass
- Code must be properly formatted (run `pnpm check:fix`)
- Packages are published to **GitHub Packages** (not npm registry)

## Publishing to GitHub Packages

MeldUI packages are published to GitHub Packages at `https://npm.pkg.github.com`. This means:

- Packages are hosted on GitHub, not the public npm registry
- Users need to configure their `.npmrc` to install packages (see [Installation](#user-installation))
- Publishing is free and integrated with GitHub permissions

## Step 1: Make Changes

Develop features, fix bugs, etc. in the packages.

```bash
# Make your changes
cd packages/vue
# Edit files...

# Test locally
pnpm dev
pnpm build
```

## Step 2: Create Changeset

After making changes, create a changeset to document what changed:

```bash
pnpm changeset
```

Answer the prompts:

1. **Which packages changed?** Select affected packages (use spacebar to select)
2. **What type of change?**
   - **patch** (0.0.x) - Bug fixes, minor improvements, no breaking changes
   - **minor** (0.x.0) - New features, backwards compatible
   - **major** (x.0.0) - Breaking changes
3. **Summary** - Describe the change for the changelog (supports markdown)

Example:

```
🦋  Which packages would you like to include?
◉ @meldui/vue
◯ @meldui/tabler-vue

🦋  Which packages should have a minor bump?
◉ @meldui/vue

🦋  Please enter a summary for this change:
Added new DataTable component with sorting and filtering
```

Commit the changeset file:

```bash
git add .changeset/
git commit -m "Add changeset for DataTable component"
git push
```

## Step 3: Update Versions

When ready to release, update package versions based on accumulated changesets:

```bash
pnpm changeset:version
```

This will:

- Read all changeset files in `.changeset/`
- Update `package.json` versions for affected packages
- Generate/update `CHANGELOG.md` entries
- Delete consumed changeset files

Review the changes:

```bash
git status
# You should see:
# - Modified package.json files (version bumped)
# - New/updated CHANGELOG.md files
# - Deleted changeset .md files
```

Commit the version bump:

```bash
git add .
git commit -m "chore: version packages"
git push
```

## Step 4: Publish to GitHub Packages

You have two options for publishing:

### Option A: Automated Publishing (Recommended)

Create and push git tags to trigger automated publishing:

```bash
# Create tags for each package that was versioned
git tag @meldui/vue@0.2.0
git tag @meldui/tabler-vue@0.1.5

# Push tags to trigger GitHub Actions
git push --tags
```

The GitHub Actions workflow will:

1. Run code quality checks
2. Build all packages
3. Publish to GitHub Packages
4. Create GitHub releases

### Option B: Manual Publishing

Publish directly from your local machine:

```bash
# Ensure you're authenticated with GitHub
# Create a Personal Access Token with 'write:packages' scope at:
# https://github.com/settings/tokens

# Login to GitHub Packages
npm login --scope=@meldui --registry=https://npm.pkg.github.com
# Username: your-github-username
# Password: your-personal-access-token
# Email: your-email

# Run the release command
pnpm release
```

This command:

1. Runs code quality checks (`pnpm check:fix`)
2. Builds all packages (`pnpm build`)
3. Publishes to GitHub Packages (`changeset publish`)

Or use the changesets publish command directly:

```bash
pnpm changeset:publish
```

## Step 5: Verify Publication

After publishing, verify packages are available:

1. Go to your GitHub repository
2. Click on "Packages" in the right sidebar
3. You should see `@meldui/vue` and `@meldui/tabler-vue`
4. Click on a package to see versions and installation instructions

## User Installation

Users need to configure their `.npmrc` to install from GitHub Packages:

### For End Users

Create or edit `~/.npmrc` in your home directory:

```bash
@meldui:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

Then install packages:

```bash
pnpm add @meldui/vue @meldui/tabler-vue
```

### For Projects (Recommended)

Create `.npmrc` in the project root:

```
@meldui:registry=https://npm.pkg.github.com
```

Users will need to authenticate with GitHub:

```bash
npm login --scope=@meldui --registry=https://npm.pkg.github.com
```

See `.npmrc.example` for a template.

## Version Guidelines

### Patch (0.0.x)

- Bug fixes that don't affect the API
- Documentation updates
- Performance improvements
- Internal refactoring
- No new features
- No breaking changes

**Example:** Fixing a bug where Button color prop wasn't working

### Minor (0.x.0)

- New features that are backwards compatible
- New components
- New props or methods
- Deprecations (with migration path and console warnings)
- Non-breaking improvements to existing features

**Example:** Adding a new DataTable component

### Major (x.0.0)

- Breaking API changes
- Removed features or components
- Changed prop names or types
- Major architecture changes
- Dropped support for Vue versions

**Example:** Renaming `variant` prop to `appearance` across all components

## Rollback

If something goes wrong after publishing:

### Unpublish a Version (Only within 72 hours)

```bash
# Only works within 72 hours of publishing
npm unpublish @meldui/vue@0.1.1 --registry=https://npm.pkg.github.com
```

### Deprecate a Version (Preferred)

```bash
# Deprecation lasts forever and warns users
npm deprecate @meldui/vue@0.1.1 "Please upgrade to 0.1.2 - fixes critical bug" --registry=https://npm.pkg.github.com
```

### Publish a Patch Release

The best approach is usually to publish a new patch version:

```bash
# Fix the issue
# Create changeset
pnpm changeset  # Select patch
# Version and publish
pnpm changeset:version
git add . && git commit -m "chore: version packages"
git push
git tag @meldui/vue@0.1.2
git push --tags
```

## GitHub Actions Workflows

### Automated Publishing on Tag Push

Location: `.github/workflows/publish.yml`

Triggers when you push tags matching `@meldui/*@*`:

```bash
git tag @meldui/vue@0.2.0
git push --tags
```

### Manual Release Workflow

Location: `.github/workflows/release.yml`

Trigger manually from GitHub Actions UI:

1. Go to Actions tab
2. Select "Release" workflow
3. Click "Run workflow"
4. Choose version bump type

This will:

- Create a PR with version bumps (if changesets exist)
- Or publish directly (if PR is merged)

## Troubleshooting

### "You must be logged in to publish"

**For local publishing:**

```bash
npm login --scope=@meldui --registry=https://npm.pkg.github.com
```

**For GitHub Actions:**
The `GITHUB_TOKEN` is automatically provided and has package write permissions.

### "You cannot publish over the previously published version"

The version already exists in GitHub Packages. You need to:

1. Update version in package.json manually, or
2. Run `pnpm changeset:version` to bump version, or
3. Create a new changeset and run version command

### "403 Forbidden" or "Permission denied"

**For local publishing:**

- Ensure your Personal Access Token has `write:packages` scope
- Verify you have write access to the `meldui/meldui` repository

**For GitHub Actions:**

- Check that the workflow has `packages: write` permission (already configured)
- Ensure repository settings allow GitHub Actions to publish packages

### "GITHUB_TOKEN doesn't have permission to publish"

Go to repository Settings → Actions → General → Workflow permissions:

- Select "Read and write permissions"
- Check "Allow GitHub Actions to create and approve pull requests"

### Changeset not found

If you run `pnpm changeset:version` and nothing happens:

```bash
# Check if changesets exist
ls .changeset/*.md

# If empty, create a changeset first
pnpm changeset
```

### Build fails during publishing

```bash
# Test build locally first
pnpm build

# Check for TypeScript errors
pnpm --filter @meldui/vue typecheck

# Check for linting errors
pnpm check
```

## Best Practices

1. **Always create changesets** for user-facing changes
2. **Run `pnpm check:fix`** before committing
3. **Test builds locally** before publishing
4. **Use semantic versioning** correctly (patch/minor/major)
5. **Write clear changeset summaries** - they become changelog entries
6. **Batch related changes** - create one changeset for multiple related commits
7. **Use automated publishing** - push tags to trigger GitHub Actions
8. **Verify publication** - check GitHub Packages UI after publishing

## Example Workflow

Here's a complete example of the release workflow:

```bash
# 1. Develop feature
cd packages/vue
# ... make changes ...

# 2. Create changeset
cd ../..
pnpm changeset
# Select @meldui/vue
# Choose "minor" (new feature)
# Summary: "Added DataTable component with sorting"

# 3. Commit changeset
git add .changeset/
git commit -m "Add changeset for DataTable"
git push

# 4. When ready to release, bump versions
pnpm changeset:version
# Review changes
git add .
git commit -m "chore: version packages"
git push

# 5. Create and push tags
git tag @meldui/vue@0.2.0
git push --tags

# 6. GitHub Actions publishes automatically
# OR publish manually:
# pnpm release
```

## Additional Resources

- [Changesets Documentation](https://github.com/changesets/changesets)
- [GitHub Packages Documentation](https://docs.github.com/en/packages)
- [Semantic Versioning](https://semver.org/)
- [Creating Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

---

**Need help?** Open an issue in the repository or contact the maintainers.
