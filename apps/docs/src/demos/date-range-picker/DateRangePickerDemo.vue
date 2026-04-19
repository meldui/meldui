<script setup lang="ts">
import { ref } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { DateRangePicker } from '@meldui/vue'

const value = ref()

const code = `\u003cscript setup>
import { ref } from 'vue'
import { DateRangePicker } from '@meldui/vue'

const value = ref()
\u003c/script>

\u003ctemplate>
  <DateRangePicker v-model="value" />
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
      <DateRangePicker v-model="value" class="w-[400px]" />
  </DemoBlock>
</template>
