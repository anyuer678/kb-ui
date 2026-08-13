<script setup lang="ts">
import { ref } from 'vue'
import {
  KbButton,
  KbIcon,
  KbTag,
  KbSpace,
  KbDivider,
  KbRow,
  KbCol,
  KbInput,
  KbCheckbox,
  KbRadio,
  KbSwitch,
  KbSelect,
  KbTooltip,
  KbDialog,
  KbTable,
  message,
} from '@kb/ui'

// 表单示例状态
const inputValue = ref('')
const checked = ref(true)
const radioValue = ref('a')
const switchValue = ref(false)
const selectValue = ref('')
const selectOptions = [
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
  { label: '橙子', value: 'orange' },
]

// Dialog 状态
const dialogVisible = ref(false)

// Table 数据
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

const icons = ['check', 'close', 'info', 'warning', 'success', 'error', 'arrow-left', 'arrow-right', 'search', 'menu', 'loading', 'chevron-down']
</script>

<template>
  <div class="page">
    <h1>KB UI Playground</h1>
    <p class="subtitle">@kb/ui 组件库实时预览（源码直连，热更新）</p>

    <!-- 基础组件 -->
    <section class="block">
      <h2>基础组件</h2>
      <KbDivider />

      <h3>Button</h3>
      <KbSpace wrap>
        <KbButton type="default">默认</KbButton>
        <KbButton type="primary">主要</KbButton>
        <KbButton type="success">成功</KbButton>
        <KbButton type="warning">警告</KbButton>
        <KbButton type="danger">危险</KbButton>
        <KbButton type="info">信息</KbButton>
        <KbButton type="primary" disabled>禁用</KbButton>
        <KbButton type="primary" round>圆角</KbButton>
        <KbButton type="primary" plain>朴素</KbButton>
        <KbButton type="primary" size="small">小</KbButton>
        <KbButton type="primary" size="large">大</KbButton>
      </KbSpace>

      <h3>Icon</h3>
      <KbSpace wrap>
        <KbIcon v-for="name in icons" :key="name" :name="name" :size="22" :color="name === 'error' ? '#dc2626' : undefined" />
      </KbSpace>

      <h3>Tag</h3>
      <KbSpace wrap>
        <KbTag>默认</KbTag>
        <KbTag type="primary">主要</KbTag>
        <KbTag type="success">成功</KbTag>
        <KbTag type="warning">警告</KbTag>
        <KbTag type="danger" closable>可关闭</KbTag>
        <KbTag type="info" round>圆角</KbTag>
      </KbSpace>

      <h3>Space / Grid</h3>
      <KbSpace direction="vertical" :size="12">
        <KbRow :gutter="12">
          <KbCol :span="6"><div class="grid-box">span 6</div></KbCol>
          <KbCol :span="6"><div class="grid-box">span 6</div></KbCol>
          <KbCol :span="6"><div class="grid-box">span 6</div></KbCol>
          <KbCol :span="6"><div class="grid-box">span 6</div></KbCol>
        </KbRow>
      </KbSpace>
    </section>

    <!-- 表单组件 -->
    <section class="block">
      <h2>表单组件</h2>
      <KbDivider />

      <h3>Input</h3>
      <KbSpace vertical>
        <KbInput v-model="inputValue" placeholder="请输入内容" clearable style="width: 240px" />
        <span class="hint">输入值：{{ inputValue || '（空）' }}</span>
      </KbSpace>

      <h3>Checkbox / Radio / Switch</h3>
      <KbSpace wrap>
        <KbCheckbox v-model="checked" label="勾选我" />
        <KbRadio v-model="radioValue" value="a">选项 A</KbRadio>
        <KbRadio v-model="radioValue" value="b">选项 B</KbRadio>
        <KbSwitch v-model="switchValue" />
      </KbSpace>
      <p class="hint">radio={{ radioValue }} · switch={{ switchValue }}</p>

      <h3>Select</h3>
      <KbSpace>
        <KbSelect v-model="selectValue" :options="selectOptions" placeholder="请选择水果" />
        <span class="hint">已选：{{ selectValue || '（未选择）' }}</span>
      </KbSpace>
    </section>

    <!-- 反馈组件 -->
    <section class="block">
      <h2>反馈组件</h2>
      <KbDivider />

      <h3>Tooltip</h3>
      <KbSpace wrap>
        <KbTooltip content="上方提示">
          <KbButton type="primary" plain>上方</KbButton>
        </KbTooltip>
        <KbTooltip content="下方提示" placement="bottom">
          <KbButton type="primary" plain>下方</KbButton>
        </KbTooltip>
        <KbTooltip content="点击触发" trigger="click">
          <KbButton type="primary" plain>点击</KbButton>
        </KbTooltip>
      </KbSpace>

      <h3>Message</h3>
      <KbSpace wrap>
        <KbButton type="success" @click="message.success('操作成功')">成功提示</KbButton>
        <KbButton type="danger" @click="message.error('出错了')">错误提示</KbButton>
        <KbButton type="warning" @click="message.warning('请注意')">警告提示</KbButton>
        <KbButton type="info" @click="message.info('这是一条信息')">信息提示</KbButton>
      </KbSpace>

      <h3>Dialog</h3>
      <KbButton type="primary" @click="dialogVisible = true">打开对话框</KbButton>
      <KbDialog v-model="dialogVisible" title="确认操作" width="420">
        <p>这是一段对话框内容，支持任意插槽内容与 footer 自定义。</p>
        <template #footer>
          <KbButton @click="dialogVisible = false">取消</KbButton>
          <KbButton type="primary" @click="dialogVisible = false; message.success('已确认')">
            确定
          </KbButton>
        </template>
      </KbDialog>
    </section>

    <!-- 数据展示 -->
    <section class="block">
      <h2>数据展示</h2>
      <KbDivider />

      <h3>Table</h3>
      <KbTable :data="tableData" :columns="tableColumns" stripe border />
    </section>
  </div>
</template>

<style scoped>
.page {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 24px 80px;
  font-family: var(--kb-font-family);
}

.subtitle {
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-sm);
}

.block {
  margin-top: 24px;
}

.block h2 {
  color: var(--kb-color-text-1);
  font-size: var(--kb-font-size-xl);
}

.block h3 {
  margin: 20px 0 10px;
  color: var(--kb-color-text-2);
  font-size: var(--kb-font-size-lg);
  font-weight: 600;
}

.hint {
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-sm);
}

.grid-box {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  border-radius: var(--kb-radius-sm);
  background: color-mix(in srgb, var(--kb-color-primary) 12%, transparent);
  color: var(--kb-color-primary);
  font-size: var(--kb-font-size-sm);
}
</style>
