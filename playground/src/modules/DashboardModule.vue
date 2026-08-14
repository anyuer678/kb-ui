<script setup lang="ts">
import {
  KbStatistic,
  KbProgress,
  KbCard,
  KbTable,
  KbTag,
  KbAlert,
  KbButton,
  message,
} from '@kb/ui'

const stats = [
  { title: '总用户', value: 128456, color: 'var(--kb-color-primary)' },
  { title: '今日访问', value: 8321, color: 'var(--kb-color-success)' },
  { title: '订单数', value: 1567, color: 'var(--kb-color-warning)' },
  { title: '待处理', value: 23, color: 'var(--kb-color-danger)' },
]

const progressList = [
  { label: '服务器负载', value: 62, status: 'normal' as const },
  { label: '存储占用', value: 84, status: 'warning' as const },
  { label: '任务完成', value: 100, status: 'success' as const },
]

const tableData = [
  { name: '张三', role: '管理员', status: '正常', city: '北京' },
  { name: '李四', role: '编辑', status: '正常', city: '上海' },
  { name: '王五', role: '访客', status: '停用', city: '广州' },
  { name: '赵六', role: '编辑', status: '正常', city: '深圳' },
]
const tableColumns = [
  { prop: 'name', label: '姓名' },
  { prop: 'role', label: '角色' },
  { prop: 'status', label: '状态' },
  { prop: 'city', label: '城市' },
]

function refresh() {
  message.success('数据已刷新（演示）')
}
</script>

<template>
  <div class="dashboard-module">
    <div class="dashboard-module__header">
      <div>
        <h2 class="dashboard-module__title">数据概览</h2>
        <p class="dashboard-module__subtitle">欢迎回来，这里是今天的最新数据</p>
      </div>
      <KbButton type="primary" size="small" @click="refresh">刷新数据</KbButton>
    </div>

    <div class="dashboard-module__stats">
      <div v-for="stat in stats" :key="stat.title" class="dashboard-module__stat">
        <KbStatistic :title="stat.title" :value="stat.value" />
      </div>
    </div>

    <div class="dashboard-module__grid">
      <KbCard title="系统资源" class="dashboard-module__card">
        <div class="dashboard-module__progress">
          <div v-for="item in progressList" :key="item.label" class="dashboard-module__progress-item">
            <span class="dashboard-module__progress-label">{{ item.label }}</span>
            <KbProgress :percentage="item.value" :status="item.status" />
          </div>
        </div>
      </KbCard>

      <KbCard title="最新用户" class="dashboard-module__card">
        <KbTable :data="tableData" :columns="tableColumns" stripe>
          <template #cell="{ row, column }">
            <KbTag v-if="column.prop === 'status'" :type="row.status === '正常' ? 'success' : 'danger'">
              {{ row[column.prop] }}
            </KbTag>
            <span v-else>{{ row[column.prop] }}</span>
          </template>
        </KbTable>
      </KbCard>
    </div>

    <KbAlert type="info" title="提示" show-icon>
      这是一个仪表盘示例模块，由 KbStatistic / KbProgress / KbCard / KbTable / KbTag 组合而成。
    </KbAlert>
  </div>
</template>

<style scoped>
.dashboard-module {
  display: flex;
  flex-direction: column;
  gap: var(--kb-space-4);
}

.dashboard-module__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.dashboard-module__title {
  margin: 0;
  color: var(--kb-color-text-1);
  font-size: var(--kb-font-size-xl);
}

.dashboard-module__subtitle {
  margin: var(--kb-space-1) 0 0;
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-sm);
}

.dashboard-module__stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--kb-space-3);
}

.dashboard-module__stat {
  border: 1px solid var(--kb-color-border);
  border-radius: var(--kb-radius-md);
  background: var(--kb-color-bg);
}

.dashboard-module__grid {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: var(--kb-space-3);
}

.dashboard-module__card {
  height: 100%;
}

.dashboard-module__progress {
  display: flex;
  flex-direction: column;
  gap: var(--kb-space-3);
}

.dashboard-module__progress-label {
  display: block;
  margin-bottom: var(--kb-space-1);
  color: var(--kb-color-text-2);
  font-size: var(--kb-font-size-sm);
}

@media (max-width: 720px) {
  .dashboard-module__stats,
  .dashboard-module__grid {
    grid-template-columns: 1fr;
  }
}
</style>
