<template>
  <section class="page">
    <section class="resources-hero">
      <p class="eyebrow">{{ $t("resourcesHub.eyebrow") }}</p>
      <h1>{{ $t("resourcesHub.title") }}</h1>
      <p>{{ $t("resourcesHub.intro") }}</p>
    </section>

    <section class="featured">
      <NuxtLink class="roadmap-card" :to="localePath('/resources/roadmap')">
        <div class="roadmap-copy">
          <p class="card-kicker">{{ $t("resourcesHub.roadmap.kicker") }}</p>
          <h2>{{ $t("resourcesHub.roadmap.title") }}</h2>
          <p>{{ $t("resourcesHub.roadmap.subtitle") }}</p>
        </div>

        <div class="map-preview" aria-hidden="true">
          <span class="map-node one" />
          <span class="map-node two" />
          <span class="map-node three" />
          <span class="map-node four" />
          <span class="map-line a" />
          <span class="map-line b" />
          <span class="map-line c" />
        </div>

        <div class="stats">
          <span>
            <strong>{{ roadmapCategoryCount }}</strong>
            {{ $t("resourcesHub.stats.disciplines") }}
          </span>
          <span>
            <strong>{{ roadmapNodeCount }}</strong>
            {{ $t("resourcesHub.stats.steps") }}
          </span>
          <span>
            <strong>{{ estimatedHours }}h</strong>
            {{ $t("resourcesHub.stats.estimated") }}
          </span>
        </div>
      </NuxtLink>

      <div class="library-card">
        <p class="card-kicker">{{ $t("resourcesHub.library.kicker") }}</p>
        <h2>{{ $t("resourcesHub.library.title") }}</h2>
        <p>{{ $t("resourcesHub.library.subtitle") }}</p>
        <div class="library-metrics">
          <span>
            <strong>{{ categories.length }}</strong>
            {{ $t("resourcesHub.stats.categories") }}
          </span>
          <span>
            <strong>{{ totalResources }}</strong>
            {{ $t("resourcesHub.stats.resources") }}
          </span>
        </div>
      </div>
    </section>

    <section class="category-section">
      <div class="section-head">
        <div>
          <p class="eyebrow">{{ $t("resourcesHub.categoriesEyebrow") }}</p>
          <h2>{{ $t("resourcesHub.categoriesTitle") }}</h2>
        </div>
        <p>{{ $t("resourcesHub.categoriesIntro") }}</p>
      </div>

      <div class="cards">
        <NuxtLink
          v-for="(c, index) in categories"
          :key="c.slug"
          class="card"
          :style="{ '--category-color': c.color }"
          :to="localePath(`/resources/${c.slug}`)"
        >
          <span class="card-index">{{ String(index + 1).padStart(2, "0") }}</span>
          <h3>{{ c.label }}</h3>
          <p>{{ c.description }}</p>
          <div class="card-footer">
            <span>
              {{
                t("resourcesHub.categoryCount", {
                  count: c.count,
                  plural: c.count,
                })
              }}
            </span>
            <UIcon name="i-lucide-arrow-right" aria-hidden="true" />
          </div>
        </NuxtLink>
      </div>
    </section>

    <section class="compact-roadmap">
      <NuxtLink class="compact-link" :to="localePath('/resources/roadmap')">
        <span>{{ $t("resourcesHub.roadmap.compact") }}</span>
        <UIcon name="i-lucide-route" aria-hidden="true" />
      </NuxtLink>
    </section>

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
import roadmap from "../../../data/roadmap.json";

const { t } = useI18n();
const localePath = useLocalePath();

const categoryOrder = [
  "fonaments",
  "llenguatge-musical",
  "harmonia",
  "produccio",
  "gravacio",
  "edicio",
  "mescla",
  "disseny-de-so",
];

const categoryColors = [
  "#d08a3f",
  "#6ea8fe",
  "#8dd3c7",
  "#f0c36d",
  "#c084fc",
  "#f472b6",
  "#a3e635",
  "#f87171",
];

const {
  data: docs,
  pending,
  refresh,
} = await useAsyncData(
  "resources-hub",
  async () => {
    return await queryCollection("resources").select("path", "title").all();
  },
  { default: () => [] }
);

onMounted(() => {
  if (!(docs.value || []).length) refresh();
});

