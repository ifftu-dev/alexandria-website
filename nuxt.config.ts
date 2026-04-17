export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/sitemap',
  ],

  site: {
    url: 'https://alexandria.ifftu.dev',
  },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [
      (await import('@tailwindcss/vite')).default(),
    ],
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      title: 'Alexandria — Free, Decentralized Learning for Everyone',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: 'Alexandria is a free, open-source, decentralized learning platform. A native app for macOS, Windows, Linux, iOS, and Android. P2P networking, offline-first, W3C Verifiable Credentials anchored to Cardano. No servers. No gatekeepers.' },
        { name: 'theme-color', content: '#ffffff', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#0f172a', media: '(prefers-color-scheme: dark)' },
        { name: 'color-scheme', content: 'light dark' },
        { name: 'keywords', content: 'learning platform, free education, open source, decentralized, verifiable credentials, did, selective disclosure, peer-to-peer learning, offline-first, native app, Tauri, Cardano' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Alexandria' },
        { property: 'og:image', content: 'https://alexandria.ifftu.dev/og-image.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: 'https://alexandria.ifftu.dev/og-image.png' },
      ],
      script: [
        {
          innerHTML: `(function(){try{var t=localStorage.getItem('alexandria-theme')||'dark';var d=document.documentElement;if(t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme:dark)').matches))d.classList.add('dark')}catch(e){}})()`,
          type: 'text/javascript',
        },
        {
          src: 'https://plausible.io/js/script.outbound-links.file-downloads.tagged-events.js',
          defer: true,
          'data-domain': 'alexandria.ifftu.dev',
        },
        {
          innerHTML: `window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)}`,
          type: 'text/javascript',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:wght@400;500;600;700&display=swap', media: 'print', onload: "this.media='all'" },
      ],
    },
  },
})
