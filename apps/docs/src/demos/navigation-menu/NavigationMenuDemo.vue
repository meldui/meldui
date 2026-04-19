<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from '@meldui/vue'

const code = `\u003cscript setup>
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from '@meldui/vue'
\u003c/script>

\u003ctemplate>
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
        <NavigationMenuContent>
          <div class="grid gap-3 p-4 w-[400px]">
            <NavigationMenuLink href="/docs/getting-started">
              Introduction
            </NavigationMenuLink>
            <NavigationMenuLink href="/docs/getting-started/installation">
              Installation
            </NavigationMenuLink>
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuTrigger>Components</NavigationMenuTrigger>
        <NavigationMenuContent>
          <div class="grid gap-3 p-4 w-[400px]">
            <NavigationMenuLink href="/docs/components/button">
              Button
            </NavigationMenuLink>
            <NavigationMenuLink href="/docs/components/input">
              Input
            </NavigationMenuLink>
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div class="grid gap-3 p-4 w-[400px]">
              <NavigationMenuLink href="#">Introduction</NavigationMenuLink>
              <NavigationMenuLink href="#">Installation</NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div class="grid gap-3 p-4 w-[400px]">
              <NavigationMenuLink href="#">Button</NavigationMenuLink>
              <NavigationMenuLink href="#">Input</NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  </DemoBlock>
</template>
