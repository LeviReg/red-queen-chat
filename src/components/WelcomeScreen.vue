<template>
  <div class="welcome-screen">
    <div class="welcome-content">
      <div class="logo">
        <h1 class="red-glow">RED QUEEN</h1>
        <div class="subtitle">Umbrella Corporation AI System</div>
      </div>
      <div class="divider"></div>
      <div class="instructions">
        <p class="terminal-text">// SYSTEM STATUS: ONLINE</p>
        <p class="terminal-text">// SECURITY LEVEL: MAXIMUM</p>
        <p class="terminal-text">// PROTOCOL: ACTIVE</p>
        <p class="info-text">Start a new conversation to begin.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.welcome-screen {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: var(--bg-primary);
}

.welcome-content {
  text-align: center;
  max-width: 600px;
}

.logo h1 {
  font-size: 4rem;
  font-family: var(--font-mono);
  letter-spacing: 0.2em;
  margin-bottom: 0.5rem;
  color: var(--red-primary);
}

.subtitle {
  font-size: 1rem;
  color: var(--text-secondary);
  font-family: var(--font-mono);
  letter-spacing: 0.1em;
  margin-bottom: 2rem;
}

.divider {
  height: 2px;
  background: linear-gradient(
    to right,
    transparent,
    var(--red-glow),
    transparent
  );
  margin: 2rem 0;
  box-shadow: 0 0 10px var(--red-glow);
}

.instructions {
  margin-top: 2rem;
}

.terminal-text {
  font-family: var(--font-mono);
  color: var(--red-bright);
  font-size: 0.9rem;
  margin: 0.5rem 0;
  text-align: left;
  opacity: 0.8;
}

.info-text {
  color: var(--text-secondary);
  margin-top: 1.5rem;
  font-size: 1.1rem;
}

@keyframes flicker {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.logo h1 {
  animation: flicker 3s infinite;
}
</style>
