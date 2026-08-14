<script setup lang="ts">
import { ref, computed } from 'vue'
import { KbCalendar, KbCard, KbTag, message } from '@kb/ui'

const selectedDate = ref('2026-08-15')
const events: { date: string; title: string; type: 'success' | 'primary' | 'danger' | 'warning' }[] = [
  { date: '2026-08-15', title: '设计评审', type: 'success' },
  { date: '2026-08-15', title: '代码审查', type: 'primary' },
  { date: '2026-08-18', title: '发布 v2.0', type: 'danger' },
  { date: '2026-08-20', title: '团队周会', type: 'warning' },
]
const dayEvents = computed(() => events.filter((e) => e.date === selectedDate.value))
</script>

<template>
  <div class="calendar-module">
    <KbCard title="日程安排">
      <KbCalendar v-model="selectedDate" />
    </KbCard>
    <KbCard :title="`${selectedDate} 的日程（${dayEvents.length}）`">
      <div v-for="(e, i) in dayEvents" :key="i" class="calendar-module__event">
        <KbTag :type="e.type">{{ e.title }}</KbTag>
        <span class="calendar-module__time">09:30</span>
        <button class="calendar-module__btn" type="button" @click="message.info(`打开${e.title}（演示）`)">详情</button>
      </div>
      <p v-if="!dayEvents.length" class="calendar-module__none">当日暂无安排，点击日期查看</p>
    </KbCard>
  </div>
</template>

<style scoped>
.calendar-module {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: var(--kb-space-3);
}

.calendar-module__event {
  display: flex;
  align-items: center;
  gap: var(--kb-space-3);
  padding: var(--kb-space-2) 0;
  border-bottom: 1px solid var(--kb-color-border);
}

.calendar-module__time {
  flex: 1;
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-sm);
}

.calendar-module__btn {
  border: none;
  background: transparent;
  color: var(--kb-color-primary);
  font-size: var(--kb-font-size-sm);
  cursor: pointer;
}

.calendar-module__none {
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-sm);
}
</style>
