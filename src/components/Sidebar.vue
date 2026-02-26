<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <button @click="handleNewChat" class="new-chat-btn">
        <span class="plus-icon">+</span>
        New Chat
      </button>
    </div>
    <div class="conversations-list">
      <div v-if="conversations.length === 0" class="empty-state">
        No conversations yet.
        <br />
        Start a new chat to begin.
      </div>
      <ConversationItem
        v-for="conversation in conversations"
        :key="conversation.id"
        :conversation="conversation"
        :isActive="conversation.id === currentConversationId"
        @select="handleSelect"
        @delete="handleDelete"
      />
    </div>
  </aside>
</template>

<script setup>
import ConversationItem from './ConversationItem.vue'

defineProps({
  conversations: {
    type: Array,
    required: true
  },
  currentConversationId: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['new-chat', 'select', 'delete'])

function handleNewChat() {
  emit('new-chat')
}

function handleSelect(id) {
  emit('select', id)
}

function handleDelete(id) {
  emit('delete', id)
}
</script>

<style scoped>
.sidebar {
  width: 280px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.new-chat-btn {
  width: 100%;
  padding: 0.75rem;
  background: var(--red-primary);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
}

.new-chat-btn:hover {
  background: var(--red-bright);
  box-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
}

.plus-icon {
  font-size: 1.5rem;
  line-height: 1;
}

.conversations-list {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
}

.empty-state {
  padding: 2rem 1rem;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    max-width: 280px;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 100;
    box-shadow: 2px 0 20px rgba(0, 0, 0, 0.5);
  }
}
</style>
