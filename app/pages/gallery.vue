<template>
  <div class="gallery-page">
    <section class="gallery-shell" aria-labelledby="gallery-title">
      <div class="gallery-head">
        <div class="gallery-copy">
          <p class="gallery-kicker">{{ t("gallery.eyebrow") }}</p>
          <h1 id="gallery-title">{{ t("gallery.title") }}</h1>
          <p>
            {{ t("gallery.subtitle") }}
          </p>
        </div>

      </div>

      <GalleryGrid :images="images" />
    </section>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import GalleryGrid from "~/components/GalleryGrid.vue";

const { t } = useI18n();

const images = [
  { src: "/images/services/produccio.png", alt: t("gallery.images.controlRoom") },
  { src: "/images/services/mescla.png", alt: t("gallery.images.analogRack") },
  { src: "/images/foto3_galeria.jpg", alt: t("gallery.images.instruments") },
  { src: "/images/services/gravacio.png", alt: t("gallery.images.gearDetail") },
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
.gallery-page {
  min-height: 100vh;
  padding-top: 96px;
  background:
    linear-gradient(180deg, rgba(208, 138, 63, 0.06), transparent 280px),
    var(--background);
}

.gallery-shell {
  width: min(1320px, calc(100% - 2.5rem));
  margin: 0 auto;
  padding: clamp(3rem, 7vw, 6rem) 0 clamp(4rem, 8vw, 7rem);
}

.gallery-head {
  margin-bottom: clamp(1.5rem, 4vw, 2.6rem);
}

.gallery-copy {
  max-width: 760px;
}

.gallery-kicker {
  margin: 0 0 0.7rem;
  color: var(--accent);
  font-size: 0.82rem;
  font-weight: 850;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.gallery-copy h1 {
  margin: 0;
  max-width: 760px;
  font-size: clamp(3.2rem, 8vw, 6.2rem);
  font-weight: 930;
  line-height: 0.94;
  letter-spacing: 0;
  background: linear-gradient(135deg, var(--text) 0%, var(--accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.gallery-copy p:not(.gallery-kicker) {
  color: var(--text-secondary);
  font-size: clamp(1rem, 1.7vw, 1.14rem);
  line-height: 1.65;
}

.gallery-copy p:not(.gallery-kicker) {
  max-width: 680px;
  margin: 1.2rem 0 0;
}

@media (max-width: 860px) {
  .gallery-page {
    padding-top: 76px;
  }

  .gallery-shell {
    width: min(100% - 2rem, 640px);
    padding-top: clamp(2.2rem, 8vw, 3.5rem);
  }

  .gallery-copy h1 {
    font-size: clamp(3rem, 16vw, 4.4rem);
  }
}
</style>
