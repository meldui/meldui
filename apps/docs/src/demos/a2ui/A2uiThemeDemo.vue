<script setup lang="ts">
import { onMounted } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { examples } from '@meldui/a2ui'
import { A2UISurface, provideA2UI } from '@meldui/a2ui/vue'
import '@incremark/theme/styles.css'

/**
 * Theming demo: renders a catalog component's canonical example, but wrapped the
 * way a *consuming app* would style it — via MeldUI CSS-variable overrides
 * (`vars`) and/or a scoped CSS string targeting the component's `data-a2ui`
 * attribute (`css`). The agent's messages (shown in the code tab) are unchanged;
 * only the host's styling differs. Use one styled instance per page (the `css`
 * is injected globally for the lifetime of the island).
 */
const props = defineProps<{
  component: string
  vars?: Record<string, string>
  css?: string
}>()

const messages = examples[props.component] ?? []
const code = JSON.stringify(messages, null, 2)

const { processor } = provideA2UI()
onMounted(() => processor.processMessages(messages as never))
</script>

<template>
  <DemoBlock :code="code" lang="json">
    <div class="w-full max-w-xl" :style="vars">
      <component :is="'style'" v-if="css">{{ css }}</component>
      <A2UISurface surface-id="s1" />
    </div>
  </DemoBlock>
</template>
