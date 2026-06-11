<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import {
  CircularProgress,
  CircularProgressIndicator,
  CircularProgressLabel,
  CircularProgressRange,
  CircularProgressTrack,
} from '@meldui/vue'

const code = `\u003cscript setup>
import {
  CircularProgress,
  CircularProgressIndicator,
  CircularProgressLabel,
  CircularProgressRange,
  CircularProgressTrack,
} from '@meldui/vue'
\u003c/script>

<template>
  <div class="flex items-center gap-6">
    <CircularProgress :value="75" :size="80" :thickness="6">
      <CircularProgressIndicator>
        <CircularProgressTrack />
        <CircularProgressRange />
      </CircularProgressIndicator>
      <CircularProgressLabel />
    </CircularProgress>

    <CircularProgress :value="50" variant="success" :size="80" :thickness="6">
      <CircularProgressIndicator>
        <CircularProgressTrack />
        <CircularProgressRange />
      </CircularProgressIndicator>
      <CircularProgressLabel />
    </CircularProgress>

    <CircularProgress :value="30" variant="warning" :size="80" :thickness="6">
      <CircularProgressIndicator>
        <CircularProgressTrack />
        <CircularProgressRange />
      </CircularProgressIndicator>
      <CircularProgressLabel />
    </CircularProgress>
  </div>
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="flex items-center gap-6">
      <CircularProgress :value="75" :size="80" :thickness="6">
        <CircularProgressIndicator>
          <CircularProgressTrack />
          <CircularProgressRange />
        </CircularProgressIndicator>
        <CircularProgressLabel />
      </CircularProgress>

      <CircularProgress :value="50" variant="success" :size="80" :thickness="6">
        <CircularProgressIndicator>
          <CircularProgressTrack />
          <CircularProgressRange />
        </CircularProgressIndicator>
        <CircularProgressLabel />
      </CircularProgress>

      <CircularProgress :value="30" variant="warning" :size="80" :thickness="6">
        <CircularProgressIndicator>
          <CircularProgressTrack />
          <CircularProgressRange />
        </CircularProgressIndicator>
        <CircularProgressLabel />
      </CircularProgress>
    </div>
  </DemoBlock>
</template>
