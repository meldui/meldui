import type { InjectionKey, Ref } from 'vue'

// Timeline orientation and variant types
export type TimelineOrientation = 'vertical' | 'horizontal'
export type TimelineVariant = 'default' | 'alternate'
export type TimelineStatus = 'completed' | 'active' | 'pending'
export type TimelineContentPosition = 'start' | 'end'

// Size and thickness presets
export type TimelineDotSize = 'sm' | 'md' | 'lg'
export type TimelineConnectorThickness = 'thin' | 'default' | 'thick'

// Root props
export interface TimelineRootProps {
  /** Orientation of the timeline */
  orientation?: TimelineOrientation
  /** Layout variant */
  variant?: TimelineVariant
  /** Index of the currently active item (0-based) */
  activeIndex?: number
  /** Position of content relative to the separator (start=left/top, end=right/bottom) */
  contentPosition?: TimelineContentPosition
  /** Additional CSS classes */
  class?: string
}

// Item props
export interface TimelineItemProps {
  /** Additional CSS classes */
  class?: string
}

// Dot props
export interface TimelineDotProps {
  /** Size preset for the dot */
  size?: TimelineDotSize
  /** Additional CSS classes */
  class?: string
}

// Connector props
export interface TimelineConnectorProps {
  /** Thickness preset for the connector */
  thickness?: TimelineConnectorThickness
  /** Additional CSS classes */
  class?: string
}

// Content props
export interface TimelineContentProps {
  /** Additional CSS classes */
  class?: string
}

// Header props
export interface TimelineHeaderProps {
  /** Additional CSS classes */
  class?: string
}

// Title props
export interface TimelineTitleProps {
  /** Additional CSS classes */
  class?: string
}

// Description props
export interface TimelineDescriptionProps {
  /** Additional CSS classes */
  class?: string
}

// Time props
export interface TimelineTimeProps {
  /** ISO 8601 date string for the datetime attribute */
  dateTime?: string
  /** Additional CSS classes */
  class?: string
}

// Separator props
export interface TimelineSeparatorProps {
  /** Additional CSS classes */
  class?: string
}

// Context shared via provide/inject
export interface TimelineContext {
  orientation: Ref<TimelineOrientation>
  variant: Ref<TimelineVariant>
  activeIndex: Ref<number>
  contentPosition: Ref<TimelineContentPosition>
  registerItem: () => number
  unregisterItem: (index: number) => void
  totalItems: Ref<number>
}

// Item context for nested components
export interface TimelineItemContext {
  index: Ref<number>
  status: Ref<TimelineStatus>
  isLast: Ref<boolean>
  isAlternateRight: Ref<boolean>
}

// Injection keys
export const TIMELINE_INJECTION_KEY = Symbol('timeline') as InjectionKey<TimelineContext>
export const TIMELINE_ITEM_INJECTION_KEY = Symbol(
  'timeline-item',
) as InjectionKey<TimelineItemContext>
