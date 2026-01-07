<template>
  <section class="page">
    <section class="section">
      <h1 class="section-title heading-accent">Recursos</h1>
    </section>

    <div class="cards">
      <NuxtLink class="card" to="/resources/roadmap">
        <div class="title">Roadmap</div>
        <div class="sub">
          Mapa interactiu d'aprenentatge amb recursos recomanats
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
          {{ c.count }} recurs{{ c.count === 1 ? "" : "os" }} en aquesta
          categoria
        </div>
      </NuxtLink>
    </div>

    <p v-if="!categories.length" class="debug">
      No categories found. Docs detected: {{ totalDocs }}
    </p>
  </section>
</template>

<script setup>
import { computed } from "vue";

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

// (Opcional) ordre preferit a la home de resources
const CATEGORY_ORDER = [
  "fonaments",
  "llenguatge-musical",
  "harmonia",
  "edicio",
  "gravacio",
  "mescla",
  "produccio",
  "disseny-de-so",
];

function humanizeSlug(slug) {
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

function slugFromRow(row) {
  // 1) Preferim frontmatter categorySlug (és el robust)
  const fromFM = String(row?.categorySlug || "").trim();
  if (fromFM) return fromFM;

  // 2) Fallback: intentem deduir-ho des del path (per docs antics sense categorySlug)
  const p = String(row?.path || "");
  const parts = p.split("/").filter(Boolean);

  // casos típics:
  // - /resources/<slug>/<article>
  // - /<slug>/<article> (si Content resol el path sense prefix)
  const idx = parts.indexOf("resources");
  if (idx !== -1 && parts[idx + 1]) return parts[idx + 1];
  if (parts.length >= 2) return parts[0];

  return "";
}

const { data: hub } = await useAsyncData(
  "resources-hub",
  async () => {
    const rows =
      (await queryCollection("resources")
        .select("path", "categorySlug")
        .all()) || [];

    const counts = new Map(); // slug -> count

    for (const r of rows) {
      const slug = slugFromRow(r);
      if (!slug) continue;
      counts.set(slug, (counts.get(slug) || 0) + 1);
    }

    const slugs = Array.from(counts.keys());

    slugs.sort((a, b) => {
      const ia = CATEGORY_ORDER.indexOf(a);
      const ib = CATEGORY_ORDER.indexOf(b);

      if (ia !== -1 || ib !== -1) {
        return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
      }
      return a.localeCompare(b);
    });

    const categories = slugs.map((slug) => ({
      slug,
      label: humanizeSlug(slug),
      count: counts.get(slug) || 0,
    }));

    return { categories, totalDocs: rows.length };
  },
  {
    default: () => ({ categories: [], totalDocs: 0 }),
  }
);

const categories = computed(() => hub.value?.categories || []);
const totalDocs = computed(() => hub.value?.totalDocs || 0);
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
  text-transform: capitalize;
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
