<template>
  <div class="page-wrapper">
    <section class="section">
      <h1 class="section-title heading-accent">{{ t("gallery.title") }}</h1>
      <p class="section-subtitle">
        {{ t("gallery.subtitle") }}
      </p>

      <GalleryGrid :images="images" />
    </section>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import GalleryGrid from "~/components/GalleryGrid.vue";

const { t } = useI18n();

const images = [
  { src: "/images/foto4_galeria.jpg", alt: t("gallery.images.controlRoom") },
  { src: "/images/foto8_galeria.jpg", alt: t("gallery.images.analogRack") },
  { src: "/images/foto3_galeria.jpg", alt: t("gallery.images.instruments") },
  { src: "/images/foto1_galeria.jpg", alt: t("gallery.images.gearDetail") },
  {
    src: "/images/foto7_galeria.jpg",
    alt: t("gallery.images.acousticTreatment"),
  },
];

useHead(() => ({
  title: t("gallery.seo.title"),
  meta: [
    {
      name: "description",
      content: t("gallery.seo.description"),
    },
  ],
}));
</script>

<style scoped>
.section-subtitle {
  margin-bottom: 4rem;
}
</style>
