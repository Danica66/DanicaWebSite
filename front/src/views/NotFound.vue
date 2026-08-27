<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const goHome = () => router.push('/')
</script>

<template>
  <!-- 居中单栏：简洁错误页 -->
  <div class="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
    <div class="glass-card w-full p-12">
      <p class="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-8xl font-black text-transparent select-none">
        404
      </p>
      <h1 class="mt-6 text-xl font-semibold text-slate-800 dark:text-slate-100">
        你好，你好像进错网页了呢
      </h1>
      <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
        该网页为 404 专属页面，请回去吧
      </p>
      <button
        type="button"
        class="mt-8 rounded-full bg-primary px-8 py-2.5 text-sm font-medium text-white shadow-md shadow-primary/30 transition-all hover:bg-primary-dark active:scale-95"
        @click="goHome"
      >
        回到首页
      </button>
    </div>
  </div>
</template>
