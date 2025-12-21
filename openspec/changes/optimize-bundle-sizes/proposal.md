# Change: Optimize Bundle Sizes for Vue Packages

## Why

Current bundle sizes are excessive and **tree-shaking is broken** for all packages. Consumers receive the full bundle regardless of actual usage:

**Before Optimization:**
| Package | Raw ESM | Gzipped | Status |
|---------|---------|---------|--------|
| @meldui/tabler-vue | 3.5MB | 453KB | Tree-shaking completely broken |
| @meldui/vue | 592KB | 105KB | Tree-shaking broken |
| @meldui/charts-vue | 52KB | 10KB | Partially optimized |

**The Problem:**
```typescript
// Consumer imports single icon
import { IconUser } from '@meldui/tabler-vue'
// Result: Gets entire 3.5MB bundle instead of ~3KB icon
```

## What Changes

### @meldui/tabler-vue (Critical)

**Individual Icon Files Architecture:**
- Generate individual files for each icon in `src/icons/`
- Each icon imports only its corresponding Tabler icon
- Barrel `index.ts` re-exports all icons for backwards compatibility
- Enable `preserveModules: true` to maintain module boundaries
- Add `sideEffects: false` to package.json

**Structure:**
```
src/
├── icons/
│   ├── IconUser.ts      → imports only IconUser from @tabler/icons-vue
│   ├── IconHome.ts      → imports only IconHome from @tabler/icons-vue
│   └── ... (6019 auto-generated files)
├── wrapper.ts
├── defaults.ts
└── index.ts             → export { IconUser } from './icons/IconUser'; ...
```

### @meldui/vue (High priority)
- Enable `preserveModules: true` with dual ESM/CJS output
- Add `sideEffects: ["**/*.css"]` to package.json
- Enable minification with esbuild
- Output structure: `dist/esm/` and `dist/cjs/`

### @meldui/charts-vue (Minor)
- Add `sideEffects: false` to package.json
- Enable minification

## Results

### Verified with task-manager App

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Main JS (raw) | 3.8MB | 302KB | **92% reduction** |
| Main JS (gzipped) | 597KB | 99KB | **83% reduction** |
| Icons bundled | 6019 (all) | ~15 (used only) | **99.7% reduction** |

### Package-Level Results

| Package | Before | After | Change |
|---------|--------|-------|--------|
| @meldui/tabler-vue | Single 3.5MB file | 6019 individual ~0.3KB files | Tree-shakeable |
| @meldui/vue | Single 592KB file | Preserved modules | Tree-shakeable |
| @meldui/charts-vue | 52KB | 52KB + minified | Same (already optimized) |

## Impact

- **Affected files**:
  - `packages/tabler-vue/scripts/generate.ts` (individual icon generation)
  - `packages/tabler-vue/src/icons/*.ts` (auto-generated)
  - `packages/tabler-vue/src/index.ts` (auto-generated barrel)
  - `packages/tabler-vue/vite.config.ts` (preserveModules, dual format)
  - `packages/tabler-vue/package.json` (sideEffects, exports)
  - `packages/vue/vite.config.ts` (preserveModules, dual format)
  - `packages/vue/package.json` (sideEffects, exports)
  - `packages/charts-vue/vite.config.ts` (minification)
  - `packages/charts-vue/package.json` (sideEffects)

- **Breaking changes**: None - consumer API unchanged
- **Consumer impact**: 83% smaller bundles for typical applications
