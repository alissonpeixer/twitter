export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "nuxt-primevue",
    'nuxt-icon',
    '@nuxtjs/supabase',
    '@nuxt/image',
    '@nuxtjs/tailwindcss'
  ],
  primevue: {
    cssLayerOrder: "tailwind-base, primevue, tailwind-utilities",
    components: {
      exclude: ["Editor", "Chart"]
    }
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  build: {
    transpile: ["primevue"],
  },
  css: ["./primevue/resources/themes/lara-dark-green/theme.css",'@/assets/css/tailwind.css'],
  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL || 'http://localhost:3000'
    }
  },
  supabase: {
    redirectOptions: {
      login: '/signin',
      callback: '/confirm'
    }
  },
  components: [
    {
      path: '~/components',
     pathPrefix: false,
    },
  ],
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    }
  }
});