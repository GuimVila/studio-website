<template>
  <div v-if="consent === null" class="cookie-banner">
    <p class="cookie-text">
      Utilitzem cookies per millorar l’experiència i analitzar l’ús del lloc web.
    </p>

    <div class="cookie-actions">
      <button class="btn-reject" @click="reject">
        Rebutjar
      </button>
      <button class="btn-accept" @click="accept">
        Acceptar
      </button>
    </div>
  </div>
</template>

<script setup>
import { useCookieConsent } from "~/composables/useCookieConsent";

const { consent, accept, reject } = useCookieConsent();
</script>

<style scoped>
.cookie-banner {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  max-width: 900px;
  width: calc(100% - 3rem);
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  z-index: 9999;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
}

.cookie-text {
  color: #b0b0b0;
  font-size: 0.95rem;
  line-height: 1.4;
  margin: 0;
}

.cookie-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-reject {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #b0b0b0;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-reject:hover {
  color: white;
  border-color: white;
}

.btn-accept {
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c61 100%);
  border: none;
  color: white;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-accept:hover {
  box-shadow: 0 6px 20px rgba(255, 107, 53, 0.5);
}

@media (max-width: 640px) {
  .cookie-banner {
    flex-direction: column;
    text-align: center;
  }
}
</style>
