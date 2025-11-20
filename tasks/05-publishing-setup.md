# Phase 5: Publishing Setup

**Goal:** Configure version management with Changesets and set up npm publishing workflow.

**Estimated Time:** 2-3 hours

**Prerequisites:** Phase 1-4 must be complete

---

## Task 1: Install and Configure Changesets

Set up Changesets for version management and changelogs.

### Sub-tasks

#### 1.1 Install Changesets
- [ ] Install at workspace root:
  ```bash
  cd /path/to/meldui  # Go to root
  pnpm add -Dw @changesets/cli
  ```

**Acceptance Criteria:**
- @changesets/cli in root package.json devDependencies

---

#### 1.2 Initialize Changesets
- [ ] Run initialization command:
  ```bash
  pnpm changeset init
  ```
- [ ] This creates `.changeset/` directory with config

**Expected Output:**
```
🦋  Thanks for choosing changesets to help manage your versioning and publishing
🦋
🦋  You should be set up to start using changesets now!
```

**Acceptance Criteria:**
- .changeset/ directory created
- .changeset/config.json exists
- .changeset/README.md exists

---

#### 1.3 Configure Changesets
- [ ] Edit `.changeset/config.json`:
  ```json
  {
    "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
    "changelog": "@changesets/cli/changelog",
    "commit": false,
    "fixed": [],
    "linked": [],
    "access": "public",
    "baseBranch": "main",
    "updateInternalDependencies": "patch",
    "ignore": ["vue-storybook", "react-storybook"],
    "___experimentalUnsafeOptions_PLEASE_READ_THIS_README_FIRST___": {
      "onlyUpdatePeerDependentsWhenOutOfRange": true
    }
  }
  ```

**Configuration Explained:**
- `access: "public"` - Packages are public on npm
- `commit: false` - Don't auto-commit version bumps
- `ignore` - Don't version Storybook apps (they're not published)
- `updateInternalDependencies: "patch"` - When a package updates, bump dependents by patch
- `onlyUpdatePeerDependentsWhenOutOfRange` - Only update peer dependents if version range doesn't match

**Acceptance Criteria:**
- config.json has correct settings
- Storybook apps are ignored

---

## Task 2: Configure Package Publishing

Ensure packages are properly configured for npm publishing.

### Sub-tasks

#### 2.1 Verify package.json exports
- [ ] Check `packages/tabler-vue/package.json`:
  ```json
  {
    "name": "@meldui/tabler-vue",
    "version": "0.1.0",
    "description": "Tabler Icons for Vue with MeldUI defaults",
    "main": "./dist/index.cjs",
    "module": "./dist/index.mjs",
    "types": "./dist/index.d.ts",
    "exports": {
      ".": {
        "import": "./dist/index.mjs",
        "require": "./dist/index.cjs",
        "types": "./dist/index.d.ts"
      }
    },
    "files": [
      "dist",
      "README.md"
    ],
    "publishConfig": {
      "access": "public"
    }
  }
  ```

