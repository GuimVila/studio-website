<template>
  <div class="page">
    <section class="section">
      <h1 class="section-title">Recursos</h1>
      <p class="section-intro">
        Aprèn producció, mescla, disseny de so i més amb els recursos que
        trobaràs a continuació.
      </p>
      <!-- Categories -->
      <div class="categories">
        <button
          v-for="cat in categories"
          :key="cat"
          :class="[
            'btn',
            'category-btn',
            selectedCategory === cat ? 'btn-primary' : 'btn-secondary',
          ]"
          @click="selectedCategory = cat"
        >
          {{ cat }}
        </button>
      </div>
      <!-- Tutorials Grid -->
      <div class="tutorials-grid">
        <TutorialCard
          v-for="tutorial in filteredTutorials"
          :key="tutorial.id"
          v-bind="tutorial"
        />
      </div>
      <div v-if="filteredTutorials.length === 0" class="empty-state">
        <p>No hi ha tutorials disponibles en aquesta category.</p>
      </div>
    </section>
  </div>
</template>
<script setup>
import TutorialCard from "~/components/TutorialCard.vue";
import { useTutorials } from "~/composables/useTutorials.js";

const { selectedCategory, categories, filteredTutorials } = useTutorials();

useHead({
  title: "Recursos | Guillem Vila · Producció musical i educació en música",
  meta: [
    {
      name: "description",
      content:
        "Comparteixo recursos educatius en producció, mescla, harmonia, teoria musical, gravació i d'altres, per ajudar artistes i productors a millorar les seves habilitats i projectes musicals.",
    },
  ],
});
</script>
<style scoped>
.page {
  padding-top: 100px;
}
.section-intro {
  text-align: center;
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

h1 {
  text-align: center;
  font-size: clamp(2.5rem, 5vw, 3rem);
  font-weight: 900;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, #ffffff 0%, #ff6b35 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.categories {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 3rem;
}
.category-btn {
  padding: 0.7rem 1.5rem;
}
.empty-state {
  text-align: center;
  padding: 4rem;
  color: var(--text-secondary);
}
.empty-state p {
  font-size: 1.2rem;
}
</style>
