import { useauthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: () => import('@/views/Home.vue') },
    { path: '/login', component: () => import('@/views/Login.vue'), meta: { guest: true } },
    { path: '/articles/:id', component: () => import('@/views/ArticleDetail.vue') },
    { path: '/articles/create', component: () => import('@/views/ArticleEditor.vue'), meta: { requiresAuth: true } },
    { path: '/articles', component: () => import('@/views/Articles.vue') },
    { path: '/articles/:id/edit', component: () => import('@/views/ArticleEditor.vue'), meta: { requiresAuth: true } },
    { path: '/profile', component: () => import('@/views/Profile.vue'), meta: { requiresAuth: true } },
    { path: '/:pathMatch(.*)*', component: () => import('@/views/NotFound.vue') },
  ],
})

router.beforeEach((to) => {
  const authStore = useauthStore()

  // 需要登录的页面 → 没登录就跳到 login，记住原目标
  if (to.meta.requiresAuth && !authStore.isLogin) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  // 登录/注册页 → 已登录就跳到首页
  if (to.meta.guest && authStore.isLogin) {
    return '/'
  }
})

export default router
