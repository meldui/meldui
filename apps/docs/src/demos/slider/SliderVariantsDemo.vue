<script setup>
import { ref } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { Slider } from '@meldui/vue'

const v1 = ref([60])
const v2 = ref([40])
const v3 = ref([80])
const v4 = ref([25])

const code = `\u003ctemplate>
  <div class="space-y-6">
    <Slider v-model="v1" variant="default" :max="100" />
    <Slider v-model="v2" variant="success" :max="100" />
    <Slider v-model="v3" variant="warning" :max="100" />
    <Slider v-model="v4" variant="destructive" :max="100" />
  </div>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="w-full max-w-sm space-y-6">
      <Slider v-model="v1" variant="default" :max="100" />
      <Slider v-model="v2" variant="success" :max="100" />
      <Slider v-model="v3" variant="warning" :max="100" />
      <Slider v-model="v4" variant="destructive" :max="100" />
    </div>
  </DemoBlock>
</template>
