<script setup lang="ts">
const siteName = import.meta.env.VITE_SITE_NAME || 'Danica'
// Hero 背景图片：把图片放到 front/public/ 后在这里填路径即可（如 '/hero.jpg'）
// 未配置时使用渐变 + 光斑装饰
const bgImage = ''
</script>

<template>
  <section
    class="relative flex h-[100vh] min-h-[560px] w-full items-center justify-center overflow-hidden"
  >
    <!-- 背景图片（可选）+ 渐变遮罩 -->
    <div
      class="absolute inset-0 bg-cover bg-center"
      :style="bgImage ? { backgroundImage: `url(${bgImage})` } : {}"
    >
      <div class="absolute inset-0 bg-gradient-to-br from-primary-dark/70 via-primary/50 to-purple-500/40" />
      <!-- 渐变遮罩：压暗背景让文字清晰 -->
      <div class="absolute inset-0 bg-black/40" />
    </div>

    <!-- 装饰光斑（毛玻璃氛围） -->
    <div class="pointer-events-none absolute inset-0" aria-hidden="true">
      <div class="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
      <div class="absolute right-1/4 bottom-1/4 h-72 w-72 rounded-full bg-sky-300/30 blur-3xl" />
    </div>

    <!-- 居中文案 -->
    <div class="relative z-10 px-6 text-center text-white">
      <h1 class="text-4xl font-bold leading-tight drop-shadow-lg sm:text-5xl md:text-6xl">
        欢迎来到 {{ siteName }} 的小站
      </h1>
      <p class="mx-auto mt-4 max-w-xl text-base text-white/90 drop-shadow sm:text-lg">
        随便发一点学习笔记什么的
      </p>
      <div class="mt-8 flex items-center justify-center gap-4">
        <a
          href="#recent"
          class="rounded-full border border-white/50 bg-white/15 px-7 py-2.5 text-sm font-medium backdrop-blur-md transition-all hover:bg-white/30"
        >
          浏览文章
        </a>
        <a
          href="/api/rss"
          target="_blank"
          rel="noopener"
          class="rounded-full border border-white/50 px-7 py-2.5 text-sm font-medium backdrop-blur-md transition-all hover:bg-white/30"
        >
          RSS 订阅
        </a>
      </div>
    </div>
  </section>
</template>
