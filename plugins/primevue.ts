// plugins/primevue.ts
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

export default defineNuxtPlugin((nuxtApp) => {
  // Cấu hình PrimeVue
  nuxtApp.vueApp.use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        cssLayer: {
          name: "primevue",
          order: "primevue,base",
        },
        darkModeSelector: ".my-app-dark",
      },
    },
  })
})
