<template>
  <div>
    <AppHero />
    <HomePathways />
    <HomeResources />
    <WhyChooseMe />
    <StartToday />
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import AppHero from "~/components/AppHero.vue";
import HomePathways from "~/components/HomePathways.vue";
import HomeResources from "~/components/HomeResources.vue";
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
