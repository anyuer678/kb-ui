<script setup lang="ts">
import { KbCard, KbProgress, message } from '@kb/ui'

const videos = [
  { title: 'Vue 3 组件库开发实录', author: '张三', duration: '24:30', view: '1.2万', cover: '#3b82f6' },
  { title: 'Monorepo 工程化实践', author: '李四', duration: '18:45', view: '8.6千', cover: '#10b981' },
  { title: '设计系统 Token 指南', author: '王五', duration: '32:10', view: '2.3万', cover: '#8b5cf6' },
  { title: 'Electron 桌面应用入门', author: '赵六', duration: '41:20', view: '6.5千', cover: '#f59e0b' },
]
</script>

<template>
  <div class="video-module">
    <div class="video-module__grid">
      <KbCard v-for="(v, i) in videos" :key="v.title" shadow="hover" class="video-module__card">
        <div class="video-module__cover" :style="{ background: v.cover }" @click="message.info(`播放：${v.title}（演示）`)">
          <span class="video-module__play">▶</span>
          <span class="video-module__duration">{{ v.duration }}</span>
        </div>
        <h3 class="video-module__title">{{ v.title }}</h3>
        <div class="video-module__meta">
          <span>{{ v.author }}</span>
          <span>{{ v.view }}次观看</span>
        </div>
        <KbProgress :percentage="[85, 40, 60, 20][i]" :stroke-width="4" :show-text="false" />
      </KbCard>
    </div>
  </div>
</template>

<style scoped>
.video-module__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--kb-space-3);
}

.video-module__cover {
  position: relative;
  display: grid;
  place-items: center;
  height: 130px;
  border-radius: var(--kb-radius-md);
  cursor: pointer;
}

.video-module__play {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgb(255 255 255 / 85%);
  color: var(--kb-color-text-1);
  font-size: 16px;
}

.video-module__duration {
  position: absolute;
  right: 8px;
  bottom: 8px;
  padding: 1px 6px;
  border-radius: 4px;
  background: rgb(0 0 0 / 55%);
  color: #fff;
  font-size: 12px;
}

.video-module__title {
  margin: var(--kb-space-2) 0 4px;
  color: var(--kb-color-text-1);
  font-size: var(--kb-font-size-md);
}

.video-module__meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--kb-space-2);
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-xs);
}
</style>
