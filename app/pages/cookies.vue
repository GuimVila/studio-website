<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="section-title heading-accent">{{ t("cookies.title") }}</h1>

        <p>{{ t("cookies.intro") }}</p>

        <h2>{{ t("cookies.whatTitle") }}</h2>
        <p>{{ t("cookies.whatText") }}</p>

        <h2>{{ t("cookies.usedTitle") }}</h2>

        <h3>{{ t("cookies.essentialTitle") }}</h3>
        <p>{{ t("cookies.essentialText") }}</p>

        <h3>{{ t("cookies.analyticsTitle") }}</h3>
        <p>{{ t("cookies.analyticsText") }}</p>

        <h2>{{ t("cookies.manageTitle") }}</h2>
        <p>{{ t("cookies.manageText1") }}</p>
        <p>{{ t("cookies.manageText2") }}</p>

        <h2>{{ t("cookies.changesTitle") }}</h2>
        <p>{{ t("cookies.changesText") }}</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useI18n } from "#i18n";

const { t } = useI18n();

useHead(() => ({
  title: t("cookies.seo.title"),
  meta: [{ name: "description", content: t("cookies.seo.description") }],
}));
</script>

<style scoped>
h2 {
  margin-top: 2rem;
  margin-bottom: 1rem;
}

h3 {
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

p {
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 1rem;
}
</style>
