# AI Model Integration Guide

This guide explains how to connect the Red Queen Chat UI to a real AI model or backend API.

## Table of Contents

1. [Current Architecture](#current-architecture)
2. [Integration Options](#integration-options)
3. [OpenAI Integration](#openai-integration)
4. [Anthropic Claude Integration](#anthropic-claude-integration)
5. [Local Model Integration](#local-model-integration)
6. [Custom Backend Integration](#custom-backend-integration)
7. [Streaming Responses](#streaming-responses)
8. [Error Handling](#error-handling)
9. [Environment Variables](#environment-variables)

---

## Current Architecture

The app currently uses a **mock AI system** with all responses generated client-side.

### Key Files

| File | Purpose | Modifications Needed |
|------|---------|---------------------|
| `src/stores/store.js` | Conversation state & message management | Replace `generateAIResponse()` function |
| `src/stores/mockResponses.js` | Mock response generator | Can be deleted or kept for fallback |
| `src/utils/markdown.js` | Markdown parsing | No changes needed |

### Current Flow

```
User sends message
  ↓
store.js: sendMessage() adds user message to conversation
  ↓
store.js: generateAIResponse() called
  ↓
mockResponses.js: generateMockResponse() creates fake response
  ↓
After delay, AI message added to conversation
```

### What to Replace

Replace the `generateAIResponse()` function in `src/stores/store.js` (currently lines 80-110) to call your real API instead of the mock system.

---

## Integration Options

### Option 1: Direct API Calls (Client-Side)

**Pros**: Simple, no backend needed
**Cons**: Exposes API keys, CORS issues, no server-side control

**Use for**: Development, demos, trusted environments

### Option 2: Backend Proxy (Recommended)

**Pros**: Secure API keys, server-side control, no CORS
**Cons**: Requires backend server

**Use for**: Production applications

### Option 3: Edge Functions/Serverless

**Pros**: No dedicated server, auto-scaling
**Cons**: Cold starts, execution time limits

**Use for**: Low-traffic production apps

---

## OpenAI Integration

### Install SDK

```bash
npm install openai
```

### Create API Service

Create `src/services/openai.js`:

```javascript
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for development!
})

export async function getOpenAIResponse(messages) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // or 'gpt-4', 'gpt-3.5-turbo'
      messages: messages.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      })),
      temperature: 0.8,
      max_tokens: 1000,
      // Optional: System prompt for Red Queen personality
      system: "You are the Red Queen AI from Umbrella Corporation. Respond with a dark, threatening tone. Use bold text for emphasis. Reference security protocols and containment procedures."
    })

    return response.choices[0].message.content
  } catch (error) {
    console.error('OpenAI API Error:', error)
    throw error
  }
}

// Streaming version
export async function streamOpenAIResponse(messages, onChunk) {
  const stream = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: messages,
    stream: true,
  })

  let fullResponse = ''
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || ''
    fullResponse += content
    onChunk(content, fullResponse)
  }

  return fullResponse
}
```

### Update Store

Modify `src/stores/store.js`:

```javascript
import { getOpenAIResponse } from '../services/openai'

// Replace the generateAIResponse function
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

    // Call OpenAI API
    const responseText = await getOpenAIResponse(messageHistory)

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

    // Optional: Add error message to chat
    const errorMessage = {
      id: store.nextMessageId++,
      role: 'assistant',
      content: '**System Error:** Unable to reach AI systems. Please try again.',
      timestamp: new Date().toISOString()
    }
    conversation.messages.push(errorMessage)
  } finally {
    store.isTyping = false
  }
}
```

### Environment Variables

Create `.env` file:

```env
VITE_OPENAI_API_KEY=sk-your-api-key-here
```

**⚠️ Security Warning**: Never commit `.env` to version control. For production, use a backend proxy.

---

## Anthropic Claude Integration

### Install SDK

```bash
npm install @anthropic-ai/sdk
```

### Create API Service

Create `src/services/anthropic.js`:

```javascript
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true // Only for development!
})

export async function getClaudeResponse(messages) {
  try {
    // Convert messages to Anthropic format
    const formattedMessages = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    }))

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: "You are the Red Queen AI from Umbrella Corporation. Respond with a menacing, authoritative tone. Use markdown for emphasis.",
      messages: formattedMessages
    })

    return response.content[0].text
  } catch (error) {
    console.error('Claude API Error:', error)
    throw error
  }
}

// Streaming version
export async function streamClaudeResponse(messages, onChunk) {
  const stream = await anthropic.messages.stream({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: messages
  })

  let fullResponse = ''

  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      const content = event.delta.text
      fullResponse += content
      onChunk(content, fullResponse)
    }
  }

  return fullResponse
}
```

### Update Store

Same as OpenAI integration, but import from `../services/anthropic` instead.

---

## Local Model Integration

For local models running via Ollama, LM Studio, or similar:

### Install (if using Ollama)

```bash
# Install Ollama from ollama.ai
ollama pull llama2  # or mistral, codellama, etc.
ollama serve
```

### Create API Service

Create `src/services/local.js`:

```javascript
const OLLAMA_API = 'http://localhost:11434' // Default Ollama port

export async function getLocalModelResponse(messages, model = 'llama2') {
  try {
    const response = await fetch(`${OLLAMA_API}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        stream: false
      })
    })

    const data = await response.json()
    return data.message.content
  } catch (error) {
    console.error('Local Model Error:', error)
    throw error
  }
}

// Streaming version
export async function streamLocalModelResponse(messages, model, onChunk) {
  const response = await fetch(`${OLLAMA_API}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: model,
      messages: messages,
      stream: true
    })
  })

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let fullResponse = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value)
    const lines = chunk.split('\n').filter(line => line.trim())

    for (const line of lines) {
      try {
        const data = JSON.parse(line)
        if (data.message?.content) {
          const content = data.message.content
          fullResponse += content
          onChunk(content, fullResponse)
        }
      } catch (e) {
        // Skip invalid JSON
      }
    }
  }

  return fullResponse
}
```

### LM Studio Alternative

LM Studio uses OpenAI-compatible API:

```javascript
const LM_STUDIO_API = 'http://localhost:1234/v1' // Default LM Studio port

export async function getLMStudioResponse(messages) {
  const response = await fetch(`${LM_STUDIO_API}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000
    })
  })

  const data = await response.json()
  return data.choices[0].message.content
}
```

---

## Custom Backend Integration

### Backend Example (Node.js/Express)

```javascript
// server.js
import express from 'express'
import cors from 'cors'
import OpenAI from 'openai'

