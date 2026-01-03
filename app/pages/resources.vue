<template>
  <div class="page-wrapper">
    <section class="section">
      <h1 class="section-title heading-accent">Recursos</h1>

      <p class="section-subtitle">
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
        <p>No hi ha tutorials disponibles en aquesta categoria.</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import TutorialCard from "~/components/TutorialCard.vue";
import { useTutorials } from "~/composables/useTutorials";

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
.page-wrapper {
  padding-top: 100px;
}

.section {
  text-align: center;
}

.categories {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin: 3rem 0;
}

.category-btn {
  padding: 0.7rem 1.5rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);
}

.empty-state p {
  font-size: 1.2rem;
}
</style>
