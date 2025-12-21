## Context

MeldUI packages had broken tree-shaking, causing consumers to bundle the entire library regardless of actual usage. This significantly impacted application bundle sizes and load times.

**Before Optimization:**
| Package | Raw ESM | Gzipped | Tree-Shakeable |
|---------|---------|---------|----------------|
| @meldui/vue | 592KB | 105KB | NO |
| @meldui/tabler-vue | 3.5MB | 453KB | NO |
| @meldui/charts-vue | 52KB | 10KB | Partial |

**Root Causes:**
1. Icons were all imported and wrapped in a single index.ts file
2. No `sideEffects` declaration in package.json files
3. Single bundled output prevented module-level tree-shaking

## Goals / Non-Goals

**Goals:**
- Enable effective tree-shaking for all packages
- Consumers bundle ONLY what they import
- Target: 80%+ bundle size reduction for typical usage
- Maintain full backwards compatibility

**Non-Goals:**
- Changing public API
- Removing any existing exports

## Decisions

### Decision 1: Individual Icon Files for tabler-vue

**What:** Generate individual TypeScript files for each icon instead of one barrel file.

**Why:** This is the industry-standard approach used by @heroicons/vue, lucide-vue-next, and other popular icon libraries. It enables bundlers to completely eliminate unused icons.

**Implementation:**
```
src/icons/
├── IconUser.ts    → import { IconUser } from '@tabler/icons-vue'; export const IconUser = createIcon(...)
├── IconHome.ts    → import { IconHome } from '@tabler/icons-vue'; export const IconHome = createIcon(...)
└── ... (6019 files)

src/index.ts       → export { IconUser } from './icons/IconUser'; ...
```

**Trade-offs:**
- Pro: Perfect tree-shaking (only used icons bundled)
- Pro: Same consumer API (backwards compatible)
- Con: Many files in npm package (~12,000 with sourcemaps)
- Con: Slightly larger npm package download

### Decision 2: Dual ESM/CJS Output with preserveModules

**What:** Generate both ESM and CJS formats in separate directories with preserved module structure.

**Implementation:**
```
dist/
├── esm/
│   ├── index.mjs
│   ├── icons/
│   │   ├── IconUser.mjs
│   │   └── ...
│   └── wrapper.mjs
└── cjs/
    ├── index.cjs
    ├── icons/
    │   ├── IconUser.cjs
    │   └── ...
    └── wrapper.cjs
```

**Why:** Enables tree-shaking for ESM consumers while maintaining CJS compatibility.

### Decision 3: sideEffects Declarations

**Configuration:**
```json
// @meldui/tabler-vue, @meldui/charts-vue
{ "sideEffects": false }

// @meldui/vue (has CSS)
{ "sideEffects": ["**/*.css"] }
```

**Why:** Signals to bundlers which files can be safely tree-shaken.

### Decision 4: esbuild Minification

**What:** Use esbuild for minification instead of terser.

**Why:**
- 10-100x faster build times
- Good compression ratio
- Built into Vite

## Architecture

### How Tree-Shaking Now Works

```typescript
// Consumer imports
import { IconUser, IconSettings } from '@meldui/tabler-vue'

// Bundler resolution:
// 1. index.mjs re-exports from individual files
// 2. IconUser.mjs imports only IconUser from @tabler/icons-vue
// 3. IconSettings.mjs imports only IconSettings from @tabler/icons-vue
// 4. Other 6017 icons are completely excluded

// Result: ~6KB instead of 3.5MB
```

### File Generation Flow

```
pnpm generate-icons
    ↓
scripts/generate.ts
    ↓
1. Import @tabler/icons-vue
2. Get all icon names (6019)
3. For each icon:
   - Create src/icons/{IconName}.ts
   - Import only that icon from @tabler/icons-vue
   - Export wrapped version
4. Generate src/index.ts barrel with re-exports
    ↓
pnpm build
    ↓
Vite + preserveModules
    ↓
dist/esm/icons/{IconName}.mjs (6019 files)
dist/cjs/icons/{IconName}.cjs (6019 files)
```

## Results

### Verified with task-manager App

The task-manager app uses ~15 icons and ~10 components from MeldUI.

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Main JS (raw) | 3.8MB | 302KB | **92%** |
| Main JS (gzipped) | 597KB | 99KB | **83%** |

### Expected Results by Scenario

| Scenario | Before (Gzipped) | After (Gzipped) | Improvement |
|----------|------------------|-----------------|-------------|
| 1 icon, 5 components | ~560KB | ~30KB | 95% |
| 10 icons, 20 components | ~560KB | ~60KB | 89% |
| 50 icons, all components | ~560KB | ~150KB | 73% |
| All icons, all components | ~560KB | ~500KB | 11% |

## Migration

No migration needed for consumers. The API is unchanged:

```typescript
// Works exactly as before
import { IconUser, IconSettings } from '@meldui/tabler-vue'
import { Button, Card } from '@meldui/vue'
```

## Risks / Trade-offs

### Risk 1: Large File Count in npm Package
- **Impact:** ~12,000 files in @meldui/tabler-vue
- **Mitigation:** Standard practice for tree-shakeable icon libraries
- **Severity:** Low

### Risk 2: Longer npm Install Time
- **Impact:** Slightly longer install due to more files
- **Mitigation:** Files are tiny (~0.3KB each)
- **Severity:** Low

### Risk 3: Longer Build Time for Package
- **Impact:** Build creates 12,000+ files
- **Mitigation:** Still only ~4 seconds with esbuild
- **Severity:** Low
