# Phase 1: Project Initialization

**Goal:** Set up the monorepo foundation with proper tooling and configuration.

**Estimated Time:** 2-3 hours

**Prerequisites:** None (this is the first phase)

---

## Task 1: Initialize pnpm Workspace

Create the monorepo structure using pnpm workspaces.

### Sub-tasks

#### 1.1 Create pnpm-workspace.yaml
- [x] Create `pnpm-workspace.yaml` in the root directory
- [x] Add workspace patterns:
  ```yaml
  packages:
    - 'packages/*'
    - 'apps/*'
  ```
- [x] This tells pnpm which directories contain workspace packages

**Acceptance Criteria:**
- File `pnpm-workspace.yaml` exists in root
- Contains correct workspace patterns

---

#### 1.2 Create root package.json
- [x] Create `package.json` in the root directory
- [x] Set name to "meldui" (private monorepo root)
- [x] Mark as private: `"private": true`
- [x] Add initial scripts:
  ```json
  {
    "name": "meldui",
    "version": "0.0.0",
    "private": true,
    "scripts": {
      "build": "turbo build",
      "dev": "turbo dev",
      "lint": "biome lint .",
      "lint:fix": "biome lint --write .",
      "format": "biome format --write .",
      "check": "biome check .",
      "check:fix": "biome check --write ."
    }
  }
  ```

**Command:**
```bash
pnpm init
# Then edit the generated package.json
```

**Acceptance Criteria:**
- Root package.json exists with "private": true
- Scripts are defined
- No dependencies yet (will be added later)

---

#### 1.3 Create .npmrc configuration
- [x] Create `.npmrc` file in root directory
- [x] Add pnpm-specific configuration:
  ```
  # Use workspaces protocol for local packages
  link-workspace-packages=true

  # Hoist common dependencies to root
  hoist-pattern[]=*eslint*
  hoist-pattern[]=*prettier*
  hoist-pattern[]=*typescript*

  # Strict peer dependencies
  auto-install-peers=true
  strict-peer-dependencies=false
  ```

**Acceptance Criteria:**
- `.npmrc` file exists
- Configuration is properly formatted

---

## Task 2: Set up TypeScript Configuration

Create base TypeScript configuration that all packages will extend.

### Sub-tasks

#### 2.1 Install TypeScript
- [x] Install TypeScript as a dev dependency at the root level:
  ```bash
  pnpm add -Dw typescript
  ```
- [x] The `-w` flag installs at workspace root
- [x] The `-D` flag installs as devDependency

**Acceptance Criteria:**
- TypeScript is listed in root package.json devDependencies
- node_modules/.pnpm/typescript exists

---

#### 2.2 Create base tsconfig.json
- [x] Create `tsconfig.json` in root directory
- [x] Configure for modern TypeScript and monorepo:
  ```json
  {
    "compilerOptions": {
      "target": "ES2020",
      "module": "ESNext",
      "lib": ["ES2020", "DOM", "DOM.Iterable"],
      "moduleResolution": "Bundler",
      "resolveJsonModule": true,
      "allowJs": true,
      "strict": true,
      "esModuleInterop": true,
      "skipLibCheck": true,
      "forceConsistentCasingInFileNames": true,
      "declaration": true,
      "declarationMap": true,
      "sourceMap": true,
      "composite": false,
      "noUnusedLocals": true,
      "noUnusedParameters": true,
      "noImplicitReturns": true
    },
    "exclude": ["node_modules", "dist", "build"]
  }
  ```

**Acceptance Criteria:**
- tsconfig.json exists in root
- Configuration uses modern TypeScript features
- Strict mode is enabled

---

## Task 3: Install and Configure Biome.js

Set up Biome.js for linting and formatting (replaces ESLint + Prettier).

### Sub-tasks

#### 3.1 Install Biome
- [x] Install Biome at workspace root:
  ```bash
  pnpm add -Dw @biomejs/biome
  ```

**Acceptance Criteria:**
- Biome is in root package.json devDependencies

---

#### 3.2 Create biome.json configuration
- [x] Create `biome.json` in root directory
- [x] Copy configuration from PRD.md (see PRD section "Biome.js Configuration")
- [x] Key settings:
  - VCS integration enabled (git)
  - Ignore: node_modules, dist, build, .turbo, storybook-static
  - 2-space indentation
  - 100 character line width
  - Single quotes for JavaScript
  - Semicolons as needed
  - Organize imports enabled

**Acceptance Criteria:**
- biome.json exists with complete configuration
- Running `pnpm check` should work (even with no files yet)

---

#### 3.3 Test Biome commands
- [x] Run `pnpm check` to verify Biome is working
- [x] Run `pnpm format` to test formatting
- [x] Run `pnpm lint` to test linting

