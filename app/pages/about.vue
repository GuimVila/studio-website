<template>
  <div>
    <NavigationMenu />

    <div style="padding-top: 100px">
      <section class="section">
        <h1 class="section-title">Sobre mi</h1>
        <p
          style="
            text-align: center;
            font-size: 1.2rem;
            color: var(--text-secondary);
            margin-bottom: 4rem;
          "
        >
          Una mica sobre mi i la meva trajectòria en el món de la música.
        </p>
      </section>

      <section class="section">
        <p
          style="
            text-align: center;
            font-size: 1.2rem;
            color: var(--text-secondary);
            margin-bottom: 4rem;
          "
        >
          Sóc un productor musical amb més de 10 anys d'experiència en la
          indústria. He treballat amb diversos artistes i gèneres, aportant
          sempre una perspectiva fresca i innovadora als meus projectes.
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
