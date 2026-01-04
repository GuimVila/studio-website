<template>
  <div class="service-card">
    <div class="service-image">
      <NuxtImg
        :src="image"
        :alt="title"
        loading="lazy"
        sizes="(max-width: 768px) 100vw, 33vw"
        width="800"
        height="450"
      />
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
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid var(--border);
  transition:
    transform 0.35s ease,
    box-shadow 0.35s ease,
    border-color 0.35s ease;
  display: flex;
  flex-direction: column;
}

.service-card:hover {
  transform: translateY(-8px);
  border-color: rgba(208, 138, 63, 0.55);
  box-shadow: var(--shadow-2);
}

/* Imatge */
.service-image {
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.service-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s ease;
  border-radius: 20px;
}

.service-card:hover {
  transform: scale(1.05);
}

/* Contingut */
.service-content {
  padding: 2rem;
  text-align: left;
}

.service-content h3 {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
}

.service-content p {
  color: var(--text-secondary);
  line-height: 1.7;
}
</style>
