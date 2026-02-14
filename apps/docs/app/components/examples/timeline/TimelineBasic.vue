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
  TimelineTime,
} from '@meldui/vue'
</script>

<template>
  <Timeline :active-index="1">
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot />
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <TimelineHeader>
          <TimelineTitle>Order placed</TimelineTitle>
          <TimelineTime date-time="2024-01-15">Jan 15, 2024</TimelineTime>
        </TimelineHeader>
        <TimelineDescription>Your order has been confirmed.</TimelineDescription>
      </TimelineContent>
    </TimelineItem>
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot />
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <TimelineHeader>
          <TimelineTitle>Processing</TimelineTitle>
          <TimelineTime date-time="2024-01-16">Jan 16, 2024</TimelineTime>
        </TimelineHeader>
        <TimelineDescription>Your order is being prepared.</TimelineDescription>
      </TimelineContent>
    </TimelineItem>
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot />
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <TimelineHeader>
          <TimelineTitle>Shipped</TimelineTitle>
        </TimelineHeader>
        <TimelineDescription>Awaiting shipment.</TimelineDescription>
      </TimelineContent>
    </TimelineItem>
  </Timeline>
</template>
