<template>
  <div class="page-wrapper">
    <section class="section">
      <h1 class="section-title">Galeria</h1>
      <p class="section-subtitle">
        Una mostra visual de l'estudi, equipament i sessions de treball.
      </p>

      <GalleryGrid :images="images" />
    </section>
  </div>
</template>

<script setup>
import GalleryGrid from "~/components/GalleryGrid.vue";

const images = [
  { src: "/assets/images/studio-1.jpg", alt: "Sala principal de control" },
  { src: "/assets/images/studio-2.jpg", alt: "Rack analògic" },
  { src: "/assets/images/studio-3.jpg", alt: "Sessió de gravació" },
  { src: "/assets/images/studio-4.jpg", alt: "Zona de producció" },
  { src: "/assets/images/studio-5.jpg", alt: "Detall equipament" },
  { src: "/assets/images/studio-6.jpg", alt: "Sessió de mescla" },
];
</script>

<style scoped>
.page-wrapper {
  padding-top: 100px;
}
.section {
  text-align: center;
}
.section-subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 4rem;
  text-align: center;
}
h1 {
  text-align: center;
  font-size: clamp(2.5rem, 5vw, 3rem);
  font-weight: 900;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, #ffffff 0%, #ff6b35 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
