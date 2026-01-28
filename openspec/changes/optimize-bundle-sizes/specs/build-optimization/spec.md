## ADDED Requirements

### Requirement: Tree-Shakeable Icon Package

The `@meldui/tabler-vue` package SHALL use individual icon files to enable tree-shaking.

#### Scenario: Individual icon files

- **GIVEN** the package source structure
- **THEN** each icon SHALL be in its own file in `src/icons/{IconName}.ts`
- **AND** each file SHALL import only its corresponding icon from `@tabler/icons-vue`

#### Scenario: Consumer imports subset of icons

- **WHEN** a consumer imports specific icons (e.g., `import { IconUser } from '@meldui/tabler-vue'`)
- **THEN** only the imported icons SHALL be included in the consumer's bundle
- **AND** unused icons SHALL be excluded by the bundler

#### Scenario: Backwards compatible API

- **WHEN** a consumer imports icons using the existing API
- **THEN** the imports SHALL work without any code changes

### Requirement: Tree-Shakeable Component Package

The `@meldui/vue` package SHALL preserve module boundaries to enable tree-shaking.

#### Scenario: Preserved modules in build

- **GIVEN** the package build configuration
- **THEN** the output SHALL use `preserveModules: true`
- **AND** each component SHALL be in its own output file

#### Scenario: Consumer imports subset of components

- **WHEN** a consumer imports specific components (e.g., `import { Button, Card } from '@meldui/vue'`)
- **THEN** only the imported components and their dependencies SHALL be bundled

### Requirement: Dual Format Output

All packages SHALL provide both ESM and CJS outputs.

#### Scenario: ESM output

- **GIVEN** a package build
- **THEN** ESM files SHALL be output to `dist/esm/`
- **AND** files SHALL use `.mjs` extension
- **AND** files SHALL use `import/export` syntax

#### Scenario: CJS output

- **GIVEN** a package build
- **THEN** CJS files SHALL be output to `dist/cjs/`
- **AND** files SHALL use `.cjs` extension
- **AND** files SHALL use `require/module.exports` syntax

### Requirement: Side Effects Declaration

All packages SHALL declare their side effects status.

#### Scenario: Pure JavaScript packages

- **GIVEN** a package with no CSS at the entry level
- **THEN** the package.json SHALL include `"sideEffects": false`

#### Scenario: Packages with CSS

- **GIVEN** a package that imports CSS
- **THEN** the package.json SHALL include `"sideEffects": ["**/*.css"]`

### Requirement: Minified Production Builds

All packages SHALL produce minified output.

#### Scenario: Build output

- **WHEN** running `pnpm build` on any package
- **THEN** JavaScript files SHALL be minified using esbuild

### Requirement: Verified Bundle Size Reduction

Bundle size improvements SHALL be verified in consumer applications.

#### Scenario: task-manager app verification

- **GIVEN** the task-manager app with optimized packages
- **THEN** the main JavaScript bundle SHALL be reduced by at least 70% compared to baseline
- **AND** only imported icons and components SHALL be included

### Requirement: Icon Generation Script

The tabler-vue package SHALL include a generation script for icon files.

#### Scenario: Running generate-icons

- **WHEN** running `pnpm generate-icons` in the tabler-vue package
- **THEN** individual icon files SHALL be created in `src/icons/`
- **AND** the barrel `index.ts` SHALL be updated with re-exports
- **AND** the script SHALL support updates when @tabler/icons-vue is updated
