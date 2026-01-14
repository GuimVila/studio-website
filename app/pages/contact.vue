<template>
  <div class="page-wrapper">
    <section class="section">
      <h1 class="section-title heading-accent">{{ $t("contact.title") }}</h1>

      <p class="section-subtitle">
        {{ $t("contact.subtitle") }}
      </p>

      <div class="contact-container">
        <!-- FORM -->
        <form class="contact-form" @submit.prevent="submitForm">
          <div class="form-group">
            <label for="name">{{ $t("contact.form.nameLabel") }}</label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              required
              :placeholder="$t('contact.form.namePlaceholder')"
            >
          </div>

          <div class="form-group">
            <label for="email">{{ $t("contact.form.emailLabel") }}</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              :placeholder="`${$t('contact.form.emailPlaceholderUser')}@${$t('contact.form.emailPlaceholderDomain')}`"
            >
          </div>

          <div class="form-group">
            <label for="phone">{{ $t("contact.form.phoneLabel") }}</label>
            <input
              id="phone"
              v-model="formData.phone"
              type="tel"
              :placeholder="$t('contact.form.phonePlaceholder')"
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
            <label for="service">{{ $t("contact.form.serviceLabel") }}</label>
            <select id="service" v-model="formData.service" required>
              <option value="">
                {{ $t("contact.form.servicePlaceholder") }}
              </option>
              <option value="mescla">
                {{ $t("contact.form.services.mixing") }}
              </option>
              <option value="gravacio">
                {{ $t("contact.form.services.recording") }}
              </option>
              <option value="produccio">
                {{ $t("contact.form.services.production") }}
              </option>
              <option value="edicio">
                {{ $t("contact.form.services.editing") }}
              </option>
              <option value="altre">
                {{ $t("contact.form.services.other") }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="message">{{ $t("contact.form.messageLabel") }}</label>
            <textarea
              id="message"
              v-model="formData.message"
              required
              :placeholder="$t('contact.form.messagePlaceholder')"
            />
          </div>

          <button
            type="submit"
            class="btn btn-primary submit-btn"
            :disabled="isSubmitting"
          >
            {{
              isSubmitting
                ? $t("contact.form.sending")
                : $t("contact.form.submit")
            }}
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
            <div class="card-icon">
              📧
              <h3>{{ $t("contact.cards.email") }}</h3>
            </div>
            <p>info@guillemvila.com</p>
          </a>

          <a href="tel:+34682463081" class="contact-card">
            <div class="card-icon">
              📱
              <h3>{{ $t("contact.cards.phone") }}</h3>
            </div>
            <p>+34 682 463 081</p>
          </a>

          <a
            href="https://www.google.com/maps/place/Riells+i+Viabrea,+El+Baix+Montseny"
            target="_blank"
            class="contact-card"
          >
            <div class="card-icon">
              📍
              <h3>{{ $t("contact.cards.location") }}</h3>
            </div>
            <p>Riells i Viabrea, el Baix Montseny</p>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useContactForm } from "~/composables/useContactForm";

const { t } = useI18n();

const {
  formData,
  isSubmitting,
  submitMessage,
  submitSuccess,
  submitForm,
  honeypot,
} = useContactForm();

useHead(() => ({
  title: t("contact.seo.title"),
  meta: [{ name: "description", content: t("contact.seo.description") }],
}));
</script>

<style scoped>
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
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
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
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.contact-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-1);
}

.card-icon {
  display: flex;
  align-items: center;
  gap: .5rem;
  width: min-content;
  margin: 0 auto;
  font-size: 2.5rem;
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
