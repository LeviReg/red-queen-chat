<template>
  <div :class="['message-bubble', message.role]">
    <div class="message-header">
      <span class="message-role">{{ message.role === 'user' ? 'You' : 'Red Queen' }}</span>
      <span class="message-time">{{ formatTime(message.timestamp) }}</span>
    </div>
    <div class="message-content" v-html="renderedContent"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { parseMarkdown } from '../utils/markdown'

const props = defineProps({
  message: {
    type: Object,
    required: true
  }
})

const renderedContent = computed(() => {
  return parseMarkdown(props.message.content)
})

function formatTime(timestamp) {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.message-bubble {
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  max-width: 80%;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-bubble.user {
  background: var(--bg-tertiary);
  margin-left: auto;
  border: 1px solid var(--border-color);
}

.message-bubble.assistant {
  background: var(--bg-secondary);
  margin-right: auto;
  border: 1px solid var(--red-glow);
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.1);
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  opacity: 0.8;
}

.message-role {
  font-weight: 600;
  font-family: var(--font-mono);
}

.message-bubble.assistant .message-role {
  color: var(--red-bright);
}

.message-time {
  color: var(--text-secondary);
  font-size: 0.75rem;
}

.message-content {
  line-height: 1.6;
  word-wrap: break-word;
}

.message-content :deep(p) {
  margin-bottom: 0.5em;
}

.message-content :deep(p:last-child) {
  margin-bottom: 0;
}

.message-content :deep(code) {
  background: rgba(255, 0, 0, 0.1);
  border: 1px solid rgba(255, 0, 0, 0.2);
}

.message-content :deep(pre) {
  background: var(--bg-primary);
  border: 1px solid var(--red-glow);
  margin: 0.5em 0;
}

.message-content :deep(pre code) {
  color: var(--text-primary);
  background: none;
  border: none;
}

.message-content :deep(ul),
.message-content :deep(ol) {
  margin-left: 1.5em;
  margin-bottom: 0.5em;
}

.message-content :deep(strong) {
  color: var(--red-bright);
  font-weight: 700;
}

.message-content :deep(a) {
  color: var(--red-bright);
  text-decoration: underline;
}
</style>
