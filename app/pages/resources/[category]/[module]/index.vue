<template>
  <section class="page">
    <section class="section">
      <h1 class="section-title heading-accent capitalize">
        {{ module?.name_ca || moduleSlug }}
      </h1>
      <NuxtLink class="back" :to="`/resources/${category}`">← Enrere</NuxtLink>
    </section>

    <div v-if="pending" class="loading">
      <p>Carregant artícles...</p>
    </div>

    <div v-else-if="articles.length" class="articles-container">
      <ul class="articles-list">
        <li v-for="article in articles" :key="article.id">
          <NuxtLink :to="`/resources/${category}/${article.slug}`">
            <span class="title">{{ article.title_ca }}</span>
            <span class="meta">{{ article.est_minutes }} min</span>
          </NuxtLink>
        </li>
      </ul>
    </div>

    <p v-else class="empty">
      No s'han trobat articles en aquest mòdul.
    </p>
  </section>
</template>

<script setup>
import { computed } from "vue";

const route = useRoute();
const category = computed(() => String(route.params.category || "").trim());
const moduleSlug = computed(() => String(route.params.module || "").trim());

const { getModuleArticles } = useArticles();

const { data: moduleData, pending } = await useAsyncData(
  () => `resources-module-${category.value}-${moduleSlug.value}`,
  () => getModuleArticles(category.value, moduleSlug.value),
  { default: () => ({ module: null, articles: [] }) }
);

const module = computed(() => moduleData.value?.module);
const articles = computed(() => moduleData.value?.articles || []);

// SEO
useHead(() => ({
  title: module.value?.name_ca || "Module",
  meta: [
    {
      name: "description",
      content: `Artícles del mòdul: ${module.value?.name_ca || ""}`,
    },
  ],
}));
</script>

<style scoped>
.page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 4rem 2rem;
  color: var(--text);
}

.section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 50px;
  text-decoration: none;
  color: var(--text);
  font-weight: 500;
  transition: all 0.25s ease;
}

.back:hover {
  background: var(--surface-2);
  border-color: var(--accent);
  color: var(--accent);
  transform: translateX(-3px);
  text-decoration: none;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
}

.articles-container {
  margin-top: 2rem;
}

.articles-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.articles-list li {
  margin: 0;
}

.articles-list a {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  text-decoration: none;
  color: var(--text);
  font-weight: 500;
  font-size: 1.1rem;
  position: relative;
  transition: all 0.25s ease;
}

.articles-list a:hover {
  background: var(--surface-2);
  border-color: var(--accent);
  transform: translateX(6px);
}

.title {
  font-weight: 500;
  flex: 1;
}

.meta {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-left: 1rem;
  white-space: nowrap;
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

  .section-title {
    font-size: 2rem;
  }

  .articles-list a {
    padding: 0.75rem 1rem;
    font-size: 1rem;
  }
}
</style>
