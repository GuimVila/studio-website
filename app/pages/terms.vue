<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="section-title heading-accent">{{ t("terms.title") }}</h1>
        <p>{{ t("terms.intro") }}</p>

        <h2>{{ t("terms.sections.use.title") }}</h2>
        <ul>
          <li>{{ t("terms.sections.use.items.0") }}</li>
          <li>{{ t("terms.sections.use.items.1") }}</li>
        </ul>

        <h2>{{ t("terms.sections.ip.title") }}</h2>
        <p>{{ t("terms.sections.ip.text") }}</p>

        <h2>{{ t("terms.sections.liability.title") }}</h2>
        <p>{{ t("terms.sections.liability.text") }}</p>

        <h2>{{ t("terms.sections.links.title") }}</h2>
        <p>{{ t("terms.sections.links.text") }}</p>

        <h2>{{ t("terms.sections.changes.title") }}</h2>
        <p>{{ t("terms.sections.changes.text") }}</p>

        <h2>{{ t("terms.sections.law.title") }}</h2>
        <p>{{ t("terms.sections.law.text") }}</p>

        <h2>{{ t("terms.sections.contact.title") }}</h2>
        <p>
          {{ t("terms.sections.contact.text") }}
          <a href="mailto:info@guillemvila.com">info@guillemvila.com</a>.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useI18n } from "#i18n";
const { t } = useI18n();

useHead(() => ({
  title: t("terms.seo.title"),
  meta: [{ name: "description", content: t("terms.seo.description") }],
}));
</script>

<style scoped>
h2 {
  margin-top: 2rem;
  margin-bottom: 1rem;
}

p,
li {
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 1rem;
}

ul {
  padding-left: 1.5rem;
  list-style: none;
}

a {
  color: inherit;
  text-decoration: underline;
}
</style>
