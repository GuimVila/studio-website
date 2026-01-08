<template>
  <div>
    <AppHero />
    <WhyChooseMe />
    <StartToday />
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import AppHero from "~/components/AppHero.vue";
import WhyChooseMe from "~/components/WhyChooseMe.vue";
import StartToday from "~/components/StartToday.vue";

const { t } = useI18n();

useHead(() => ({
  title: t("home.seo.title"),
  meta: [
    {
      name: "description",
      content: t("home.seo.description"),
    },
  ],
}));
</script>
