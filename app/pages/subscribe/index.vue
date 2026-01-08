<template>
  <div class="page-wrapper">
    <section class="section">
      <h1 class="section-title heading-accent">{{ t("subscribe.title") }}</h1>

      <p class="section-subtitle">
        {{ t("subscribe.subtitle") }}
      </p>

      <form class="subscribe-form" @submit.prevent="subscribe">
        <input
          v-model="email"
          type="email"
          required
          :placeholder="t('subscribe.placeholderEmail')"
          class="subscribe-input"
        >

        <input
          v-model="honeypot"
          type="text"
          tabindex="-1"
          autocomplete="off"
          class="hp-field"
        >

        <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
          {{ isSubmitting ? t("subscribe.sending") : t("subscribe.cta") }}
        </button>
      </form>

      <p
        v-if="submitMessage"
        class="submit-message"
        :class="submitSuccess ? 'success' : 'error'"
      >
        {{ submitMessage }}
      </p>
    </section>
  </div>
</template>

<script setup>
import { useI18n } from "#i18n";
import { useNewsletter } from "~/composables/useNewsletter";

const { t } = useI18n();

const {
  email,
  honeypot,
  isSubmitting,
  message: submitMessage,
  success: submitSuccess,
  subscribe,
} = useNewsletter();
</script>

<style scoped>
.section {
  text-align: center;
}

/* Form */
.subscribe-form {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.subscribe-input {
  padding: 0.85rem 1.2rem;
  font-size: 1rem;
  border-radius: 10px;
  width: 320px;
  background: var(--secondary);
  color: var(--text);
  border: 1px solid var(--border);
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
}

.subscribe-input::placeholder {
  color: var(--text-secondary);
}

.subscribe-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(208, 138, 63, 0.18);
}

/* Result message */
.submit-message {
  text-align: center;
  margin-top: 1.25rem;
  font-size: 0.95rem;
}

.submit-message.success {
  color: #4ade80;
}

.submit-message.error {
  color: #ef4444;
}

/* Honeypot */
.hp-field {
  position: absolute;
  left: -9999px;
  opacity: 0;
  pointer-events: none;
}
</style>
