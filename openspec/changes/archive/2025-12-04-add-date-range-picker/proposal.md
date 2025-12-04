# Change: Add DateRangePicker Component

## Why

Users frequently need to select dates or date ranges from common relative time periods (e.g., "Last 7 days", "This month"). Currently, they must manually navigate the calendar to select these ranges, which is time-consuming and error-prone. A DateRangePicker with preset selections allows quick, one-click date selection while still providing full calendar access when needed.

## What Changes

- Add new `DateRangePicker` composite component to `@meldui/vue`
- Component supports both single date and date range selection modes
- Includes configurable preset buttons (e.g., "Today", "Last 7 days", "This month")
- Provides built-in default presets that work out of the box
- Presets panel positioned on the left side of the calendar
- Full component structure: trigger button + popover + picker panel
- Option to hide calendar and show only presets
- Configurable behavior for auto-close on preset selection

## Impact

- Affected specs: None (new capability)
- Affected code:
  - `packages/vue/src/composites/date-range-picker/` (new directory)
  - `packages/vue/src/index.ts` (exports)
  - `apps/vue-storybook/stories/` (documentation)
