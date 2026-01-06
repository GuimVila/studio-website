<script setup>
import { computed } from "vue";

const { data: docs } = await useAsyncData("resources-hub", async () => {
  return await queryCollection("resources").select("path", "title").all();
});

const categories = computed(() => {
  const set = new Set();
  for (const d of docs.value || []) {
    const p = String(d.path || "");
    // esperem: /resources/<category>/<slug>
    const parts = p.split("/").filter(Boolean);
    if (parts.length >= 2 && parts[0] === "resources") set.add(parts[1]);
  }
  return Array.from(set).sort();
});
</script>

<template>
  <section class="page">
    <header class="hero">
      <h1>Resources</h1>
      <p>Browse by category or open the learning roadmap.</p>
    </header>

    <div class="cards">
      <NuxtLink class="card" to="/resources/roadmap">
        <div class="title">Roadmap</div>
        <div class="sub">Visual learning map with prerequisites</div>
      </NuxtLink>

      <NuxtLink
        v-for="c in categories"
        :key="c"
        class="card"
        :to="`/resources/${c}`"
      >
        <div class="title">{{ c }}</div>
        <div class="sub">Browse articles in this category</div>
      </NuxtLink>
    </div>

    <p v-if="!categories.length" class="debug">
      No categories found. Docs detected: {{ (docs || []).length }}
    </p>
  </section>
</template>

<style scoped>
.page { max-width: 1100px; margin: 0 auto; padding: 22px 16px 40px; color: white; }
.hero h1 { font-size: 28px; margin-bottom: 8px; }
.hero p { opacity: 0.85; max-width: 70ch; }
.cards { margin-top: 16px; display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px; }
.card { display:block; text-decoration:none; color:white; padding:14px; border-radius:16px;
  background: rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); }
.card:hover { background: rgba(255,255,255,0.09); }
.title { font-size: 16px; margin-bottom: 6px; }
.sub { opacity: 0.8; font-size: 12px; line-height: 1.4; }
.debug { margin-top: 14px; font-size: 12px; opacity: 0.75; }
@media (max-width: 900px){ .cards { grid-template-columns: 1fr; } }
</style>
