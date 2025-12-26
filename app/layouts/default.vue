<template>
  <div class="layout">
    <NavigationMenu />

    <main class="main">
      <slot />
    </main>

    <AppFooter />
    <ClientOnly>
      <CookieBanner />
    </ClientOnly>
  </div>
</template>

<script setup>
import NavigationMenu from "~/components/NavigationMenu.vue";
import AppFooter from "~/components/AppFooter.vue";
import CookieBanner from "~/components/CookieBanner.vue";
</script>

<style>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
  min-height: 100vh;
}
</style>
