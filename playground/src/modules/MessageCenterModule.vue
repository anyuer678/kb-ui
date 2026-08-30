<script setup lang="ts">
import { ref } from 'vue'
import { KbTabs, KbTag, KbEmpty, KbBadge, message } from 'kb-ui-vue'

interface Notice {
  title: string
  time: string
  unread?: boolean
  type: '系统' | '评论' | '点赞'
}

const all: Notice[] = [
  { title: '你的组件库被点赞了', time: '5 分钟前', unread: true, type: '点赞' },
  { title: '有人评论了你的文章', time: '1 小时前', unread: true, type: '评论' },
  { title: '系统维护通知', time: '3 小时前', type: '系统' },
  { title: '版本更新：新增 30 套主题', time: '昨天', type: '系统' },
]

const activeTab = ref('unread')
const list = ref(all.filter((n) => n.unread))

const tabs = [
  { label: '未读', name: 'unread' },
  { label: '全部', name: 'all' },
  { label: '系统', name: 'system' },
]

function switchTab(name: string) {
  activeTab.value = name
  if (name === 'unread') list.value = all.filter((n) => n.unread)
  else if (name === 'system') list.value = all.filter((n) => n.type === '系统')
  else list.value = all
}

function open(item: Notice) {
  item.unread = false
  message.info(`打开：${item.title}（演示）`)
}
</script>

<template>
  <div class="message-center-module">
    <div class="message-center-module__header">
      <h3 class="message-center-module__title">消息中心</h3>
      <KbBadge :content="all.filter((n) => n.unread).length">
        <span class="message-center-module__badge-label">未读</span>
      </KbBadge>
    </div>

    <KbTabs :tabs="tabs" :model-value="activeTab" @update:model-value="switchTab">
      <div class="message-center-module__list">
        <div
          v-for="(item, i) in list"
          :key="i"
          class="message-center-module__item"
          :class="{ 'message-center-module__item--unread': item.unread }"
          @click="open(item)"
        >
          <div class="message-center-module__item-head">
            <KbTag :type="item.type === '系统' ? 'info' : item.type === '评论' ? 'success' : 'warning'" size="small">
              {{ item.type }}
            </KbTag>
            <span v-if="item.unread" class="message-center-module__dot" />
          </div>
          <div class="message-center-module__item-title">{{ item.title }}</div>
          <div class="message-center-module__item-time">{{ item.time }}</div>
        </div>
        <KbEmpty v-if="list.length === 0" description="暂无消息" />
      </div>
    </KbTabs>
  </div>
</template>

<style scoped>
.message-center-module {
  max-width: 560px;
  padding: var(--kb-space-4);
  border: 1px solid var(--kb-color-border);
  border-radius: var(--kb-radius-lg);
  background: var(--kb-color-bg);
}

.message-center-module__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--kb-space-3);
}

.message-center-module__title {
  margin: 0;
  color: var(--kb-color-text-1);
  font-size: var(--kb-font-size-lg);
}

.message-center-module__badge-label {
  margin-left: var(--kb-space-1);
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-sm);
}

.message-center-module__list {
  display: flex;
  flex-direction: column;
}

.message-center-module__item {
  padding: var(--kb-space-3);
  border-radius: var(--kb-radius-md);
  cursor: pointer;
  transition: background var(--kb-transition-duration) var(--kb-transition-timing);
}

.message-center-module__item:hover {
  background: var(--kb-color-bg-elevated);
}

.message-center-module__item-head {
  display: flex;
  align-items: center;
  gap: var(--kb-space-2);
}

.message-center-module__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--kb-color-danger);
}

.message-center-module__item-title {
  margin-top: var(--kb-space-1);
  color: var(--kb-color-text-1);
  font-size: var(--kb-font-size-md);
}

.message-center-module__item--unread .message-center-module__item-title {
  font-weight: 600;
}

.message-center-module__item-time {
  margin-top: 2px;
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-xs);
}
</style>
