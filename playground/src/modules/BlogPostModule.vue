<script setup lang="ts">
import { KbTag, KbAvatar, KbDivider, KbSpace } from '@kb/ui'

const tags = ['组件库', 'Vue 3', '设计系统']
</script>

<template>
  <article class="blog-post-module">
    <h1 class="blog-post-module__title">如何设计一套可扩展的组件库主题系统</h1>
    <div class="blog-post-module__meta">
      <KbAvatar fallback="张" round :size="28" />
      <span class="blog-post-module__author">张三 · 2026-08-13 · 8 分钟阅读</span>
    </div>
    <KbDivider />
    <p class="blog-post-module__lead">CSS 变量 + 主题覆盖文件，是零依赖实现多主题的最佳实践。本文从 token 设计讲起。</p>
    <h2>Token 分层</h2>
    <p>将设计变量分为颜色、间距、圆角、阴影、字体五类，全部通过 <code>--kb-*</code> 前缀暴露。</p>
    <h2>主题覆盖</h2>
    <p>每个主题一个独立的 CSS 文件，只覆盖差异变量，切换时替换 <code>data-theme</code> 属性。</p>
    <KbDivider />
    <KbSpace wrap>
      <KbTag v-for="t in tags" :key="t" type="info">{{ t }}</KbTag>
    </KbSpace>
  </article>
</template>

<style scoped>
.blog-post-module {
  max-width: 640px;
  margin: 0 auto;
  padding: var(--kb-space-5);
  border-radius: var(--kb-radius-lg);
  background: var(--kb-color-bg);
}

.blog-post-module__title {
  margin: 0 0 var(--kb-space-3);
  color: var(--kb-color-text-1);
  font-size: 26px;
  line-height: 1.4;
}

.blog-post-module__meta {
  display: flex;
  align-items: center;
  gap: var(--kb-space-2);
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-sm);
}

.blog-post-module__lead {
  color: var(--kb-color-text-2);
  font-size: 15px;
  line-height: 1.8;
}

.blog-post-module p {
  color: var(--kb-color-text-2);
  line-height: 1.8;
}

.blog-post-module code {
  padding: 1px 6px;
  border-radius: 4px;
  background: var(--kb-color-bg-elevated);
  color: var(--kb-color-primary);
}
</style>
