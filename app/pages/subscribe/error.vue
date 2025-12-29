<template>
  <div style="padding-top: 100px">
    <section class="section">
      <h1 class="section-title">Error</h1>
      <p
        style="
          text-align: center;
          font-size: 1.2rem;
          color: var(--text-secondary);
          margin-bottom: 2rem;
        "
      >
        Hi ha hagut un problema processant la subscripció. Torna-ho a provar més
        tard.
      </p>
    </section>
  </div>
</template>

<script setup>
useHead({
  title: "Subscripció | Error",
});
</script>

<style scoped>
h1 {
  text-align: center;
  font-size: clamp(2.5rem, 5vw, 3rem);
  font-weight: 900;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, #ffffff 0%, #ff6b35 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
