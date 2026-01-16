<template>
  <section class="page">
    <section class="section">
      <h1 class="section-title heading-accent capitalize">
        {{ categoryName }}
      </h1>
      <NuxtLink class="back" to="/resources">← Enrere</NuxtLink>
    </section>

    <div v-if="pending" class="loading">
      <p>Carregant artícles...</p>
    </div>

    <CategoryModuleList v-else-if="articles.length" :articles="articles" :category="category" />

    <p v-if="!pending && !articles.length" class="empty">
      No s'han trobat articles en aquesta categoria.
    </p>
  </section>
</template>

<script setup>
import { computed } from "vue";

const route = useRoute();
const category = computed(() => String(route.params.category || "").trim());

const { getCategoryArticles } = useArticles();

const { data: articlesData, pending } = await useAsyncData(
  () => `resources-category-${category.value}`,
  () => getCategoryArticles(category.value),
  { default: () => [] }
);

const articles = computed(() => articlesData.value?.data || []);

const categoryName = computed(() => {
  if (!articles.value.length) return category.value;
  return articles.value[0].categories?.name_ca || category.value;
});
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

.list {
  margin-top: 2rem;
  display: grid;
  gap: 1rem;
  list-style: none;
  padding: 0;
}

.list li {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  transition: all 0.25s ease;
  overflow: hidden;
}

.list li:hover {
  transform: translateX(6px);
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

.list a:hover {
  text-decoration: none;
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
  transition: opacity 0.25s ease;
}

.list li:hover a::before {
  opacity: 1;
}

.title {
  font-weight: 500;
}

.meta {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-top: 0.5rem;
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

  .list a {
    padding: 1.25rem 1.5rem;
    font-size: 1rem;
  }

  .list a::before {
    right: 1.5rem;
    font-size: 1.2rem;
  }
}
</style>
