<script setup>
import { CalendarDate } from '@internationalized/date'
import { ref } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { RangeCalendar } from '@meldui/vue'

const range = ref({
  start: new CalendarDate(2026, 6, 9),
  end: new CalendarDate(2026, 6, 19),
})

const code = `\u003cscript setup>
import { CalendarDate } from '@internationalized/date'
import { ref } from 'vue'
import { RangeCalendar } from '@meldui/vue'

const range = ref({
  start: new CalendarDate(2026, 6, 9),
  end: new CalendarDate(2026, 6, 19),
})
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
