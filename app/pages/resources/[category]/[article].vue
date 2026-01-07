<template>
  <article class="page">
    <section class="section">
      <h1 class="section-title heading-accent">{{ doc.title }}</h1>

      <NuxtLink class="back" :to="`/resources/${category}`">
        ← Enrere
      </NuxtLink>
    </section>

    <!-- IMPORTANT: només encapsulem el markdown -->
    <div class="prose">
      <ContentRenderer :value="doc" />
    </div>
  </article>
</template>

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

<style scoped>
.page {
  max-width: 900px;
  margin: 0 auto;
  padding: 6rem 2rem;
  color: var(--text);
}

/* Botó enrere: no el centrem ni el movem del teu layout */
.back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  margin-top: 1rem; /* sota el títol */
  padding: 0.75rem 1.5rem;

  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 50px;

  color: var(--text);
  font-weight: 500;

  text-decoration: none !important; /* blinda contra styles del markdown i globals */
  transition:
    transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1),
    border-color 220ms ease,
    background 220ms ease,
    color 220ms ease,
    box-shadow 220ms ease;
}

.back:hover,
.back:focus,
.back:focus-visible,
.back:active {
  text-decoration: none !important;
}

.back:hover {
  background: var(--surface-2);
  border-color: rgba(208, 138, 63, 0.55);
  color: var(--accent);
  transform: translate3d(-2px, 0, 0); /* suau */
  box-shadow: var(--shadow-1);
}

/* Wrapper del markdown */
.prose {
  margin-top: 1.5rem;
}

/* Estils del contingut: ARA només afecten el markdown */
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
  line-height: 1.8;
  margin-bottom: 1.5rem;
  color: var(--text-secondary);
  font-size: 1.05rem;
}

.prose :deep(ul),
.prose :deep(ol) {
  margin-bottom: 1.5rem;
  padding-left: 2rem;
  line-height: 1.8;
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
  transition:
    color 0.2s ease,
    text-decoration-color 0.2s ease;
}

.prose :deep(a:hover) {
  color: var(--accent-light);
  text-decoration: underline;
  text-underline-offset: 3px;
}

@media (max-width: 768px) {
  .page {
    padding: 4rem 1.5rem;
  }
}
</style>
