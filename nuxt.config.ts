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
    "@nuxtjs/supabase",
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

  supabase: {
    url: process.env.NUXT_SUPABASE_URL,
    key: process.env.NUXT_SUPABASE_ANON_KEY,
    redirect: false,
  },

  site: {
    url: "https://guillemvila.com",
    name: "Guillem Vila",
  },

  sitemap: {
    exclude: ["/subscribe/error", "/subscribe/confirmed"],
  },
  i18n: {
    locales: [
      { code: "ca", iso: "ca-ES", name: "Català" },
      { code: "es", iso: "es-ES", name: "Español" },
      { code: "en", iso: "en-GB", name: "English" },
    ],
    defaultLocale: "ca",
    strategy: "prefix_except_default", // o "prefix"
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      fallbackLocale: "ca",
      alwaysRedirect: false,
    },
  },
});
