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
      class="btn"
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

// Ref per a animació d’entrada
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
  background: var(--card-bg);
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);

  /* Animació d’entrada */
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease-out;
}

/* Quan és visible: fade + slide */
.pricing-card.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Hover: s’agranda */
.pricing-card:hover {
  transform: scale(1.03);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.25);
}

.featured {
  border: 2px solid var(--accent);
}

.badge-popular {
  background: var(--accent);
  color: white;
  padding: 0.5rem;
  border-radius: 20px;
  margin-bottom: 1rem;
  font-weight: bold;
}

.price {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.price-unit {
  font-size: 1rem;
  color: var(--text-secondary);
}

.pricing-features {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
  line-height: 1.7;
}
</style>
