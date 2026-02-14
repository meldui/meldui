<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    type?: 'info' | 'warning' | 'danger' | 'tip'
    title?: string
  }>(),
  { type: 'info' },
)

const styles = {
  info: 'border-info/50 bg-info/5 text-info [&_svg]:text-info',
  warning: 'border-warning/50 bg-warning/5 text-warning [&_svg]:text-warning',
  danger: 'border-destructive/50 bg-destructive/5 text-destructive [&_svg]:text-destructive',
  tip: 'border-success/50 bg-success/5 text-success [&_svg]:text-success',
} as const

const icons = {
  info: 'M12 16v-4m0-4h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
  warning:
    'M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z',
  danger: 'M12 9v4m0 4h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
  tip: 'M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547Z',
} as const
</script>

<template>
  <div class="not-prose my-6 rounded-lg border-l-4 p-4" :class="styles[type]">
    <div class="flex items-start gap-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="mt-0.5 shrink-0"
      >
        <path :d="icons[type]" />
      </svg>
      <div class="min-w-0">
        <p v-if="title" class="mb-1 font-semibold">{{ title }}</p>
        <div class="text-sm text-foreground [&_p]:my-1">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
