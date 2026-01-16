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
        <LocaleLink to="/" class="brand-name-link">
          <p class="brand-name">Guillem Vila</p>
        </LocaleLink>
      </div>

      <!-- 2) Links -->
      <ul class="nav-menu" :class="{ active: menuOpen }">
        <li>
          <LocaleLink to="/" class="nav-link" @click="closeMenu">
            {{ $t("nav.home") }}
          </LocaleLink>
        </li>
        <li>
          <LocaleLink to="/gallery" class="nav-link" @click="closeMenu">
            {{ $t("nav.gallery") }}
          </LocaleLink>
        </li>
        <li>
          <LocaleLink to="/services" class="nav-link" @click="closeMenu">
            {{ $t("nav.services") }}
          </LocaleLink>
        </li>
        <li>
          <LocaleLink to="/about" class="nav-link" @click="closeMenu">
            {{ $t("nav.about") }}
          </LocaleLink>
        </li>
        <li>
          <LocaleLink to="/resources" class="nav-link" @click="closeMenu">
            {{ $t("nav.resources") }}
          </LocaleLink>
        </li>
        <li>
          <LocaleLink to="/subscribe" class="nav-link" @click="closeMenu">
            {{ $t("nav.subscribe") }}
          </LocaleLink>
        </li>
        <li>
          <LocaleLink to="/contact" class="nav-link" @click="closeMenu">
            {{ $t("nav.contact") }}
          </LocaleLink>
        </li>

        <!-- Mobile-only language selector inside the hamburger menu -->
        <li class="nav-sep" />
        <li class="nav-lang">
          <p class="nav-lang-title">{{ $t("nav.language") }}</p>

          <div class="nav-lang-actions">
            <button
              v-for="l in locales"
              :key="l.code"
              type="button"
              class="nav-lang-btn"
              :class="{ active: currentLocale === l.code }"
              @click="changeLocale(l.code)"
            >
              {{ l.short }}
            </button>
          </div>
        </li>
      </ul>

      <!-- 3) User actions + burger (burger només visible en mòbil) -->
      <div class="right">
        <div class="user-actions">
          <!-- Desktop-only language selector -->
          <div class="lang-desktop">
            <LanguageSelector />
          </div>

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
  if (import.meta.client) {
    document.documentElement.classList.toggle("nav-open", menuOpen.value);
  }
}

function closeMenu() {
  menuOpen.value = false;
  if (import.meta.client) {
    document.documentElement.classList.remove("nav-open");
  }
}

// i18n for the mobile language buttons
const { locale, setLocale } = useI18n();

const locales = [
  { code: "ca", short: "CA" },
  { code: "es", short: "ES" },
  { code: "en", short: "EN" },
];

const currentLocale = computed(() => String(locale.value || "ca"));

async function changeLocale(code) {
  if (code === currentLocale.value) return;
  await setLocale(code);
  closeMenu(); // close menu after changing language
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
}

/* Brand */
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex: 0 1 auto;
}

.logo-image {
  height: 28px;
  width: auto;
  flex: 0 0 auto;
}

.brand-name {
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px;
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
  justify-content: center;
  min-width: 0;
}

/* Actions (dreta) */
.right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 0 0 auto;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

/* Desktop-only language selector wrapper */
.lang-desktop {
  display: inline-flex;
}

/* Burger */
.mobile-toggle {
  display: none;
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

/* Mobile language block (hidden by default; shown in mobile menu) */
.nav-sep,
.nav-lang {
  display: none;
}

/* MÒBIL */
@media (max-width: 899px) {
  .mobile-toggle {
    display: inline-flex;
  }

  /* Hide desktop language selector on mobile */
  .lang-desktop {
    display: none;
  }

  /* Links become hamburger panel */
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

  /* Mobile language selector inside menu */
  .nav-sep {
    display: block;
    height: 1px;
    background: var(--border);
    margin: 0.75rem 0;
  }

  .nav-lang {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .nav-lang-title {
    margin: 0;
    font-weight: 700;
    color: var(--text);
    opacity: 0.9;
  }

  .nav-lang-actions {
    display: flex;
    gap: 0.75rem;
  }

  .nav-lang-btn {
    flex: 1;
    height: 42px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--text-secondary);
    cursor: pointer;
    font-weight: 800;
    letter-spacing: 0.02em;
    line-height: 1;
    transition: all 0.2s ease;
  }

  .nav-lang-btn:hover {
    color: var(--text);
    border-color: var(--border-strong);
  }

  .nav-lang-btn.active {
    color: #fff;
    border: none;
    background: linear-gradient(135deg, var(--accent-dark), var(--accent));
    box-shadow: var(--accent-shadow-1);
  }

  /* Evita que el nom rebenti en pantalles molt petites */
  @media (max-width: 380px) {
    .brand-name {
      display: none;
    }
  }
}
</style>
