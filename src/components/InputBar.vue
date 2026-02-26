<template>
  <div class="input-bar">
    <div class="input-container">
      <textarea
        v-model="message"
        @keydown.enter.exact.prevent="handleSend"
        @keydown.escape="handleClear"
        placeholder="Enter your message... (Enter to send, Shift+Enter for new line)"
        :disabled="disabled"
        ref="textareaRef"
      ></textarea>
      <div class="button-group">
        <button
          v-if="showRegenerate"
          @click="handleRegenerate"
          class="regenerate-btn"
          :disabled="disabled"
          title="Regenerate last response"
        >
          ↻ Regenerate
        </button>
        <button
          @click="handleSend"
          class="send-btn"
          :disabled="!message.trim() || disabled"
        >
          Send
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  showRegenerate: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['send', 'regenerate'])

const message = ref('')
const textareaRef = ref(null)

function handleSend() {
  if (!message.value.trim() || props.disabled) return

  emit('send', message.value)
  message.value = ''

  // Reset textarea height
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.style.height = 'auto'
    }
  })
}

function handleRegenerate() {
  emit('regenerate')
}

function handleClear() {
  message.value = ''
}

// Auto-resize textarea
watch(message, () => {
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.style.height = 'auto'
      textareaRef.value.style.height = textareaRef.value.scrollHeight + 'px'
    }
  })
})
</script>

<style scoped>
.input-bar {
  padding: 1rem;
  background: var(--bg-secondary);
  border-top: 2px solid var(--red-glow);
}

.input-container {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
}

textarea {
  flex: 1;
  padding: 0.75rem;
  border-radius: 8px;
  resize: none;
  min-height: 50px;
  max-height: 200px;
  overflow-y: auto;
  font-size: 0.95rem;
}

textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button-group {
  display: flex;
  gap: 0.5rem;
}

.send-btn,
.regenerate-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
}

.send-btn {
  background: var(--red-primary);
  color: white;
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
}

.send-btn:hover:not(:disabled) {
  background: var(--red-bright);
  box-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
}

.send-btn:disabled {
  background: var(--bg-tertiary);
  box-shadow: none;
}

.regenerate-btn {
  background: var(--bg-tertiary);
  color: var(--red-bright);
  border: 1px solid var(--red-glow);
}

.regenerate-btn:hover:not(:disabled) {
  background: var(--bg-secondary);
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.2);
}
</style>
