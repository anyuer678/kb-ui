<script setup lang="ts">
import { KbButton, KbTag, KbSpace, message } from '@kb/ui'

function start() {
  message.success('开始使用（演示）')
}
</script>

<template>
  <div class="landing-module">
    <div class="landing-module__badge">
      <KbTag type="warning">全新发布</KbTag>
    </div>
    <h1 class="landing-module__title">让组件开发<br />变得简单优雅</h1>
    <p class="landing-module__subtitle">50+ 组件 · 36 套主题 · 20 个页面模板，基于 Vue 3 + TypeScript，开箱即用。</p>
    <KbSpace class="landing-module__actions">
      <KbButton type="primary" size="large" @click="start">立即开始</KbButton>
      <KbButton size="large" plain>查看文档</KbButton>
    </KbSpace>
    <div class="landing-module__stats">
      <span><b>50+</b> 组件</span>
      <span><b>36</b> 主题</span>
      <span><b>20</b> 模板</span>
      <span><b>215</b> 测试</span>
    </div>
  </div>
</template>

<style scoped>
.landing-module {
  text-align: center;
  padding: var(--kb-space-6) var(--kb-space-4);
  border-radius: var(--kb-radius-lg);
  background:
    radial-gradient(at 20% 30%, color-mix(in srgb, var(--kb-color-primary) 15%, transparent), transparent 55%),
    radial-gradient(at 80% 70%, color-mix(in srgb, var(--kb-color-success) 10%, transparent), transparent 55%),
    var(--kb-color-bg-elevated);
}

.landing-module__title {
  margin: var(--kb-space-3) 0;
  color: var(--kb-color-text-1);
  font-size: 40px;
  line-height: 1.3;
}

.landing-module__subtitle {
  max-width: 520px;
  margin: 0 auto var(--kb-space-5);
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-md);
}

.landing-module__actions {
  justify-content: center;
}

.landing-module__stats {
  display: flex;
  justify-content: center;
  gap: var(--kb-space-6);
  margin-top: var(--kb-space-6);
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-sm);
}

.landing-module__stats b {
  display: block;
  color: var(--kb-color-primary);
  font-size: 24px;
}
</style>
