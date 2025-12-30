<template>
  <div style="padding-top: 100px">
    <section class="section">
      <h1 class="section-title">Confirmació de subscripció</h1>

      <p
        style="
          text-align: center;
          font-size: 1.2rem;
          color: var(--text-secondary);
          margin-bottom: 2rem;
        "
      >
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

      <!-- Reenviar confirmació (només quan NO és success) -->
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

      <div style="display: flex; justify-content: center; margin-top: 24px">
        <NuxtLink class="btn" to="/">Tornar a l'inici</NuxtLink>
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
.btn {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  border-radius: 8px;
  background: var(--accent);
  color: var(--text);
  text-decoration: none;
}
.btn:hover {
  filter: brightness(1.05);
}

.resend-wrap {
  display: flex;
  justify-content: center;
  margin-top: 12px;
}

.resend-card {
  width: min(520px, 100%);
  background: var(--secondary);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 18px;
}

.resend-title {
  margin: 0 0 6px 0;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 800;
}

.resend-subtitle {
  margin: 0 0 14px 0;
  text-align: center;
  color: var(--text-secondary);
}

.resend-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.resend-input {
  width: 100%;
  padding: 0.9rem 1rem;
  border-radius: 10px;
  background: #2d2d2d;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text);
  font-size: 1rem;
  font-family: inherit;
}

.resend-button {
  width: 100%;
  padding: 0.9rem 1.2rem;
  border-radius: 10px;
  background: var(--accent);
  color: var(--text);
  font-weight: 700;
  border: none;
  cursor: pointer;
}
.resend-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.resend-message {
  margin: 6px 0 0 0;
  text-align: center;
  font-size: 0.95rem;
  color: #4ade80;
}

.hp-field {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}
</style>
