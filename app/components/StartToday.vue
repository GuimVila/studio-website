<template>
  <section class="section section--cta">
    <div class="container">
      <h2 class="section-title">Comença el teu projecte avui</h2>
      <p class="section-subtitle">
        Producció, edició, gravació i mescla amb un flux de treball àgil i eficient.
      </p>
      <div class="button-wrapper">
        <NuxtLink to="/contact" class="btn btn-primary"> Contacta'ns </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section--cta {
  background: var(--surface-2);
  border-radius: 30px;
  padding: clamp(3rem, 5vw, 5rem) 2rem;
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
