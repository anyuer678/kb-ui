<script setup lang="ts">
import { KbCard, KbStatistic, KbProgress } from 'kb-ui-vue'

const weekly = [42, 68, 55, 90, 76, 83, 61]
const max = 100

const stats = [
  { title: '周访问', value: 4750 },
  { title: '新用户', value: 386 },
  { title: '转化率', value: 12.8, suffix: '%' },
]
</script>

<template>
  <div class="chart-module">
    <div class="chart-module__stats">
      <KbCard v-for="s in stats" :key="s.title" shadow="hover">
        <KbStatistic :title="s.title" :value="s.value" :suffix="s.suffix" :precision="s.value % 1 ? 1 : 0" />
      </KbCard>
    </div>
    <KbCard title="本周趋势（纯 CSS 柱状图）">
      <div class="chart-module__bars">
        <div v-for="(v, i) in weekly" :key="i" class="chart-module__bar-col">
          <div class="chart-module__bar" :style="{ height: `${(v / max) * 100}%` }">
            <span class="chart-module__bar-value">{{ v }}</span>
          </div>
          <span class="chart-module__bar-label">周{{ '一二三四五六日'[i] }}</span>
        </div>
      </div>
    </KbCard>
    <KbCard title="完成度">
      <div class="chart-module__progress">
        <span class="chart-module__progress-label">季度目标</span>
        <KbProgress :percentage="78" status="success" />
      </div>
    </KbCard>
  </div>
</template>

<style scoped>
.chart-module {
  display: flex;
  flex-direction: column;
  gap: var(--kb-space-3);
}

.chart-module__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--kb-space-3);
}

.chart-module__bars {
  display: flex;
  align-items: flex-end;
  gap: var(--kb-space-3);
  height: 180px;
  padding-top: var(--kb-space-4);
}

.chart-module__bar-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--kb-space-1);
  height: 100%;
}

.chart-module__bar {
  width: 100%;
  max-width: 40px;
  border-radius: var(--kb-radius-sm) var(--kb-radius-sm) 0 0;
  background: linear-gradient(180deg, var(--kb-color-primary), color-mix(in srgb, var(--kb-color-primary) 40%, transparent));
  position: relative;
  min-height: 4px;
}

.chart-module__bar-value {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-xs);
}

.chart-module__bar-label {
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-xs);
}

.chart-module__progress {
  display: flex;
  align-items: center;
  gap: var(--kb-space-3);
}

.chart-module__progress-label {
  flex-shrink: 0;
  color: var(--kb-color-text-2);
  font-size: var(--kb-font-size-sm);
}
</style>
