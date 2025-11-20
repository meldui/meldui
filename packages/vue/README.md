# @meldui/vue

MeldUI Vue 3 component library built on shadcn-vue.

## Installation

```bash
pnpm add @meldui/vue @meldui/tabler-vue vue
```

## Setup

### 1. Import styles in your main.ts

```typescript
import '@meldui/vue/styles'
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

### 2. Use components

```vue
<script setup lang="ts">
import { Button, Card, CardHeader, CardTitle, CardContent, Input } from '@meldui/vue'
import { IconX } from '@meldui/tabler-vue'
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Welcome to MeldUI</CardTitle>
    </CardHeader>
    <CardContent>
      <Input placeholder="Enter your name..." />
      <Button>
        <IconX :size="20" />
        Submit
      </Button>
    </CardContent>
  </Card>
</template>
```

## Available Components

### UI Components (shadcn-vue)

All shadcn-vue components are available, including:

- **Accordion** - Collapsible content panels
- **Alert** - Contextual feedback messages
- **Alert Dialog** - Modal dialogs for important actions
- **Avatar** - User profile images with fallbacks
- **Badge** - Small status indicators
- **Button** - Interactive buttons with variants
- **Card** - Content containers with header, content, and footer
- **Checkbox** - Selection controls
- **Dialog** - Modal dialogs
- **Dropdown Menu** - Contextual menus
- **Form** - Form components with validation
- **Input** - Text input fields
- **Label** - Form labels
- **Select** - Dropdown selection
- **Table** - Data tables
- **Tabs** - Tabbed interfaces
- **Toast** - Notification messages
- And many more...

See the [shadcn-vue documentation](https://www.shadcn-vue.com/) for details on all components.

### Utilities

- `cn()` - Class name merge utility

## Theming

Components use Tailwind CSS v4 with CSS variables for theming.

Customize the theme by overriding CSS variables:

```css
:root {
  --color-primary: #your-color;
  --color-background: #your-color;
  /* See src/styles/index.css for all variables */
}
```

The theme uses OKLCH color space for better color perception and manipulation.

## Dark Mode

Add the `dark` class to enable dark mode:

```html
<html class="dark">
```

Or toggle it dynamically:

```typescript
document.documentElement.classList.toggle('dark')
```

## Adding More Components

Use shadcn-vue CLI to add more components:

```bash
cd packages/vue
pnpm dlx shadcn-vue@latest add [component-name]
```

Then export the component in `src/index.ts`.

## Development

```bash
# Build the package
pnpm build

# Watch mode for development
pnpm dev
```

## TypeScript Support

Full TypeScript support with auto-generated type definitions.

```typescript
import type { ButtonVariants } from '@meldui/vue'
```

## License

MIT (internal use only)
