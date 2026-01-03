<template>
  <div class="service-card">
    <div class="service-image">
      <img :src="image" :alt="title" loading="lazy" >
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
  background: var(--card-bg);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition:
    transform 0.35s ease,
    box-shadow 0.35s ease,
    border-color 0.35s ease;
  display: flex;
  flex-direction: column;
}

.service-card:hover {
  transform: translateY(-8px);
  border-color: var(--accent);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
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
}

.service-card:hover .service-image img {
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
