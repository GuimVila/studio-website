<template>
  <section class="page">
    <section class="section">
      <h1 class="section-title heading-accent">Resources</h1>
    </section>

    <div class="cards">
      <NuxtLink class="card" to="/resources/roadmap">
        <div class="title">Roadmap</div>
        <div class="sub">
          Mapa interactiu d'aprenentatge amb recursos recomanats per a cada etapa
        </div>
      </NuxtLink>

      <NuxtLink
        v-for="c in categories"
        :key="c.slug"
        class="card"
        :to="`/resources/${c.slug}`"
      >
        <div class="title">{{ c.label }}</div>
        <div class="sub">
          {{ c.count }} recursos en aquesta categoria
        </div>
      </NuxtLink>
    </div>

    <p v-if="!pending && !categories.length" class="debug">
      No s'han trobat categories. Documents detectats: {{ (docs || []).length }}
    </p>
  </section>
</template>

<script setup>
import { computed, onMounted } from "vue";

const CATEGORY_LABELS = {
  "disseny-de-so": "Disseny de so",
  edicio: "Edició",
  fonaments: "Fonaments",
  gravacio: "Gravació",
  harmonia: "Harmonia",
  "llenguatge-musical": "Llenguatge musical",
  mescla: "Mescla",
  produccio: "Producció",
};

function categoryLabel(slug) {
  if (CATEGORY_LABELS[slug]) return CATEGORY_LABELS[slug];

  const stop = new Set([
    "de",
    "i",
    "a",
    "per",
    "del",
    "dels",
    "la",
    "el",
    "les",
    "els",
  ]);
  const words = String(slug)
    .trim()
    .toLowerCase()
    .replace(/[-_]+/g, " ")
    .split(" ")
    .filter(Boolean);

  return words
    .map((w, i) => {
      if (i > 0 && stop.has(w)) return w;
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(" ");
}

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
    if (parts.length >= 2 && parts[0] === "resources") {
      const slug = parts[1];
      counts.set(slug, (counts.get(slug) || 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([slug, count]) => ({
      slug,
      label: categoryLabel(slug),
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
