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

        <p class="gallery-note">
          {{ t("gallery.note") }}
        </p>
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
  display: grid;
  grid-template-columns: minmax(0, 0.78fr) minmax(260px, 0.35fr);
  gap: clamp(1.5rem, 5vw, 4rem);
  align-items: end;
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

.gallery-copy p:not(.gallery-kicker),
.gallery-note {
  color: var(--text-secondary);
  font-size: clamp(1rem, 1.7vw, 1.14rem);
  line-height: 1.65;
}

.gallery-copy p:not(.gallery-kicker) {
  max-width: 680px;
  margin: 1.2rem 0 0;
}

.gallery-note {
  margin: 0;
  padding-left: 1.2rem;
  border-left: 2px solid var(--accent);
}

@media (max-width: 860px) {
  .gallery-page {
    padding-top: 76px;
  }

  .gallery-shell {
    width: min(100% - 2rem, 640px);
    padding-top: clamp(2.2rem, 8vw, 3.5rem);
  }

  .gallery-head {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .gallery-copy h1 {
    font-size: clamp(3rem, 16vw, 4.4rem);
  }

  .gallery-note {
    padding-left: 0;
    border-left: 0;
  }
}
</style>
