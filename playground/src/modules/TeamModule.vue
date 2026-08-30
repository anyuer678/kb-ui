<script setup lang="ts">
import { KbAvatar, KbCard, KbTag, message } from 'kb-ui-vue'

const members = [
  { name: '林一', role: '架构师', color: '#3b82f6' },
  { name: '陈二', role: '前端', color: '#10b981' },
  { name: '张三', role: '后端', color: '#f59e0b' },
  { name: '李四', role: '产品', color: '#ec4899' },
  { name: '王五', role: '测试', color: '#8b5cf6' },
  { name: '赵六', role: '运维', color: '#06b6d4' },
]
</script>

<template>
  <div class="team-module">
    <div v-for="m in members" :key="m.name" class="team-module__member">
      <KbCard shadow="hover">
        <div class="team-module__head">
          <KbAvatar :fallback="m.name[0]" :size="48" round />
          <div class="team-module__info">
            <div class="team-module__name">{{ m.name }}</div>
            <div class="team-module__role">{{ m.role }}</div>
          </div>
        </div>
        <div class="team-module__tags">
          <KbTag type="info" size="small">在线</KbTag>
          <KbTag type="success" size="small">核心成员</KbTag>
        </div>
        <button class="team-module__chat" type="button" @click="message.info(`与 ${m.name} 聊天（演示）`)">
          发消息
        </button>
      </KbCard>
    </div>
  </div>
</template>

<style scoped>
.team-module {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--kb-space-3);
}

.team-module__head {
  display: flex;
  align-items: center;
  gap: var(--kb-space-3);
}

.team-module__name {
  color: var(--kb-color-text-1);
  font-size: var(--kb-font-size-md);
  font-weight: 600;
}

.team-module__role {
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-sm);
}

.team-module__tags {
  display: flex;
  gap: var(--kb-space-1);
  margin: var(--kb-space-3) 0;
}

.team-module__chat {
  width: 100%;
  padding: var(--kb-space-1) 0;
  border: 1px solid var(--kb-color-border);
  border-radius: var(--kb-radius-sm);
  background: transparent;
  color: var(--kb-color-text-2);
  font-size: var(--kb-font-size-sm);
  cursor: pointer;
}

.team-module__chat:hover {
  border-color: var(--kb-color-primary);
  color: var(--kb-color-primary);
}
</style>
