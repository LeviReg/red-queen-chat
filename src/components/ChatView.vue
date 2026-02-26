<template>
  <div class="chat-view">
    <div v-if="!hasConversation" class="chat-content">
      <WelcomeScreen />
    </div>
    <div v-else class="chat-content">
      <div class="messages-container" ref="messagesContainer">
        <MessageBubble
          v-for="message in messages"
          :key="message.id"
          :message="message"
        />
        <TypingIndicator v-if="isTyping" />
      </div>
    </div>
    <InputBar
      :disabled="isTyping"
      :showRegenerate="canRegenerate"
      @send="handleSend"
      @regenerate="handleRegenerate"
    />
  </div>
</template>

<script setup>
import { ref, watch, nextTick, computed } from 'vue'
import MessageBubble from './MessageBubble.vue'
import TypingIndicator from './TypingIndicator.vue'
import InputBar from './InputBar.vue'
import WelcomeScreen from './WelcomeScreen.vue'

const props = defineProps({
  messages: {
    type: Array,
    default: () => []
  },
  isTyping: {
    type: Boolean,
    default: false
  },
  hasConversation: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['send', 'regenerate'])

const messagesContainer = ref(null)

const canRegenerate = computed(() => {
  if (props.messages.length === 0) return false
  const lastMessage = props.messages[props.messages.length - 1]
  return lastMessage.role === 'assistant' && !props.isTyping
})

function handleSend(message) {
  emit('send', message)
  scrollToBottom()
}

function handleRegenerate() {
  emit('regenerate')
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// Auto-scroll when new messages arrive or typing status changes
watch(() => [props.messages.length, props.isTyping], () => {
  scrollToBottom()
})
</script>

<style scoped>
.chat-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg-primary);
}

.chat-content {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.messages-container {
  flex: 1;
  padding: 2rem;
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .messages-container {
    padding: 1rem;
  }
}
</style>
