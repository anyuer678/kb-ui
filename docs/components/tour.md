# Tour 漫游式引导

分步高亮页面元素并展示说明气泡，用于新功能引导。

## 基础用法

```vue
<template>
  <button id="tour-target">引导目标</button>
  <KbTour v-model="open" :steps="steps" />
</template>

<script setup>
import { ref } from 'vue'
const open = ref(false)
const steps = [
  { target: '#tour-target', title: '第一步', description: '这是要被高亮的元素', placement: 'bottom' },
  { title: '第二步', description: '不传 target 时气泡居中展示' },
]
</script>
```

<button class="kb-btn kb-btn--primary" @click="open = true">开始引导</button>
<div id="tour-demo-target" style="margin-top:12px;padding:12px;border:1px dashed #dcdfe6;display:inline-block">引导目标</div>
<KbTour v-model="open" :steps="steps" />

## 气泡位置

`placement` 可取 `top` / `bottom` / `left` / `right`，默认 `bottom`。不传 `target` 的步骤会居中显示，且不渲染高亮框。

```vue
<template>
  <KbTour v-model="open" :steps="[{ target: '#box', title: '标题', placement: 'right' }]" />
</template>
```

## 关闭方式

| 方式 | 说明 |
|---|---|
| 跳过 | `show-skip` 为 `true`（默认）时展示「跳过」按钮 |
| 遮罩 | `mask-closable` 为 `true`（默认）时点击遮罩关闭 |
| 关闭按钮 | 气泡右上角 `×` |
| 最后一步 | 按钮变为「结束引导」，点击后派发 `finish` 并关闭 |

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `modelValue` | `boolean` | `false` | 是否显示 |
| `steps` | `TourStep[]` | `[]` | 步骤列表 |
| `current` | `number` | `0` | 当前步骤下标 |
| `showSkip` | `boolean` | `true` | 是否展示跳过按钮 |
| `maskClosable` | `boolean` | `true` | 点击遮罩是否关闭 |

`TourStep` 字段：`target?`（选择器）、`title`、`description?`、`placement?`。

### 事件

| 事件 | 参数 | 说明 |
|---|---|---|
| `update:modelValue` | `boolean` | 关闭时派发 |
| `update:current` | `number` | 步骤变化 |
| `change` | `number` | 步骤变化 |
| `finish` | — | 在最后一步点击「结束引导」 |

<script setup>
import { ref } from 'vue'
const open = ref(false)
const steps = [
  { target: '#tour-demo-target', title: '第一步', description: '这是要被高亮的元素', placement: 'bottom' },
  { title: '第二步', description: '不传 target 时气泡居中展示' },
]
</script>
