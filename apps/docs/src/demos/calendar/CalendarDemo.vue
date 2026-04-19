<script setup>
import { ref } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { Calendar } from '@meldui/vue'

const date = ref()

const code = `\u003cscript setup>
import { ref } from 'vue'
import { Calendar } from '@meldui/vue'

const date = ref()
\u003c/script>

\u003ctemplate>
  <Calendar v-model="date" />
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <Calendar v-model="date" />
  </DemoBlock>
</template>
