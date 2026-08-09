import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    // Element Plus 按需引入：用到哪个组件自动 import 哪个，配合 dts 类型提示
    AutoImport({
      resolvers: [ElementPlusResolver()],
      dts: 'src/auto-imports.d.ts',
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'src/components.d.ts',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    host: '0.0.0.0',   // 加这一行，让容器外部能访问
    proxy: {
      '/api': {
        // 代理目标后端地址，可用 .env 的 VITE_PROXY_TARGET 覆盖（本地后端不在默认端口时用）
        target: process.env.VITE_PROXY_TARGET || 'http://localhost:3000',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('error', (err) => {
            // 后端未启动时静默处理，避免控制台抛 AggregateError
            if ((err as any).code === 'ECONNREFUSED') return
            console.warn('[proxy error]', err.message)
          })
        },
      },
    },
  },
})
