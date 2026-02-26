<template>
  <div class="chat-page">
    <Header />
    <div class="chat-layout">
      <Sidebar
        :conversations="sortedConversations"
        :currentConversationId="store.currentConversationId"
        @new-chat="handleNewChat"
        @select="handleSelectConversation"
        @delete="handleDeleteConversation"
      />
      <ChatView
        :messages="currentMessages"
        :isTyping="store.isTyping"
        :hasConversation="!!currentConversation"
        @send="handleSendMessage"
        @regenerate="handleRegenerate"
      />
    </div>
  </div>
</template>

<script setup>
import Header from '../components/Header.vue'
import Sidebar from '../components/Sidebar.vue'
import ChatView from '../components/ChatView.vue'
import {
  store,
  sortedConversations,
  currentConversation,
  currentMessages,
  createConversation,
  sendMessage,
  regenerateLastResponse,
  deleteConversation,
  selectConversation,
  clearSelection
} from '../stores/store'

function handleNewChat() {
  // Clear current selection to show welcome screen
  clearSelection()
}

function handleSelectConversation(id) {
  selectConversation(id)
}

function handleDeleteConversation(id) {
  if (confirm('Are you sure you want to delete this conversation?')) {
    deleteConversation(id)
  }
}

function handleSendMessage(message) {
  if (store.currentConversationId) {
    sendMessage(message)
  } else {
    // Create new conversation with first message
    createConversation(message)
  }
}

function handleRegenerate() {
  regenerateLastResponse()
}
</script>

<style scoped>
.chat-page {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
}

.chat-layout {
  flex: 1;
  display: flex;
  overflow: hidden;
}

@media (max-width: 768px) {
  .chat-layout {
    flex-direction: column;
  }
}
</style>
