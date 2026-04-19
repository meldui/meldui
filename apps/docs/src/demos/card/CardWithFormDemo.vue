<script setup lang="ts">
import DemoBlock from '../../components/DemoBlock.vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Input, Label, Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@meldui/vue'

const code = `\u003cscript setup>
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@meldui/vue'
import { Button, Input, Label, Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@meldui/vue'
\u003c/script>

\u003ctemplate>
  <Card class="w-[350px]">
    <CardHeader>
      <CardTitle>Create project</CardTitle>
      <CardDescription>Deploy your new project in one-click.</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="grid w-full gap-4">
        <div class="grid gap-2">
          <Label for="name">Name</Label>
          <Input id="name" placeholder="Name of your project" />
        </div>
        <div class="grid gap-2">
          <Label for="framework">Framework</Label>
          <Select>
            <SelectTrigger id="framework">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vue">Vue</SelectItem>
              <SelectItem value="react">React</SelectItem>
              <SelectItem value="astro">Astro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
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
        <div class="grid w-full gap-4">
          <div class="grid gap-2">
            <Label for="cf-name">Name</Label>
            <Input id="cf-name" placeholder="Name of your project" />
          </div>
          <div class="grid gap-2">
            <Label for="cf-framework">Framework</Label>
            <Select>
              <SelectTrigger id="cf-framework">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vue">Vue</SelectItem>
                <SelectItem value="react">React</SelectItem>
                <SelectItem value="astro">Astro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter class="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  </DemoBlock>
</template>
