<template>
  <div
    :class="['conversation-item', { active: isActive }]"
    @click="handleClick"
  >
    <div class="conversation-info">
      <div class="conversation-title">{{ conversation.title }}</div>
      <div class="conversation-date">{{ formatDate(conversation.createdAt) }}</div>
    </div>
    <button
      @click.stop="handleDelete"
      class="delete-btn"
      title="Delete conversation"
    >
      ✕
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  conversation: {
    type: Object,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select', 'delete'])

function handleClick() {
  emit('select', props.conversation.id)
}

function handleDelete() {
  emit('delete', props.conversation.id)
}

function formatDate(timestamp) {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
.conversation-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  margin: 0.25rem 0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
  background: var(--bg-secondary);
}

.conversation-item:hover {
  background: var(--bg-tertiary);
  border-color: var(--border-color);
}

.conversation-item.active {
  background: var(--bg-tertiary);
  border-color: var(--red-primary);
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.2);
}

.conversation-info {
  flex: 1;
  min-width: 0;
}

.conversation-title {
  font-size: 0.9rem;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.25rem;
}

.conversation-item.active .conversation-title {
  color: var(--red-bright);
  font-weight: 600;
}

.conversation-date {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-family: var(--font-mono);
}

.delete-btn {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background: transparent;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.2s;
  font-size: 1.2rem;
  padding: 0;
}

.conversation-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background: var(--red-primary);
  color: white;
}
</style>
