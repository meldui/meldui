# @meldui/tabler-vue

Tabler Icons for Vue 3 with MeldUI design system defaults.

## Installation

MeldUI packages are published to **GitHub Packages**. You need to configure your `.npmrc` first.

### 1. Configure npm to use GitHub Packages

Create or edit `.npmrc` in your project root:

```
@meldui:registry=https://npm.pkg.github.com
```

Then authenticate with GitHub:

```bash
npm login --scope=@meldui --registry=https://npm.pkg.github.com
```

You'll need a GitHub Personal Access Token with `read:packages` scope.
Create one at: https://github.com/settings/tokens

### 2. Install package

```bash
pnpm add @meldui/tabler-vue vue
```

## Usage

```vue
<script setup>
import { IconX, IconUser, IconSettings } from '@meldui/tabler-vue'
</script>

<template>
  <div>
    <!-- Default size (24px) and strokeWidth (1.5) -->
    <IconX />

    <!-- Override size -->
    <IconUser :size="32" />

    <!-- Override stroke width -->
    <IconSettings :stroke-width="2" />

    <!-- Color inherits from parent text color -->
    <span class="text-red-500">
      <IconX />
    </span>

    <!-- Explicit color -->
    <IconX color="#ff0000" />
  </div>
</template>
```

## Default Configuration

All icons use these defaults (can be overridden via props):

- `size`: 24px
- `strokeWidth`: 1.5

## Theme Integration

Icons respect the CSS variable `--icon-color` for theming:

```css
:root {
  --icon-color: #374151; /* gray-700 */
}

.dark {
  --icon-color: #e5e7eb; /* gray-200 */
}
```

## Available Icons

This package re-exports all 6000+ icons from [@tabler/icons-vue](https://tabler.io/icons).

Browse all available icons at: https://tabler.io/icons

## For Maintainers

### Syncing with Tabler Updates

When @tabler/icons-vue releases new icons:

```bash
cd packages/tabler-vue
pnpm update @tabler/icons-vue
pnpm generate-icons  # Regenerate src/index.ts
pnpm build
# Review changes, then publish new version
```

## License

MIT (internal use only)
