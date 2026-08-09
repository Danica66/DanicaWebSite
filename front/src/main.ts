import { createApp } from 'vue'
import { createPinia } from 'pinia'
// Element Plus 组件已由 unplugin 按需自动引入，这里只保留基础变量样式
import 'element-plus/theme-chalk/base.css'
import '@/styles/global.css'

import App from './App.vue'
import router from './router'

document.title = import.meta.env.VITE_APP_TITLE
const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
