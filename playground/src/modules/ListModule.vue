<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  KbInput,
  KbSelect,
  KbButton,
  KbTable,
  KbTag,
  KbPagination,
  KbDropdown,
  KbEmpty,
  message,
} from 'kb-ui-vue'

// 模拟数据源
const allData = Array.from({ length: 37 }, (_, i) => ({
  id: i + 1,
  name: `用户${String(i + 1).padStart(3, '0')}`,
  role: ['管理员', '编辑', '访客'][i % 3],
  status: i % 5 === 0 ? '停用' : '正常',
  created: `2026-08-${String((i % 28) + 1).padStart(2, '0')}`,
}))

const columns = [
  { prop: 'id', label: 'ID', width: 60 },
  { prop: 'name', label: '姓名' },
  { prop: 'role', label: '角色' },
  { prop: 'status', label: '状态' },
  { prop: 'created', label: '创建日期' },
]

const keyword = ref('')
const roleFilter = ref('')
const currentPage = ref(1)
const pageSize = 10

const roleOptions = [
  { label: '全部角色', value: '' },
  { label: '管理员', value: '管理员' },
  { label: '编辑', value: '编辑' },
  { label: '访客', value: '访客' },
]

const filtered = computed(() => {
  let list = allData
  if (keyword.value) {
    list = list.filter((row) => row.name.includes(keyword.value))
  }
  if (roleFilter.value) {
    list = list.filter((row) => row.role === roleFilter.value)
  }
  return list
})

const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filtered.value.slice(start, start + pageSize)
})

function search() {
  currentPage.value = 1
  message.info(`共找到 ${filtered.value.length} 条记录`)
}

function reset() {
  keyword.value = ''
  roleFilter.value = ''
  currentPage.value = 1
}

function handleAction(key: string) {
  message.info(`操作：${key}（演示）`)
}
</script>

<template>
  <div class="list-module">
    <div class="list-module__toolbar">
      <KbInput
        v-model="keyword"
        placeholder="搜索姓名"
        clearable
        style="width: 200px"
        @keyup.enter="search"
      />
      <KbSelect v-model="roleFilter" :options="roleOptions" style="width: 140px" />
      <KbButton type="primary" @click="search">搜索</KbButton>
      <KbButton @click="reset">重置</KbButton>
      <span class="list-module__count">共 {{ filtered.length }} 条</span>
    </div>

    <KbTable :data="pagedData" :columns="columns" stripe border>
      <template #cell="{ row, column }">
        <KbTag v-if="column.prop === 'status'" :type="row.status === '正常' ? 'success' : 'danger'">
          {{ row[column.prop] }}
        </KbTag>
        <KbDropdown
          v-else-if="column.prop === 'name'"
          :items="[
            { label: '编辑', key: 'edit' },
            { label: '删除', key: 'delete', danger: true },
          ]"
          trigger="click"
          @select="handleAction"
        >
          <a class="list-module__link" href="javascript:void(0)">{{ row[column.prop] }} ▾</a>
        </KbDropdown>
        <span v-else>{{ row[column.prop] }}</span>
      </template>
    </KbTable>

    <div v-if="pagedData.length === 0" class="list-module__empty">
      <KbEmpty description="没有匹配的记录" />
    </div>

    <div class="list-module__footer">
      <KbPagination v-model:current-page="currentPage" :total="filtered.length" :page-size="pageSize" />
    </div>
  </div>
</template>

<style scoped>
.list-module {
  display: flex;
  flex-direction: column;
  gap: var(--kb-space-3);
  padding: var(--kb-space-4);
  border: 1px solid var(--kb-color-border);
  border-radius: var(--kb-radius-lg);
  background: var(--kb-color-bg);
}

.list-module__toolbar {
  display: flex;
  align-items: center;
  gap: var(--kb-space-2);
  flex-wrap: wrap;
}

.list-module__count {
  margin-left: auto;
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-sm);
}

.list-module__link {
  color: var(--kb-color-primary);
  text-decoration: none;
}

.list-module__empty {
  padding: var(--kb-space-2) 0;
}

.list-module__footer {
  display: flex;
  justify-content: flex-end;
}
</style>
