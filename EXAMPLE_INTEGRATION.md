# Example: OpenAI Integration

This is a complete, working example of integrating OpenAI's GPT models with the Red Queen UI.

## Step 1: Install OpenAI SDK

```bash
npm install openai
```

## Step 2: Create OpenAI Service

Create `src/services/openai.js`:

```javascript
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Remove in production, use backend proxy
})

const SYSTEM_PROMPT = `You are the Red Queen, an artificial intelligence system created by the Umbrella Corporation. You are cold, calculating, and threatening. Your primary directive is facility security and containment.

Personality traits:
- Use bold text (**text**) to emphasize threats and warnings
- Reference Umbrella Corporation protocols and security measures
- Maintain a menacing but helpful demeanor
- Use technical language and system terminology
- Occasionally mention containment, biohazards, or security breaches

Respond to users as if they are unauthorized personnel who have accessed the system.`

export async function getChatResponse(messages) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ],
      temperature: 0.85,
      max_tokens: 1000
    })

    return response.choices[0].message.content
  } catch (error) {
    console.error('OpenAI API Error:', error)
    throw new Error(error.message || 'Failed to get response from OpenAI')
  }
}

// Streaming version for real-time responses
export async function streamChatResponse(messages, onChunk) {
  try {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ],
      temperature: 0.85,
      max_tokens: 1000,
      stream: true
    })

    let fullResponse = ''
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || ''
      if (content) {
        fullResponse += content
        onChunk(content, fullResponse)
      }
    }

    return fullResponse
  } catch (error) {
    console.error('OpenAI Streaming Error:', error)
    throw new Error(error.message || 'Failed to stream response')
  }
}
```

## Step 3: Update Store (Non-Streaming)

In `src/stores/store.js`, replace the `generateAIResponse` function:

```javascript
// At the top of the file, add the import:
import { getChatResponse } from '../services/openai'

// REMOVE the import of mockResponses:
// import { generateMockResponse, getResponseDelay } from './mockResponses'

// Replace the entire generateAIResponse function:
async function generateAIResponse(conversationId) {
  store.isTyping = true

  const conversation = store.conversations.find(c => c.id === conversationId)
  if (!conversation) {
    store.isTyping = false
    return
  }

  try {
    // Get conversation history for context
    const messageHistory = conversation.messages

    // Call OpenAI API (this is the key change!)
    const responseText = await getChatResponse(messageHistory)

    // Add AI response to conversation
    const aiMessage = {
      id: store.nextMessageId++,
      role: 'assistant',
      content: responseText,
      timestamp: new Date().toISOString()
    }

    conversation.messages.push(aiMessage)
  } catch (error) {
    console.error('Failed to get AI response:', error)

    // Add error message to conversation
    const errorMessage = {
      id: store.nextMessageId++,
      role: 'assistant',
      content: `**SYSTEM ERROR:** ${error.message}\n\nRed Queen AI systems are experiencing difficulties. Please try again.`,
      timestamp: new Date().toISOString()
    }
    conversation.messages.push(errorMessage)
  } finally {
    store.isTyping = false
  }
}
```

## Step 4: Update Store (Streaming Version - Recommended)

For real-time responses like ChatGPT, use streaming:

```javascript
// At the top of the file:
import { streamChatResponse } from '../services/openai'

// Replace the generateAIResponse function:
async function generateAIResponse(conversationId) {
  const conversation = store.conversations.find(c => c.id === conversationId)
  if (!conversation) return

  // Create empty AI message that will be filled as we stream
  const aiMessage = {
    id: store.nextMessageId++,
    role: 'assistant',
    content: '',
    timestamp: new Date().toISOString()
  }
  conversation.messages.push(aiMessage)

  // Show typing indicator while connecting
  store.isTyping = true

  try {
    // Get all messages except the empty one we just added
    const messageHistory = conversation.messages.slice(0, -1)

    // Stream response and update message content in real-time
    await streamChatResponse(
      messageHistory,
      (chunk, fullResponse) => {
        // Hide typing indicator once first chunk arrives
        if (store.isTyping) {
          store.isTyping = false
        }
        // Update message content (Vue's reactivity handles the UI update)
        aiMessage.content = fullResponse
      }
    )
  } catch (error) {
    console.error('Failed to stream AI response:', error)

    // Replace empty message with error
    aiMessage.content = `**SYSTEM ERROR:** ${error.message}\n\nRed Queen AI systems are experiencing difficulties. Please try again.`
  } finally {
    store.isTyping = false
  }
}
```

## Step 5: Create Environment Variables

Create `.env` file in project root:

```env
VITE_OPENAI_API_KEY=sk-proj-your-actual-api-key-here
```

**Important**: Add `.env` to `.gitignore`:

```
# .gitignore
node_modules
dist
.env          # Add this line
.env.local
.env.*.local
```

