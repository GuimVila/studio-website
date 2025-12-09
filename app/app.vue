<template>
  <div>
    <NuxtRouteAnnouncer />
    <NavigationMenu />
    <NuxtPage />
    <AppFooter />
  </div>
</template>

<script setup>
import NavigationMenu from "~/components/NavigationMenu.vue";
import AppFooter from "~/components/AppFooter.vue";
</script>
