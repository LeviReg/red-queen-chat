import { reactive, computed } from 'vue'
import { generateMockResponse, getResponseDelay } from './mockResponses'

// Reactive store for conversation management
export const store = reactive({
  conversations: [],
  currentConversationId: null,
  isTyping: false,
  nextConversationId: 1,
  nextMessageId: 1
})

// Computed properties
export const currentConversation = computed(() => {
  if (!store.currentConversationId) return null
  return store.conversations.find(c => c.id === store.currentConversationId)
})

export const currentMessages = computed(() => {
  return currentConversation.value?.messages || []
})

export const sortedConversations = computed(() => {
  return [...store.conversations].sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  )
})

// Create a new conversation
export function createConversation(firstMessage) {
  const conversation = {
    id: store.nextConversationId++,
    title: generateConversationTitle(firstMessage),
    createdAt: new Date().toISOString(),
    messages: []
  }

  store.conversations.push(conversation)
  store.currentConversationId = conversation.id

  // Add the first user message
  if (firstMessage) {
    const userMessage = {
      id: store.nextMessageId++,
      role: 'user',
      content: firstMessage,
      timestamp: new Date().toISOString()
    }
    conversation.messages.push(userMessage)

    // Trigger AI response
    generateAIResponse(conversation.id)
  }

  return conversation
}

// Generate conversation title from first message
function generateConversationTitle(message) {
  if (!message) return 'New Conversation'

  // Take first 40 characters of the message
  const title = message.trim().substring(0, 40)
  return title.length < message.trim().length ? title + '...' : title
}

// Send a message in the current conversation
export function sendMessage(content) {
  if (!store.currentConversationId) {
    // Create new conversation if none exists
    createConversation(content)
    return
  }

  const conversation = store.conversations.find(c => c.id === store.currentConversationId)
  if (!conversation) return

  // Add user message
  const userMessage = {
    id: store.nextMessageId++,
    role: 'user',
    content: content.trim(),
    timestamp: new Date().toISOString()
  }
  conversation.messages.push(userMessage)

  // Generate AI response
  generateAIResponse(store.currentConversationId)
}

// Generate AI response with delay
function generateAIResponse(conversationId) {
  store.isTyping = true

  const conversation = store.conversations.find(c => c.id === conversationId)
  if (!conversation) {
    store.isTyping = false
    return
  }

  // Get the last user message
  const lastUserMessage = [...conversation.messages]
    .reverse()
    .find(m => m.role === 'user')

  const delay = getResponseDelay()

  setTimeout(() => {
    // Generate mock response
    const aiResponse = generateMockResponse(lastUserMessage?.content || '')

    const aiMessage = {
      id: store.nextMessageId++,
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date().toISOString()
    }

    conversation.messages.push(aiMessage)
    store.isTyping = false
  }, delay)
}

// Regenerate the last AI response
export function regenerateLastResponse() {
  const conversation = currentConversation.value
  if (!conversation || conversation.messages.length < 2) return

  // Find and remove the last AI message
  const lastMessageIndex = conversation.messages.length - 1
  const lastMessage = conversation.messages[lastMessageIndex]

  if (lastMessage.role !== 'assistant') return

  conversation.messages.splice(lastMessageIndex, 1)

  // Generate new response
  generateAIResponse(store.currentConversationId)
}

// Delete a conversation
export function deleteConversation(id) {
  const index = store.conversations.findIndex(c => c.id === id)
  if (index === -1) return

  store.conversations.splice(index, 1)

  // If we deleted the current conversation, clear selection
  if (store.currentConversationId === id) {
    store.currentConversationId = null
  }
}

// Select a conversation
export function selectConversation(id) {
  const conversation = store.conversations.find(c => c.id === id)
  if (conversation) {
    store.currentConversationId = id
  }
}

// Clear current selection
export function clearSelection() {
  store.currentConversationId = null
}
