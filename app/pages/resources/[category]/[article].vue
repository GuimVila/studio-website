<template>
  <article class="page">
    <!-- Breadcrumb -->
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <NuxtLink
        v-for="(item, i) in breadcrumb"
        :key="i"
        :to="`/resources/${item.slug}`"
        :aria-current="item.active ? 'page' : undefined"
      >
        {{ item.label }}
      </NuxtLink>
    </nav>

    <!-- Título + metadata -->
    <header>
      <h1>{{ article.title_ca }}</h1>
      <div class="meta">
        <span>{{ article.est_minutes }} min lectura</span>
        <div class="tags">
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
    <div class="prose" v-html="article.body_ca"></div>

    <!-- Prerequisitos (si los hay) -->
    <section v-if="article.prerequisites.length" class="prerequisites">
      <h3>Requisitos previos</h3>
      <ul>
        <li v-for="p in article.prerequisites" :key="p.id">
          <NuxtLink :to="`/resources/${p.slug}`">
            {{ p.title_ca }}
          </NuxtLink>
        </li>
      </ul>
    </section>

    <!-- Artículos relacionados -->
    <section v-if="relatedArticles.length" class="related">
      <h3>Artículos relacionados</h3>
      <div class="grid">
        <ArticleCard
          v-for="article in relatedArticles"
          :key="article.id"
          :article="article"
        />
      </div>
    </section>

    <!-- Navegación (siguiente/anterior) -->
    <footer class="navigation">
      <NuxtLink v-if="prevArticle" :to="`/resources/${prevArticle.slug}`">
        ← {{ prevArticle.title_ca }}
      </NuxtLink>
      <NuxtLink v-if="nextArticle" :to="`/resources/${nextArticle.slug}`">
        {{ nextArticle.title_ca }} →
      </NuxtLink>
    </footer>
  </article>
</template>

<script setup>
const route = useRoute();
const { getArticle, getBreadcrumb, getRelatedArticles } = useArticles();

const slug = route.params.article;

const { data: article } = await useAsyncData(`article-${slug}`, () =>
  getArticle(slug)
);

if (!article.value) {
  throw createError({ statusCode: 404 });
}

const { breadcrumb } = await getBreadcrumb(slug);
const { data: relatedArticles } = await getRelatedArticles(slug);
</script>