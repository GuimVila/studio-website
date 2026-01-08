<template>
  <div class="page">
    <section class="section">
      <h1 class="section-title">{{ $t("confirmSubscribe.title") }}</h1>

      <!-- Estat -->
      <div class="status-text">
        <p class="status-message" :class="`status-${status}`">
          <span v-if="status === 'loading'">
            {{ $t("confirmSubscribe.status.loading") }}
          </span>

          <span v-else-if="status === 'success'">
            {{ $t("confirmSubscribe.status.success") }}
          </span>

          <span v-else-if="status === 'missing'">
            {{ $t("confirmSubscribe.status.missing") }}
          </span>

          <span v-else-if="status === 'expired'">
            {{ $t("confirmSubscribe.status.expired") }}
          </span>

          <span v-else-if="status === 'invalid'">
            {{ $t("confirmSubscribe.status.invalid") }}
          </span>

          <span v-else>
            {{ $t("confirmSubscribe.status.error") }}
          </span>
        </p>
      </div>

      <!-- Reenviar confirmació -->
      <div v-if="status !== 'success'" class="resend-wrap">
        <div class="resend-card">
          <h2 class="resend-title">
            {{ $t("confirmSubscribe.resend.title") }}
          </h2>
          <p class="resend-subtitle">
            {{ $t("confirmSubscribe.resend.subtitle") }}
          </p>

          <form class="resend-form" @submit.prevent="resend">
            <input
              v-model="email"
              type="email"
              :placeholder="$t('confirmSubscribe.resend.placeholderEmail')"
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
              {{
                isSending
                  ? $t("confirmSubscribe.resend.sending")
                  : $t("confirmSubscribe.resend.button")
              }}
            </button>

            <p v-if="resendMessage" class="resend-message">
              {{ resendMessage }}
            </p>
          </form>
        </div>
      </div>

      <!-- Back -->
      <div class="back-wrap">
        <NuxtLink class="btn btn-secondary" to="/">
          {{ $t("confirmSubscribe.backHome") }}
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "#i18n";

const { t } = useI18n();
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
    resendMessage.value = t("confirmSubscribe.resend.silentMessage");
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
    resendMessage.value = t("confirmSubscribe.resend.silentMessage");
  } catch (e) {
    console.error("[newsletter resend error]", e);
    resendMessage.value = t("confirmSubscribe.resend.silentMessage");
  } finally {
    isSending.value = false;
  }
}
useHead(() => ({
  title: t("confirmSubscribe.seo.title"),
  meta: [
    { name: "description", content: t("confirmSubscribe.seo.description") },
  ],
}));
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
