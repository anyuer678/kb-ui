<script setup lang="ts">
import { ref } from 'vue'
import { KbTag, KbButton, message } from 'kb-ui-vue'

const columns = ref<{ key: string; title: string; color: 'info' | 'warning' | 'success'; items: { id: number; text: string }[] }[]>([
  { key: 'todo', title: '待办', color: 'info', items: [{ id: 1, text: '设计评审' }, { id: 2, text: '接口联调' }] },
  { key: 'doing', title: '进行中', color: 'warning', items: [{ id: 3, text: '组件开发' }] },
  { key: 'done', title: '已完成', color: 'success', items: [{ id: 4, text: '需求分析' }, { id: 5, text: '技术选型' }] },
])

function move(itemId: number, from: string, to: string) {
  if (from === to) return
  const src = columns.value.find((c) => c.key === from)!
  const dst = columns.value.find((c) => c.key === to)!
  const idx = src.items.findIndex((i) => i.id === itemId)
  if (idx < 0) return
  const [item] = src.items.splice(idx, 1)
  dst.items.push(item)
  message.info(`「${item.text}」移至${dst.title}（演示）`)
}
</script>

<template>
  <div class="kanban-module">
    <div v-for="col in columns" :key="col.key" class="kanban-module__col">
      <div class="kanban-module__head">
        <KbTag :type="col.color">{{ col.title }}</KbTag>
        <span class="kanban-module__count">{{ col.items.length }}</span>
      </div>
      <div class="kanban-module__list">
        <div v-for="item in col.items" :key="item.id" class="kanban-module__card">
          <span>{{ item.text }}</span>
          <div class="kanban-module__ops">
            <KbButton v-if="col.key !== 'todo'" size="small" @click="move(item.id, col.key, 'todo')">←</KbButton>
            <KbButton v-if="col.key !== 'done'" size="small" type="primary" @click="move(item.id, col.key, 'done')">→</KbButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kanban-module {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--kb-space-3);
}

.kanban-module__col {
  min-height: 260px;
  padding: var(--kb-space-3);
  border-radius: var(--kb-radius-lg);
  background: var(--kb-color-bg-elevated);
}

.kanban-module__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--kb-space-3);
}

.kanban-module__count {
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-sm);
}

.kanban-module__list {
  display: flex;
  flex-direction: column;
  gap: var(--kb-space-2);
}

.kanban-module__card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--kb-space-2);
  padding: var(--kb-space-3);
  border: 1px solid var(--kb-color-border);
  border-radius: var(--kb-radius-md);
  background: var(--kb-color-bg);
  font-size: var(--kb-font-size-sm);
}

.kanban-module__ops {
  display: flex;
  gap: 4px;
}
</style>
