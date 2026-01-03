<template>
  <div class="page">
    <section class="section">
      <h1 class="section-title">Alguna cosa no ha anat bé</h1>

      <div class="error-text">
        <p>
          Hi ha hagut un problema processant la subscripció.<br >
          Si us plau, torna-ho a provar més tard.
        </p>
      </div>

      <div class="actions">
        <NuxtLink to="/" class="btn btn-secondary"> Tornar a l'inici </NuxtLink>
        <NuxtLink to="/subscribe" class="btn btn-primary">
          Tornar-me a subscriure
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
useHead({
  title: "Error | Guillem Vila",
});
</script>

<style scoped>
.page {
  padding-top: 120px;
  padding-bottom: 4rem;
}

/* Text */
.error-text {
  max-width: 620px;
  margin: 0 auto 2.5rem auto;
}

.error-text p {
  text-align: center;
  font-size: 1.15rem;
  line-height: 1.6;
  color: var(--text-secondary);
}

/* Accions */
.actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

/* Ajust mòbil */
@media (max-width: 480px) {
  .actions {
    flex-direction: column;
    align-items: center;
  }

  .actions .btn {
    width: 100%;
    max-width: 280px;
    text-align: center;
  }
}
</style>
