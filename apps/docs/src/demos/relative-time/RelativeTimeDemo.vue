<script setup lang="ts">
import DemoBlock from '../../components/DemoBlock.vue'
import { RelativeTime } from '@meldui/vue'

const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
const yesterdayDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

const code = `\u003cscript setup>
import { RelativeTime } from '@meldui/vue'
\u003c/script>

\u003ctemplate>
  <RelativeTime :date="fiveMinutesAgo" />    <!-- "5 minutes ago" -->
  <RelativeTime :date="twoHoursAgo" />       <!-- "2 hours ago" -->
  <RelativeTime :date="yesterday" />         <!-- "yesterday" -->
  <RelativeTime :date="oneWeekAgo" />        <!-- "last week" -->
  <RelativeTime :date="fiveMinutesAgo" auto-update :update-interval="10000" />
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="flex flex-col gap-2 text-sm">
      <div class="flex items-center justify-between gap-8">
        <span class="text-muted-foreground">5 min ago:</span>
        <RelativeTime :date="fiveMinutesAgo" />
      </div>
      <div class="flex items-center justify-between gap-8">
        <span class="text-muted-foreground">2 hours ago:</span>
        <RelativeTime :date="twoHoursAgo" />
      </div>
      <div class="flex items-center justify-between gap-8">
        <span class="text-muted-foreground">Yesterday:</span>
        <RelativeTime :date="yesterdayDate" />
      </div>
      <div class="flex items-center justify-between gap-8">
        <span class="text-muted-foreground">1 week ago:</span>
        <RelativeTime :date="oneWeekAgo" />
      </div>
      <div class="flex items-center justify-between gap-8">
        <span class="text-muted-foreground">Auto-updating:</span>
        <RelativeTime :date="fiveMinutesAgo" auto-update :update-interval="10000" />
      </div>
    </div>
  </DemoBlock>
</template>
