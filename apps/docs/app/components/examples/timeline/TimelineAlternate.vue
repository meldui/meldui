<script setup lang="ts">
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineHeader,
  TimelineTitle,
  TimelineDescription,
} from '@meldui/vue'
</script>

<template>
  <Timeline :active-index="2" variant="alternate">
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot />
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <TimelineHeader>
          <TimelineTitle>Step 1</TimelineTitle>
        </TimelineHeader>
        <TimelineDescription>Initial setup complete.</TimelineDescription>
      </TimelineContent>
    </TimelineItem>
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot />
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <TimelineHeader>
          <TimelineTitle>Step 2</TimelineTitle>
        </TimelineHeader>
        <TimelineDescription>Configuration applied.</TimelineDescription>
      </TimelineContent>
    </TimelineItem>
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot />
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <TimelineHeader>
          <TimelineTitle>Step 3</TimelineTitle>
        </TimelineHeader>
        <TimelineDescription>Currently in progress.</TimelineDescription>
      </TimelineContent>
    </TimelineItem>
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot />
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <TimelineHeader>
          <TimelineTitle>Step 4</TimelineTitle>
        </TimelineHeader>
        <TimelineDescription>Final review pending.</TimelineDescription>
      </TimelineContent>
    </TimelineItem>
  </Timeline>
</template>
