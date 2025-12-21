<template>
  <div class="gallery-grid">
    <GalleryItem v-for="(img, i) in images" :key="i" :image="img" />
  </div>
</template>

<script setup>
import GalleryItem from "~/components/GalleryItem.vue";

defineProps({
  images: { type: Array, required: true },
});
</script>

<style scoped>
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}
</style>
