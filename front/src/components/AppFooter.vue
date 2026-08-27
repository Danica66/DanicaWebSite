<script setup lang="ts">
const siteName = import.meta.env.VITE_SITE_NAME || 'Danica'
const year = new Date().getFullYear()
</script>

<template>
  <footer class="mt-16 border-t border-white/60 bg-white/40 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/40">
    <div class="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-8 text-[13px] text-slate-500 dark:text-slate-400">
      <p>© {{ year }} {{ siteName }} · 个人博客</p>
      <div class="flex flex-wrap items-center justify-center gap-2">
        <a
          href="https://beian.miit.gov.cn/"
          target="_blank"
          rel="noopener"
          class="transition-colors hover:text-primary"
        >
          黑ICP备2026009394号
        </a>
        <a
          href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=23100002000275"
          target="_blank"
          rel="noopener"
          class="transition-colors hover:text-primary"
        >
          黑公网安备23100002000275号
        </a>
        <a href="/api/rss" target="_blank" rel="noopener" class="transition-colors hover:text-primary">
          RSS 订阅
        </a>
      </div>
    </div>
  </footer>
</template>
