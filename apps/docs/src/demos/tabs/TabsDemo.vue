<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@meldui/vue'

const code = `\u003cscript setup>
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@meldui/vue'
\u003c/script>

\u003ctemplate>
  <Tabs default-value="account">
    <TabsList>
      <TabsTrigger value="account">Account</TabsTrigger>
      <TabsTrigger value="password">Password</TabsTrigger>
    </TabsList>
    <TabsContent value="account">Account settings here.</TabsContent>
    <TabsContent value="password">Change your password here.</TabsContent>
  </Tabs>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <Tabs default-value="account" class="w-full max-w-md">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Account settings here.</TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
  </DemoBlock>
</template>