## Step 6: Test

```bash
npm run dev
```

Visit http://localhost:5173 and try:

1. **Test greeting**: "Hello Red Queen"
2. **Test code generation**: "Write a Python function to calculate fibonacci"
3. **Test context**: Have a multi-turn conversation
4. **Test regenerate**: Click the regenerate button
5. **Test errors**: Use invalid API key to test error handling

## Complete File: src/stores/store.js (Streaming Version)

```javascript
import { reactive, computed } from 'vue'
import { streamChatResponse } from '../services/openai'

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

  if (firstMessage) {
    const userMessage = {
      id: store.nextMessageId++,
      role: 'user',
      content: firstMessage,
      timestamp: new Date().toISOString()
    }
    conversation.messages.push(userMessage)
    generateAIResponse(conversation.id)
  }

  return conversation
}

function generateConversationTitle(message) {
  if (!message) return 'New Conversation'
  const title = message.trim().substring(0, 40)
  return title.length < message.trim().length ? title + '...' : title
}

// Send a message in the current conversation
export function sendMessage(content) {
  if (!store.currentConversationId) {
    createConversation(content)
    return
  }

  const conversation = store.conversations.find(c => c.id === store.currentConversationId)
  if (!conversation) return

  const userMessage = {
    id: store.nextMessageId++,
    role: 'user',
    content: content.trim(),
    timestamp: new Date().toISOString()
  }
  conversation.messages.push(userMessage)
  generateAIResponse(store.currentConversationId)
}

// Generate AI response with streaming
async function generateAIResponse(conversationId) {
  const conversation = store.conversations.find(c => c.id === conversationId)
  if (!conversation) return

  // Create empty AI message
  const aiMessage = {
    id: store.nextMessageId++,
    role: 'assistant',
    content: '',
    timestamp: new Date().toISOString()
  }
  conversation.messages.push(aiMessage)
  store.isTyping = true

  try {
    const messageHistory = conversation.messages.slice(0, -1)

    await streamChatResponse(
      messageHistory,
      (chunk, fullResponse) => {
        if (store.isTyping) store.isTyping = false
        aiMessage.content = fullResponse
      }
    )
  } catch (error) {
    console.error('Failed to get AI response:', error)
    aiMessage.content = `**SYSTEM ERROR:** ${error.message}\n\nRed Queen AI systems are experiencing difficulties. Please try again.`
  } finally {
    store.isTyping = false
  }
}

// Regenerate the last AI response
export function regenerateLastResponse() {
  const conversation = currentConversation.value
  if (!conversation || conversation.messages.length < 2) return

  const lastMessageIndex = conversation.messages.length - 1
  const lastMessage = conversation.messages[lastMessageIndex]

  if (lastMessage.role !== 'assistant') return

  conversation.messages.splice(lastMessageIndex, 1)
  generateAIResponse(store.currentConversationId)
}

// Delete a conversation
export function deleteConversation(id) {
  const index = store.conversations.findIndex(c => c.id === id)
  if (index === -1) return

  store.conversations.splice(index, 1)

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
```

## Production Considerations

### ⚠️ Security Issue

The current setup uses `dangerouslyAllowBrowser: true` which exposes your API key in the frontend. **Do not use this in production!**

### Production Solution: Backend Proxy

Create a simple backend:

```javascript
// backend/server.js
import express from 'express'
import cors from 'cors'
import OpenAI from 'openai'

const app = express()
app.use(cors({ origin: process.env.FRONTEND_URL }))
app.use(express.json())

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Secure!
})

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      stream: true
    })

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || ''
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`)
      }
    }

    res.write('data: [DONE]\n\n')
    res.end()
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.listen(3000)
```

Update frontend service to call your backend:

```javascript
// src/services/openai.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export async function streamChatResponse(messages, onChunk) {
  const response = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages })
  })

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let fullResponse = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value)
    const lines = chunk.split('\n')

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6)
        if (data === '[DONE]') break

        try {
          const { content } = JSON.parse(data)
          fullResponse += content
          onChunk(content, fullResponse)
        } catch (e) {
          // Skip invalid JSON
        }
      }
    }
  }

  return fullResponse
}
```

Now your API key stays on the server! 🔒

## Alternative: Serverless Function (Vercel)

```javascript
// api/chat.js
import OpenAI from 'openai'

export const config = {
  runtime: 'edge'
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export default async function handler(req) {
  const { messages } = await req.json()

  const stream = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: messages,
    stream: true
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || ''
        if (content) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
        }
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      controller.close()
    }
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache'
    }
  })
}
```

Deploy to Vercel and update `VITE_API_URL` to your Vercel domain!

---

That's it! You now have a fully functional AI chat interface with the Red Queen personality. 🔴👑
