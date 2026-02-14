<script setup lang="ts">
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@meldui/vue'
import { ref } from 'vue'

const currentStep = ref(2)
</script>

<template>
  <Stepper v-model="currentStep">
    <StepperItem :step="1" class="basis-1/3">
      <StepperTrigger>
        <StepperIndicator>1</StepperIndicator>
        <StepperTitle>Account</StepperTitle>
        <StepperDescription>Set up your account</StepperDescription>
      </StepperTrigger>
      <StepperSeparator />
    </StepperItem>

    <StepperItem :step="2" class="basis-1/3">
      <StepperTrigger>
        <StepperIndicator>2</StepperIndicator>
        <StepperTitle>Profile</StepperTitle>
        <StepperDescription>Add your details</StepperDescription>
      </StepperTrigger>
      <StepperSeparator />
    </StepperItem>

    <StepperItem :step="3" class="basis-1/3">
      <StepperTrigger>
        <StepperIndicator>3</StepperIndicator>
        <StepperTitle>Complete</StepperTitle>
        <StepperDescription>Review and finish</StepperDescription>
      </StepperTrigger>
    </StepperItem>
  </Stepper>
</template>
