<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Stepper, StepperItem, StepperTrigger, StepperIndicator, StepperTitle, StepperDescription, StepperSeparator } from '@meldui/vue'

const code = `\u003cscript setup>
import { Stepper, StepperItem, StepperTrigger, StepperIndicator, StepperTitle, StepperDescription, StepperSeparator } from '@meldui/vue'
\u003c/script>

\u003ctemplate>
  <Stepper :default-value="2">
    <StepperItem :step="1">
      <StepperTrigger>
        <StepperIndicator>1</StepperIndicator>
        <div>
          <StepperTitle>Account</StepperTitle>
          <StepperDescription>Create your account</StepperDescription>
        </div>
      </StepperTrigger>
      <StepperSeparator />
    </StepperItem>
    <StepperItem :step="2">
      <StepperTrigger>
        <StepperIndicator>2</StepperIndicator>
        <div>
          <StepperTitle>Profile</StepperTitle>
          <StepperDescription>Set up your profile</StepperDescription>
        </div>
      </StepperTrigger>
      <StepperSeparator />
    </StepperItem>
    <StepperItem :step="3">
      <StepperTrigger>
        <StepperIndicator>3</StepperIndicator>
        <div>
          <StepperTitle>Complete</StepperTitle>
          <StepperDescription>Review and confirm</StepperDescription>
        </div>
      </StepperTrigger>
    </StepperItem>
  </Stepper>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <Stepper :default-value="2" class="w-full max-w-lg">
      <StepperItem :step="1">
        <StepperTrigger>
          <StepperIndicator>1</StepperIndicator>
          <div>
            <StepperTitle>Account</StepperTitle>
            <StepperDescription>Create your account</StepperDescription>
          </div>
        </StepperTrigger>
        <StepperSeparator />
      </StepperItem>
      <StepperItem :step="2">
        <StepperTrigger>
          <StepperIndicator>2</StepperIndicator>
          <div>
            <StepperTitle>Profile</StepperTitle>
            <StepperDescription>Set up your profile</StepperDescription>
          </div>
        </StepperTrigger>
        <StepperSeparator />
      </StepperItem>
      <StepperItem :step="3">
        <StepperTrigger>
          <StepperIndicator>3</StepperIndicator>
          <div>
            <StepperTitle>Complete</StepperTitle>
            <StepperDescription>Review and confirm</StepperDescription>
          </div>
        </StepperTrigger>
      </StepperItem>
    </Stepper>
  </DemoBlock>
</template>
