<script setup lang="ts">
import DemoBlock from '../../components/DemoBlock.vue'
import { Timeline, TimelineItem, TimelineSeparator, TimelineDot, TimelineConnector, TimelineContent, TimelineTitle, TimelineDescription, TimelineTime } from '@meldui/vue'

const code = `\u003cscript setup>
import {
  Timeline, TimelineItem, TimelineSeparator, TimelineDot,
  TimelineConnector, TimelineContent, TimelineTitle,
  TimelineDescription, TimelineTime
} from '@meldui/vue'
\u003c/script>

\u003ctemplate>
  <Timeline :active-index="1">
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot />
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <TimelineTitle>Order Placed</TimelineTitle>
        <TimelineDescription>Your order has been confirmed.</TimelineDescription>
        <TimelineTime date-time="2024-01-15">Jan 15, 2024</TimelineTime>
      </TimelineContent>
    </TimelineItem>
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot />
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <TimelineTitle>Shipped</TimelineTitle>
        <TimelineDescription>Package is on its way.</TimelineDescription>
        <TimelineTime date-time="2024-01-17">Jan 17, 2024</TimelineTime>
      </TimelineContent>
    </TimelineItem>
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot />
      </TimelineSeparator>
      <TimelineContent>
        <TimelineTitle>Delivered</TimelineTitle>
        <TimelineDescription>Estimated delivery.</TimelineDescription>
        <TimelineTime date-time="2024-01-20">Jan 20, 2024</TimelineTime>
      </TimelineContent>
    </TimelineItem>
  </Timeline>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <Timeline :active-index="1" class="w-full max-w-md">
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <TimelineTitle>Order Placed</TimelineTitle>
          <TimelineDescription>Your order has been confirmed.</TimelineDescription>
          <TimelineTime date-time="2024-01-15">Jan 15, 2024</TimelineTime>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <TimelineTitle>Shipped</TimelineTitle>
          <TimelineDescription>Package is on its way.</TimelineDescription>
          <TimelineTime date-time="2024-01-17">Jan 17, 2024</TimelineTime>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
        </TimelineSeparator>
        <TimelineContent>
          <TimelineTitle>Delivered</TimelineTitle>
          <TimelineDescription>Estimated delivery.</TimelineDescription>
          <TimelineTime date-time="2024-01-20">Jan 20, 2024</TimelineTime>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  </DemoBlock>
</template>
