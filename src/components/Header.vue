<template>
  <header class="header">
    <div class="header-content">
      <div class="logo">
        <span class="logo-icon red-glow">◆</span>
        <h1 class="logo-text red-glow">RED QUEEN</h1>
      </div>
      <div class="tagline">Umbrella Corporation AI Interface</div>
    </div>
  </header>
</template>

<script setup>
</script>

<style scoped>
.header {
  background: var(--bg-primary);
  border-bottom: 2px solid var(--red-primary);
  box-shadow: 0 2px 20px rgba(255, 0, 0, 0.3);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  max-width: 100%;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  font-size: 1.5rem;
  color: var(--red-primary);
}

.logo-text {
  font-size: 1.5rem;
  font-family: var(--font-mono);
  letter-spacing: 0.2em;
  color: var(--red-primary);
  margin: 0;
}

.tagline {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-family: var(--font-mono);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
  }

  .logo-text {
    font-size: 1.2rem;
  }

  .tagline {
    font-size: 0.65rem;
  }
}
</style>
