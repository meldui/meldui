---
name: Generate LLMs Documentation
description: Generate llms.txt and llms-full.txt files for AI agents consuming MeldUI.
category: Documentation
tags: [llms, documentation, ai]
---

# Generate LLMs Documentation

Generate `llms.txt` and `llms-full.txt` files that help AI coding assistants understand how to use MeldUI in consumer projects.

## Output Location

Write files to: `apps/vue-storybook/public/`

- `llms.txt` - Index file with structure and links
- `llms-full.txt` - Complete documentation in one file

## Steps

### 1. Gather Information

Read these sources to understand what to document:

**MDX Documentation Files:**

- `apps/vue-storybook/src/stories/*.mdx` - Introduction, Installation, Theming, Icons, Colors
- `apps/vue-storybook/src/stories/Components/**/*.mdx` - Component overviews

**Story Files:**

- `apps/vue-storybook/src/stories/Components/**/*.stories.ts` - All component stories

**Package Information:**

- `packages/vue/package.json` - Main package info
- `packages/tabler-vue/package.json` - Icons package info
- `packages/charts-vue/package.json` - Charts package info
- `packages/vue/src/index.ts` - Exported components list

### 2. Generate llms.txt (Index File)

Create a concise index following this structure:

```markdown
# MeldUI

> [One-line description of what MeldUI is]

[2-3 sentences about the library, emphasizing key facts AI agents need to know:

- It's built on shadcn-vue
- Uses Tailwind CSS v4 (NOT v3)
- Has three packages: @meldui/vue, @meldui/tabler-vue, @meldui/charts-vue]

## Critical: Common Mistakes

[List the most common mistakes AI agents make - this section is CRUCIAL]

## Getting Started

- [Installation](#installation): How to install and configure
- [Theming](#theming): CSS variables and customization

## Packages

- [@meldui/vue](#meldui-vue): Core components
- [@meldui/tabler-vue](#icons): Icon system
- [@meldui/charts-vue](#charts): Chart components

## Components

### Form & Input

[List all form components with brief descriptions]

### Navigation

[List all navigation components]

### Data Display

[List all data display components]

### Feedback

[List all feedback components]

### Layout

[List all layout components]

### Overlay

[List all overlay components]

### Interactive

[List all interactive components]

### Charts

[List all chart components]

## Optional

- [Examples](#examples): Dashboard examples
- [Colors](#colors): Color system reference
```

### 3. Generate llms-full.txt (Complete Documentation)

Create comprehensive documentation with this structure:

````markdown
# MeldUI - Complete Documentation for AI Assistants

> [Same description as llms.txt]

This documentation is optimized for AI coding assistants. It contains everything
needed to correctly use MeldUI components in Vue 3 projects.

## Critical Information

### Package Structure

MeldUI consists of three packages that must be installed separately:

| Package            | Purpose              | Install            |
| ------------------ | -------------------- | ------------------ |
| @meldui/vue        | Core UI components   | Required           |
| @meldui/tabler-vue | 5000+ Tabler icons   | Required for icons |
| @meldui/charts-vue | ECharts-based charts | Optional           |

### Common Mistakes to Avoid

**1. Using Tailwind CSS v3 syntax**

- WRONG: Creating `tailwind.config.js`
- CORRECT: Use CSS-first config with `@import "tailwindcss"`

**2. Wrong icon imports**

- WRONG: `import { IconCheck } from '@meldui/vue'`
- CORRECT: `import { IconCheck } from '@meldui/tabler-vue'`

**3. Wrong chart imports**

- WRONG: `import { MeldLineChart } from '@meldui/vue'`
- CORRECT: `import { MeldLineChart } from '@meldui/charts-vue'`

**4. Missing theme import**

- WRONG: Only importing components
- CORRECT: Also import `@meldui/vue/themes/default` in your CSS

**5. Missing Tailwind source directive**

- WRONG: Not scanning MeldUI dist files
- CORRECT: Add `@source "../node_modules/@meldui/vue/dist/*.mjs";`

## Installation

[Extract and include full content from Installation.mdx]

## Theming

[Extract and include full content from Theming.mdx]

## Icons

[Extract and include full content from Icons.mdx]

---

## Components Reference

[For EACH component, create a section with:]

### [ComponentName]

[Brief description from story meta or argTypes description]

#### Import

```typescript
import { ComponentName } from '@meldui/vue'
```
````

#### Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |

[Extract from argTypes in the story file]

#### Basic Example

```vue
[Extract the Default story template]
```

#### Variants/Examples

[Extract 2-3 most useful story examples, cleaned up and annotated]

---

## Charts Reference

[For each chart component from @meldui/charts-vue:]

### MeldLineChart

#### Import

```typescript
import { MeldLineChart } from '@meldui/charts-vue'
import type { MeldChartConfig } from '@meldui/charts-vue'
```

#### Props

[Document the config prop structure]

#### Example

[Extract from story]

---

## Icon System

### Import Pattern

```typescript
import { IconName } from '@meldui/tabler-vue'
```

### Icon Props

| Prop   | Type   | Default | Description         |
| ------ | ------ | ------- | ------------------- |
| size   | number | 24      | Icon size in pixels |
| stroke | number | 1.5     | Stroke width        |

### Color Inheritance

Icons inherit color from `currentColor`. Use Tailwind text classes:

```vue
<span class="text-red-500">
  <IconX /> <!-- Red icon -->
</span>
```

### Common Icons

[List 20-30 most commonly used icons with their names]

````

### 4. Extraction Guidelines

When extracting from story files:

1. **Props**: Look for `argTypes` in the story meta object
2. **Description**: Look for `parameters.docs.description.component`
3. **Examples**: Extract `template` strings from story render functions
4. **Imports**: Note which components are imported at the top

Clean up extracted templates:
- Remove unnecessary wrapper divs used for Storybook layout
- Remove inline styles that are just for Storybook display
- Keep the essential component usage
- Add setup script if the story uses `setup()` function

### 5. Quality Checklist

Before writing files, verify:

- [ ] All component categories are covered
- [ ] Import statements are correct for each package
- [ ] Common mistakes section is prominent and accurate
- [ ] Examples are copy-paste ready
- [ ] Props tables are complete
- [ ] No Storybook-specific code in examples (like story args)

## Format Requirements

- Use clean Markdown with proper headings
- Use fenced code blocks with language specifiers (```vue, ```typescript, ```bash)
- Keep line lengths reasonable (under 100 chars where possible)
- Use tables for props documentation
- Include anchor-friendly headings (lowercase, hyphenated) for cross-references

## After Generation

1. Write `apps/vue-storybook/public/llms.txt`
2. Write `apps/vue-storybook/public/llms-full.txt`
3. Report summary: number of components documented, file sizes, any issues found
````
