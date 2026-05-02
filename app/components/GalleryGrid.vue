<template>
  <div class="gallery-grid">
    <GalleryItem
      v-for="(img, i) in images"
      :key="img.src"
      :image="img"
      :index="i + 1"
      :featured="i === 0"
    />
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
  grid-template-columns: repeat(12, minmax(0, 1fr));
  grid-auto-flow: dense;
  gap: clamp(0.85rem, 2vw, 1.25rem);
  align-items: stretch;
}

.gallery-grid :deep(.gallery-item:nth-child(1)) {
  grid-column: span 7;
  grid-row: span 2;
  min-height: 560px;
}

.gallery-grid :deep(.gallery-item:nth-child(2)),
.gallery-grid :deep(.gallery-item:nth-child(3)) {
  grid-column: span 5;
  min-height: 268px;
}

.gallery-grid :deep(.gallery-item:nth-child(4)),
.gallery-grid :deep(.gallery-item:nth-child(5)) {
  grid-column: span 6;
  min-height: 320px;
}

@media (max-width: 980px) {
  .gallery-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .gallery-grid :deep(.gallery-item:nth-child(n)) {
    grid-column: auto;
    grid-row: auto;
    min-height: 300px;
  }

  .gallery-grid :deep(.gallery-item:nth-child(1)) {
    grid-column: 1 / -1;
    min-height: 420px;
  }
}

@media (max-width: 640px) {
  .gallery-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .gallery-grid :deep(.gallery-item:nth-child(n)) {
    min-height: 0;
  }
}
</style>
