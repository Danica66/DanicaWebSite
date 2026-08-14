import { useauthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/Login.vue')},
    { path: '/',component:()=>import('@/components/AppLayout.vue'), meta: { requiresAuth: true },children:[
      {path: '',component: ()=>import('@/views/Home.vue')},
      {path: 'articles',children: [
        {path: '' , component: () => import('@/views/Articles.vue')},//查,删,改
        {path: 'create', component: () => import('@/views/ArticleEditor.vue')},//增
      ]},
    ] },
    { path: '/:pathMatch(.*)*', component: () => import('@/views/NotFound.vue') },
  ],
})

router.beforeEach((to) => {
  const authStore = useauthStore()
  // 需要登录的页面 → 没登录就跳到 login，记住原目标
  if (to.meta.requiresAuth && !authStore.isLogin) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
})

export default router
