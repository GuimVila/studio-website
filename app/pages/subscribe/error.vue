<template>
  <div class="page">
    <section class="section">
      <h1 class="section-title">{{ t("subscribeError.title") }}</h1>

      <div class="error-text">
        <p style="white-space: pre-line">
          {{ t("subscribeError.message") }}
        </p>
      </div>

      <div class="actions">
        <LocaleLink to="/" class="btn btn-secondary">
          {{ t("subscribeError.actions.backHome") }}
        </LocaleLink>

        <LocaleLink to="/subscribe" class="btn btn-primary">
          {{ t("subscribeError.actions.resubscribe") }}
        </LocaleLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useI18n } from "#i18n";

const { t } = useI18n();

useHead(() => ({
  title: t("subscribeError.seo.title"),
  meta: [
    {
      name: "description",
      content: t("subscribeError.seo.description"),
    },
  ],
}));
</script>

<style scoped>
.page {
  padding-top: 120px;
  padding-bottom: 4rem;
}

/* Text */
.error-text {
  max-width: 620px;
  margin: 0 auto 2.5rem auto;
}

.error-text p {
  text-align: center;
  font-size: 1.15rem;
  line-height: 1.6;
  color: var(--text-secondary);
}

/* Accions */
.actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

/* Ajust mòbil */
@media (max-width: 480px) {
  .actions {
    flex-direction: column;
    align-items: center;
  }

  .actions .btn {
    width: 100%;
    max-width: 280px;
    text-align: center;
  }
}
</style>
