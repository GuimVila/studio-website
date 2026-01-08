<template>
  <section class="section section--cta">
    <div class="container">
      <h2 class="section-title">{{ $t("startToday.title") }}</h2>
      <p class="section-subtitle">
        {{ $t("startToday.subtitle") }}
      </p>
      <div class="button-wrapper">
        <NuxtLink to="/contact" class="btn btn-primary">{{ $t("startToday.cta") }}</NuxtLink>
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
