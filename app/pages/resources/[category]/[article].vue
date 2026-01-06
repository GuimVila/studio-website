<script setup>
const route = useRoute();

const category = String(route.params.category || "").trim();
const article = String(route.params.article || "").trim();

const contentPath = `/resources/${category}/${article}`;

const { data: doc } = await useAsyncData(
  () => `resources-doc-${contentPath}`,
  async () => {
    return await queryCollection("resources").path(contentPath).first();
  }
);

if (!doc.value) {
  throw createError({ statusCode: 404, statusMessage: "Not found" });
}
</script>

<template>
  <article class="page">
    <NuxtLink class="back" :to="`/resources/${category}`">← Back</NuxtLink>

    <h1 class="title">{{ doc.title }}</h1>
    <ContentRenderer :value="doc" />
  </article>
</template>

<style scoped>
.page {
  max-width: 900px;
  margin: 0 auto;
  padding: 6rem 2rem;
  color: var(--text);
}

.back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  padding: 0.75rem 1.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 50px;
  text-decoration: none;
  color: var(--text);
  font-weight: 500;
  transition: all 0.3s ease;
}

.back:hover {
  background: var(--surface-2);
  border-color: var(--accent);
  color: var(--accent);
  transform: translateX(-4px);
}

.title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 900;
  margin: 1rem 0 2rem;
  line-height: 1.2;
  background: linear-gradient(135deg, var(--text) 0%, var(--accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Estils per al contingut de l'article */
.page :deep(h2) {
  font-size: 1.8rem;
  font-weight: 700;
  margin-top: 3rem;
  margin-bottom: 1rem;
  color: var(--text);
}

.page :deep(h3) {
  font-size: 1.4rem;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: var(--text);
}

.page :deep(p) {
  line-height: 1.8;
  margin-bottom: 1.5rem;
  color: var(--text-secondary);
  font-size: 1.05rem;
}

.page :deep(ul),
.page :deep(ol) {
  margin-bottom: 1.5rem;
  padding-left: 2rem;
  line-height: 1.8;
  color: var(--text-secondary);
}

.page :deep(li) {
  margin-bottom: 0.5rem;
}

.page :deep(code) {
  background: var(--surface);
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  font-size: 0.9em;
  border: 1px solid var(--border);
}

.page :deep(pre) {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
  overflow-x: auto;
  margin-bottom: 1.5rem;
}

.page :deep(pre code) {
  background: none;
  padding: 0;
  border: none;
}

.page :deep(blockquote) {
  border-left: 4px solid var(--accent);
  padding-left: 1.5rem;
  margin: 2rem 0;
  font-style: italic;
  color: var(--text-secondary);
}

.page :deep(strong) {
  color: var(--text);
  font-weight: 700;
}

.page :deep(a) {
  color: var(--accent);
  text-decoration: none;
  transition: color 0.3s ease;
}

.page :deep(a:hover) {
  color: var(--accent-light);
  text-decoration: underline;
}

@media (max-width: 768px) {
  .page {
    padding: 4rem 1.5rem;
  }
}
</style>
