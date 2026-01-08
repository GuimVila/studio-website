<template>
  <header class="header">
    <nav class="nav-container">
      <!-- 1) Brand -->
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
        <p class="brand-name">Guillem Vila</p>
      </div>

      <!-- 2) Links -->
      <ul class="nav-menu" :class="{ active: menuOpen }">
        <li>
          <NuxtLink to="/" class="nav-link" @click="menuOpen = false">{{
            $t("nav.home")
          }}</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/gallery" class="nav-link" @click="menuOpen = false">{{
            $t("nav.gallery")
          }}</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/services" class="nav-link" @click="menuOpen = false">{{
            $t("nav.services")
          }}</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/about" class="nav-link" @click="menuOpen = false">{{
            $t("nav.about")
          }}</NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/resources"
            class="nav-link"
            @click="menuOpen = false"
            >{{ $t("nav.resources") }}</NuxtLink
          >
        </li>
        <li>
          <NuxtLink
            to="/subscribe"
            class="nav-link"
            @click="menuOpen = false"
            >{{ $t("nav.subscribe") }}</NuxtLink
          >
        </li>
        <li>
          <NuxtLink to="/contact" class="nav-link" @click="menuOpen = false">{{
            $t("nav.contact")
          }}</NuxtLink>
        </li>
      </ul>

      <!-- 3) User actions + burger (burger només visible en mòbil) -->
      <div class="right">
        <div class="user-actions">
          <LanguageSelector />
          <ToggleSwitch />
        </div>

        <button
          class="mobile-toggle"
          aria-label="Open menu"
          @click="toggleMenu"
        >
          ☰
        </button>
      </div>
    </nav>
  </header>
</template>

<script setup>
import ToggleSwitch from "~/components/ToggleSwitch.vue";
import LanguageSelector from "~/components/LanguageSelector.vue";

const menuOpen = ref(false);
function toggleMenu() {
  menuOpen.value = !menuOpen.value;
  document.documentElement.classList.toggle("nav-open", menuOpen.value);
}
</script>

<style scoped>
/* Logos tema */
.logo-light {
  display: none;
}
.logo-dark {
  display: block;
}

:root[data-theme="light"] .logo-dark {
  display: none;
}
:root[data-theme="light"] .logo-light {
  display: block;
}

/* Layout base: Brand | Links | Actions */
.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 16px;
}

/* Brand */
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0; /* important per truncar text */
  flex: 0 1 auto;
}

.logo-image {
  height: 28px;
  width: auto;
  flex: 0 0 auto;
}

.brand-name {
  margin: 0;
  white-space: nowrap; /* evita 2 línies */
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px; /* ajusta si vols */
  line-height: 1;
}

/* Links (desktop) */
.nav-menu {
  display: flex;
  align-items: center;
  gap: 18px;
  list-style: none;
  margin: 0;
  padding: 0;
  flex: 1 1 auto;
  justify-content: center; /* links al mig */
  min-width: 0;
}

/* Actions (dreta) */
.right {
  display: flex;
  align-items: center;
  gap: 10px; /* separa selector i burger */
  flex: 0 0 auto;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Burger */
.mobile-toggle {
  display: none; /* desktop off */
  align-items: center;
  justify-content: center;
  height: 38px;
  width: 42px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: transparent;
  color: inherit;
  cursor: pointer;
}

:root[data-theme="light"] .mobile-toggle {
  border-color: rgba(0, 0, 0, 0.18);
}

/* MÒBIL: amaguem links inline, burger visible, menú desplegable */
@media (max-width: 899px) {
  .mobile-toggle {
    display: inline-flex;
  }

  /* Links no ocupen la fila: es mostren només quan menuOpen */
  .nav-menu {
    display: none;
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    padding: 14px 16px;
    flex-direction: column;
    gap: 12px;
    justify-content: flex-start;
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(10px);
    z-index: 50;
  }

  :root[data-theme="light"] .nav-menu {
    background: rgba(255, 255, 255, 0.92);
  }

  .nav-menu.active {
    display: flex;
  }

  /* Evita que el nom rebenti en pantalles molt petites */
  @media (max-width: 380px) {
    .brand-name {
      display: none;
    }
  }
}
</style>
