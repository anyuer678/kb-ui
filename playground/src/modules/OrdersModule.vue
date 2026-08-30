<script setup lang="ts">
import { ref } from 'vue'
import { KbTable, KbTag, KbSegmented, KbPagination, KbButton, message } from 'kb-ui-vue'

const status = ref('all')
const orders = ref([
  { id: '20260813001', customer: '张三', amount: 1288, status: '已支付', time: '2026-08-13 10:20' },
  { id: '20260813002', customer: '李四', amount: 399, status: '待发货', time: '2026-08-13 09:45' },
  { id: '20260812003', customer: '王五', amount: 2599, status: '已发货', time: '2026-08-12 16:30' },
  { id: '20260812004', customer: '赵六', amount: 89, status: '已完成', time: '2026-08-12 11:02' },
  { id: '20260811005', customer: '钱七', amount: 699, status: '已退款', time: '2026-08-11 14:18' },
])
const cols = [
  { prop: 'id', label: '订单号' },
  { prop: 'customer', label: '客户' },
  { prop: 'amount', label: '金额', formatter: (v: number) => `¥${v.toLocaleString()}` },
  { prop: 'status', label: '状态', render: (row: { status: string }) => ({ type: 'info', text: row.status }) },
  { prop: 'time', label: '下单时间' },
]
const filtered = ref(orders)

function filter() {
  filtered.value = status.value === 'all' ? orders.value : orders.value.filter((o) => o.status === status.value)
}

function ship(row: { id: string }) {
  message.success(`订单 ${row.id} 已发货（演示）`)
}
</script>

<template>
  <div class="orders-module">
    <div class="orders-module__bar">
      <KbSegmented v-model="status" :options="[{ label: '全部', value: 'all' }, { label: '待发货', value: '待发货' }, { label: '已发货', value: '已发货' }, { label: '已完成', value: '已完成' }]" @change="filter" />
    </div>
    <KbTable :data="filtered" :columns="cols">
      <template #status="{ row }">
        <KbTag size="small" :type="row.status === '已退款' ? 'danger' : row.status === '已完成' ? 'success' : 'info'">{{ row.status }}</KbTag>
      </template>
      <template #ops="{ row }">
        <KbButton size="small" @click="ship(row)">发货</KbButton>
      </template>
    </KbTable>
    <div class="orders-module__pager">
      <KbPagination :total="filtered.length" :page-size="5" :current-page="1" />
    </div>
  </div>
</template>

<style scoped>
.orders-module {
  display: flex;
  flex-direction: column;
  gap: var(--kb-space-3);
}

.orders-module__pager {
  display: flex;
  justify-content: flex-end;
}
</style>