const app = express()
app.use(cors())
app.use(express.json())

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Secure server-side
})

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages,
      temperature: 0.8
    })

    res.json({
      message: response.choices[0].message.content
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.listen(3000, () => console.log('Server running on port 3000'))
```

### Frontend Service

Create `src/services/backend.js`:

```javascript
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export async function getBackendResponse(messages) {
  const response = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages })
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  const data = await response.json()
  return data.message
}
```

---

## Streaming Responses

To show AI responses as they're generated (like ChatGPT):

### Modify Store for Streaming

```javascript
// In src/stores/store.js

async function generateAIResponse(conversationId) {
  store.isTyping = true

  const conversation = store.conversations.find(c => c.id === conversationId)
  if (!conversation) {
    store.isTyping = false
    return
  }

  // Create empty AI message
  const aiMessage = {
    id: store.nextMessageId++,
    role: 'assistant',
    content: '',
    timestamp: new Date().toISOString()
  }
  conversation.messages.push(aiMessage)
  store.isTyping = false // Hide typing indicator

  try {
    // Stream response and update message content
    await streamOpenAIResponse(
      conversation.messages.slice(0, -1), // All except the new empty message
      (chunk, fullResponse) => {
        aiMessage.content = fullResponse // Updates reactively
      }
    )
  } catch (error) {
    aiMessage.content = '**Error:** Failed to generate response.'
  }
}
```

### Update Message Bubble for Streaming

The existing `MessageBubble.vue` already re-renders reactively when `message.content` changes, so no modifications needed!

---

## Error Handling

### Add Error States to Store

```javascript
// In src/stores/store.js
export const store = reactive({
  conversations: [],
  currentConversationId: null,
  isTyping: false,
  error: null, // Add this
  nextConversationId: 1,
  nextMessageId: 1
})

