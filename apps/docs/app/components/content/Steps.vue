<template>
  <div class="not-prose my-6 space-y-4 border-l-2 border-border pl-6 [counter-reset:step]">
    <slot />
  </div>
</template>

<style scoped>
div :deep(> *) {
  position: relative;
  counter-increment: step;
}

div :deep(> *::before) {
  content: counter(step);
  position: absolute;
  left: -2.35rem;
  display: flex;
  width: 1.5rem;
  height: 1.5rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: 2px solid hsl(var(--border));
  background: hsl(var(--background));
  font-size: 0.75rem;
  font-weight: 600;
  color: hsl(var(--foreground));
}
</style>
