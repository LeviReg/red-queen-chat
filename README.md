# Red Queen AI Chat Application

A Vue 3 chat interface inspired by the Resident Evil series' Red Queen AI, featuring a dark Umbrella Corporation aesthetic with red accents and terminal-style visuals.

## Features

- **Multi-Conversation Support**: Create, manage, and switch between multiple chat sessions
- **Real-Time Chat Interface**: ChatGPT-style message flow with user and AI messages
- **Markdown Rendering**: Full markdown support with syntax-highlighted code blocks
- **Regenerate Responses**: Get alternative AI responses with one click
- **Red Queen Theme**: Dark, tech-horror aesthetic with glowing red effects
- **Responsive Design**: Works on desktop and mobile devices
- **Mock AI System**: Currently uses frontend-only mock responses (ready for backend integration)

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will run at http://localhost:5173 (or next available port).

## Project Structure

```
red-queen-chat/
├── src/
│   ├── main.js              # App entry point
│   ├── App.vue              # Root component
│   ├── style.css            # Global Red Queen theme styles
│   ├── router/
│   │   └── index.js         # Vue Router configuration
│   ├── stores/
│   │   ├── store.js         # Reactive store (conversation & message management)
│   │   └── mockResponses.js # Mock AI response generator
│   ├── utils/
│   │   └── markdown.js      # Markdown parsing with syntax highlighting
│   ├── components/
│   │   ├── Header.vue       # Top branding bar
│   │   ├── Sidebar.vue      # Conversation list
│   │   ├── ConversationItem.vue
│   │   ├── ChatView.vue     # Main chat area
│   │   ├── MessageBubble.vue
│   │   ├── InputBar.vue     # Message input with send/regenerate
│   │   ├── WelcomeScreen.vue
│   │   └── TypingIndicator.vue
│   └── views/
│       └── Chat.vue         # Main chat page
├── package.json
├── vite.config.js
├── index.html
├── README.md
└── INTEGRATION.md           # Guide for connecting real AI models
```

## Architecture

### State Management

Uses Vue 3's `reactive()` API for state management (no Vuex/Pinia):

- **stores/store.js**: Central reactive store with conversation management
- **stores/mockResponses.js**: Mock AI personality and response generation

### Key Store Methods

```javascript
import { store, createConversation, sendMessage, regenerateLastResponse } from './stores/store'

createConversation(firstMessage)    // Create new chat
sendMessage(content)                 // Send user message
regenerateLastResponse()             // Regenerate last AI response
deleteConversation(id)               // Delete a conversation
selectConversation(id)               // Switch active conversation
```

### Component Patterns

All components use:
- `<script setup>` syntax (Vue 3 Composition API)
- `<style scoped>` for component-specific styles
- Relative imports (no path aliases)

## Integrating a Real AI Model

**See [INTEGRATION.md](./INTEGRATION.md)** for detailed instructions on connecting this UI to:

- OpenAI API (GPT-3.5, GPT-4, etc.)
- Anthropic Claude API
- Local models (Ollama, LM Studio, etc.)
- Custom backend APIs
- Streaming responses

The current mock system is designed to be easily replaced with real API calls.

## Customization

### Changing the Theme

Edit CSS variables in `src/style.css`:

```css
:root {
  --bg-primary: #0a0a0a;
  --red-primary: #ff0000;
  --text-primary: #e0e0e0;
  /* ... more variables */
}
```

### Modifying AI Personality

Edit `src/stores/mockResponses.js` to change:
- Response templates
- Intent detection
- Personality traits
- Response delay timing

### Adding Features

Common extensions:
- User authentication (add auth store and API calls)
- Conversation persistence (localStorage or database)
- Export conversations (add download functionality)
- Image uploads (extend message model and upload handler)
- Voice input (Web Speech API integration)

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **Vue Router 4** - Official routing library
- **Vite 6** - Next-generation frontend build tool
- **marked** - Markdown parser
- **highlight.js** - Syntax highlighting for code blocks

## Browser Support

Modern browsers with ES6+ support:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Development

```bash
# Run dev server with hot reload
npm run dev

# Build for production (outputs to dist/)
npm run build

# Preview production build locally
npm run preview
```

## License

MIT

## Credits

Inspired by the Red Queen AI from Capcom's Resident Evil series.
