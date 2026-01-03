<template>
  <div class="page-wrapper">
    <section class="section">
      <h1 class="section-title heading-accent">Galeria</h1>
      <p class="section-subtitle">
        Una mostra visual de l'estudi. Equipaments i sessions de treball.
      </p>

      <GalleryGrid :images="images" />
    </section>
  </div>
</template>

<script setup>
import GalleryGrid from "~/components/GalleryGrid.vue";

const images = [
  { src: "/images/foto4_galeria.jpg", alt: "Sala principal de control" },
  { src: "/images/foto8_galeria.jpg", alt: "Rack analògic" },
  { src: "/images/foto3_galeria.jpg", alt: "Instruments" },
  { src: "/images/foto1_galeria.jpg", alt: "Detall equipament" },
  { src: "/images/foto7_galeria.jpg", alt: "Tractament acústic" },
];

useHead({
  title: "Galeria | Guillem Vila · Artista, productor musical i enginyer de so",
  meta: [
    {
      name: "description",
      content:
        "Galeria. Fotografies de l’estudi, sessions de gravació i concerts, mostrant el treball creatiu i professional en música i so.",
    },
  ],
});
</script>

<style scoped>
.page-wrapper {
  padding-top: 100px;
}

.section-subtitle {
  margin-bottom: 4rem;
}
</style>
