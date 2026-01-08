<template>
  <section class="section">
    <h2 class="section-title">{{ $t("whyMe.title") }}</h2>

    <div class="services-grid">
      <ServiceCard
        v-for="(item, index) in services"
        :key="index"
        :title="item.title"
        :description="item.description"
        :image="item.image"
      />
    </div>
  </section>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import ServiceCard from "~/components/ServiceCard.vue";

const { t } = useI18n();

const services = computed(() => [
  {
    title: t("whyMe.items.production.title"),
    description: t("whyMe.items.production.description"),
    image: "/images/services/produccio.png",
  },
  {
    title: t("whyMe.items.mixing.title"),
    description: t("whyMe.items.mixing.description"),
    image: "/images/services/mescla.png",
  },
  {
    title: t("whyMe.items.recording.title"),
    description: t("whyMe.items.recording.description"),
    image: "/images/services/gravacio.png",
  },
  {
    title: t("whyMe.items.resources.title"),
    description: t("whyMe.items.resources.description"),
    image: "/images/services/recursos.png",
  },
]);
</script>
