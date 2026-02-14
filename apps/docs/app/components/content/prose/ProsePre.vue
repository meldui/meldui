<script setup lang="ts">
const copied = ref(false)

function copyCode(el: HTMLElement) {
  const code = el.querySelector('code')?.textContent || ''
  navigator.clipboard.writeText(code).then(() => {
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  })
}
</script>

<template>
  <div class="group relative my-4">
    <button
      class="absolute right-2 top-2 z-10 inline-flex h-7 w-7 items-center justify-center rounded-md border border-border/50 bg-background/80 text-muted-foreground opacity-0 backdrop-blur transition-all hover:bg-accent hover:text-accent-foreground group-hover:opacity-100"
      @click="copyCode($el?.parentElement!)"
    >
      <!-- Check icon when copied -->
      <svg
        v-if="copied"
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
      <!-- Copy icon -->
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
      </svg>
    </button>
    <pre
      class="overflow-x-auto rounded-lg border border-border bg-muted/50 p-4 text-sm leading-relaxed"
    ><slot /></pre>
  </div>
</template>
