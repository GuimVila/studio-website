// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },

  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  ssr: true,
  nitro: {
    preset: "vercel",
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "https://api.guillemvila.com/api",
    },
  },

  css: ["~/assets/css/main.css"],

  modules: [
    "@nuxt/hints",
    "@nuxt/eslint",
    "@nuxt/content",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/ui",
    "@nuxt/test-utils",
    "motion-v/nuxt",
    "@pinia/nuxt",
    "@nuxtjs/sitemap",
    "@nuxtjs/i18n",
  ],

  image: {
    format: ["avif", "webp", "jpeg"],
    quality: 70,
    screens: {
      xs: 480,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  },

  site: {
    url: "https://guillemvila.com",
    name: "Guillem Vila",
  },

  sitemap: {
    exclude: ["/subscribe/error", "/subscribe/confirmed"],
  },
  i18n: {
    strategy: "prefix_except_default",
    defaultLocale: "ca",
    detectBrowserLanguage: false,
    locales: [
      { code: "ca", language: "ca-ES", name: "Català", file: "ca.json" },
      { code: "es", language: "es-ES", name: "Español", file: "es.json" },
      { code: "en", language: "en-US", name: "English", file: "en.json" },
    ],
  },
});
