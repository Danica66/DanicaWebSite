<script setup lang="ts">
const siteName = import.meta.env.VITE_SITE_NAME || 'Danica'
// Hero 背景图片：把图片放到 front/public/ 后在这里填路径即可（如 '/hero.jpg'）
// 未配置时使用纯渐变背景
const bgImage = ''
</script>

<template>
  <section
    class="hero relative flex h-[100vh] min-h-[560px] w-full items-center justify-center overflow-hidden"
  >
    <!-- 背景图片（可选，覆盖渐变） -->
    <div
      v-if="bgImage"
      class="absolute inset-0 bg-cover bg-center"
      :style="{ backgroundImage: `url(${bgImage})` }"
    />

    <!-- 居中文案 -->
    <div class="relative z-10 px-6 text-center text-slate-900 dark:text-white">
      <h1 class="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
        欢迎来到 {{ siteName }} 的小站
      </h1>
      <p class="mx-auto mt-4 max-w-xl text-base text-slate-600 sm:text-lg dark:text-white/90">
        随便发一点学习笔记什么的
      </p>
      <div class="mt-8 flex items-center justify-center gap-4">
        <a
          href="#recent"
          class="rounded-full border border-slate-300 bg-white/70 px-7 py-2.5 text-sm font-medium backdrop-blur-md transition-all hover:bg-white dark:border-white/50 dark:bg-white/15 dark:hover:bg-white/30"
        >
          浏览文章
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* 纯渐变背景：基底 + 两层椭圆径向渐变（左上冷蓝 / 右下中性灰），固定不随滚动 */
.hero {
  background-color: #f8fafc;
  background-image:
    radial-gradient(ellipse at 20% 40%, rgba(56, 139, 253, 0.13) 0%, transparent 55%),
    radial-gradient(ellipse at 80% 65%, rgba(139, 148, 158, 0.1) 0%, transparent 55%);
  background-attachment: fixed;
}

html.dark .hero {
  background-color: #0d1117;
}

/* 底部渐隐层（约 140px）：从透明过渡到主体底色，让英雄区自然溶解到主体 */
.hero::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 140px;
  pointer-events: none;
  background: linear-gradient(to bottom, transparent, #f8fafc);
}

html.dark .hero::after {
  background: linear-gradient(to bottom, transparent, #0d1117);
}
</style>
