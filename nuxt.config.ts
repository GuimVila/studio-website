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
  ],

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
});
