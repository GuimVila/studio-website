<template>
  <div>
    <div style="padding-top: 100px">
      <section class="section">
        <h1 class="section-title">Contacta amb nosaltres</h1>
        <p
          style="
            text-align: center;
            font-size: 1.2rem;
            color: var(--text-secondary);
            margin-bottom: 4rem;
          "
        >
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

            <div class="form-group">
              <label for="service">Servei d'interès *</label>
              <select
                id="service"
                v-model="formData.service"
                required
                style="
                  width: 100%;
                  padding: 1rem;
                  background: var(--secondary);
                  border: 1px solid rgba(255, 255, 255, 0.1);
                  border-radius: 10px;
                  color: var(--text);
                  font-size: 1rem;
                  font-family: inherit;
                "
              >
                <option value="">Selecciona un servei</option>
                <option value="mescla">Mescla</option>
                <option value="mastering">Mastering</option>
                <option value="mescla-mastering">Mescla + Mastering</option>
                <option value="produccio">Producció Musical</option>
                <option value="gravacio">Gravació</option>
                <option value="formacio">Formació</option>
                <option value="altre">Altre</option>
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
              class="btn btn-primary"
              style="width: 100%"
              :disabled="isSubmitting"
            >
              <span v-if="isSubmitting">Enviant...</span>
              <span v-else>Enviar missatge</span>
            </button>

            <p
              v-if="submitMessage"
              :style="{
                marginTop: '1rem',
                textAlign: 'center',
                color: submitSuccess ? '#4ade80' : '#ef4444',
              }"
            >
              {{ submitMessage }}
            </p>
          </form>

          <div
            style="
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 2rem;
              margin-top: 4rem;
            "
          >
            <div
              style="
                background: var(--card-bg);
                padding: 2rem;
                border-radius: 20px;
                text-align: center;
                border: 1px solid rgba(255, 255, 255, 0.1);
              "
            >
              <div style="font-size: 3rem; margin-bottom: 1rem">📧</div>
              <h3 style="margin-bottom: 0.5rem">Email</h3>
              <p style="color: var(--text-secondary)">info@guillemvila.cat</p>
            </div>

            <div
              style="
                background: var(--card-bg);
                padding: 2rem;
                border-radius: 20px;
                text-align: center;
                border: 1px solid rgba(255, 255, 255, 0.1);
              "
            >
              <div style="font-size: 3rem; margin-bottom: 1rem">📱</div>
              <h3 style="margin-bottom: 0.5rem">Telèfon</h3>
              <p style="color: var(--text-secondary)">+34 682 463 081</p>
            </div>

            <div
              style="
                background: var(--card-bg);
                padding: 2rem;
                border-radius: 20px;
                text-align: center;
                border: 1px solid rgba(255, 255, 255, 0.1);
              "
            >
              <div style="font-size: 3rem; margin-bottom: 1rem">📍</div>
              <h3 style="margin-bottom: 0.5rem">Ubicació</h3>
              <p style="color: var(--text-secondary)">Riells i Viabrea, El Baix Montseny</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const isSubmitting = ref(false);
const submitMessage = ref("");
const submitSuccess = ref(false);

const formData = ref({
  name: "",
  email: "",
  phone: "",
  service: "",
  message: "",
});

async function submitForm() {
  if (isSubmitting.value) return;

  // Validació mínima
  if (
    !formData.value.name ||
    !formData.value.email ||
    !formData.value.service ||
    !formData.value.message
  ) {
    submitMessage.value = "Si us plau, omple tots els camps obligatoris (*)";
    submitSuccess.value = false;
    return;
  }

  isSubmitting.value = true;
  submitMessage.value = "";

  const { $supabase } = useNuxtApp();

  try {
    const { error } = await $supabase.from("contactes").insert([
      {
        nom: formData.value.name,
        email: formData.value.email,
        telefon: formData.value.phone,
        servei: formData.value.service,
        missatge: formData.value.message,
      },
    ]);

    if (error) throw error;

    submitSuccess.value = true;
    submitMessage.value =
      "Missatge enviat correctament! Ens posarem en contacte aviat.";

    // Reset form
    formData.value = {
      name: "",
      email: "",
      phone: "",
      service: "",
      message: "",
    };
  } catch (err) {
    console.error("Error enviant el missatge:", err);
    submitSuccess.value = false;
    submitMessage.value =
      "Hi ha hagut un error. Si us plau, intenta-ho de nou o contacta per email.";
  } finally {
    isSubmitting.value = false;
  }
}
</script>
