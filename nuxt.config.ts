export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    "nuxt-primevue",
    '@nuxtjs/supabase',
    'nuxt-icon',
    "@nuxt/image"
  ],
  extends: ['nuxt-emoji'],
  primevue: {
    importPT: { as: 'Lara', from: __dirname+'/presets/lara/' },
    cssLayerOrder: 'tailwind-base, primevue,  tailwind-utilities',
    options:{
      unstyled: false,
    }
  },
  supabase: {
    redirectOptions: {
      login: '/signin',
      callback: '/confirm'
    }
  },
  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL || 'http://127.0.0.1'
    }
  },

  css: ['~/assets/css/main.css'],


})