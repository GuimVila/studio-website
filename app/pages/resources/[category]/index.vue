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
    <header class="hero">
      <NuxtLink class="back" to="/resources">← Resources</NuxtLink>
      <h1>{{ category }}</h1>
    </header>

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
.page { max-width: 900px; margin: 0 auto; padding: 22px 16px 40px; color: white; }
.hero { margin-bottom: 14px; }
.back { display:inline-block; margin-bottom: 10px; opacity: .85; text-decoration:none; color: white; }
.list { display: grid; gap: 10px; padding-left: 18px; }
.empty { opacity: .75; margin-top: 14px; }
</style>
