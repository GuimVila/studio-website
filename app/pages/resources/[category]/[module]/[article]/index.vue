<template>
  <article class="page">
    <!-- Breadcrumb -->
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <NuxtLink
        v-for="(item, i) in breadcrumb"
        :key="i"
        :to="item.active ? '#' : item.slug ? `/resources/${item.slug}` : '#'"
        :aria-current="item.active ? 'page' : undefined"
        :class="{ disabled: item.active }"
      >
        {{ item.label }} 
        <span v-if="i < breadcrumb.length - 1">/</span>
      </NuxtLink>
    </nav>

    <!-- Título + metadata -->
    <header>
      <h1>{{ article?.title_ca }}</h1>
      <div class="meta">
        <span v-if="article?.est_minutes">{{ article.est_minutes }} min lectura</span>
        <div v-if="article?.tags?.length" class="tags">
          <NuxtLink
            v-for="tag in article.tags"
            :key="tag.id"
            :to="`/resources?tag=${tag.slug}`"
            class="tag"
            :style="{ backgroundColor: tag.color }"
          >
            {{ tag.name_ca }}
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Contenido -->
    <div class="prose" v-html="parsedContent"></div>

    <!-- Prerequisitos (si los hay) -->
    <section v-if="article?.prerequisites?.length" class="prerequisites">
      <h3>Requisitos previos</h3>
      <ul>
        <li v-for="p in article.prerequisites" :key="p.id">
          <NuxtLink
            :to="`/resources/${article.categories?.slug}/${p.modules?.slug || 'modulos'}/${p.slug}`"
          >
            {{ p.title_ca }}
          </NuxtLink>
        </li>
      </ul>
    </section>

    <!-- Artículos relacionados -->
    <section v-if="relatedArticles?.length" class="related">
      <h3>Artículos relacionados</h3>
      <div class="grid">
        <div
          v-for="related in relatedArticles"
          :key="related.id"
          class="article-card"
        >
          <NuxtLink
            :to="`/resources/${article.categories?.slug}/${related.modules?.slug || 'modulos'}/${related.slug}`"
            class="card-link"
          >
            <h4>{{ related.title_ca }}</h4>
            <p v-if="related.est_minutes" class="card-meta">
              {{ related.est_minutes }} min
            </p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Navegación (siguiente/anterior) -->
    <footer v-if="prevArticle || nextArticle" class="navigation">
      <NuxtLink
        v-if="prevArticle"
        :to="`/resources/${article.categories?.slug}/${prevArticle.modules?.slug || 'modulos'}/${prevArticle.slug}`"
        class="nav-link prev"
      >
        ← {{ prevArticle.title_ca }}
      </NuxtLink>
      <NuxtLink
        v-if="nextArticle"
        :to="`/resources/${article.categories?.slug}/${nextArticle.modules?.slug || 'modulos'}/${nextArticle.slug}`"
        class="nav-link next"
      >
        {{ nextArticle.title_ca }} →
      </NuxtLink>
    </footer>
  </article>
</template>

<script setup>
import { computed } from "vue";
import { marked } from "marked";

const route = useRoute();
console.log("📄 Article page - Route params:", route.params);

const {
  getArticle,
  getBreadcrumb,
  getRelatedArticles,
  getNextArticle,
  getPrevArticle,
} = useArticles();

const slug = computed(() => String(route.params.article || ""));

console.log("📄 Article slug computed:", slug.value);

const { data: articleData, error: articleError } = await useAsyncData(
  () => `article-${slug.value}`,
  () => {
    console.log("📄 Fetching article:", slug.value);
    return getArticle(slug.value);
  }
);

console.log("📄 Article data:", articleData.value);
console.log("📄 Article error:", articleError.value);

const article = computed(() => articleData.value?.data);

if (articleError.value || !article.value) {
  console.error("❌ Article not found or error:", { error: articleError.value, article: article.value });
  throw createError({ statusCode: 404, statusMessage: "Article not found" });
}

// Parsear markdown a HTML
const parsedContent = computed(() => {
  if (!article.value?.body_ca) return "";
  return marked(article.value.body_ca);
});

const { data: breadcrumbData } = await useAsyncData(
  () => `breadcrumb-${slug.value}`,
  () => getBreadcrumb(slug.value)
);

const breadcrumb = computed(() => breadcrumbData.value?.breadcrumb || []);

const { data: relatedArticlesData } = await useAsyncData(
  () => `related-${slug.value}`,
  () => getRelatedArticles(slug.value)
);

const relatedArticles = computed(() => relatedArticlesData.value?.data || []);

const { data: nextArticleData } = await useAsyncData(
  () => `next-${slug.value}`,
  () => getNextArticle(slug.value)
);

