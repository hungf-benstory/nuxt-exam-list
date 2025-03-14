// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primeuix/themes/aura';
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  app: {
    head: {
      title: 'My Nuxt App',
      meta: [
        { name: 'description', content: 'Ứng dụng Nuxt 3 với TailwindCSS, Pinia và PrimeVue' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      script: [
        {
          src: 'https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js',
          type: 'text/javascript',
          async: true,
          defer: true
        }
      ],
    }
  },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@primevue/nuxt-module',
    "nuxt-lodash"
  ],
  primevue: {
    autoImport: true,
    options: {
      theme: {
        preset: Aura,
        options: {
          cssLayer: {
            name: "primevue",
            order: "primevue,base,tailwindcss-primeui"
          },
          darkModeSelector: ".my-app-dark",
        },
      },
    }
  },
  css: ["~/assets/main.scss", "primeicons/primeicons.css", "tailwindcss-primeui"],

  // Axios configuration for API
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000/',
    },
  },

  plugins: [
    '~/plugins/axios.ts',  // Add axios plugin
  ],

})
