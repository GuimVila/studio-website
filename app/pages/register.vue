<template>
  <div class="auth-page">
    <section class="auth-shell">
      <div class="auth-copy">
        <p class="eyebrow">{{ $t("auth.register.eyebrow") }}</p>
        <h1 class="heading-accent">{{ $t("auth.register.title") }}</h1>
        <p>
          {{ $t("auth.register.subtitle") }}
        </p>
      </div>

      <form class="auth-form" @submit.prevent="submit">
        <div class="form-head">
          <h2>{{ $t("auth.register.formTitle") }}</h2>
          <p>{{ $t("auth.register.formSubtitle") }}</p>
        </div>

        <label>
          {{ $t("auth.fields.name") }}
          <input
            v-model="name"
            type="text"
            autocomplete="name"
            required
            :placeholder="$t('auth.fields.namePlaceholder')"
          >
        </label>

        <label>
          {{ $t("auth.fields.email") }}
          <input
            v-model="email"
            type="email"
            autocomplete="email"
            required
            :placeholder="$t('auth.fields.emailPlaceholder')"
          >
        </label>

        <label>
          {{ $t("auth.fields.password") }}
          <input
            v-model="password"
            type="password"
            autocomplete="new-password"
            required
            minlength="8"
            :placeholder="$t('auth.fields.newPasswordPlaceholder')"
          >
        </label>

        <button class="btn btn-primary auth-submit" type="submit" :disabled="userStore.loading">
          {{ userStore.loading ? $t("auth.register.submitting") : $t("auth.register.submit") }}
        </button>

        <p v-if="message" class="auth-message error" role="status">
          {{ message }}
        </p>

        <p class="switch-copy">
          {{ $t("auth.register.switchPrompt") }}
          <NuxtLink :to="loginLink">{{ $t("auth.register.switchLink") }}</NuxtLink>
        </p>
      </form>
    </section>
  </div>
</template>

<script setup>
import { normalizeResourcePath } from "~/utils/resourceRoutes";

const route = useRoute();
const userStore = useUserStore();
const { t } = useI18n();
const localePath = useLocalePath();

const name = ref("");
const email = ref("");
const password = ref("");
const message = ref("");

const redirectTo = computed(() =>
  typeof route.query.redirect === "string" ? route.query.redirect : "/resources/roadmap"
);

function localizedPath(path) {
  const value = normalizeResourcePath(String(path || "/resources/roadmap"));
  const firstSegment = value.split("?")[0].split("/").filter(Boolean)[0];
  if (["ca", "es", "en"].includes(firstSegment)) return value;
  return localePath(value);
}

const loginLink = computed(() => ({
  path: localePath("/login"),
  query: { redirect: redirectTo.value },
}));

async function submit() {
  message.value = "";

  try {
    await userStore.register(
      name.value.trim(),
      email.value.trim().toLowerCase(),
      password.value
    );
    await navigateTo(localizedPath(redirectTo.value));
  } catch {
    const error = String(userStore.error || "");
    message.value =
      error === "email_taken" || error.includes("taken")
        ? t("auth.register.errors.emailTaken")
        : error === "register_failed"
          ? t("auth.register.errors.default")
        : error || t("auth.register.errors.default");
  }
}

useHead({
  title: () => t("auth.register.seoTitle"),
});
</script>

<style scoped>
.auth-page {
  min-height: calc(100vh - 80px);
  padding: 8rem 2rem 4rem;
  display: grid;
  place-items: center;
}

.auth-shell {
  width: min(1040px, 100%);
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(340px, 420px);
  gap: 3rem;
  align-items: center;
}

.auth-copy {
  max-width: 580px;
}

.eyebrow {
  margin: 0 0 0.75rem;
  color: var(--accent);
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.auth-copy h1 {
  margin-bottom: 1rem;
}

.auth-copy p:not(.eyebrow) {
  color: var(--text-secondary);
  font-size: 1.05rem;
}

.auth-form {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 2rem;
  box-shadow: var(--shadow-1);
}

.form-head {
  margin-bottom: 1.5rem;
}

.form-head h2 {
  margin: 0 0 0.4rem;
  font-size: 1.35rem;
}

.form-head p,
.switch-copy {
  margin: 0;
  color: var(--text-secondary);
}

label {
  display: grid;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: var(--text);
  font-weight: 700;
}

input {
  width: 100%;
  padding: 0.95rem 1rem;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--secondary);
  color: var(--text);
  font: inherit;
}

input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(208, 138, 63, 0.18);
}

.auth-submit {
  width: 100%;
  margin-top: 0.5rem;
}

.auth-message {
  margin: 1rem 0 0;
  padding: 0.85rem;
  border: 1px solid rgba(239, 68, 68, 0.35);
  border-radius: 10px;
  background: rgba(239, 68, 68, 0.08);
}

.switch-copy {
  margin-top: 1.25rem;
  text-align: center;
}

.switch-copy a {
  color: var(--accent-light);
  font-weight: 800;
}

@media (max-width: 820px) {
  .auth-page {
    padding: 7rem 1.25rem 3rem;
  }

  .auth-shell {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>