const nextArticle = computed(() => nextArticleData.value?.data);

const { data: prevArticleData } = await useAsyncData(
  () => `prev-${slug.value}`,
  () => getPrevArticle(slug.value)
);

const prevArticle = computed(() => prevArticleData.value?.data);

// SEO
useHead(() => ({
  title: article.value?.title_ca || "Article",
  meta: [
    {
      name: "description",
      content: article.value?.meta_description_ca || article.value?.title_ca,
    },
  ],
}));
</script>

<style scoped>
.page {
  max-width: 900px;
  margin: 0 auto;
  padding: 6rem 2rem;
  color: var(--text);
}

.breadcrumb {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  font-size: 0.9rem;
}

.breadcrumb a {
  color: var(--accent);
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb a:hover:not(.disabled) {
  color: var(--accent-light);
  text-decoration: underline;
}

.breadcrumb a[aria-current="page"] {
  color: var(--text);
  cursor: default;
  pointer-events: none;
}

.breadcrumb a.disabled {
  color: var(--text);
  cursor: default;
  pointer-events: none;
}

header {
  margin-bottom: 3rem;
}

header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text);
  line-height: 1.2;
}

.meta {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  color: var(--text-secondary);
  font-size: 0.95rem;
  flex-wrap: wrap;
}

.tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  display: inline-block;
  padding: 0.3rem 0.75rem;
  border-radius: 20px;
  color: white;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  transition: opacity 0.2s ease;
}

.tag:hover {
  opacity: 0.8;
}

/* Markdown prose styles */
.prose {
  margin: 3rem 0;
  line-height: 1.8;
}

.prose :deep(h2) {
  font-size: 1.8rem;
  font-weight: 700;
  margin-top: 3rem;
  margin-bottom: 1rem;
  color: var(--text);
}

.prose :deep(h3) {
  font-size: 1.4rem;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: var(--text);
}

.prose :deep(p) {
  margin-bottom: 1.5rem;
  color: var(--text-secondary);
}

.prose :deep(ul),
.prose :deep(ol) {
  margin-bottom: 1.5rem;
  padding-left: 2rem;
  color: var(--text-secondary);
}

.prose :deep(li) {
  margin-bottom: 0.5rem;
}

.prose :deep(code) {
  background: var(--surface);
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  font-size: 0.9em;
  border: 1px solid var(--border);
  font-family: "Courier New", monospace;
}

.prose :deep(pre) {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
  overflow-x: auto;
  margin-bottom: 1.5rem;
}

.prose :deep(pre code) {
  background: none;
  padding: 0;
  border: none;
}

.prose :deep(blockquote) {
  border-left: 4px solid var(--accent);
  padding-left: 1.5rem;
  margin: 2rem 0;
  font-style: italic;
  color: var(--text-secondary);
}

.prose :deep(strong) {
  color: var(--text);
  font-weight: 700;
}

.prose :deep(a) {
  color: var(--accent);
  text-decoration: none;
  transition: color 0.2s ease;
}

.prose :deep(a:hover) {
  color: var(--accent-light);
  text-decoration: underline;
}

.prerequisites,
.related {
  margin: 3rem 0;
  padding: 2rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
}

.prerequisites h3,
.related h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  color: var(--text);
}

.prerequisites ul {
  margin-bottom: 0;
}

.prerequisites a {
  color: var(--accent);
  text-decoration: none;
  transition: color 0.2s ease;
}

.prerequisites a:hover {
  color: var(--accent-light);
  text-decoration: underline;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.article-card {
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  background: var(--surface-2);
  transition: all 0.25s ease;
}

.article-card:hover {
  border-color: var(--accent);
  transform: translateY(-4px);
  box-shadow: var(--shadow-1);
}

.card-link {
  display: block;
  padding: 1.5rem;
  text-decoration: none;
  color: var(--text);
  height: 100%;
}

.article-card h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text);
}

.card-meta {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.navigation {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border);
}

.nav-link {
  flex: 1;
  padding: 1.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  text-decoration: none;
  color: var(--text);
  font-weight: 500;
  transition: all 0.25s ease;
}

.nav-link:hover {
  background: var(--surface-2);
  border-color: var(--accent);
  color: var(--accent);
}

.nav-link.prev {
  text-align: left;
}

.nav-link.next {
  text-align: right;
}

@media (max-width: 768px) {
  .page {
    padding: 4rem 1.5rem;
  }

  header h1 {
    font-size: 1.8rem;
  }

  .meta {
    flex-direction: column;
    align-items: flex-start;
  }

  .navigation {
    flex-direction: column;
  }

  .nav-link {
    text-align: center;
  }

  .grid {
    grid-template-columns: 1fr;
  }
}
</style>