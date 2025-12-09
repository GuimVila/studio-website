<template>
  <section class="section">
    <div class="container">
      <h2 class="section-title">Comença el teu projecte avui</h2>
      <p class="section-subtitle">
        Més de 100 projectes realitzats amb artistes d'arreu
      </p>
      <div class="button-wrapper">
        <NuxtLink to="/contact" class="btn btn-primary">Contacta'ns</NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section {
  background: var(--primary);
  border-radius: 30px;
}

.section-subtitle {
  text-align: center;
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.button-wrapper {
  text-align: center;
}
</style>
