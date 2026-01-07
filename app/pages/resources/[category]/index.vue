<template>
  <section class="page">
    <section class="section">
      <h1 class="section-title heading-accent capitalize">
        {{ categoryLabelText }}
      </h1>
      <NuxtLink class="back" to="/resources">← Enrere</NuxtLink>
    </section>

    <ul class="list">
      <li v-for="a in articles" :key="a.path">
        <NuxtLink :to="a.path">{{ a.title }}</NuxtLink>
      </li>
    </ul>

    <p v-if="!pending && !articles.length" class="empty">
      No s'han trobat articles en aquesta categoria.
    </p>
  </section>
</template>

<script setup>
import { computed, onMounted } from "vue";

const route = useRoute();
const category = computed(() => String(route.params.category || "").trim());

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

const categoryLabelText = computed(() => categoryLabel(category.value));

const {
  data: articles,
  pending,
  refresh,
} = await useAsyncData(
  () => `resources-cat-${category.value}`,
  async () => {
    const prefix = `/resources/${category.value}/`;

    const rows = await queryCollection("resources")
      .where("path", "LIKE", `${prefix}%`)
      .select("title", "path", "seq")
      .all();

    return (rows || []).sort(
      (a, b) => (Number(a.seq) || 999999) - (Number(b.seq) || 999999)
    );
  },
  { default: () => [] }
);

// Fallback robust: si SSR a prod torna buit, força refetch al client
onMounted(() => {
  if (!(articles.value || []).length) refresh();
});
</script>

<style scoped>
.page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 4rem 2rem;
  color: var(--text);
}

.back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 50px;
  text-decoration: none;
  color: var(--text);
  font-weight: 500;
  transition: all 0.25s ease;
}

.back:hover {
  background: var(--surface-2);
  border-color: var(--accent);
  color: var(--accent);
  transform: translateX(-3px);
  text-decoration: none;
}

.list {
  margin-top: 2rem;
  display: grid;
  gap: 1rem;
  list-style: none;
  padding: 0;
}

.list li {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  transition: all 0.25s ease;
  overflow: hidden;
}

.list li:hover {
  transform: translateX(6px);
  border-color: var(--accent);
  box-shadow: var(--shadow-1);
}

.list a {
  display: block;
  padding: 1.5rem 2rem;
  text-decoration: none;
  color: var(--text);
  font-weight: 500;
  font-size: 1.1rem;
  position: relative;
}

.list a:hover {
  text-decoration: none;
}

.list a::before {
  content: "→";
  position: absolute;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--accent);
  font-size: 1.5rem;
  opacity: 0;
  transition: opacity 0.25s ease;
}

.list li:hover a::before {
  opacity: 1;
}

.empty {
  color: var(--text-secondary);
  margin-top: 2rem;
  text-align: center;
  font-size: 1.1rem;
}

/* .capitalize {
  text-transform: capitalize;
} */

@media (max-width: 768px) {
  .page {
    padding: 3rem 1.5rem;
  }
  .list a {
    padding: 1.25rem 1.5rem;
    font-size: 1rem;
  }
}
</style>
