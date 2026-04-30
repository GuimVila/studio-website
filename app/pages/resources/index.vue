<template>
  <section class="page">
    <section class="section">
      <h1 class="section-title heading-accent">
        {{ $t("resourcesHub.title") }}
      </h1>
    </section>

    <div class="cards">
      <NuxtLink class="card" :to="localePath('/resources/roadmap')">
        <div class="title">{{ $t("resourcesHub.roadmap.title") }}</div>
        <div class="sub">
          {{ $t("resourcesHub.roadmap.subtitle") }}
        </div>
      </NuxtLink>

      <NuxtLink
        v-for="c in categories"
        :key="c.slug"
        class="card"
        :to="localePath(`/resources/${c.slug}`)"
      >
        <div class="title">{{ c.label }}</div>
        <div class="sub">
          {{
            t("resourcesHub.categoryCount", { count: c.count, plural: c.count })
          }}
        </div>
      </NuxtLink>
    </div>

    <p v-if="!pending && !categories.length" class="debug">
      {{
        $t("resourcesHub.debug.noCategories", { count: (docs || []).length })
      }}
    </p>
  </section>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useI18n, useLocalePath } from "#i18n";
import { resourceCategoryLabel } from "~/utils/resourceCategories";

const { t } = useI18n();
const localePath = useLocalePath();

const {
  data: docs,
  pending,
  refresh,
} = await useAsyncData(
  "resources-hub",
  async () => {
    // IMPORTANT: query Nuxt Content collection
    return await queryCollection("resources").select("path", "title").all();
  },
  { default: () => [] }
);

// Fallback robust: si SSR a prod torna buit, força refetch al client
onMounted(() => {
  if (!(docs.value || []).length) refresh();
});

const categories = computed(() => {
  const counts = new Map();

  for (const d of docs.value || []) {
    const p = String(d.path || "");
    // esperem: /resources/<category>/<slug>
    const parts = p.split("/").filter(Boolean);
    const idx = parts.indexOf("resources");
    if (idx !== -1 && parts.length > idx + 1) {
      const slug = parts[idx + 1];
      counts.set(slug, (counts.get(slug) || 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([slug, count]) => ({
      slug,
      label: resourceCategoryLabel(slug, t),
      count,
    }));
});
</script>

<style scoped>
.page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 4rem 2rem;
  color: var(--text);
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
}

.card {
  display: block;
  text-decoration: none;
  color: var(--text);
  padding: 2.5rem;
  border-radius: 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
}

.card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, var(--accent-dark), var(--accent-light));
  transform: scaleX(0);
  transition: transform 0.4s ease;
}

.card:hover::before {
  transform: scaleX(1);
}

.card:hover {
  transform: translateY(-8px);
  border-color: rgba(208, 138, 63, 0.55);
  box-shadow: var(--shadow-2);
}

.title {
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  /* text-transform: capitalize; */
}

.sub {
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.5;
}

.debug {
  margin-top: 2rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
  text-align: center;
}

@media (max-width: 768px) {
  .page {
    padding: 3rem 1.5rem;
  }
  .cards {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  .card {
    padding: 2rem;
  }
}
</style>
