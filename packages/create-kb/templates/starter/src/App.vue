<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'kb-ui-vue'

const dark = ref(false)

function toggleTheme() {
  dark.value = !dark.value
  document.documentElement.dataset.theme = dark.value ? 'dark' : 'light'
}

// 表单示例
const inputValue = ref('')
const checked = ref(true)
const radioValue = ref('a')
const selectValue = ref('')
const selectOptions = [
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
  { label: '橙子', value: 'orange' },
]

// 表格
const tableData = [
  { name: '张三', age: 18, city: '北京' },
  { name: '李四', age: 20, city: '上海' },
  { name: '王五', age: 22, city: '广州' },
]
const tableColumns = [
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' },
  { prop: 'city', label: '城市' },
]

// 对话框
const dialogVisible = ref(false)
</script>

<template>
  <main class="page">
    <h1>{{projectName}}</h1>
    <p class="subtitle">@kb/ui 组件库完整示例</p>

    <div class="actions">
      <KbButton type="primary" @click="toggleTheme">切换主题</KbButton>
      <KbButton type="success" @click="message.success('保存成功')">保存</KbButton>
      <KbButton type="danger" plain @click="message.error('操作失败')">删除</KbButton>
    </div>

    <section class="block">
      <h2>表单</h2>
      <KbSpace vertical :size="12">
        <KbInput v-model="inputValue" placeholder="请输入内容" clearable style="width: 280px" />
        <KbSpace wrap>
          <KbCheckbox v-model="checked" label="记住我" />
          <KbRadio v-model="radioValue" value="a">选项 A</KbRadio>
          <KbRadio v-model="radioValue" value="b">选项 B</KbRadio>
        </KbSpace>
        <KbSelect v-model="selectValue" :options="selectOptions" placeholder="请选择" style="width: 280px" />
      </KbSpace>
      <p class="hint">
        输入：{{ inputValue || '（空）' }} · 选中：{{ selectValue || '（未选择）' }}
      </p>
    </section>

    <section class="block">
      <h2>表格</h2>
      <KbTable :data="tableData" :columns="tableColumns" stripe border>
        <template #cell="{ row, column }">
          <KbTag v-if="column.prop === 'city'" type="primary">{{ row[column.prop] }}</KbTag>
          <span v-else>{{ row[column.prop] }}</span>
        </template>
      </KbTable>
    </section>

    <section class="block">
      <h2>对话框</h2>
      <KbButton type="primary" plain @click="dialogVisible = true">打开对话框</KbButton>
      <KbDialog v-model="dialogVisible" title="确认操作" width="420">
        <p>这是一个对话框示例，footer 支持自定义。</p>
        <template #footer>
          <KbButton @click="dialogVisible = false">取消</KbButton>
          <KbButton type="primary" @click="dialogVisible = false; message.success('已确认')">
            确定
          </KbButton>
        </template>
      </KbDialog>
    </section>
  </main>
</template>

<style scoped>
.page {
  max-width: 720px;
  margin: 0 auto;
  padding: 40px 24px 80px;
  font-family: var(--kb-font-family);
}

.subtitle {
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-sm);
}

.actions {
  display: flex;
  gap: var(--kb-space-2);
  margin: 24px 0;
}

.block {
  margin-top: 32px;
}

.block h2 {
  font-size: var(--kb-font-size-lg);
  color: var(--kb-color-text-1);
}

.hint {
  margin-top: 8px;
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-sm);
}
</style>
