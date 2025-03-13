// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  app: {
    head: {
      title: 'CBT Exam',
      meta: [
        { name: 'description', content: 'CBT exam-list' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      script: [
        {
          src: 'https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js',
          type: 'text/javascript',
          async: true,
          defer: true,
        },
      ],
    },
  },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@primevue/nuxt-module',
    'nuxt-lodash',
  ],
  css: ['~/assets/main.scss', 'primeicons/primeicons.css', 'tailwindcss-primeui'],

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'https://api.example.com',
    },
  },
})
