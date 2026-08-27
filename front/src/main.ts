import { createApp } from 'vue'
import { createPinia } from 'pinia'
// Tailwind v4 样式入口（含设计令牌 / 暗色模式 / markdown 内容样式）
import '@/styles/main.css'

import App from './App.vue'
import router from './router'

document.title = import.meta.env.VITE_APP_TITLE
const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
