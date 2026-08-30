<script setup lang="ts">
import { ref } from 'vue'
import { KbCard, KbStatistic, KbProgress, KbTable, KbSegmented } from 'kb-ui-vue'

const range = ref('week')
const stats = [
  { title: '访问量', value: 48291, trend: '+12.5%', up: true },
  { title: '销售额', value: 12840, trend: '+8.2%', up: true },
  { title: '转化率', value: 3.62, trend: '-0.4%', up: false },
]
const rows = [
  { channel: '自然搜索', visits: 18240, conv: '4.1%' },
  { channel: '直接访问', visits: 12480, conv: '3.2%' },
  { channel: '社交媒体', visits: 9860, conv: '2.8%' },
]
const cols = [
  { prop: 'channel', label: '渠道' },
  { prop: 'visits', label: '访问数' },
  { prop: 'conv', label: '转化率' },
]
</script>

<template>
  <div class="analytics-module">
    <div class="analytics-module__bar">
      <KbSegmented v-model="range" :options="[{ label: '今日', value: 'day' }, { label: '本周', value: 'week' }, { label: '本月', value: 'month' }]" />
    </div>
    <div class="analytics-module__stats">
      <KbCard v-for="s in stats" :key="s.title" shadow="hover">
        <KbStatistic :title="s.title" :value="s.value" :precision="s.value % 1 ? 2 : 0" />
        <div class="analytics-module__trend" :class="{ down: !s.up }">{{ s.trend }}</div>
      </KbCard>
    </div>
    <div class="analytics-module__grid">
      <KbCard title="渠道占比">
        <div class="analytics-module__bars">
          <div v-for="(r, i) in rows" :key="r.channel">
            <div class="analytics-module__bar-row"><span>{{ r.channel }}</span><b>{{ r.visits.toLocaleString() }}</b></div>
            <KbProgress :percentage="[70, 48, 38][i]" :stroke-width="8" :show-text="false" />
          </div>
        </div>
      </KbCard>
      <KbCard title="渠道明细">
        <KbTable :data="rows" :columns="cols" size="small" />
      </KbCard>
    </div>
  </div>
</template>

<style scoped>
.analytics-module {
  display: flex;
  flex-direction: column;
  gap: var(--kb-space-3);
}

.analytics-module__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--kb-space-3);
}

.analytics-module__trend {
  margin-top: 4px;
  color: var(--kb-color-success);
  font-size: var(--kb-font-size-sm);
}

.analytics-module__trend.down {
  color: var(--kb-color-danger);
}

.analytics-module__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--kb-space-3);
}

.analytics-module__bars {
  display: flex;
  flex-direction: column;
  gap: var(--kb-space-3);
}

.analytics-module__bar-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  color: var(--kb-color-text-2);
  font-size: var(--kb-font-size-sm);
}
</style>
