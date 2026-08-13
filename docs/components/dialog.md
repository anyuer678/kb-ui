# Dialog 对话框

通过 `v-model` 控制显隐，支持标题、自定义内容与 footer。

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
const visible = ref(false)
</script>

<template>
  <KbButton type="primary" @click="visible = true">打开对话框</KbButton>
  <KbDialog v-model="visible" title="确认操作">
    <p>这是对话框内容</p>
    <template #footer>
      <KbButton @click="visible = false">取消</KbButton>
      <KbButton type="primary" @click="visible = false">确定</KbButton>
    </template>
  </KbDialog>
</template>
```

<KbButton type="primary" @click="visible = true">打开对话框</KbButton>

<KbDialog v-model="visible" title="确认操作" width="420">
  <p>这是一个对话框示例，支持任意插槽内容与 footer 自定义。</p>
  <template #footer>
    <KbButton @click="visible = false">取消</KbButton>
    <KbButton type="primary" @click="visible = false; message.success('已确认')">确定</KbButton>
  </template>
</KbDialog>

## API

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `modelValue` | `boolean` | `false` | 是否显示 |
| `title` | `string` | `''` | 标题 |
| `width` | `string \| number` | `480` | 宽度（数字为 px） |
| `closeOnClickOverlay` | `boolean` | `true` | 点击遮罩关闭 |

### 插槽

| 名称 | 说明 |
|---|---|
| `default` | 内容区 |
| `footer` | 底部操作区 |

### 事件

| 事件 | 说明 |
|---|---|
| `update:modelValue` | 关闭时触发 |
| `close` | 点击遮罩关闭时触发 |

<script setup>
import { ref } from 'vue'
const visible = ref(false)
</script>
