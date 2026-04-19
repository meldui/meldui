<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions, Button } from '@meldui/vue'
import { IconUser, IconMail } from '@meldui/tabler-vue'

const code = `\u003cscript setup>
import { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions } from '@meldui/vue'
import { Button } from '@meldui/vue'
import { IconUser, IconMail } from '@meldui/tabler-vue'
\u003c/script>

\u003ctemplate>
  <div class="space-y-2 w-full max-w-md">
    <Item variant="outline">
      <ItemMedia variant="icon">
        <IconUser class="size-5" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>John Doe</ItemTitle>
        <ItemDescription>Software Engineer</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button size="sm" variant="outline">View</Button>
      </ItemActions>
    </Item>
    <Item variant="outline">
      <ItemMedia variant="icon">
        <IconMail class="size-5" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>jane@example.com</ItemTitle>
        <ItemDescription>Primary email</ItemDescription>
      </ItemContent>
    </Item>
  </div>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="w-full max-w-md space-y-2">
      <Item variant="outline">
        <ItemMedia variant="icon">
          <IconUser class="size-5" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>John Doe</ItemTitle>
          <ItemDescription>Software Engineer</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm" variant="outline">View</Button>
        </ItemActions>
      </Item>
      <Item variant="outline">
        <ItemMedia variant="icon">
          <IconMail class="size-5" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>jane@example.com</ItemTitle>
          <ItemDescription>Primary email</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  </DemoBlock>
</template>
