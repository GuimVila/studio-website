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
    <AnalyticsLoader />
  </div>
</template>

<script setup>
import NavigationMenu from "~/components/NavigationMenu.vue";
import AppFooter from "~/components/AppFooter.vue";
import CookieBanner from "~/components/CookieBanner.vue";
import AnalyticsLoader from "~/components/AnalyticsLoader.vue";
</script>