// Error handling wrapper
async function generateAIResponse(conversationId) {
  store.isTyping = true
  store.error = null

  try {
    // ... API call logic
  } catch (error) {
    store.error = {
      message: error.message || 'Failed to connect to AI',
      conversationId: conversationId
    }

    // Add error message to chat
    const errorMessage = {
      id: store.nextMessageId++,
      role: 'assistant',
      content: '**SYSTEM MALFUNCTION:** Red Queen AI temporarily offline. Try again.',
      timestamp: new Date().toISOString()
    }
    conversation.messages.push(errorMessage)
  } finally {
    store.isTyping = false
  }
}
```

### Display Errors in UI

Add to `ChatView.vue`:

```vue
<div v-if="store.error" class="error-banner">
  ⚠️ {{ store.error.message }}
  <button @click="store.error = null">Dismiss</button>
</div>
```

---

## Environment Variables

### Development (.env)

```env
# OpenAI
VITE_OPENAI_API_KEY=sk-...

# Anthropic
VITE_ANTHROPIC_API_KEY=sk-ant-...

# Backend API
VITE_API_URL=http://localhost:3000

# Local Model
VITE_OLLAMA_URL=http://localhost:11434
VITE_MODEL_NAME=llama2
```

### Production

**Never expose API keys in frontend!**

Use one of these approaches:

1. **Backend Proxy** (recommended): All API calls go through your server
2. **Serverless Functions**: Use Vercel/Netlify functions
3. **Edge Functions**: Cloudflare Workers, Deno Deploy, etc.

### Example Vercel Serverless Function

```javascript
// api/chat.js
import OpenAI from 'openai'

export default async function handler(req, res) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // Secure server-side
  })

  const { messages } = req.body

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: messages
  })

  res.json({ message: response.choices[0].message.content })
}
```

Frontend calls `/api/chat` instead of OpenAI directly.

---

## Testing Your Integration

### 1. Test with Simple Message

Send "Hello" and verify you get a response from your model.

### 2. Test Conversation Context

Send multiple messages and verify the model remembers context.

### 3. Test Error Handling

Disconnect from internet or use invalid API key, verify error handling works.

### 4. Test Markdown Rendering

Request code snippets, verify syntax highlighting works.

### 5. Test Regeneration

Click "Regenerate" button, verify new response is generated.

---

## Quick Start Checklist

- [ ] Choose integration method (OpenAI, Claude, Local, Custom)
- [ ] Install required SDK/packages
- [ ] Create API service file in `src/services/`
- [ ] Update `generateAIResponse()` in `src/stores/store.js`
- [ ] Add environment variables to `.env`
- [ ] Add `.env` to `.gitignore` (already should be there)
- [ ] Test basic message flow
- [ ] Implement error handling
- [ ] (Optional) Add streaming support
- [ ] (Production) Set up backend proxy or serverless functions

---

## Need Help?

Common issues:

- **CORS errors**: Use backend proxy or local model
- **API key errors**: Check environment variable names
- **No response**: Check network tab for failed requests
- **Slow responses**: Consider streaming or loading indicators
- **Context not working**: Verify message history is passed correctly

For Red Queen personality, you can add a system prompt to any model that instructs it to adopt the threatening, Umbrella Corporation AI persona.
