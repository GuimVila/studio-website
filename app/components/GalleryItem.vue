<template>
  <figure class="gallery-item" :class="{ 'is-featured': featured }">
    <NuxtImg
      :src="image.src"
      :alt="image.alt"
      :loading="featured ? 'eager' : 'lazy'"
      :fetchpriority="featured ? 'high' : 'auto'"
      sizes="100vw md:50vw lg:58vw"
      width="1200"
      height="900"
      format="webp"
      quality="82"
      densities="x1 x2"
    />
    <figcaption class="overlay">
      <span class="image-index">{{ paddedIndex }}</span>
      <strong>{{ image.alt }}</strong>
    </figcaption>
  </figure>
</template>

<script setup>
const props = defineProps({
  image: { type: Object, required: true },
  index: { type: Number, required: true },
  featured: { type: Boolean, default: false },
});

const paddedIndex = computed(() => String(props.index).padStart(2, "0"));
</script>

<style scoped>
.gallery-item {
  position: relative;
  min-height: 260px;
  margin: 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border);
  background: var(--surface);
  transition:
    transform 0.28s ease,
    border-color 0.28s ease,
    box-shadow 0.28s ease;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: saturate(0.92) contrast(1.04);
  transition: transform 0.45s ease;
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.02) 0%,
    rgba(0, 0, 0, 0.06) 44%,
    rgba(0, 0, 0, 0.72) 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 0.35rem;
  padding: clamp(1rem, 2.2vw, 1.35rem);
}

.image-index {
  color: var(--accent-light);
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.overlay strong {
  color: #fff;
  font-size: clamp(1.05rem, 2.2vw, 1.35rem);
  line-height: 1.05;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

.is-featured .overlay strong {
  max-width: 560px;
  font-size: clamp(1.35rem, 3vw, 2rem);
}

@media (hover: hover) {
  .gallery-item:hover {
    transform: translateY(-4px);
    border-color: rgba(208, 138, 63, 0.48);
    box-shadow: 0 18px 52px rgba(0, 0, 0, 0.32);
  }

  .gallery-item:hover img {
    transform: scale(1.035);
  }
}

@media (max-width: 640px) {
  .gallery-item {
    aspect-ratio: 4 / 3;
  }
}
</style>
