<template>
  <header class="header">
    <nav class="nav-container">
      <div class="logo">
        <img
          key="logo"
          src="/images/logo-web_blanc.png"
          alt="Logo"
          class="logo-image"
        >
        <p>Guillem Vila</p>
      </div>
      <button class="mobile-toggle" @click="toggleMenu">☰</button>
      <ul class="nav-menu" :class="{ active: menuOpen }">
        <li><NuxtLink to="/" class="nav-link">Inici</NuxtLink></li>
        <li>
          <NuxtLink to="/gallery" class="nav-link" @click="menuOpen = false"
            >Galeria</NuxtLink
          >
        </li>
        <li>
          <NuxtLink to="/services" class="nav-link" @click="menuOpen = false"
            >Serveis</NuxtLink
          >
        </li>
        <li>
          <NuxtLink to="/about" class="nav-link" @click="menuOpen = false"
            >Sobre mi</NuxtLink
          >
        </li>
        <!-- <li>
          <NuxtLink to="/portfolio" class="nav-link">Portfoli</NuxtLink>
        </li>
        <li><NuxtLink to="/music" class="nav-link" @click="menuOpen = false">Música</NuxtLink></li> -->
        <li>
          <NuxtLink to="/resources" class="nav-link" @click="menuOpen = false"
            >Recursos</NuxtLink
          >
        </li>
        <li>
          <NuxtLink to="/subscribe" class="nav-link" @click="menuOpen = false"
            >Subscriu-te</NuxtLink
          >
        </li>
        <li>
          <NuxtLink to="/contact" class="nav-link" @click="menuOpen = false"
            >Contacte</NuxtLink
          >
        </li>
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
