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
.page { max-width: 900px; margin: 0 auto; padding: 22px 16px 60px; color: white; }
.back { display:inline-block; margin-bottom: 12px; opacity: .85; text-decoration:none; color: white; }
.title { font-size: 30px; margin: 6px 0 18px; }
</style>
