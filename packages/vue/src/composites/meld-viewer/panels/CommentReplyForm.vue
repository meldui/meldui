<script setup lang="ts">
/**
 * CommentReplyForm — minimal text input + submit/cancel for reply entry.
 *
 * Used both at the bottom of a thread (add a reply) and inline when first
 * creating a comment thread.
 */
import { nextTick, onMounted, ref } from 'vue'
import { Button } from '../../../components/ui/button'
import { Textarea } from '../../../components/ui/textarea'

interface Props {
  autofocus?: boolean
  placeholder?: string
  submitLabel?: string
  cancelLabel?: string
  initialValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  autofocus: true,
  placeholder: 'Reply…',
  submitLabel: 'Reply',
  cancelLabel: 'Cancel',
  initialValue: '',
})

const emit = defineEmits<{
  (e: 'submit', content: string): void
  (e: 'cancel'): void
}>()

const content = ref(props.initialValue)
const textareaEl = ref<InstanceType<typeof Textarea> | null>(null)

onMounted(async () => {
  if (props.autofocus) {
    await nextTick()
    const native =
      (textareaEl.value as unknown as { $el?: HTMLElement; focus?: () => void })?.focus ?? undefined
    native?.()
  }
})

function handleSubmit() {
  const trimmed = content.value.trim()
  if (!trimmed) return
  emit('submit', trimmed)
  content.value = ''
}

function handleKey(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
    handleSubmit()
    e.preventDefault()
  } else if (e.key === 'Escape') {
    emit('cancel')
    e.preventDefault()
  }
}
</script>

<template>
  <form class="meld-comment-reply-form flex flex-col gap-2" @submit.prevent="handleSubmit">
    <Textarea
      ref="textareaEl"
      v-model="content"
      :placeholder="placeholder"
      class="min-h-16 resize-none text-sm"
      @keydown="handleKey"
    />
    <div class="flex items-center justify-end gap-2">
      <Button type="button" variant="ghost" size="sm" @click="emit('cancel')">
        {{ cancelLabel }}
      </Button>
      <Button type="submit" size="sm" :disabled="content.trim().length === 0">
        {{ submitLabel }}
      </Button>
    </div>
  </form>
</template>
