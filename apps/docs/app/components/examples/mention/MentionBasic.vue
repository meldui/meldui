<script setup lang="ts">
import { Mention, MentionContent, MentionEmpty, MentionInput, MentionItem } from '@meldui/vue'
import { ref } from 'vue'

const value = ref('')

const users = [
  { id: '1', label: 'Alice Johnson' },
  { id: '2', label: 'Bob Smith' },
  { id: '3', label: 'Charlie Brown' },
  { id: '4', label: 'Diana Prince' },
]
</script>

<template>
  <Mention v-model="value" :triggers="[{ char: '@' }]" placeholder="Type @ to mention someone...">
    <MentionInput />
    <MentionContent>
      <MentionEmpty>No users found.</MentionEmpty>
      <MentionItem v-for="user in users" :key="user.id" :value="user.id" :label="user.label">
        {{ user.label }}
      </MentionItem>
    </MentionContent>
  </Mention>
</template>
