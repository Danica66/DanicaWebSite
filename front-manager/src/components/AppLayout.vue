<template>
  <div class="applayout">
    <aside class="nav">
      <el-menu :default-active="$route.path" router>
        <el-menu-item index="/">首页</el-menu-item>
        <el-sub-menu>
          <template #title>文章管理</template>
          <el-menu-item index="/articles">编辑文章</el-menu-item>
          <el-menu-item index="/articles/create">写文章</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </aside>
    <div class="router">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.applayout{
  display: flex;
  align-items: flex-start;      /* 防止 aside 被拉伸，高度交给 sticky */
}
.nav {
  width: 200px;
  flex-shrink: 0;
  position: sticky;
  top: 56px;                    /* 顶部全局 navbar 高度 */
  height: calc(100vh - 56px);
  background: var(--navbar-bg);
  border-right: 1px solid var(--border);
}
/* 覆盖 el-menu 默认颜色，跟随全局亮/暗主题变量 */
.nav :deep(.el-menu) {
  --el-menu-bg-color: transparent;
  --el-menu-text-color: var(--text);
  --el-menu-hover-bg-color: var(--bg);
  --el-menu-active-color: var(--primary);
  --el-menu-border-color: transparent;
  border-right: none;
  width: 200px;
}
.router{
  flex: 1;
  min-width: 0;
  padding: 0 24px;
}
</style>
