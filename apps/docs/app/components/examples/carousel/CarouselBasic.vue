<script setup lang="ts">
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Card,
  CardContent,
} from '@meldui/vue'
</script>

<template>
  <Carousel class="w-full max-w-xs mx-auto">
    <CarouselContent>
      <CarouselItem v-for="i in 5" :key="i">
        <Card>
          <CardContent class="flex items-center justify-center p-6">
            <span class="text-4xl font-semibold">{{ i }}</span>
          </CardContent>
        </Card>
      </CarouselItem>
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
</template>