const totalResources = computed(() => (docs.value || []).length);
const roadmapNodes = computed(() => roadmap.nodes || []);
const roadmapNodeCount = computed(() => roadmapNodes.value.length);
const roadmapCategoryCount = computed(
  () => new Set(roadmapNodes.value.map((node) => node.category)).size
);
const estimatedHours = computed(() => {
  const minutes = roadmapNodes.value.reduce(
    (total, node) => total + Number(node.estMinutes || 0),
    0
  );
  return Math.max(1, Math.round(minutes / 60));
});

const categories = computed(() => {
  const counts = new Map();

  for (const d of docs.value || []) {
    const p = String(d.path || "");
    const parts = p.split("/").filter(Boolean);
    const idx = parts.indexOf("resources");
    if (idx !== -1 && parts.length > idx + 1) {
      const slug = parts[idx + 1];
      counts.set(slug, (counts.get(slug) || 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .sort((a, b) => {
      const ai = categoryOrder.indexOf(a[0]);
      const bi = categoryOrder.indexOf(b[0]);
      if (ai !== -1 || bi !== -1) {
        return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
      }
      return a[0].localeCompare(b[0]);
    })
    .map(([slug, count]) => ({
      slug,
      label: resourceCategoryLabel(slug, t),
      count,
      color: categoryColors[
        Math.max(0, categoryOrder.indexOf(slug)) % categoryColors.length
      ],
      description: t(`resourcesHub.categoryDescriptions.${slug}`),
    }));
});
</script>

<style scoped>
.page {
  max-width: 1240px;
  margin: 0 auto;
  padding: 4rem 2rem 5rem;
  color: var(--text);
}

.resources-hero {
  max-width: 820px;
  margin-bottom: 1.5rem;
}

.eyebrow,
.card-kicker,
.card-index {
  color: var(--accent);
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.resources-hero h1,
.section-head h2 {
  margin: 0;
  color: var(--text);
  line-height: 1.04;
}

.resources-hero h1 {
  font-size: 3.25rem;
  font-weight: 950;
}

.resources-hero p:not(.eyebrow) {
  max-width: 70ch;
  margin: 1rem 0 0;
  color: var(--text-secondary);
  font-size: 1.06rem;
}

.featured {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(280px, 0.7fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.roadmap-card,
.library-card {
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  box-shadow: var(--shadow-1);
}

.roadmap-card {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 0.7fr);
  grid-template-rows: minmax(0, 1fr) auto;
  gap: 1rem;
  min-height: 320px;
  align-items: center;
  overflow: hidden;
  padding: 1.5rem;
  color: var(--text);
  transition:
    transform 0.24s ease,
    border-color 0.24s ease,
    box-shadow 0.24s ease;
}

.roadmap-card:hover {
  transform: translateY(-3px);
  border-color: rgba(208, 138, 63, 0.55);
  box-shadow: var(--shadow-2);
}

.roadmap-copy {
  align-self: center;
  max-width: 560px;
  position: relative;
  z-index: 2;
}

.roadmap-copy h2,
.library-card h2 {
  margin: 0.35rem 0 0.65rem;
  color: var(--text);
  line-height: 1.1;
}

.roadmap-copy h2 {
  font-size: 2.1rem;
}

.roadmap-copy p:not(.card-kicker),
.library-card p:not(.card-kicker),
.section-head p,
.card p {
  color: var(--text-secondary);
}

.map-preview {
  position: relative;
  min-height: 220px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background:
    linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    var(--surface-2);
  background-size: 34px 34px;
  overflow: hidden;
}

:root[data-theme="light"] .map-preview {
  background:
    linear-gradient(rgba(20, 20, 20, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(20, 20, 20, 0.045) 1px, transparent 1px),
    var(--surface-2);
  background-size: 34px 34px;
}

.map-node,
.map-line {
  position: absolute;
  display: block;
}

.map-node {
  width: 44px;
  height: 44px;
  border: 2px solid var(--accent);
  border-radius: 50%;
  background: var(--surface);
  box-shadow: 0 0 0 8px rgba(208, 138, 63, 0.08);
}

.map-node.one {
  left: 12%;
  top: 48%;
}

.map-node.two {
  left: 42%;
  top: 28%;
  border-color: #6ea8fe;
  box-shadow: 0 0 0 8px rgba(110, 168, 254, 0.08);
}

.map-node.three {
  left: 58%;
  top: 62%;
  border-color: #a3e635;
  box-shadow: 0 0 0 8px rgba(163, 230, 53, 0.08);
}

.map-node.four {
  left: 78%;
  top: 35%;
  border-color: #f472b6;
  box-shadow: 0 0 0 8px rgba(244, 114, 182, 0.08);
}

.map-line {
  height: 2px;
  background: rgba(208, 138, 63, 0.5);
  transform-origin: left center;
}

.map-line.a {
  left: 22%;
  top: 54%;
  width: 28%;
  transform: rotate(-25deg);
}

.map-line.b {
  left: 50%;
  top: 41%;
  width: 24%;
  background: rgba(110, 168, 254, 0.45);
  transform: rotate(35deg);
}

.map-line.c {
  left: 66%;
  top: 58%;
  width: 21%;
  background: rgba(163, 230, 53, 0.42);
  transform: rotate(-44deg);
}

.stats,
.library-metrics {
  display: grid;
  gap: 0.6rem;
}

.stats {
  position: relative;
  z-index: 2;
  grid-column: 1 / -1;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  max-width: none;
  margin-top: 0.25rem;
}

.stats span,
.library-metrics span {
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface-2);
  color: var(--text-secondary);
  font-size: 0.82rem;
  line-height: 1.25;
}

.stats strong,
.library-metrics strong {
  display: block;
  color: var(--accent);
  font-size: 1.35rem;
  line-height: 1.05;
}

.library-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.5rem;
}

.library-metrics {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 1.2rem;
}

.category-section {
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  box-shadow: var(--shadow-1);
  padding: 1.5rem;
}

.section-head {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(280px, 0.7fr);
  gap: 1rem;
  align-items: end;
  margin-bottom: 1.2rem;
}

.section-head h2 {
  font-size: 1.75rem;
}

.section-head p {
  margin: 0;
}

.cards {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.9rem;
}

.card {
  display: flex;
  min-height: 230px;
  flex-direction: column;
  text-decoration: none;
  color: var(--text);
  padding: 1rem;
  border-radius: 8px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--category-color) 12%, transparent), transparent 42%),
    var(--surface-2);
  border: 1px solid var(--border);
  position: relative;
  overflow: hidden;
  transition:
    transform 0.22s ease,
    border-color 0.22s ease,
    box-shadow 0.22s ease;
}

.card::before {
  content: "";
  position: absolute;
  top: 1rem;
  left: 0;
  width: 3px;
  height: calc(100% - 2rem);
  background: var(--category-color);
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 0.22s ease;
}

.card:hover::before {
  transform: scaleY(1);
}

.card:hover {
  transform: translateY(-3px);
  border-color: color-mix(in srgb, var(--category-color) 58%, var(--border));
  box-shadow: var(--shadow-1);
}

.card-index {
  color: var(--category-color);
}

.card h3 {
  margin: 0.9rem 0 0.55rem;
  color: var(--text);
  font-size: 1.18rem;
  line-height: 1.15;
}

.card p {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.5;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  gap: 0.8rem;
  align-items: center;
  margin-top: auto;
  padding-top: 1rem;
  color: var(--category-color);
  font-size: 0.88rem;
  font-weight: 850;
}

.card-footer :deep(svg) {
  flex: 0 0 auto;
  width: 18px;
  height: 18px;
}

.compact-roadmap {
  margin-top: 1rem;
}

.compact-link {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  min-height: 54px;
  padding: 0.9rem 1rem;
  border: 1px solid rgba(208, 138, 63, 0.38);
  border-radius: 8px;
  background: rgba(208, 138, 63, 0.08);
  color: var(--accent);
  font-weight: 900;
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

  .resources-hero h1 {
    font-size: 2.45rem;
  }

  .featured,
  .roadmap-card,
  .section-head {
    grid-template-columns: 1fr;
  }

  .map-preview {
    min-height: 180px;
  }

  .stats {
    grid-template-columns: 1fr;
  }

  .cards {
    grid-template-columns: 1fr;
  }

  .card {
    min-height: 0;
  }
}

@media (min-width: 769px) and (max-width: 1120px) {
  .featured,
  .roadmap-card {
    grid-template-columns: 1fr;
  }

  .map-preview {
    min-height: 220px;
  }

  .cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
