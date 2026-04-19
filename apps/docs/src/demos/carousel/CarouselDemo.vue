<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@meldui/vue'

const code = `\u003cscript setup>
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@meldui/vue'
\u003c/script>

<template>
  <Carousel class="w-full max-w-xs">
    <CarouselContent>
      <CarouselItem v-for="i in 5" :key="i">
        <div class="p-1">
          <div class="flex items-center justify-center rounded-lg border bg-card p-6">
            <span class="text-4xl font-semibold">{{ i }}</span>
          </div>
        </div>
      </CarouselItem>
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <Carousel class="w-full max-w-xs">
      <CarouselContent>
        <CarouselItem v-for="i in 5" :key="i">
          <div class="p-1">
            <div class="flex items-center justify-center rounded-lg border bg-card p-6">
              <span class="text-4xl font-semibold">{{ i }}</span>
            </div>
          </div>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  </DemoBlock>
</template>
