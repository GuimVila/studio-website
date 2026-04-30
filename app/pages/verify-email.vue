<template>
  <div class="verify-page">
    <section class="verify-shell">
      <p class="eyebrow">{{ $t("auth.verify.eyebrow") }}</p>
      <h1 class="heading-accent">{{ title }}</h1>
      <p class="lead">{{ body }}</p>

      <div class="verify-actions">
        <NuxtLink
          v-if="isVerifiedStatus"
          class="btn btn-primary"
          :to="continueLink"
        >
          {{ $t("auth.verify.continue") }}
        </NuxtLink>

        <button
          v-else-if="userStore.isLoggedIn && !userStore.isEmailVerified"
          class="btn btn-primary"
          type="button"
          :disabled="userStore.loading"
          @click="resend"
        >
          {{ userStore.loading ? $t("auth.verify.resending") : $t("auth.verify.resend") }}
        </button>

        <NuxtLink
          v-else
          class="btn btn-primary"
          :to="loginLink"
        >
          {{ $t("auth.verify.login") }}
        </NuxtLink>
      </div>

      <p
        v-if="message"
        class="verify-message"
        :class="{ error: hasError }"
        role="status"
      >
        {{ message }}
      </p>
    </section>
  </div>
</template>

<script setup>
import { normalizeResourcePath } from "~/utils/resourceRoutes";

const route = useRoute();
const userStore = useUserStore();
const localePath = useLocalePath();
const { t } = useI18n();

const message = ref("");
const hasError = ref(false);

const status = computed(() => String(route.query.status || ""));
const isVerifiedStatus = computed(() => status.value === "verified");
const isInvalidStatus = computed(() => status.value === "invalid");

const redirectTo = computed(() =>
  typeof route.query.redirect === "string" ? route.query.redirect : "/resources/roadmap"
);

function localizedPath(path) {
  const value = normalizeResourcePath(String(path || "/resources/roadmap"));
  const firstSegment = value.split("?")[0].split("/").filter(Boolean)[0];
  if (["ca", "es", "en"].includes(firstSegment)) return value;
  return localePath(value);
}

const continueLink = computed(() => localizedPath(redirectTo.value));
const loginLink = computed(() => ({
  path: localePath("/login"),
  query: { redirect: redirectTo.value },
}));

const title = computed(() => {
  if (isVerifiedStatus.value) return t("auth.verify.verifiedTitle");
  if (isInvalidStatus.value) return t("auth.verify.invalidTitle");
  return t("auth.verify.title");
});

const body = computed(() => {
  if (isVerifiedStatus.value) return t("auth.verify.verifiedBody");
  if (isInvalidStatus.value) return t("auth.verify.invalidBody");
  return t("auth.verify.body");
});

async function resend() {
  message.value = "";
  hasError.value = false;

  try {
    await userStore.resendVerificationEmail();
    message.value = t("auth.verify.resendSuccess");
  } catch {
    hasError.value = true;
    message.value = t("auth.verify.resendError");
  }
}

onMounted(async () => {
  if (isVerifiedStatus.value && userStore.isLoggedIn) {
    await userStore.fetchUser();
  }
});

useHead({
  title: () => t("auth.verify.seoTitle"),
});
</script>

<style scoped>
.verify-page {
  min-height: calc(100vh - 80px);
  padding: 8rem 2rem 4rem;
  display: grid;
  place-items: center;
}

.verify-shell {
  width: min(720px, 100%);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 2.25rem;
  box-shadow: var(--shadow-1);
}

.eyebrow {
  margin: 0 0 0.75rem;
  color: var(--accent);
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.verify-shell h1 {
  margin: 0 0 1rem;
}

.lead {
  margin: 0;
  color: var(--text-secondary);
  font-size: 1.05rem;
  line-height: 1.65;
}

.verify-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.verify-message {
  margin: 1rem 0 0;
  padding: 0.85rem;
  border: 1px solid rgba(74, 222, 128, 0.3);
  border-radius: 10px;
  background: rgba(74, 222, 128, 0.08);
}

.verify-message.error {
  border-color: rgba(239, 68, 68, 0.35);
  background: rgba(239, 68, 68, 0.08);
}

@media (max-width: 680px) {
  .verify-page {
    padding: 7rem 1.25rem 3rem;
  }

  .verify-shell {
    padding: 1.5rem;
  }
}
</style>
