<script setup>
import { ref } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { RangeCalendar } from '@meldui/vue'

const range = ref()

const code = `\u003cscript setup>
import { ref } from 'vue'
import { RangeCalendar } from '@meldui/vue'

const range = ref()
\u003c/script>

\u003ctemplate>
  <RangeCalendar v-model="range" />
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <RangeCalendar v-model="range" />
  </DemoBlock>
</template>
