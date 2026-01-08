<template>
  <div class="page-wrapper">
    <div class="content-wrapper">
      <section class="section">
        <h1 class="section-title heading-accent">{{ t("about.title") }}</h1>
        <p class="section-subtitle">
          {{ t("about.subtitle") }}
        </p>
      </section>

      <section class="about-paragraph">
        <p
          v-for="(text, index) in aboutParagraphs"
          :key="index"
          class="section-subtitle"
        >
          {{ text }}
        </p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";

const { t, tm, rt } = useI18n();

const aboutParagraphs = computed(() =>
  (tm("about.paragraphs") || []).map((p) => rt(p))
);

useHead(() => ({
  title: t("about.seo.title"),
  meta: [{ name: "description", content: t("about.seo.description") }],
}));
</script>

<style scoped>
.about-paragraph {
  padding: 0rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  text-align: center;
}
</style>
