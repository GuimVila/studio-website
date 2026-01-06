<script setup>
import { computed } from "vue";

const { data: docs } = await useAsyncData("resources-hub", async () => {
  return await queryCollection("resources").select("path", "title").all();
});

const categories = computed(() => {
  const set = new Set();
  for (const d of docs.value || []) {
    const p = String(d.path || "");
    // esperem: /resources/<category>/<slug>
    const parts = p.split("/").filter(Boolean);
    if (parts.length >= 2 && parts[0] === "resources") set.add(parts[1]);
  }
  return Array.from(set).sort();
});
</script>

<template>
  <section class="page">
    <section class="section">
      <h1 class="section-title heading-accent">Recursos</h1>
    </section>
    <div class="cards">
      <NuxtLink class="card" to="/resources/roadmap">
        <div class="title">Roadmap</div>
        <div class="sub">Visual learning map with prerequisites</div>
      </NuxtLink>

      <NuxtLink
        v-for="c in categories"
        :key="c"
        class="card"
        :to="`/resources/${c}`"
      >
        <div class="title">{{ c }}</div>
        <div class="sub">Browse articles in this category</div>
      </NuxtLink>
    </div>

    <p v-if="!categories.length" class="debug">
      No categories found. Docs detected: {{ (docs || []).length }}
    </p>
  </section>
</template>

<style scoped>
.page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 4rem 2rem;
  color: var(--text);
}

.header {
  margin-bottom: 3rem;
}

.header h1 {
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 800;
  margin-bottom: 0.75rem;
  color: var(--text);
}

.header p {
  font-size: 1.05rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;

}

.card {
  display: block;
  text-decoration: none;
  color: var(--text);
  padding: 2.5rem;
  border-radius: 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
}

.card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, var(--accent-dark), var(--accent-light));
  transform: scaleX(0);
  transition: transform 0.4s ease;
}

.card:hover::before {
  transform: scaleX(1);
}

.card:hover {
  transform: translateY(-8px);
  border-color: rgba(208, 138, 63, 0.55);
  box-shadow: var(--shadow-2);
}

.title {
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  text-transform: capitalize;
}

.sub {
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.5;
}

.debug {
  margin-top: 2rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
  text-align: center;
}

@media (max-width: 768px) {
  .page {
    padding: 3rem 1.5rem;
  }

  .header {
    margin-bottom: 2rem;
  }

  .cards {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .card {
    padding: 2rem;
  }
}
</style>
