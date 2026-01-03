<template>
  <div ref="cardRef" class="pricing-card" :class="{ featured }">
    <div v-if="badge" class="badge-popular">{{ badge }}</div>

    <h3>{{ title }}</h3>

    <div class="price">
      {{ price }}<span v-if="unit" class="price-unit">{{ unit }}</span>
    </div>

    <ul class="pricing-features">
      <li v-for="(feature, i) in features" :key="i">{{ feature }}</li>
    </ul>

    <NuxtLink
      :to="link"
      class="btn btn-margin-top"
      :class="featured ? 'btn-primary' : 'btn-secondary'"
    >
      {{ button }}
    </NuxtLink>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

defineProps({
  title: { type: String, required: true },
  price: { type: [String, Number], required: true },
  unit: { type: String, default: "" },
  features: { type: Array, default: () => [] },
  link: { type: String, default: "/contact" },
  button: { type: String, default: "Contactar" },
  badge: { type: String, default: "" },
  featured: { type: Boolean, default: false },
});

const cardRef = ref(null);

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        cardRef.value.classList.add("visible");
        observer.disconnect();
      }
    },
    { threshold: 0.1 }
  );
  observer.observe(cardRef.value);
});
</script>

<style scoped>
.pricing-card {
  background: var(--surface);
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  border: 1px solid var(--border);

  display: flex;
  flex-direction: column;

  /* Animació d’entrada */
  opacity: 0;
  transform: translateY(20px);
  transition:
    transform 0.45s ease,
    box-shadow 0.45s ease,
    border-color 0.45s ease,
    opacity 0.55s ease;
}

.btn-margin-top {
  margin-top: auto;
}

/* Visible */
.pricing-card.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Hover */
.pricing-card:hover {
  box-shadow: var(--shadow-2);
  border-color: var(--border-strong);
}

/* Featured */
.pricing-card.featured {
  border: 2px solid rgba(208, 138, 63, 0.55);
  box-shadow: var(--accent-shadow-1);
}

.pricing-card.featured:hover {
  box-shadow: var(--accent-shadow-2);
  border-color: var(--accent);
}

.badge-popular {
  background: var(--accent);
  color: #fff;
  padding: 0.5rem 0.9rem;
  border-radius: 999px;
  margin-bottom: 1rem;
  font-weight: 700;
  font-size: 0.95rem;
}

.price {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: var(--accent);
}

.price-unit {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-left: 0.25rem;
}

.pricing-features {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
  line-height: 1.7;
  color: var(--text-secondary);
}
</style>
