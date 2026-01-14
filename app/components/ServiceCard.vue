<template>
  <div class="service-card">
    <div class="service-image">
      <NuxtImg
        :src="image"
        :alt="title"
        loading="lazy"
        width="800"
        height="450"
        format="webp"
        quality="80"
        densities="x1 x2"
      />
      <div class="image-overlay" />
    </div>

    <div class="service-content">
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
});
</script>

<style scoped>
.service-card {
  background: var(--surface);
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid var(--border);
  transition:
    transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    border-color 0.4s ease;
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
}

.service-card:hover {
  transform: translateY(-10px);
  border-color: rgba(208, 138, 63, 0.6);
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(208, 138, 63, 0.2) inset;
}

:root[data-theme="light"] .service-card:hover {
  box-shadow:
    0 20px 50px rgba(20, 20, 20, 0.15),
    0 0 0 1px rgba(208, 138, 63, 0.3) inset;
}

.service-image {
  aspect-ratio: 16 / 9;
  overflow: hidden;
  position: relative;
  background: var(--surface-2);
}

.service-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(10, 10, 10, 0.1) 100%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
}

:root[data-theme="light"] .image-overlay {
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(246, 244, 241, 0.15) 100%
  );
}

.service-card:hover .service-image img {
  transform: scale(1.08);
}

.service-card:hover .image-overlay {
  opacity: 1;
}

.service-content {
  padding: clamp(1.5rem, 3vw, 2.25rem) ;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.service-content h3 {
  font-size: clamp(1.35rem, 2.5vw, 1.65rem);
  font-weight: 700;
  margin-bottom: 0.875rem;
  line-height: 1.25;
  color: var(--text);
}

.service-content p {
  color: var(--text-secondary);
  line-height: 1.65;
  font-size: clamp(0.95rem, 1.5vw, 1.05rem);
}

@media (max-width: 768px) {
  .service-card:hover {
    transform: translateY(-5px);
  }
}
</style>
