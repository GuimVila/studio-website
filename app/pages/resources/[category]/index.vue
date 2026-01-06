<script setup>
import { computed } from "vue";

const route = useRoute();
const category = computed(() => String(route.params.category || "").trim());

const { data: articles } = await useAsyncData(
  () => `resources-cat-${category.value}`,
  async () => {
    const prefix = `/resources/${category.value}/`;

    const rows = await queryCollection("resources")
      .where("path", "LIKE", `${prefix}%`)
      .select("title", "path", "seq")
      .all();

    // ordenem amb seq si existeix (fallback segur)
    return (rows || []).sort(
      (a, b) => (Number(a.seq) || 999999) - (Number(b.seq) || 999999)
    );
  },
  { default: () => [] }
);
</script>

<template>
  <section class="page">
    <section class="section">
      <h1 class="section-title heading-accent">{{ category }}</h1>
    </section>

    <ul class="list">
      <li v-for="a in articles" :key="a.path">
        <NuxtLink :to="a.path">{{ a.title }}</NuxtLink>
      </li>
    </ul>

    <p v-if="!articles.length" class="empty">
      No articles found in this category yet.
    </p>
  </section>
</template>

<style scoped>
.page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 4rem 2rem;
  color: var(--text);
}

.header {
  margin-bottom: 3rem;
}

.back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: none;
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.back:hover {
  color: var(--accent);
  transform: translateX(-4px);
}

.header h1 {
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 800;
  text-transform: capitalize;
  color: var(--text);
}

.list {
  display: grid;
  gap: 1rem;
  list-style: none;
  padding: 0;
}

.list li {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.list li:hover {
  transform: translateX(8px);
  border-color: var(--accent);
  box-shadow: var(--shadow-1);
}

.list a {
  display: block;
  padding: 1.5rem 2rem;
  text-decoration: none;
  color: var(--text);
  font-weight: 500;
  font-size: 1.1rem;
  position: relative;
}

.list a::before {
  content: "→";
  position: absolute;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--accent);
  font-size: 1.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.list li:hover a::before {
  opacity: 1;
}

.empty {
  color: var(--text-secondary);
  margin-top: 2rem;
  text-align: center;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .page {
    padding: 3rem 1.5rem;
  }

  .header {
    margin-bottom: 2rem;
  }

  .list a {
    padding: 1.25rem 1.5rem;
    font-size: 1rem;
  }
}
</style>
