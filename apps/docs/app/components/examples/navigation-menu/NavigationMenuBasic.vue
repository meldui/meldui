<script setup lang="ts">
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@meldui/vue'
</script>

<template>
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul class="grid gap-3 p-4 w-[400px]">
            <li>
              <NavigationMenuLink href="/docs/introduction"> Introduction </NavigationMenuLink>
            </li>
            <li>
              <NavigationMenuLink href="/docs/installation"> Installation </NavigationMenuLink>
            </li>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuTrigger>Components</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul class="grid gap-3 p-4 w-[400px]">
            <li>
              <NavigationMenuLink href="/docs/components/button"> Button </NavigationMenuLink>
            </li>
            <li>
              <NavigationMenuLink href="/docs/components/card"> Card </NavigationMenuLink>
            </li>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink href="/docs"> Documentation </NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
</template>
