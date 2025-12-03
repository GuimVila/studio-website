// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      supabaseUrl: process.env.NUXT_SUPABASE_URL || '',
      supabaseKey: process.env.NUXT_SUPABASE_ANON_KEY || ''
    }
  },
  modules: [
    '@nuxt/hints',
    '@nuxt/eslint',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/ui',
    '@nuxt/test-utils'
  ]
})