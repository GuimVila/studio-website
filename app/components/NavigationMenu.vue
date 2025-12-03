<template>
  <div>
    <header class="header">
      <nav class="nav-container">
        <div class="logo">🎵 Guillem Vila</div>
        <button class="mobile-toggle" @click="toggleMenu">☰</button>
        <ul class="nav-menu" :class="{ active: menuOpen }">
          <li><NuxtLink to="/" class="nav-link">Inici</NuxtLink></li>
          <li><NuxtLink to="/about" class="nav-link">Sobre mi</NuxtLink></li>
          <li><NuxtLink to="/services" class="nav-link">Serveis</NuxtLink></li>
          <li><NuxtLink to="/blog" class="nav-link">Blog</NuxtLink></li>
          <li><NuxtLink to="/portfolio" class="nav-link">Portfoli</NuxtLink></li>
          <li><NuxtLink to="/music" class="nav-link">Música</NuxtLink></li>
          <li><NuxtLink to="/contact" class="nav-link">Contacte</NuxtLink></li>
        </ul>
      </nav>
    </header>
  </div>
</template>

<script setup>
import { ref } from "vue";

const menuOpen = ref(false);

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}
</script>
