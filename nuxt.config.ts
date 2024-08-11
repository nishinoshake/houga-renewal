// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        { rel: 'stylesheet', href: '/css/reset.css' },
        { rel: 'stylesheet', href: '/css/yakuhanmp-noto.css' }
      ]
    }
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "~/assets/scss/foundation/_variables" as *;
            @use "~/assets/scss/foundation/_mixin" as *;
          `
        }
      }
    }
  },
  modules: [['@nuxtjs/google-fonts', {
    families: {
      'Roboto Mono': [300],
      'Noto Serif JP': [200]
    }
  }]],
})