<script setup>
import { ref } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { Slider } from '@meldui/vue'

const range = ref([25, 75])

const code = `\u003cscript setup>
import { ref } from 'vue'
import { Slider } from '@meldui/vue'

const range = ref([25, 75])
<\/script>

<template>
  <Slider v-model="range" :max="100" :step="1" />
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <Slider v-model="range" :max="100" :step="1" class="w-full max-w-sm" />
  </DemoBlock>
</template>
