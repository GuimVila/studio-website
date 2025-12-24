<template>
  <header class="header">
    <nav class="nav-container">
      <div class="logo">
        <img
          key="logo"
          src="/assets/images/logo-web_blanc.png"
          alt="Logo"
          class="logo-image"
        >
        <p>Guillem Vila</p>
      </div>
      <button class="mobile-toggle" @click="toggleMenu">☰</button>
      <ul class="nav-menu" :class="{ active: menuOpen }">
        <li><NuxtLink to="/" class="nav-link">Inici</NuxtLink></li>
        <li><NuxtLink to="/gallery" class="nav-link">Galeria</NuxtLink></li>
        <li><NuxtLink to="/services" class="nav-link">Serveis</NuxtLink></li>
        <li><NuxtLink to="/about" class="nav-link">Sobre mi</NuxtLink></li>
        <li>
          <NuxtLink to="/portfolio" class="nav-link">Portfoli</NuxtLink>
        </li>
        <li><NuxtLink to="/music" class="nav-link">Música</NuxtLink></li>
        <li><NuxtLink to="/resources" class="nav-link">Recursos</NuxtLink></li>
        <li><NuxtLink to="/subscribe" class="nav-link">Subscriu-te</NuxtLink></li>
        <li><NuxtLink to="/contact" class="nav-link">Contacte</NuxtLink></li>
      </ul>
      <div class="user-actions">
        <ToggleSwitch />
      </div>
    </nav>
  </header>
</template>

<script setup>
import ToggleSwitch from "~/components/ToggleSwitch.vue";
const menuOpen = ref(false);

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}
</script>

<style scoped>
/* .header {
  position: fixed;
  top: 0;
  width: 100%;
  background-color: var(--background-dark);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
} */

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-image {
  height: 40px;
  margin-right: 10px;
}

.logo p {
  margin: 0;
  font-size: 1.5rem;
}
</style>
