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
.section-subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 4rem;
  text-align: center;
}
</style>
