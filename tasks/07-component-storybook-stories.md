# Task 07: Component Storybook Stories

**Status:** Not Started
**Priority:** High
**Dependencies:** Tasks 01-04 (Storybook infrastructure must be set up)

## Overview

Create comprehensive Storybook stories for all 64 UI component groups in @meldui/vue. Currently only 3 components have stories (Button, Card, IconGallery). This task will create stories for the remaining 61 component groups to provide interactive documentation and examples.

## Objectives

1. Create `.stories.ts` files for all remaining components
2. Document all component variants and states
3. Provide interactive controls for all props
4. Include usage examples and code snippets
5. Add accessibility notes where relevant
6. Organize stories by component category

## Component Inventory

### ✅ Completed (3 components)
- Button
- Card
- IconGallery (custom)

### 🔨 To Be Implemented (61 components)

#### Form Components (16)
- [x] Checkbox
- [x] Input
- [x] InputGroup
- [x] InputOtp
- [x] Label
- [x] NativeSelect
- [x] NumberField
- [x] PinInput
- [x] RadioGroup
- [x] Select
- [x] Slider
- [x] Switch
- [x] TagsInput
- [x] Textarea
- [x] Form
- [x] Field

#### Navigation & Menu (7)
- [ ] Breadcrumb
- [ ] NavigationMenu
- [ ] Menubar
- [ ] ContextMenu
- [ ] DropdownMenu
- [ ] Pagination
- [ ] Tabs

#### Overlay & Modal (7)
- [ ] AlertDialog
- [ ] Dialog
- [ ] Drawer
- [ ] Sheet
- [ ] Popover
- [ ] HoverCard
- [ ] Tooltip

#### Feedback & Status (8)
- [ ] Alert
- [ ] Badge
- [ ] Progress
- [ ] Skeleton
- [ ] Spinner
- [ ] Stepper
- [ ] Toast (Sonner)
- [ ] Empty

#### Layout & Container (8)
- [ ] Accordion
- [ ] Collapsible
- [ ] Resizable
- [ ] ScrollArea
- [ ] Separator
- [ ] Sidebar
- [ ] AspectRatio
- [ ] Table

#### Data Display (5)
- [ ] Avatar
- [ ] Calendar
- [ ] RangeCalendar
- [ ] Chart
- [ ] Kbd

#### Interactive (5)
- [ ] ButtonGroup
- [ ] Carousel
- [ ] Command
- [ ] Toggle
- [ ] ToggleGroup

#### Utility Components (5)
- [ ] Combobox
- [ ] Item (internal utility)
- [ ] Portal
- [ ] Primitive
- [ ] Slot

## Implementation Strategy

### Phase 1: High Priority Components (Weeks 1-2)
Focus on most commonly used components first:

**Form Components:**
- Input, Textarea, Select, Checkbox, RadioGroup, Switch, Label

**Navigation:**
- Tabs, Breadcrumb, Pagination

**Feedback:**
- Alert, Badge, Progress, Skeleton

**Layout:**
- Accordion, Separator, ScrollArea

### Phase 2: Medium Priority Components (Weeks 3-4)
Interactive and data display components:

**Interactive:**
- ButtonGroup, Carousel, Command, Toggle, ToggleGroup

**Data Display:**
- Avatar, Calendar, RangeCalendar, Kbd

**Overlay:**
- Dialog, Sheet, Popover, Tooltip

### Phase 3: Complex Components (Week 5)
Advanced components with more complex APIs:

**Form Components:**
- Form, Field, NumberField, InputOtp, PinInput, TagsInput, InputGroup, NativeSelect

**Navigation:**
- NavigationMenu, Menubar, ContextMenu, DropdownMenu

**Overlay:**
- AlertDialog, Drawer, HoverCard

### Phase 4: Advanced & Specialized (Week 6)
Specialized and utility components:

**Layout:**
- Collapsible, Resizable, Sidebar, AspectRatio, Table

**Data Display:**
- Chart

**Feedback:**
- Stepper, Toast (Sonner), Empty, Spinner

**Utility:**
- Combobox, Item

## Story Template Structure

Each component story should follow this structure:

```typescript
import type { Meta, StoryObj } from '@storybook/vue3'
import { ComponentName } from '@meldui/vue'

const meta: Meta<typeof ComponentName> = {
  title: 'Components/Category/ComponentName',
  component: ComponentName,
  tags: ['autodocs'],
  argTypes: {
    // Define interactive controls for props
  },
  parameters: {
    docs: {
      description: {
        component: 'Brief description of the component and when to use it.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Default variant
export const Default: Story = {
  args: {
    // Default props
  },
}

// Additional variants (Primary, Secondary, Disabled, Loading, etc.)
export const VariantName: Story = {
  args: {
    // Variant-specific props
  },
}

// Complex example with composition
export const Example: Story = {
  render: (args) => ({
    components: { ComponentName },
    setup() {
      return { args }
    },
    template: `
      <!-- Complex usage example -->
    `,
  }),
}
```

## Story Requirements Checklist

For each component story, ensure:

- [ ] **Use Tailwind classes only** - NEVER use inline `style` attributes. Use Tailwind utility classes (e.g., `class="flex gap-4 text-sm"`). Use existing MeldUI components (Button, Label, etc.) instead of native HTML elements where applicable
- [ ] **All variants documented** - Show all available style variants (e.g., primary, secondary, outline)
- [ ] **Interactive controls** - Use argTypes for all configurable props
- [ ] **State examples** - Show disabled, loading, error, success states where applicable
- [ ] **Size variants** - Document all size options (sm, md, lg, xl)
- [ ] **Composition examples** - Show how component works with others
- [ ] **Accessibility notes** - Document keyboard navigation, ARIA attributes, screen reader support
- [ ] **Usage guidelines** - When to use vs. alternatives
- [ ] **Code examples** - Show common usage patterns
- [ ] **Responsive behavior** - Demonstrate mobile/desktop differences if relevant
- [ ] **Dark mode** - Show component in both light and dark themes

