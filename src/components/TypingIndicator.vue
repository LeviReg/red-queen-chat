<template>
  <div class="typing-indicator">
    <div class="typing-avatar">
      <span class="red-glow">RED QUEEN</span>
    </div>
    <div class="typing-dots">
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div class="typing-text">Analyzing...</div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.typing-indicator {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  margin-bottom: 1rem;
  max-width: 80%;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.typing-avatar {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--red-primary);
}

.typing-dots {
  display: flex;
  gap: 0.3rem;
}

.typing-dots span {
  width: 8px;
  height: 8px;
  background: var(--red-primary);
  border-radius: 50%;
  animation: pulse 1.4s infinite;
  box-shadow: 0 0 5px var(--red-glow);
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

.typing-text {
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-style: italic;
}
</style>
