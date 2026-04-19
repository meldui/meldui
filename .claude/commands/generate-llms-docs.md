---
name: Generate LLMs Documentation
description: Generate llms.txt and llms-full.txt files for AI agents consuming MeldUI.
category: Documentation
tags: [llms, documentation, ai]
---

# Generate LLMs Documentation

Generate `llms.txt` and `llms-full.txt` from the Astro documentation site content.

## How to Run

```bash
cd apps/docs && npx tsx scripts/generate-llms.ts
```

Or as part of the full build:

```bash
pnpm docs:build
```

The build pipeline runs: `tsx scripts/generate-llms.ts && astro build && pagefind --site dist`

## Output

- `apps/docs/public/llms.txt` — Summary index with page list and common mistakes
- `apps/docs/public/llms-full.txt` — Full API reference with props, events, slots, and sub-components

## Source

The generator at `apps/docs/scripts/generate-llms.ts` reads all MDX files from `apps/docs/src/content/docs/` and extracts:

- Title, description, category from frontmatter
- Props, events, slots arrays from frontmatter
- SubComponents with nested props from frontmatter
- Body content (markdown tables, prose)

## After Regenerating

Verify the output:

1. Check page count: `grep -c "^- \[" apps/docs/public/llms.txt`
2. Check sub-component count: `grep -c "^#### " apps/docs/public/llms-full.txt`
3. Check file size: `wc -c apps/docs/public/llms-full.txt`
