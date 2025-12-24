<template>
  <div>
    <div style="padding-top: 100px">
      <section class="section">
        <h1 class="section-title">Subscriu-te</h1>
        <p
          style="
            text-align: center;
            font-size: 1.2rem;
            color: var(--text-secondary);
            margin-bottom: 2rem;
          "
        >
          Subscriu-te al meu butlletí per rebre les últimes novetats, tutorials
          i ofertes especials directament al teu correu electrònic.
        </p>
      </section>

      <form class="subscribe-form" @submit.prevent="subscribe('page')">
        <input
          v-model="email"
          type="email"
          required
          placeholder="Introdueix el teu correu electrònic"
        >
        <input
          v-model="honeypot"
          type="text"
          tabindex="-1"
          autocomplete="off"
          class="hp-field"
        >

        <button :disabled="isSubmitting">
          {{ isSubmitting ? "Enviant..." : "Subscriu-te" }}
        </button>
      </form>

      <p
        v-if="submitMessage"
        :style="{
          textAlign: 'center',
          marginTop: '1rem',
          color: submitSuccess ? '#4ade80' : '#ef4444',
        }"
      >
        {{ submitMessage }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { useNewsletter } from "~/composables/useNewsletter";

const { email, isSubmitting, submitMessage, submitSuccess, subscribe } =
  useNewsletter();
</script>

<style scoped>
.subscribe-form {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}
.subscribe-form input {
  padding: 0.8rem 1.2rem;
  font-size: 1rem;
  border: 1px solid var(--text-secondary);
  border-radius: 5px;
  width: 300px;
  background: var(--secondary);
  color: var(--text);
}
.subscribe-form button {
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  background: var(--accent);
  color: var(--text);
  cursor: pointer;
}
.subscribe-form button:hover {
  background: darken(var(--accent), 10%);
}

.hp-field {
  position: absolute;
  left: -9999px;
  opacity: 0;
  pointer-events: none;
}
</style>
