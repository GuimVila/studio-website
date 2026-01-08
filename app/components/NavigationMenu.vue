<template>
  <header class="header">
    <nav class="nav-container">
      <div class="logo">
        <img
          src="/images/logo-web_blanc.png"
          alt="Logo dark"
          class="logo-image logo-dark"
        >
        <img
          src="/images/logo-web-negre2.png"
          alt="Logo light"
          class="logo-image logo-light"
        >
        <p>Guillem Vila</p>
      </div>
      <button class="mobile-toggle" @click="toggleMenu">☰</button>
      <ul class="nav-menu" :class="{ active: menuOpen }">
        <li>
          <NuxtLink to="/" class="nav-link" @click="menuOpen = false"
            >{{ $t("nav.home") }}</NuxtLink
          >
        </li>
        <li>
          <NuxtLink to="/gallery" class="nav-link" @click="menuOpen = false"
            >{{ $t("nav.gallery") }}</NuxtLink
          >
        </li>
        <li>
          <NuxtLink to="/services" class="nav-link" @click="menuOpen = false"
            >{{ $t("nav.services") }}</NuxtLink
          >
        </li>
        <li>
          <NuxtLink to="/about" class="nav-link" @click="menuOpen = false"
            >{{ $t("nav.about") }}</NuxtLink
          >
        </li>
        <!-- <li>
          <NuxtLink to="/portfolio" class="nav-link">Portfoli</NuxtLink>
        </li>
        <li><NuxtLink to="/music" class="nav-link" @click="menuOpen = false">Música</NuxtLink></li> -->
        <li>
          <NuxtLink to="/resources" class="nav-link" @click="menuOpen = false"
            >{{ $t("nav.resources") }}</NuxtLink
          >
        </li>
        <li>
          <NuxtLink to="/subscribe" class="nav-link" @click="menuOpen = false"
            >{{ $t("nav.subscribe") }}</NuxtLink
          >
        </li>
        <li>
          <NuxtLink to="/contact" class="nav-link" @click="menuOpen = false"
            >{{ $t("nav.contact") }}</NuxtLink
          >
        </li>
      </ul>
      <div class="user-actions">
        <LanguageSelector />
      </div>
      <ToggleSwitch />
    </nav>
  </header>
</template>

<script setup>
import ToggleSwitch from "~/components/ToggleSwitch.vue";
import LanguageSelector from "~/components/LanguageSelector.vue";

const menuOpen = ref(false);

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}
</script>

<style scoped>
/* Per defecte: dark mode */
.logo-light {
  display: none;
}

.logo-dark {
  display: block;
}

/* Light mode */
:root[data-theme="light"] .logo-dark {
  display: none;
}

:root[data-theme="light"] .logo-light {
  display: block;
}
</style>
