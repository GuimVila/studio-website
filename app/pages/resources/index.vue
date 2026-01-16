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
        v-for="category in categories"
        :key="category.id"
        class="card"
        :to="localePath(`/resources/${category.slug}`)"
      >
        <div class="title">{{ category.name_ca }}</div>
        <div class="sub">
          {{
            t("resourcesHub.categoryCount", {
              count: category.articleCount,
              plural: category.articleCount,
            })
          }}
        </div>
      </NuxtLink>
    </div>

    <p v-if="!pending && !categories.length" class="debug">
      {{ $t("resourcesHub.debug.noCategories") }}
    </p>
  </section>
</template>

<script setup>
import { useI18n, useLocalePath } from "#i18n";

const { t } = useI18n();
const localePath = useLocalePath();
const supabase = useSupabaseClient();

// DEBUG: Verificar configuración de Supabase
if (process.client) {
  console.log("🔍 DEBUG - Supabase Configuration:");
  console.log("  Actual URL:", supabase.supabaseUrl);
  console.log("  Expected (local): http://127.0.0.1:54321");
  console.log("  Expected (prod): https://pzkqgccyzzojplquobkw.supabase.co");
  console.log("  Env NUXT_SUPABASE_URL:", process.env.NUXT_SUPABASE_URL);
}

const { data: categories, pending } = await useAsyncData(
  "resources-categories",
  async () => {
    // Obtener categorías con conteo de artículos
    const { data, error } = await supabase
      .from("categories")
      .select(
        `
        id,
        slug,
        name_ca,
        name_es,
        name_en,
        articles(id)
      `
      )
      .eq("articles.published", true)
      .order("id");

    if (error) {
      console.error("❌ Error loading categories:", error);
      console.error("   Code:", error.code);
      console.error("   Message:", error.message);
      return [];
    }

    return (data || []).map((cat) => ({
      ...cat,
      articleCount: (cat.articles || []).length,
    }));
  },
  { default: () => [] }
);
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