**Key Fields:**
- `name` - Scoped package name (@meldui/*)
- `files` - Only ship dist/ and README
- `publishConfig.access` - Make package public
- `exports` - Proper ESM/CJS support

**Acceptance Criteria:**
- All required fields present
- files array only includes dist/ and README.md
- publishConfig.access is "public"

---

#### 2.2 Verify @meldui/vue package.json
- [ ] Check `packages/vue/package.json` has same structure:
  ```json
  {
    "name": "@meldui/vue",
    "version": "0.1.0",
    "exports": {
      ".": {
        "import": "./dist/index.mjs",
        "require": "./dist/index.cjs",
        "types": "./dist/index.d.ts"
      },
      "./styles": {
        "import": "./dist/styles/index.css",
        "require": "./dist/styles/index.css"
      }
    },
    "files": [
      "dist",
      "README.md"
    ],
    "publishConfig": {
      "access": "public"
    }
  }
  ```

**Note:** @meldui/vue also exports styles separately.

**Acceptance Criteria:**
- Exports includes both main module and styles
- files array correct
- publishConfig set

---

## Task 3: Add Publishing Scripts

Add scripts for version management and publishing.

### Sub-tasks

#### 3.1 Update root package.json scripts
- [ ] Add/update scripts in root `package.json`:
  ```json
  {
    "scripts": {
      "build": "turbo build",
      "dev": "turbo dev",
      "lint": "biome lint .",
      "lint:fix": "biome lint --write .",
      "format": "biome format --write .",
      "check": "biome check .",
      "check:fix": "biome check --write .",
      "storybook:vue": "pnpm --filter vue-storybook storybook",
      "build:storybook:vue": "pnpm --filter vue-storybook build-storybook",
      "changeset": "changeset",
      "changeset:version": "changeset version",
      "changeset:publish": "pnpm build && changeset publish",
      "release": "pnpm check:fix && pnpm build && changeset publish"
    }
  }
  ```

**Scripts Explained:**
- `changeset` - Create a new changeset (records what changed)
- `changeset:version` - Update package versions based on changesets
- `changeset:publish` - Publish packages to npm
- `release` - Full release flow: check code, build, publish

**Acceptance Criteria:**
- Scripts added to root package.json
- release script includes code check and build

---

## Task 4: Create First Changeset

Practice creating a changeset to understand the workflow.

### Sub-tasks

#### 4.1 Make a change
- [ ] Make a small change to a package (e.g., update a README)
  ```bash
  echo "\n## Version 0.1.0\n\nInitial release" >> packages/vue/README.md
  ```

**Acceptance Criteria:**
- Some file is modified in a package

---

#### 4.2 Create changeset
- [ ] Run changeset command:
  ```bash
  pnpm changeset
  ```
- [ ] Answer the prompts:
  - **Which packages to include?** Select @meldui/vue (use spacebar)
  - **What type of change?** Choose "patch" (0.0.x)
  - **Summary:** "Initial release"

**Interactive Example:**
```
🦋  Which packages would you like to include?
◉ @meldui/vue
◯ @meldui/tabler-vue

🦋  Which packages should have a patch bump?
◉ @meldui/vue

🦋  Please enter a summary for this change:
Initial release
```

**What this does:**
- Creates a markdown file in `.changeset/` directory
- Records which packages changed and how
- Stores the changelog message

**Acceptance Criteria:**
- New `.md` file created in .changeset/
- File contains package name and summary
- Correct bump type (patch/minor/major)

---

#### 4.3 Review changeset file
- [ ] List changesets:
  ```bash
  ls .changeset/
  ```
- [ ] You should see a file like `funny-dogs-dance.md`
- [ ] Open and review:
  ```bash
  cat .changeset/funny-dogs-dance.md
  ```

**Expected Content:**
```markdown
---
"@meldui/vue": patch
---

Initial release
```

**Acceptance Criteria:**
- Changeset file exists
- Contains correct package and version bump
- Has descriptive summary

---

## Task 5: Update Versions

Apply changesets to update package versions.

### Sub-tasks

#### 5.1 Run version command
- [ ] Update versions based on changesets:
  ```bash
  pnpm changeset:version
  ```
- [ ] This will:
  - Read all changeset files
  - Update package.json versions
  - Generate/update CHANGELOG.md files
  - Delete consumed changeset files

**Expected Output:**
```
🦋  All files have been updated. Review them and commit at your leisure
🦋  If you want to release these changes, run `pnpm changeset publish`
```

**Acceptance Criteria:**
- Package versions updated in package.json files
- CHANGELOG.md created/updated in packages
- Changeset files deleted

---

#### 5.2 Review changes
- [ ] Check what changed:
  ```bash
  git status
  ```
- [ ] You should see:
  - Modified package.json files (version bumped)
  - New/modified CHANGELOG.md files
  - Deleted changeset .md files

**Acceptance Criteria:**
- package.json versions incremented
- CHANGELOG.md contains new entry
- Changes are ready to commit

---

#### 5.3 Commit version changes
- [ ] Commit the version bump:
  ```bash
  git add .
  git commit -m "Version packages"
  ```

**Acceptance Criteria:**
- Version changes committed to git

---

## Task 6: Configure npm Authentication

Set up npm credentials for publishing.

### Sub-tasks

#### 6.1 Create npm account (if needed)
- [ ] If you don't have an npm account:
  - Go to https://www.npmjs.com/signup
  - Create an account
  - Verify your email

**Acceptance Criteria:**
- npm account exists and is verified

---

#### 6.2 Create npm organization (optional)
- [ ] If using scoped packages (@meldui/*), create organization:
  - Go to https://www.npmjs.com/org/create
  - Create organization named "meldui"
  - Or use your company's existing org

**Note:** For internal-only packages, you might want to use a private registry instead.

**Acceptance Criteria:**
- Organization exists on npm (if using scoped packages)

---

#### 6.3 Login to npm
- [ ] Authenticate with npm:
  ```bash
  npm login
  ```
- [ ] Enter your credentials when prompted

**Acceptance Criteria:**
- Logged into npm
- Token stored in ~/.npmrc

---

## Task 7: Publish Packages (Dry Run)

Test publishing without actually publishing.

### Sub-tasks

#### 7.1 Build packages
- [ ] Build all packages:
  ```bash
  pnpm build
  ```
- [ ] Verify builds succeed:
  ```bash
  ls packages/vue/dist/
  ls packages/tabler-vue/dist/
  ```

**Acceptance Criteria:**
- All packages build successfully
- dist/ directories contain output files

---

#### 7.2 Dry run publish
- [ ] Test publish command:
  ```bash
  pnpm --filter @meldui/vue publish --dry-run
  pnpm --filter @meldui/tabler-vue publish --dry-run
  ```
- [ ] Review what would be published:
  - Check file list
  - Verify no unexpected files included
  - Confirm version numbers

**Expected Output:**
```
npm notice
npm notice package: @meldui/vue@0.1.0
npm notice === Tarball Contents ===
npm notice 1.2kB  dist/index.d.ts
npm notice 23.4kB dist/index.mjs
npm notice 23.8kB dist/index.cjs
npm notice 45.2kB dist/styles/index.css
npm notice 2.1kB  README.md
npm notice === Tarball Details ===
npm notice name:          @meldui/vue
npm notice version:       0.1.0
npm notice package size:  25.3 kB
npm notice unpacked size: 95.7 kB
npm notice total files:   5
```

**Acceptance Criteria:**
- Dry run succeeds
- Only dist/ and README.md included
- No source files or config files in tarball
- File sizes reasonable

---

## Task 8: Document Release Process

Create documentation for the release workflow.

### Sub-tasks

#### 8.1 Create RELEASING.md
- [ ] Create `RELEASING.md` in root:
  ```markdown
  # Release Process

  This document describes how to release new versions of MeldUI packages.

  ## Prerequisites

  - You must be logged into npm with publish access to @meldui org
  - All tests must pass
  - Code must be properly formatted (run `pnpm check:fix`)

  ## Step 1: Make Changes

  Develop features, fix bugs, etc. in the packages.

  ## Step 2: Create Changeset

  After making changes, create a changeset:

  \`\`\`bash
  pnpm changeset
  \`\`\`

  Answer the prompts:
  1. **Which packages changed?** Select affected packages
  2. **What type of change?**
     - **patch** (0.0.x) - Bug fixes, minor improvements
     - **minor** (0.x.0) - New features, backwards compatible
     - **major** (x.0.0) - Breaking changes
  3. **Summary** - Describe the change for the changelog

  Commit the changeset file:

  \`\`\`bash
  git add .changeset/
  git commit -m "Add changeset for [feature/fix]"
  \`\`\`

  ## Step 3: Update Versions

  When ready to release, update package versions:

  \`\`\`bash
  pnpm changeset:version
  \`\`\`

  This will:
  - Update package.json versions
  - Generate CHANGELOG.md entries
  - Delete consumed changesets

  Review and commit the changes:

  \`\`\`bash
  git add .
  git commit -m "Version packages"
  git push
  \`\`\`

  ## Step 4: Publish

  Publish packages to npm:

  \`\`\`bash
  pnpm release
  \`\`\`

  This command:
  1. Runs code quality checks
  2. Builds all packages
  3. Publishes to npm

  Or use the changesets publish command directly:

  \`\`\`bash
  pnpm changeset:publish
  \`\`\`

  ## Step 5: Tag Release

  Create git tags for the releases:

  \`\`\`bash
  git tag @meldui/vue@0.1.0
  git tag @meldui/tabler-vue@0.1.0
  git push --tags
  \`\`\`

  ## Version Guidelines

  ### Patch (0.0.x)
  - Bug fixes
  - Documentation updates
  - Performance improvements
  - No new features
  - No breaking changes

  ### Minor (0.x.0)
  - New features
  - New components
  - Backwards compatible
  - Deprecations (with migration path)

  ### Major (x.0.0)
  - Breaking API changes
  - Removed features
  - Major architecture changes

  ## Rollback

  If something goes wrong:

  \`\`\`bash
  # Unpublish a version (only within 72 hours)
  npm unpublish @meldui/vue@0.1.1

  # Deprecate a version instead (preferred)
  npm deprecate @meldui/vue@0.1.1 "Please upgrade to 0.1.2"
  \`\`\`

  ## Internal Releases

  For internal-only releases, you may want to use a private npm registry (Verdaccio, npm Enterprise, etc.) instead of public npm.

  ## Troubleshooting

  ### "You must be logged in to publish"
  Run `npm login` and authenticate.

  ### "You cannot publish over the previously published version"
  Version already exists. Update version in package.json or run `pnpm changeset:version`.

  ### "403 Forbidden"
  You don't have publish access to the @meldui org. Ask an admin to add you.
  \`\`\`

**Acceptance Criteria:**
- RELEASING.md exists with complete release workflow
- Includes step-by-step instructions
- Covers version guidelines
- Includes troubleshooting section

---

## Phase 5 Completion Checklist

Verify all tasks are complete:

- [ ] Changesets installed and configured
- [ ] .changeset/config.json configured correctly
- [ ] Package.json files have correct export fields
- [ ] files array only includes dist/ and README.md
- [ ] publishConfig.access set to "public"
- [ ] Root package.json has release scripts
- [ ] Created and applied a test changeset
- [ ] Versions updated successfully
- [ ] CHANGELOG.md files generated
- [ ] npm authentication configured
- [ ] Dry-run publish succeeded
- [ ] RELEASING.md documentation created

**Test Commands:**
```bash
# Create a changeset
pnpm changeset

# Update versions
pnpm changeset:version

# Dry run publish
pnpm --filter @meldui/vue publish --dry-run

# Full release (when ready)
pnpm release
```

**Verification:**
```bash
# Check changeset config
cat .changeset/config.json

# Check package exports
cat packages/vue/package.json | grep -A 10 "exports"

# Verify files to publish
pnpm --filter @meldui/vue publish --dry-run
```

**Important Notes:**

1. **Internal vs Public:**
   - If packages are truly internal-only, consider using a private registry
   - Or keep packages private on npm (requires paid npm org)
   - Update publishConfig accordingly

2. **First Publish:**
   - For the first real publish, you may want to start at version 0.1.0
   - Use `pnpm changeset:version` to update versions
   - Then `pnpm changeset:publish` to publish

3. **CI/CD Integration:**
   - Consider automating releases via GitHub Actions
   - Can trigger on git tags or manual workflow dispatch
   - Store npm token as GitHub secret

**Next Steps:**

- Start using the packages in internal projects
- Gather feedback from team
- Consider Phase 6 for React support (see [06-react-package-future.md](./06-react-package-future.md))
- Set up CI/CD for automated publishing
- Consider adding automated testing (Vitest, Playwright)

**Congratulations!** The MeldUI design system is now ready for use and can be published to npm.
