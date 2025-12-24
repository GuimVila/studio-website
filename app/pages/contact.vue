<template>
  <div class="page-padding">
    <section class="section">
      <h1 class="section-title">Contacta amb nosaltres</h1>
      <p class="section-intro">
        Explica'ns el teu projecte i t'enviarem un pressupost personalitzat
      </p>

      <div class="contact-container">
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
            <label for="service">Servei d'interès *</label>
            <select id="service" v-model="formData.service" required>
              <option value="">Selecciona un servei</option>
              <option value="mescla">Mescla</option>
              <option value="gravacio">Gravació</option>
              <option value="produccio">Producció</option>
              <option value="formacio">Edició</option>
              <option value="altre">Altres</option>
            </select>
          </div>

          <div class="form-group">
            <label for="message">Missatge *</label>
            <textarea
              id="message"
              v-model="formData.message"
              required
              placeholder="Explica'ns el teu projecte, quan vols començar, etc."
            />
          </div>

          <button
            type="submit"
            class="btn btn-primary submit-btn"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting">Enviant...</span>
            <span v-else>Enviar missatge</span>
          </button>

          <p
            v-if="submitMessage"
            :class="submitSuccess ? 'submit-success' : 'submit-error'"
          >
            {{ submitMessage }}
          </p>
        </form>

        <div class="contact-cards">
          <div class="card">
            <div class="card-icon">📧</div>
            <h3>Email</h3>
            <p>info@guillemvila.cat</p>
          </div>
          <div class="card">
            <div class="card-icon">📱</div>
            <h3>Telèfon</h3>
            <p>+34 682 463 081</p>
          </div>
          <div class="card">
            <div class="card-icon">📍</div>
            <h3>Ubicació</h3>
            <p>Riells i Viabrea, El Baix Montseny</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useContactForm } from "~/composables/useContactForm";

const { formData, isSubmitting, submitMessage, submitSuccess, submitForm } =
  useContactForm();
</script>

<style scoped>
.page-padding {
  padding-top: 100px;
}
.section-intro {
  text-align: center;
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 4rem;
}
.contact-container {
  display: flex;
  flex-direction: column;
  gap: 4rem;
}
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: var(--text);
  font-size: 1rem;
  font-family: inherit;
}
textarea {
  min-height: 120px;
  resize: vertical;
}
.submit-btn {
  width: 100%;
}
.submit-success {
  margin-top: 1rem;
  text-align: center;
  color: #4ade80;
}
.submit-error {
  margin-top: 1rem;
  text-align: center;
  color: #ef4444;
}
.contact-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
}
.card {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.card-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}
.card h3 {
  margin-bottom: 0.5rem;
}
.card p {
  color: var(--text-secondary);
}

.hp-field {
  position: absolute;
  left: -9999px;
  opacity: 0;
  pointer-events: none;
}
</style>