**Expected Result:**
- Commands run without errors
- May show "No files to process" if no source files exist yet

---

## Task 4: Configure Turborepo (Optional)

Set up Turborepo for build orchestration and caching.

### Sub-tasks

#### 4.1 Install Turborepo
- [x] Install Turborepo at workspace root:
  ```bash
  pnpm add -Dw turbo
  ```

**Note:** This is optional but recommended for better build performance.

**Acceptance Criteria:**
- turbo is in root package.json devDependencies

---

#### 4.2 Create turbo.json configuration
- [x] Create `turbo.json` in root directory
- [x] Configure build pipeline:
  ```json
  {
    "$schema": "https://turbo.build/schema.json",
    "pipeline": {
      "build": {
        "dependsOn": ["^build"],
        "outputs": ["dist/**", ".next/**", "storybook-static/**"]
      },
      "dev": {
        "cache": false,
        "persistent": true
      },
      "lint": {
        "cache": true
      },
      "check": {
        "cache": true
      }
    }
  }
  ```
- [x] This tells Turbo:
  - Build packages in dependency order
  - Cache build outputs
  - Don't cache dev mode
  - Cache linting results

**Acceptance Criteria:**
- turbo.json exists with pipeline configuration
- Running `turbo build` should work (even with no packages yet)

---

## Task 5: Set up Git Hooks (Optional but Recommended)

Automatically run Biome checks before commits.

### Sub-tasks

#### 5.1 Install Husky
- [x] Install Husky for git hooks:
  ```bash
  pnpm add -Dw husky
  pnpm exec husky init
  ```

**Acceptance Criteria:**
- husky is in root package.json devDependencies
- .husky directory is created

---

#### 5.2 Create pre-commit hook
- [x] Create `.husky/pre-commit` file:
  ```bash
  #!/bin/sh
  . "$(dirname "$0")/_/husky.sh"

  pnpm check:fix
  ```
- [x] Make it executable:
  ```bash
  chmod +x .husky/pre-commit
  ```
- [x] This automatically formats and lints code before each commit

**Acceptance Criteria:**
- .husky/pre-commit exists and is executable
- Test by making a dummy commit (should run checks)

---

## Task 6: Create Directory Structure

Set up the basic folder structure for packages and apps.

### Sub-tasks

#### 6.1 Create packages directory
- [x] Create `packages/` directory in root:
  ```bash
  mkdir -p packages
  ```
- [x] This will hold all publishable library packages

---

#### 6.2 Create apps directory
- [x] Create `apps/` directory in root:
  ```bash
  mkdir -p apps
  ```
- [x] This will hold Storybook and other development apps

---

#### 6.3 Create .gitignore
- [x] Create `.gitignore` in root:
  ```
  # Dependencies
  node_modules
  .pnpm-store

  # Build outputs
  dist
  build
  .turbo
  storybook-static

  # Environment
  .env
  .env.local

  # IDE
  .vscode
  .idea
  *.swp
  *.swo

  # OS
  .DS_Store
  Thumbs.db

  # Logs
  *.log
  npm-debug.log*
  pnpm-debug.log*
  ```

**Acceptance Criteria:**
- packages/ and apps/ directories exist
- .gitignore exists with proper patterns

---

## Task 7: Initialize Git Repository

Set up version control.

### Sub-tasks

#### 7.1 Initialize git
- [x] Initialize git repository:
  ```bash
  git init
  ```
- [x] Add all files:
  ```bash
  git add .
  ```
- [x] Create initial commit:
  ```bash
  git commit -m "Initial commit: Project initialization"
  ```

**Acceptance Criteria:**
- `.git` directory exists
- Initial commit is created
- All configuration files are tracked

---

## Phase 1 Completion Checklist

Verify all tasks are complete:

- [x] pnpm workspace is configured (pnpm-workspace.yaml exists)
- [x] Root package.json has scripts and is marked private
- [x] .npmrc is configured for pnpm
- [x] TypeScript is installed with base tsconfig.json
- [x] Biome is installed and configured (biome.json)
- [x] Turborepo is installed and configured (turbo.json) - optional
- [x] Git hooks are set up (Husky) - optional
- [x] Directory structure is created (packages/, apps/)
- [x] .gitignore is created
- [x] Git repository is initialized with initial commit

**Test Commands:**
```bash
# Should all run without errors
pnpm check
pnpm lint
pnpm format
turbo build  # Should say "no tasks to run" but not error
```

**Next Steps:**
Proceed to [02-tabler-icon-package.md](./02-tabler-icon-package.md) to create the icon wrapper package.