## Storybook Organization

Stories should be organized in the following directory structure:

```
apps/vue-storybook/src/stories/
├── Introduction.mdx              ✅ (exists)
├── Installation.mdx              ✅ (exists)
├── Theming.mdx                   ✅ (exists)
├── Icons.mdx                     ✅ (exists)
├── Components/
│   ├── Form/
│   │   ├── Input.stories.ts
│   │   ├── Textarea.stories.ts
│   │   ├── Select.stories.ts
│   │   ├── Checkbox.stories.ts
│   │   └── ...
│   ├── Navigation/
│   │   ├── Tabs.stories.ts
│   │   ├── Breadcrumb.stories.ts
│   │   └── ...
│   ├── Feedback/
│   │   ├── Alert.stories.ts
│   │   ├── Badge.stories.ts
│   │   └── ...
│   ├── Layout/
│   │   ├── Accordion.stories.ts
│   │   ├── Separator.stories.ts
│   │   └── ...
│   ├── Overlay/
│   │   ├── Dialog.stories.ts
│   │   ├── Popover.stories.ts
│   │   └── ...
│   ├── Interactive/
│   │   ├── Carousel.stories.ts
│   │   ├── Toggle.stories.ts
│   │   └── ...
│   └── DataDisplay/
│       ├── Avatar.stories.ts
│       ├── Calendar.stories.ts
│       └── ...
└── Icons/
    └── IconGallery.stories.ts    ✅ (exists)
```

## Implementation Steps

### For Each Component:

1. **Research the component**
   - Read the shadcn-vue documentation for the component
   - Review the component's TypeScript types and props
   - Check if there are existing examples in shadcn-vue docs

2. **Create the story file**
   ```bash
   # Create appropriate directory if needed
   mkdir -p apps/vue-storybook/src/stories/Components/<Category>

   # Create the story file
   touch apps/vue-storybook/src/stories/Components/<Category>/<ComponentName>.stories.ts
   ```

3. **Implement base stories**
   - Set up meta configuration with proper title and tags
   - Create Default story
   - Add all variant stories
   - Configure argTypes for interactive controls
   - **IMPORTANT:** Use only Tailwind classes, NO inline `style` attributes
   - Use existing MeldUI components (Button, Label, etc.) instead of native HTML elements

4. **Add complex examples**
   - Create composition examples
   - Show real-world usage patterns
   - Add edge cases and special scenarios

5. **Document usage**
   - Add component description
   - Document props in argTypes descriptions
   - Add accessibility notes
   - Include usage guidelines

6. **Test in Storybook**
   ```bash
   pnpm storybook:vue
   ```
   - Verify all stories render correctly
   - Test interactive controls
   - Check dark mode
   - Verify responsive behavior
   - Test accessibility with addon-a11y

7. **Code quality check**
   ```bash
   pnpm check:fix
   ```

## Quality Standards

All stories must meet these standards:

### Code Quality
- Pass Biome linting and formatting (`pnpm check:fix`)
- Follow TypeScript strict mode
- Use proper type imports from Storybook

### Documentation
- Clear, concise descriptions
- Proper categorization in story titles
- Comprehensive prop documentation
- Real-world usage examples

### Accessibility
- All interactive elements keyboard accessible
- Proper ARIA labels and roles
- Screen reader friendly
- Color contrast compliance

### Testing
- All variants render without errors
- Interactive controls work properly
- Stories load quickly (<2s)
- No console errors or warnings

## Progress Tracking

Track completion using checkboxes in the component inventory above. After completing each component:

1. Mark the checkbox as complete ✅
2. Update the completion count in this document
3. Create a git commit for that component's stories
4. Test in Storybook before moving to next component

## Acceptance Criteria

This task is complete when:

- [ ] All 61 remaining components have Storybook stories
- [ ] All stories follow the template structure
- [ ] All stories render without errors in Storybook
- [ ] All stories have interactive controls where applicable
- [ ] All stories include usage examples
- [ ] All stories pass code quality checks
- [ ] All stories are properly categorized
- [ ] Storybook builds successfully (`pnpm build:storybook:vue`)
- [ ] All stories are documented with descriptions and usage guidelines

## Estimated Timeline

- **Phase 1:** 2 weeks (20 components)
- **Phase 2:** 2 weeks (18 components)
- **Phase 3:** 1 week (13 components)
- **Phase 4:** 1 week (10 components)

**Total:** 6 weeks for complete component story coverage

## Notes

- **Parallel work:** Multiple team members can work on different component categories simultaneously
- **Dependencies:** Some composite components may depend on base component stories being done first
- **Shadcn updates:** When shadcn-vue updates, corresponding stories may need updates
- **Reusability:** Story patterns can be copied and adapted between similar components
- **Testing focus:** Prioritize showing realistic usage over exhaustive prop combinations

## Related Files

- Component source: `packages/vue/src/components/ui/`
- Story location: `apps/vue-storybook/src/stories/Components/`
- Storybook config: `apps/vue-storybook/.storybook/`
- Existing stories: Button.stories.ts, Card.stories.ts (use as reference)

## Resources

- [Storybook Vue3 Docs](https://storybook.js.org/docs/vue/get-started/introduction)
- [Shadcn Vue Documentation](https://www.shadcn-vue.com/)
- [Storybook Controls Addon](https://storybook.js.org/docs/vue/essentials/controls)
- [Storybook A11y Addon](https://storybook.js.org/addons/@storybook/addon-a11y)
