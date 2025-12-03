<template>
  <div>
    <NavigationMenu />

    <div style="padding-top: 100px">
      <section class="section">
        <h1 class="section-title">Portfoli</h1>
        <p
          style="
            text-align: center;
            font-size: 1.2rem;
            color: var(--text-secondary);
            margin-bottom: 4rem;
          "
        >
            Una selecció dels meus projectes i treballs realitzats.
        </p>
      </section>
    </div>

    <AppFooter />
  </div>
</template>

<script setup>
import NavigationMenu from "~/components/NavigationMenu.vue";
import AppFooter from "~/components/AppFooter.vue";
</script>
