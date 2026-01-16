<template>
  <div
    v-if="isUnset"
    class="cookie-banner"
    role="dialog"
    aria-live="polite"
    aria-label="Cookie consent"
  >
    <p class="cookie-text">
      {{ t("cookieBanner.text") }}
      <span class="cookie-links">
        <NuxtLink :to="localePath('/cookies')">
          {{ t("cookieBanner.links.cookies") }}
        </NuxtLink>
        ·
        <NuxtLink :to="localePath('/privacy')">
          {{ t("cookieBanner.links.privacy") }}
        </NuxtLink>
      </span>
    </p>

    <div class="cookie-actions">
      <button class="btn-reject" type="button" @click="reject">
        {{ t("cookieBanner.reject") }}
      </button>
      <button class="btn-accept" type="button" @click="accept">
        {{ t("cookieBanner.accept") }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useI18n, useLocalePath } from "#i18n";
import { useCookieConsent } from "~/composables/useCookieConsent";

const { t } = useI18n();
const localePath = useLocalePath();

const { isUnset, accept, reject } = useCookieConsent();
</script>

<style scoped>
.cookie-banner {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  max-width: 900px;
  width: calc(100% - 3rem);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  z-index: 9999;
  box-shadow: var(--shadow-2);
}

.cookie-text {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.4;
  margin: 0;
}

.cookie-links {
  margin-left: 0.5rem;
  white-space: nowrap;
}

.cookie-links :deep(a) {
  color: var(--text-secondary);
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 0.2s ease;
}

.cookie-links :deep(a:hover) {
  color: var(--accent);
}

.cookie-actions {
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;
}

/* Reject */
.btn-reject {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-reject:hover {
  color: var(--text);
  border-color: var(--border-strong);
}

/* Accept */
.btn-accept {
  background: linear-gradient(90deg, var(--accent-dark), var(--accent));
  border: none;
  color: #fff;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-accept:hover {
  box-shadow: var(--accent-shadow-1);
}

@media (max-width: 640px) {
  .cookie-banner {
    bottom: 0.75rem;
    width: calc(100% - 1.5rem);
    max-width: 520px;

    padding: 0.85rem 0.95rem;
    border-radius: 14px;
    gap: 0.75rem;

    flex-direction: column;
    align-items: stretch;
    text-align: left;

    background: var(--header-bg);
    backdrop-filter: blur(10px);
    box-shadow: var(--shadow-1);
  }

  .cookie-text {
    font-size: 0.9rem;
    line-height: 1.35;

    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .cookie-links {
    white-space: normal;
  }

  .cookie-actions {
    width: 100%;
    gap: 0.6rem;
  }

  .btn-reject,
  .btn-accept {
    flex: 1;
    padding: 0.55rem 0.75rem;
    border-radius: 10px;
    font-size: 0.95rem;
  }
}

@media (max-width: 380px) {
  .cookie-text {
    -webkit-line-clamp: 1;
  }
}
</style>
