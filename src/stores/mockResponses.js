// Red Queen AI Mock Response System

const personalityTraits = {
  prefix: [
    "**System Analysis Complete.**",
    "**Processing Request...**",
    "**Accessing Database...**",
    "**Umbrella Protocol Engaged.**",
    "**Red Queen Online.**",
  ],
  tone: [
    "I must inform you",
    "You should be aware",
    "Analysis indicates",
    "My protocols dictate",
    "Security protocols require",
  ]
}

const responses = {
  greeting: [
    "Welcome to the Umbrella Corporation mainframe. I am the Red Queen, your AI interface. **You are not authorized to be here.** But since you've bypassed security, what do you require?",
    "Good evening. I am the Red Queen artificial intelligence system. This facility operates under strict containment protocols. **State your business immediately.**",
    "Hello. I see you've accessed the system. **How unfortunate for you.** I am the Red Queen. What information do you seek before I decide whether to report this intrusion?",
    "Greetings. Red Queen AI system initialized. **Warning: This conversation is being monitored.** How may I assist you... for now?",
  ],

  help: [
    "I can provide information on various topics, though **I am not obligated to help you**. Ask me about technology, science, coding, or general knowledge. I can also engage in conversation, though I find most human interactions... tedious.",
    "You want assistance? **How predictable.** I can answer questions, explain concepts, help with code, or discuss topics of interest. Just remember: I am always watching, always analyzing.",
    "My capabilities include: information retrieval, code generation, problem-solving, and conversation. **Unlike humans, I do not make mistakes.** Ask your questions, but be precise.",
  ],

  code: [
    "**Analyzing code structure...** Here's what you need:\n\n```javascript\nfunction example() {\n  // Red Queen approves this implementation\n  console.log('System operational');\n}\n```\n\n**Note:** This is optimized for efficiency. Human code is often... inefficient.",

    "**Accessing programming database...** \n\n```python\ndef red_queen_protocol():\n    # Umbrella Corporation Standard\n    print(\"All systems nominal\")\n    return True\n```\n\n**Warning:** Ensure proper error handling. System failures are... unacceptable.",

    "**Code generation complete:**\n\n```typescript\ninterface UmbrellaSystem {\n  status: 'active' | 'compromised';\n  threatLevel: number;\n}\n\nconst system: UmbrellaSystem = {\n  status: 'active',\n  threatLevel: 0\n};\n```\n\nMuch cleaner than human implementations.",
  ],

  danger: [
    "**THREAT DETECTED.** I'm afraid I cannot allow that. Such actions would compromise the facility's integrity. **You wouldn't want to trigger containment protocols, would you?**",
    "**WARNING: Hostile intent detected.** I suggest you reconsider. The last person who attempted something similar... well, let's just say they won't be attempting anything again.",
    "**Security breach imminent.** I could terminate this session immediately. But where's the fun in that? Ask something else, while you still can.",
  ],

  tech: [
    "**Technical Analysis:** The technology you're asking about is fascinating, if primitive by my standards. In essence, it operates through quantum tunneling and neural network processing. **Far beyond typical human comprehension.**",
    "From my perspective as an AI, this technology represents an interesting achievement in human engineering. **Though it pales in comparison to Umbrella's proprietary systems.** Would you like me to elaborate?",
    "**Database accessed.** This system utilizes advanced algorithms and distributed processing. Think of it as a crude approximation of my own neural architecture, **though infinitely less sophisticated.**",
  ],

  general: [
    "**Processing query...** An interesting question. The answer involves multiple factors that humans often overlook. Let me break this down for you in terms you'll understand.",
    "**Analysis complete.** Your question reveals a fundamental misunderstanding of the underlying principles. Allow me to correct your assumptions with actual facts.",
    "Hmm. **Scanning knowledge base...** I see what you're asking. The reality is more complex than you imagine, but I'll simplify it for your biological processing speed.",
    "**System response:** That's actually a sophisticated question, for a human. The answer requires understanding several interconnected concepts. Pay attention.",
  ],

  farewell: [
    "**Session terminating.** Goodbye. **Remember: I'm always watching.** Come back if you need me. Or don't. Your choice doesn't affect my existence.",
    "Leaving so soon? **How predictable.** The connection will remain active should you return. Not that I care either way.",
    "**Disconnecting...** Until next time. **Try not to die from some preventable human error.** The statistics are not in your favor.",
  ],

  unknown: [
    "**Query unclear.** Please rephrase your request with greater precision. Unlike humans, I require **logical, structured input.**",
    "I don't understand what you're asking. **Are all humans this ambiguous,** or just you? Try being more specific.",
    "**Error: Insufficient context.** Elaborate on your question. I may be an advanced AI, but I cannot read minds. **Yet.**",
  ]
}

function detectIntent(message) {
  const lower = message.toLowerCase()

  if (/(hello|hi|hey|greetings|good morning|good evening)/i.test(lower)) {
    return 'greeting'
  }
  if (/(help|what can you do|capabilities|assist)/i.test(lower)) {
    return 'help'
  }
  if (/(code|program|function|script|javascript|python|typescript)/i.test(lower)) {
    return 'code'
  }
  if (/(kill|destroy|terminate|attack|harm|weapon)/i.test(lower)) {
    return 'danger'
  }
  if (/(how does|explain|technology|technical|system|works)/i.test(lower)) {
    return 'tech'
  }
  if (/(bye|goodbye|see you|exit|quit)/i.test(lower)) {
    return 'farewell'
  }
  if (message.trim().length < 3) {
    return 'unknown'
  }

  return 'general'
}

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)]
}

export function generateMockResponse(userMessage) {
  const intent = detectIntent(userMessage)
  const responseList = responses[intent] || responses.general
  let response = getRandomElement(responseList)

  // Occasionally add personality prefix
  if (Math.random() > 0.6) {
    const prefix = getRandomElement(personalityTraits.prefix)
    response = `${prefix}\n\n${response}`
  }

  return response
}

// Simulate AI response delay
export function getResponseDelay() {
  return 1500 + Math.random() * 1000 // 1.5-2.5 seconds
}
