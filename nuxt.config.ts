// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  
  modules: [
    '@nuxtjs/tailwindcss'
  ],

  app: {
    baseURL: '/',
    head: {
      title: 'No Kings Countdown',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '30 Days Until No Kings March - 30 ways to make a difference' }
      ],
      link: [
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css' }
      ]
    }
  },

  css: [
    '@/assets/css/main.css'
  ],

  ssr: false,

  nitro: {
    preset: 'static',
    output: {
      publicDir: 'out'
    }
  },

  typescript: {
    strict: true,
    typeCheck: true
  },

  runtimeConfig: {
    public: {
      commitSha: process.env.NUXT_PUBLIC_COMMIT_SHA || 'dev',
      commitRef: process.env.NUXT_PUBLIC_COMMIT_REF || 'local',
      buildDate: process.env.NUXT_PUBLIC_BUILD_DATE || new Date().toISOString(),
      sheetUrl: process.env.NUXT_PUBLIC_SHEET_URL || 'https://docs.google.com/spreadsheets/d/1kG5tVKYaz6Wny2wIZKmbhloD_3Bwl5NeqsPNNGxcHIA/export?format=csv'
    }
  }
});
