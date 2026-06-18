<script setup lang="ts">
/**
 * ScreenshotProtectionOverlay — the visual layers for `screenshotProtection`.
 *
 *   - Layer 1 (brand scrim): a dim + soft primary glow shown over the (already
 *     blurred) content when the viewer loses focus / the tab is hidden.
 *   - Layer 2 (capture-block card): a persistent MeldUI card shown when a
 *     screenshot / devtools hotkey is intercepted; dismissed via "Back to
 *     document".
 *
 * Rendered as a child of the (`position: relative`) DocumentViewer root so the
 * `absolute inset-0` layers cover the whole viewer. This is deterrent UI only —
 * the detection/state lives in `useScreenshotProtection`.
 */
import { IconShieldLock } from '@meldui/tabler-vue'
import { Button } from '../../components/ui/button'

defineProps<{
  /** Layer 1 — viewer lost focus / tab hidden (the caller also blurs the content). */
  blurred: boolean
  /** Layer 2 — a screenshot hotkey was intercepted; show the persistent block card. */
  blocked: boolean
}>()

defineEmits<{ (e: 'dismiss'): void }>()
</script>

<template>
  <!-- Layer 1: brand scrim (dim + soft primary glow) over the blurred content. -->
  <div
    v-if="blurred"
    class="pointer-events-none absolute inset-0 z-40 flex select-none items-center justify-center bg-background/50 transition-opacity duration-300"
    data-screenshot-protection-scrim
  >
    <div class="size-72 rounded-full bg-primary/10 blur-3xl"></div>
  </div>

  <!-- Layer 2: persistent capture-block card. -->
  <div
    v-if="blocked"
    class="absolute inset-0 z-50 flex select-none items-center justify-center bg-background/80 backdrop-blur-md"
    data-screenshot-protection-overlay
  >
    <div
      class="meld-sp-card flex max-w-xs flex-col items-center gap-4 rounded-xl border border-border bg-card p-8 text-center shadow-lg"
    >
      <div class="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <IconShieldLock :size="24" />
      </div>
      <div class="space-y-1">
        <p class="text-base font-medium text-foreground">Protected content</p>
        <p class="text-sm text-muted-foreground">Screen capture is disabled for this document.</p>
      </div>
      <Button type="button" @click="$emit('dismiss')">Back to document</Button>
    </div>
  </div>
</template>

<style scoped>
/* Layer 2 card — gentle fade + scale on appear. */
.meld-sp-card {
  animation: meld-sp-card-in 160ms ease-out;
}
@keyframes meld-sp-card-in {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@media (prefers-reduced-motion: reduce) {
  .meld-sp-card {
    animation: none;
  }
}
</style>
