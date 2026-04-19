<script setup>
import { ref } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { Slider } from '@meldui/vue'

const value = ref([50])

const code = `\u003cscript setup>
import { ref } from 'vue'
import { Slider } from '@meldui/vue'

const value = ref([50])
<\/script>

<template>
  <Slider v-model="value" :max="100" :step="1" />
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <Slider v-model="value" :max="100" :step="1" class="w-full max-w-sm" />
  </DemoBlock>
</template>
