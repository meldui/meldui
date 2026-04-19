<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button } from '@meldui/vue'

const code = `\u003cscript setup>
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@meldui/vue'
import { Button } from '@meldui/vue'
\u003c/script>

\u003ctemplate>
  <Card class="w-[350px]">
    <CardHeader>
      <CardTitle>Create project</CardTitle>
      <CardDescription>Deploy your new project in one-click.</CardDescription>
    </CardHeader>
    <CardContent>
      <p>Card content goes here.</p>
    </CardContent>
    <CardFooter class="flex justify-between">
      <Button variant="outline">Cancel</Button>
      <Button>Deploy</Button>
    </CardFooter>
  </Card>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <Card class="w-[350px]">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <div>Card content goes here.</div>
      </CardContent>
      <CardFooter class="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  </DemoBlock>
</template>
