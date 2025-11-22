<script setup lang="ts">
import type { UseTimeAgoIntlOptions } from '@vueuse/core'
import { formatTimeAgoIntl, useTimeAgoIntl } from '@vueuse/core'
import { computed, type HTMLAttributes, toRef } from 'vue'
import { cn } from '@/lib/utils'

export interface RelativeTimeProps {
  /**
   * The date to format as relative time
   * Can be a Date object, ISO string, or timestamp (milliseconds)
   */
  date: Date | string | number
  /**
   * Whether to automatically update the relative time
   * @default false
   */
  autoUpdate?: boolean
  /**
   * The interval (in milliseconds) to update the time when autoUpdate is true
   * @default 30000 (30 seconds)
   */
  updateInterval?: number
  /**
   * BCP 47 language tag for localization (e.g., 'en-US', 'fr-FR', 'ja-JP')
   * @default undefined (uses browser default locale)
   */
  locale?: string
  /**
   * Custom CSS classes
   */
  class?: HTMLAttributes['class']
  /**
   * Render as a specific HTML element
   * @default 'time'
   */
  as?: string
}

const props = withDefaults(defineProps<RelativeTimeProps>(), {
  autoUpdate: false,
  updateInterval: 30000,
  as: 'time',
})

// When autoUpdate is false, use formatTimeAgoIntl (non-reactive)
// When autoUpdate is true, use useTimeAgoIntl (reactive with auto-updates)
const timeAgo = computed(() => {
  const options: UseTimeAgoIntlOptions<false> = {}

  if (props.locale) {
    options.locale = props.locale
  }

  if (props.autoUpdate) {
    options.updateInterval = props.updateInterval
    return useTimeAgoIntl(
      toRef(() => props.date),
      options,
    ).value
  }

  // Convert to Date object for formatTimeAgoIntl
  const dateObj = props.date instanceof Date ? props.date : new Date(props.date)
  return formatTimeAgoIntl(dateObj, options)
})

const isoDate = computed(() => {
  if (props.date instanceof Date) {
    return props.date.toISOString()
  }
  if (typeof props.date === 'string') {
    return new Date(props.date).toISOString()
  }
  return new Date(props.date).toISOString()
})
</script>

<template>
  <component :is="as" :datetime="isoDate" :class="cn(props.class)">
    {{ timeAgo }}
  </component>
</template>
