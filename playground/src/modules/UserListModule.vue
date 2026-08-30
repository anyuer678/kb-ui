<script setup lang="ts">
import { ref } from 'vue'
import { KbTable, KbTag, KbButton, KbSearch, KbAvatar, message } from 'kb-ui-vue'

const keyword = ref('')
const users = ref([
  { name: '张三', role: '管理员', email: 'zhang@example.com', status: '启用', time: '2026-01-02' },
  { name: '李四', role: '编辑', email: 'li@example.com', status: '启用', time: '2026-02-15' },
  { name: '王五', role: '访客', email: 'wang@example.com', status: '禁用', time: '2026-03-08' },
  { name: '赵六', role: '编辑', email: 'zhao@example.com', status: '启用', time: '2026-04-20' },
])
const cols = [
  { prop: 'name', label: '用户' },
  { prop: 'role', label: '角色' },
  { prop: 'email', label: '邮箱' },
  { prop: 'status', label: '状态' },
  { prop: 'time', label: '注册时间' },
]
const result = ref(users)

function doSearch(q: string) {
  keyword.value = q
  result.value = q ? users.value.filter((u) => u.name.includes(q) || u.email.includes(q)) : users.value
}
</script>

<template>
  <div class="user-list-module">
    <div class="user-list-module__bar">
      <KbSearch v-model="keyword" placeholder="搜索姓名/邮箱" @search="doSearch" style="width: 300px" />
    </div>
    <KbTable :data="result" :columns="cols">
      <template #name="{ row }">
        <div class="user-list-module__cell">
          <KbAvatar :fallback="row.name[0]" round :size="28" />
          <span>{{ row.name }}</span>
        </div>
      </template>
      <template #role="{ row }">
        <KbTag size="small" :type="row.role === '管理员' ? 'danger' : 'info'">{{ row.role }}</KbTag>
      </template>
      <template #status="{ row }">
        <KbTag size="small" :type="row.status === '启用' ? 'success' : 'default'">{{ row.status }}</KbTag>
      </template>
      <template #ops="{ row }">
        <KbButton size="small" @click="message.info(`编辑 ${row.name}（演示）`)">编辑</KbButton>
      </template>
    </KbTable>
  </div>
</template>

<style scoped>
.user-list-module {
  display: flex;
  flex-direction: column;
  gap: var(--kb-space-3);
}

.user-list-module__cell {
  display: flex;
  align-items: center;
  gap: var(--kb-space-2);
}
</style>
