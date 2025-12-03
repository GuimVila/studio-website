<template>
  <div>
    <NavigationMenu />

    <div style="padding-top: 100px">
      <section class="section">
        <h1 class="section-title">Música</h1>
        <p
          style="
            text-align: center;
            font-size: 1.2rem;
            color: var(--text-secondary);
            margin-bottom: 4rem;
          "
        >
          Escolta algunes de les meves creacions musicals, col.laboracions i projectes destacats.
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
