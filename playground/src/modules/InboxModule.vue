<script setup lang="ts">
import { ref } from 'vue'
import { KbBadge, KbTag, message } from 'kb-ui-vue'

const mails = [
  { from: 'GitHub', subject: '[kb-ui] 主题扩充 PR 已合并', time: '09:20', unread: true, tag: '系统' },
  { from: 'Vite 团队', subject: 'Vite 8.2 发布公告', time: '昨天', unread: true, tag: '开发' },
  { from: 'npm', subject: '@kb/ui 下载量周报', time: '周一', unread: false, tag: '数据' },
  { from: '团队周报', subject: '本周工作同步', time: '上周五', unread: false, tag: '内部' },
]
const selected = ref(0)

function open(i: number) {
  mails[i].unread = false
  selected.value = i
  message.info(`打开：${mails[i].subject}（演示）`)
}
</script>

<template>
  <div class="inbox-module">
    <div class="inbox-module__list">
      <div v-for="(item, index) in mails" :key="index" class="inbox-module__row" :class="{ 'inbox-module__item--unread': item.unread, 'inbox-module__item--active': selected === index }" @click="open(index)">
        <div class="inbox-module__from">
          <KbBadge v-if="item.unread" dot>
            <span>{{ item.from }}</span>
          </KbBadge>
          <span v-else>{{ item.from }}</span>
        </div>
        <div class="inbox-module__subject">{{ item.subject }}</div>
        <div class="inbox-module__meta">
          <KbTag size="small" type="info">{{ item.tag }}</KbTag>
          <span class="inbox-module__time">{{ item.time }}</span>
        </div>
      </div>
    </div>
    <div class="inbox-module__preview">
      <template v-if="mails[selected]">
        <h3 class="inbox-module__preview-title">{{ mails[selected].subject }}</h3>
        <p class="inbox-module__preview-from">发件人：{{ mails[selected].from }} · {{ mails[selected].time }}</p>
        <p class="inbox-module__preview-body">这是一封邮件正文的预览。点击左侧列表切换邮件，支持未读标记、分类标签与时间展示——全部由 KbList + KbTag + KbBadge 拼装。</p>
      </template>
    </div>
  </div>
</template>

<style scoped>
.inbox-module {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: var(--kb-space-3);
  border: 1px solid var(--kb-color-border);
  border-radius: var(--kb-radius-lg);
  background: var(--kb-color-bg);
  overflow: hidden;
}

.inbox-module__list {
  border-right: 1px solid var(--kb-color-border);
}

.inbox-module__row {
  padding: var(--kb-space-3);
  border-bottom: 1px solid var(--kb-color-border);
  cursor: pointer;
}

.inbox-module__row:hover {
  background: var(--kb-color-bg-elevated);
}

.inbox-module__item--unread .inbox-module__from {
  font-weight: 600;
}

.inbox-module__item--active {
  background: var(--kb-color-bg-elevated);
}

.inbox-module__from {
  color: var(--kb-color-text-1);
  font-size: var(--kb-font-size-sm);
}

.inbox-module__subject {
  margin: 2px 0;
  color: var(--kb-color-text-2);
  font-size: var(--kb-font-size-sm);
}

.inbox-module__meta {
  display: flex;
  align-items: center;
  gap: var(--kb-space-2);
}

.inbox-module__time {
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-xs);
}

.inbox-module__preview {
  padding: var(--kb-space-5);
}

.inbox-module__preview-title {
  margin: 0 0 var(--kb-space-2);
  color: var(--kb-color-text-1);
}

.inbox-module__preview-from {
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-sm);
}

.inbox-module__preview-body {
  color: var(--kb-color-text-2);
  line-height: 1.8;
}
</style>
