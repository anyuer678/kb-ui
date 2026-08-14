<script setup lang="ts">
import { KbCard, KbStatistic, KbCountUp, KbTag, KbProgress } from '@kb/ui'

const bars = [65, 82, 45, 90, 70]
const labels = ['周一', '周二', '周三', '周四', '周五']
const stats: { title: string; value: number; suffix?: string; precision?: number }[] = [
  { title: '今日访问', value: 12853, suffix: '' },
  { title: '在线用户', value: 863, suffix: '' },
  { title: '转化率', value: 3.6, suffix: '%', precision: 1 },
]
</script>

<template>
  <div class="datav-module">
    <div class="datav-module__header">
      <h2 class="datav-module__title">数据大屏</h2>
      <KbTag type="warning" size="small">实时</KbTag>
    </div>
    <div class="datav-module__stats">
      <KbCard v-for="s in stats" :key="s.title" shadow="hover">
        <KbStatistic :title="s.title" :value="0" :precision="s.precision ?? 0">
          <template #default>
            <KbCountUp :end="s.value" :decimals="s.precision ?? 0" :duration="1200" />
            <span>{{ s.suffix }}</span>
          </template>
        </KbStatistic>
      </KbCard>
    </div>
    <KbCard title="周访问趋势">
      <div class="datav-module__chart">
        <div v-for="(v, i) in bars" :key="i" class="datav-module__col">
          <div class="datav-module__bar" :style="{ height: `${v}%` }" />
          <span class="datav-module__label">{{ labels[i] }}</span>
        </div>
      </div>
    </KbCard>
    <KbCard title="资源占用">
      <div class="datav-module__progress">
        <div><span>CPU</span><KbProgress :percentage="42" /></div>
        <div><span>内存</span><KbProgress :percentage="68" status="warning" /></div>
        <div><span>磁盘</span><KbProgress :percentage="87" status="danger" /></div>
      </div>
    </KbCard>
  </div>
</template>

<style scoped>
.datav-module {
  display: flex;
  flex-direction: column;
  gap: var(--kb-space-3);
}

.datav-module__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.datav-module__title {
  margin: 0;
  color: var(--kb-color-text-1);
}

.datav-module__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--kb-space-3);
}

.datav-module__chart {
  display: flex;
  align-items: flex-end;
  gap: var(--kb-space-3);
  height: 160px;
}

.datav-module__col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--kb-space-1);
  height: 100%;
  justify-content: flex-end;
}

.datav-module__bar {
  width: 100%;
  max-width: 36px;
  border-radius: 4px 4px 0 0;
  background: linear-gradient(180deg, var(--kb-color-primary), color-mix(in srgb, var(--kb-color-primary) 35%, transparent));
}

.datav-module__label {
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-xs);
}

.datav-module__progress {
  display: flex;
  flex-direction: column;
  gap: var(--kb-space-3);
}

.datav-module__progress > div {
  display: flex;
  align-items: center;
  gap: var(--kb-space-3);
}

.datav-module__progress span {
  width: 40px;
  color: var(--kb-color-text-2);
  font-size: var(--kb-font-size-sm);
}
</style>
