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
  background: var(--card-bg);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition:
    transform 0.4s ease,
    box-shadow 0.4s ease;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.gallery-item:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 50px rgba(255, 107, 53, 0.25);
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.8));
  display: flex;
  align-items: flex-end;
  padding: 1.5rem;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.gallery-item:hover .overlay {
  opacity: 1;
}

.overlay span {
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
}
</style>
