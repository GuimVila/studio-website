<template>
  <div class="gallery-item">
    <img :src="image.src" :alt="image.alt" >
    <div class="overlay">
      <span>{{ image.alt }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  image: { type: Object, required: true },
});
</script>

<style scoped>
.gallery-item {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  background: var(--surface);
  border: 1px solid var(--border);
  transition:
    transform 0.4s ease,
    box-shadow 0.4s ease,
    border-color 0.4s ease;
  /* aspect-ratio: 4 / 3; */
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.gallery-item:hover {
  transform: translateY(-10px);
  border-color: rgba(208, 138, 63, 0.55);
  box-shadow: var(--accent-shadow-1);
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 45%,
    var(--overlay-1) 100%
  );

  display: flex;
  align-items: flex-end;
  padding: 1.25rem;
  opacity: 0;
  transition: opacity 0.35s ease;
}

.gallery-item:hover .overlay {
  opacity: 1;
}

.overlay span {
  color: #fff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}
</style>
