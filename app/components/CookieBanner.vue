<template>
  <div v-if="isUnset" class="cookie-banner">
    <p class="cookie-text">
      Utilitzem cookies per millorar l’experiència i analitzar l’ús del lloc
      web.
    </p>

    <div class="cookie-actions">
      <button class="btn-reject" @click="reject">Rebutjar</button>
      <button class="btn-accept" @click="accept">Acceptar</button>
    </div>
  </div>
</template>

<script setup>
import { useCookieConsent } from "~/composables/useCookieConsent";

const { isUnset, accept, reject } = useCookieConsent();
</script>

<style scoped>
.cookie-banner {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  max-width: 900px;
  width: calc(100% - 3rem);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  z-index: 9999;
  box-shadow: var(--shadow-2);
}

.cookie-text {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.4;
  margin: 0;
}

.cookie-actions {
  display: flex;
  gap: 0.75rem;
}

/* Reject */
.btn-reject {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-reject:hover {
  color: var(--text);
  border-color: var(--border-strong);
}

/* Accept */
.btn-accept {
  background: linear-gradient(90deg, var(--accent-dark), var(--accent));
  border: none;
  color: #fff;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-accept:hover {
  box-shadow: var(--accent-shadow-1);
}

@media (max-width: 640px) {
  .cookie-banner {
    flex-direction: column;
    text-align: center;
  }
}
</style>
