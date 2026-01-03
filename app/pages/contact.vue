<template>
  <div class="page-wrapper">
    <section class="section">
      <h1 class="section-title heading-accent">Contacta amb mi</h1>

      <p class="section-subtitle">
        Explica’m el teu projecte i et respondré amb una proposta personalitzada
      </p>

      <div class="contact-container">
        <!-- FORM -->
        <form class="contact-form" @submit.prevent="submitForm">
          <div class="form-group">
            <label for="name">Nom complet *</label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              required
              placeholder="El teu nom"
            >
          </div>

          <div class="form-group">
            <label for="email">Email *</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              placeholder="email@exemple.com"
            >
          </div>

          <div class="form-group">
            <label for="phone">Telèfon</label>
            <input
              id="phone"
              v-model="formData.phone"
              type="tel"
              placeholder="+34 600 000 000"
            >
          </div>

          <input
            v-model="honeypot"
            type="text"
            tabindex="-1"
            autocomplete="off"
            class="hp-field"
          >

          <div class="form-group">
            <label for="service">Servei d’interès *</label>
            <select id="service" v-model="formData.service" required>
              <option value="">Selecciona un servei</option>
              <option value="mescla">Mescla</option>
              <option value="gravacio">Gravació</option>
              <option value="produccio">Producció</option>
              <option value="edicio">Edició</option>
              <option value="altre">Altres</option>
            </select>
          </div>

          <div class="form-group">
            <label for="message">Missatge *</label>
            <textarea
              id="message"
              v-model="formData.message"
              required
              placeholder="Explica el teu projecte, objectius, terminis, etc."
            />
          </div>

          <button
            type="submit"
            class="btn btn-primary submit-btn"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? "Enviant..." : "Enviar missatge" }}
          </button>

          <p
            v-if="submitMessage"
            class="submit-message"
            :class="submitSuccess ? 'success' : 'error'"
          >
            {{ submitMessage }}
          </p>
        </form>

        <!-- CONTACT CARDS -->
        <div class="contact-cards">
          <a href="mailto:info@guillemvila.com" class="contact-card">
            <div class="card-icon">📧</div>
            <h3>Email</h3>
            <p>info@guillemvila.com</p>
          </a>

          <a href="tel:+34682463081" class="contact-card">
            <div class="card-icon">📱</div>
            <h3>Telèfon</h3>
            <p>+34 682 463 081</p>
          </a>

          <a
            href="https://www.google.com/maps/place/Riells+i+Viabrea,+El+Baix+Montseny"
            target="_blank"
            class="contact-card"
          >
            <div class="card-icon">📍</div>
            <h3>Ubicació</h3>
            <p>Riells i Viabrea, el Baix Montseny</p>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useContactForm } from "~/composables/useContactForm";

const {
  formData,
  isSubmitting,
  submitMessage,
  submitSuccess,
  submitForm,
  honeypot,
} = useContactForm();

useHead({
  title: "Contacte | Guillem Vila · Productor musical i enginyer de so",
  meta: [
    {
      name: "description",
      content:
        "Contacta amb mi per projectes de producció musical, mescla, gravació o col·laboracions creatives.",
    },
  ],
});
</script>

<style scoped>
.page-wrapper {
  padding-top: 100px;
}

.section {
  text-align: center;
}

.contact-container {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

/* FORM */
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 1rem;
  background: var(--secondary);
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--text);
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(208, 138, 63, 0.18);
}

textarea {
  min-height: 140px;
  resize: vertical;
}

.submit-btn {
  margin-top: 1rem;
}

.submit-message {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.95rem;
}

.submit-message.success {
  color: #4ade80;
}

.submit-message.error {
  color: #ef4444;
}

/* CONTACT CARDS */
.contact-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 2rem;
}

.contact-card {
  background: var(--surface);
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  border: 1px solid var(--border);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.contact-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-1);
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.contact-card h3 {
  margin-bottom: 0.5rem;
}

.contact-card p {
  color: var(--text-secondary);
}

/* Honeypot */
.hp-field {
  position: absolute;
  left: -9999px;
  opacity: 0;
  pointer-events: none;
}
</style>
