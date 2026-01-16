<template>
  <div class="modules-container">
    <!-- Artículos sin módulo -->
    <div v-if="articlesWithoutModule.length" class="module-section">
      <h3 class="module-title">Sin módulo</h3>
      <ul class="articles-list">
        <li v-for="article in articlesWithoutModule" :key="article.id">
          <NuxtLink :to="`/resources/${category}/${article.slug}`">
            <span class="title">{{ article.title_ca }}</span>
            <span class="meta">{{ article.est_minutes }} min</span>
          </NuxtLink>
        </li>
      </ul>
    </div>

    <!-- Artículos por módulo -->
    <div v-for="(moduleData, moduleName) in groupedByModule" :key="moduleName" class="module-section">
      <h3 class="module-title">{{ moduleName }}</h3>
      <ul class="articles-list">
        <li v-for="article in moduleData.articles" :key="article.id">
          <NuxtLink :to="`/resources/${category}/${article.slug}`">
            <span class="title">{{ article.title_ca }}</span>
            <span class="meta">{{ article.est_minutes }} min</span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  articles: {
    type: Array,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});

// Agrupar artículos por módulo
const groupedByModule = computed(() => {
  const grouped = {};
  (props.articles || []).forEach((article) => {
    const moduleName = article.modules?.name_ca || "Sin módulo";
    if (!grouped[moduleName]) {
      grouped[moduleName] = { articles: [] };
    }
    grouped[moduleName].articles.push(article);
  });
  return grouped;
});

const articlesWithoutModule = computed(() => {
  return (props.articles || []).filter((a) => !a.modules);
});
</script>

<style scoped>
.modules-container {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.module-section {
  border-left: 4px solid var(--accent);
  padding-left: 2rem;
}

.module-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--text);
  text-transform: capitalize;
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
  transition: all 0.25s ease;
}

.articles-list a:hover {
  background: var(--surface-2);
  border-color: var(--accent);
  transform: translateX(4px);
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

@media (max-width: 768px) {
  .module-section {
    padding-left: 1.5rem;
  }

  .articles-list a {
    padding: 0.75rem 1rem;
    font-size: 0.95rem;
  }
}
</style>
