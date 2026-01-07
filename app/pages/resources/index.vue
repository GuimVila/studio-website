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
        <div class="sub">Explora articles en aquesta categoria</div>
      </NuxtLink>
    </div>

    <p v-if="!categories.length" class="debug">
      No categories found. Docs detected: {{ (docs || []).length }}
    </p>
  </section>
</template>

<script setup>
import { computed } from "vue";

const { data: docs } = await useAsyncData("resources-hub", async () => {
  return await queryCollection("resources").select("path", "title").all();
});

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
  // 1) mapping explícit (recomanat: accents i estil perfectes)
  if (CATEGORY_LABELS[slug]) return CATEGORY_LABELS[slug];

  // 2) fallback decent si mai surt una categoria nova
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

const categories = computed(() => {
  const set = new Set();

  for (const d of docs.value || []) {
    const p = String(d.path || "");
    const parts = p.split("/").filter(Boolean);
    if (parts.length >= 2 && parts[0] === "resources") set.add(parts[1]);
  }

  return Array.from(set)
    .sort()
    .map((slug) => ({ slug, label: categoryLabel(slug) }));
});
</script>

<style scoped>
.page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 4rem 2rem;
  color: var(--text);
}

.header {
  margin-bottom: 3rem;
}

.header h1 {
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 800;
  margin-bottom: 0.75rem;
  color: var(--text);
}

.header p {
  font-size: 1.05rem;
  color: var(--text-secondary);
  line-height: 1.5;
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

  .header {
    margin-bottom: 2rem;
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
