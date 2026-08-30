<script setup lang="ts">
import { KbTimeline, KbCard, message } from 'kb-ui-vue'

const activities: { content: string; time: string; type?: 'success' | 'primary' | 'warning' }[] = [
  { content: '张三 提交了代码', time: '5 分钟前', type: 'success' },
  { content: '李四 合并了 PR #42', time: '30 分钟前' },
  { content: '系统 发布了新版本 v1.2', time: '2 小时前', type: 'primary' },
  { content: '王五 创建了任务「优化主题」', time: '今天 09:00', type: 'warning' },
]
</script>

<template>
  <div class="activity-module">
    <KbCard title="最近动态">
      <KbTimeline :items="activities" />
      <button class="activity-module__more" type="button" @click="message.info('加载更多（演示）')">加载更多</button>
    </KbCard>
  </div>
</template>

<style scoped>
.activity-module {
  max-width: 480px;
}

.activity-module__more {
  width: 100%;
  padding: var(--kb-space-2);
  border: 1px solid var(--kb-color-border);
  border-radius: var(--kb-radius-sm);
  background: transparent;
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-sm);
  cursor: pointer;
}

.activity-module__more:hover {
  color: var(--kb-color-primary);
  border-color: var(--kb-color-primary);
}
</style>
