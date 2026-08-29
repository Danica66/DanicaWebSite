import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@shared': fileURLToPath(new URL('../shared', import.meta.url))
    },
  },
  server: {
    host: '0.0.0.0',   // 加这一行，让容器外部能访问
    fs: {
      allow: ['..'],  // 允许访问上级目录的 shared/ 共享类型
    },
    proxy: {
      '/admin': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('error', (err) => {
            if ((err as any).code === 'ECONNREFUSED') return
            console.warn('[proxy error]', err.message)
          })
        },
      },
    },
  },
})
