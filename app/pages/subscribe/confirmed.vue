<template>
  <div class="page">
    <section class="section">
      <h1 class="section-title">Confirmació de subscripció</h1>

      <!-- Estat -->
      <div class="status-text">
        <p class="status-message" :class="`status-${status}`">
          <span v-if="status === 'loading'">
            Estem confirmant la teva subscripció...
          </span>

          <span v-else-if="status === 'success'">
            Perfecte. Ja estàs subscrit a la newsletter.
          </span>

          <span v-else-if="status === 'missing'">
            Falta el token de confirmació. Si no has rebut el correu, pots
            reenviar-lo a continuació.
          </span>

          <span v-else-if="status === 'expired'">
            Aquest enllaç de confirmació ha caducat. Pots reenviar el correu de
            confirmació.
          </span>

          <span v-else-if="status === 'invalid'">
            Aquest enllaç de confirmació no és vàlid. Si no has rebut el correu,
            pots reenviar-lo a continuació.
          </span>

          <span v-else>
            Hi ha hagut un error confirmant la subscripció. Si no has rebut el
            correu, pots reenviar-lo a continuació.
          </span>
        </p>
      </div>

      <!-- Reenviar confirmació -->
      <div v-if="status !== 'success'" class="resend-wrap">
        <div class="resend-card">
          <h2 class="resend-title">No has rebut el correu?</h2>
          <p class="resend-subtitle">
            Introdueix el teu correu i t’enviarem un nou enllaç de confirmació.
          </p>

          <form class="resend-form" @submit.prevent="resend">
            <input
              v-model="email"
              type="email"
              placeholder="Correu electrònic"
              required
              class="resend-input"
              autocomplete="email"
            >

            <!-- Honeypot -->
            <input
              v-model="honeypot"
              type="text"
              tabindex="-1"
              autocomplete="off"
              class="hp-field"
            >

            <button class="resend-button" type="submit" :disabled="isSending">
              {{ isSending ? "Enviant..." : "Reenviar confirmació" }}
            </button>

            <p v-if="resendMessage" class="resend-message">
              {{ resendMessage }}
            </p>
          </form>
        </div>
      </div>

      <!-- Back -->
      <div class="back-wrap">
        <NuxtLink class="btn btn-secondary" to="/"> Tornar a l'inici </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const status = ref("loading");

// Reenviar confirmació
const email = ref("");
const honeypot = ref("");
const isSending = ref(false);
const resendMessage = ref("");

function safeGetLastEmail() {
  if (import.meta.server) return "";
  try {
    return localStorage.getItem("newsletter:lastEmail") || "";
  } catch {
    return "";
  }
}

onMounted(async () => {
  // Prefill email si el tenim guardat (pas 6 el farem a useNewsletter.ts)
  email.value = safeGetLastEmail();

  const route = useRoute();
  const token = route.query.token;

  if (!token || typeof token !== "string") {
    status.value = "missing";
    return;
  }

  try {
    const res = await $fetch("/api/newsletter/confirm", {
      method: "POST",
      body: { token },
    });

    if (res && res.ok) {
      status.value = "success";
      return;
    }

    // Si backend retorna reason, el fem servir per UX
    const reason = res && typeof res === "object" ? res.reason : null;
    if (reason === "expired") status.value = "expired";
    else if (reason === "invalid") status.value = "invalid";
    else status.value = "error";
  } catch (e) {
    console.error("[newsletter confirm error]", e);
    status.value = "error";
  }
});

async function resend() {
  if (isSending.value) return;

  // Honeypot (bots) → UX silenciosa
  if (honeypot.value) {
    resendMessage.value =
      "Si hi ha una subscripció pendent per aquest correu, rebràs un nou enllaç de confirmació.";
    return;
  }

  const cleanEmail = (email.value || "").trim().toLowerCase();
  if (!cleanEmail) return;

  isSending.value = true;
  resendMessage.value = "";

  try {
    await $fetch("/api/newsletter/resend-confirmation", {
      method: "POST",
      body: { email: cleanEmail, honeypot: honeypot.value },
    });

    // UX silenciosa (no confirmem existència)
    resendMessage.value =
      "Si hi ha una subscripció pendent per aquest correu, rebràs un nou enllaç de confirmació.";
  } catch (e) {
    console.error("[newsletter resend error]", e);
    resendMessage.value =
      "Si hi ha una subscripció pendent per aquest correu, rebràs un nou enllaç de confirmació.";
  } finally {
    isSending.value = false;
  }
}
</script>

<style scoped>
.page {
  padding-top: 120px;
  padding-bottom: 4rem;
}

/* Estat */
.status-text {
  max-width: 680px;
  margin: 0 auto 2.5rem auto;
}

.status-message {
  text-align: center;
  font-size: 1.15rem;
  line-height: 1.6;
  color: var(--text-secondary);
}

.status-success {
  color: #4ade80;
}

/* Reenviar */
.resend-wrap {
  display: flex;
  justify-content: center;
}

.resend-card {
  width: min(520px, 100%);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 2rem;
  box-shadow: var(--shadow-1);
}

.resend-title {
  margin: 0 0 0.5rem 0;
  text-align: center;
  font-size: 1.25rem;
  font-weight: 800;
}

.resend-subtitle {
  margin: 0 0 1.5rem 0;
  text-align: center;
  color: var(--text-secondary);
  font-size: 1rem;
}

.resend-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.resend-input {
  width: 100%;
  padding: 0.9rem 1rem;
  border-radius: 10px;
  background: var(--secondary);
  border: 1px solid var(--border);
  color: var(--text);
  font-size: 1rem;
  font-family: inherit;
}

.resend-button {
  width: 100%;
  padding: 0.9rem 1.2rem;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--accent-dark), var(--accent));
  color: white;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.resend-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--accent-shadow-1);
}

.resend-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.resend-message {
  margin-top: 0.5rem;
  text-align: center;
  font-size: 0.95rem;
  color: #4ade80;
}

/* Back */
.back-wrap {
  display: flex;
  justify-content: center;
  margin-top: 2.5rem;
}

/* Honeypot */
.hp-field {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}
</style>
