# date-range-picker Specification

## Purpose

TBD - created by archiving change add-date-range-picker. Update Purpose after archive.

## Requirements

### Requirement: DateRangePicker Component

The system SHALL provide a `DateRangePicker` composite component that enables users to select dates or date ranges through preset quick selections and/or calendar interaction.

#### Scenario: Basic date range selection

- **WHEN** user opens the DateRangePicker in range mode
- **THEN** a popover displays with preset buttons on the left and a calendar on the right
- **AND** user can select a date range by clicking start and end dates on the calendar

#### Scenario: Single date selection mode

- **WHEN** DateRangePicker is configured with `mode="single"`
- **THEN** the component displays single-date presets and a single-selection calendar
- **AND** selecting a date updates the modelValue with a single DateValue

### Requirement: Preset Quick Selection

The system SHALL provide configurable preset buttons that allow one-click date or date range selection.

#### Scenario: Built-in default presets for range mode

- **WHEN** DateRangePicker is used in range mode without custom presets
- **THEN** default presets are shown: Today, Yesterday, Last 7 days, Last 30 days, This month, Last month
- **AND** each preset calculates the date range relative to the current date when selected

#### Scenario: Built-in default presets for single mode

- **WHEN** DateRangePicker is used in single mode without custom presets
- **THEN** default presets are shown: Today, Yesterday, 1 week ago, 1 month ago
- **AND** each preset calculates the date relative to the current date when selected

#### Scenario: Custom preset configuration

- **WHEN** user provides a `presets` prop with custom preset definitions
- **THEN** the custom presets replace the default presets
- **AND** each preset must include a `label` (string) and `value` (function returning date/range)

#### Scenario: Preset selection updates value

- **WHEN** user clicks a preset button
- **THEN** the modelValue is updated with the preset's calculated date/range
- **AND** the `preset-select` event is emitted with the selected preset

### Requirement: Configurable Selection Behavior

The system SHALL allow configuration of the picker's behavior when a preset is selected.

#### Scenario: Auto-close on preset selection (default)

- **WHEN** `closeOnPresetSelect` is `true` (default) and user selects a preset
- **THEN** the popover closes immediately after selection

#### Scenario: Stay open on preset selection

- **WHEN** `closeOnPresetSelect` is `false` and user selects a preset
- **THEN** the popover remains open after selection
- **AND** user can continue to modify the selection or close manually

### Requirement: Calendar Visibility Control

The system SHALL allow hiding the calendar to show only preset options.

#### Scenario: Presets-only mode

- **WHEN** `showCalendar` is `false`
- **THEN** only the presets panel is displayed without the calendar
- **AND** users can only select from the available presets

#### Scenario: Full mode with calendar

- **WHEN** `showCalendar` is `true` (default)
- **THEN** both the presets panel and calendar are displayed
- **AND** users can select via presets or by interacting with the calendar

### Requirement: Date Constraints

The system SHALL support minimum and maximum date constraints.

#### Scenario: Date constraints applied to calendar

- **WHEN** `minValue` and/or `maxValue` props are provided
- **THEN** dates outside the allowed range are disabled in the calendar
- **AND** preset selections that fall outside the range are adjusted to fit within constraints

### Requirement: Trigger Button Display

The system SHALL display the selected date(s) in the trigger button.

#### Scenario: No date selected

- **WHEN** no date is selected
- **THEN** the trigger button displays the placeholder text

#### Scenario: Single date selected

- **WHEN** a single date is selected
- **THEN** the trigger button displays the formatted date

#### Scenario: Date range selected

- **WHEN** a date range is selected
- **THEN** the trigger button displays both dates in format "Start - End"

### Requirement: Accessibility

The system SHALL be accessible via keyboard and screen readers.

#### Scenario: Keyboard navigation

- **WHEN** user navigates with keyboard
- **THEN** Tab moves focus between presets and calendar
- **AND** Arrow keys navigate within the calendar
- **AND** Enter/Space selects the focused date or preset

#### Scenario: Screen reader support

- **WHEN** component is used with a screen reader
- **THEN** appropriate ARIA labels are provided for all interactive elements
- **AND** selection state changes are announced
