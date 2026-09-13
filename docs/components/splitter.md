# Splitter 分隔面板

可拖拽调整相邻面板占比，支持键盘微调与纵向布局。

## 基础用法

`v-model` 是各面板的百分比数组，长度即面板数量。

```vue
<template>
  <KbSplitter v-model="sizes" style="height:200px">
    <template #panel-0>左侧</template>
    <template #panel-1>右侧</template>
  </KbSplitter>
</template>

<script setup>
import { ref } from 'vue'
const sizes = ref([50, 50])
</script>
```

<KbSplitter :model-value="[40, 60]" style="height:160px;border:1px solid #dcdfe6" @update:model-value="() => {}">
  <template #panel-0><div style="padding:12px">左侧</div></template>
  <template #panel-1><div style="padding:12px">右侧</div></template>
</KbSplitter>

## 多面板

数组长度大于 2 时会渲染对应数量的分隔条，拖拽只影响相邻两个面板。

```vue
<template>
  <KbSplitter v-model="sizes" style="height:200px">
    <template #panel-0>一</template>
    <template #panel-1>二</template>
    <template #panel-2>三</template>
  </KbSplitter>
</template>

<script setup>
import { ref } from 'vue'
const sizes = ref([25, 40, 35])
</script>
```

## 纵向布局

```vue
<template>
  <KbSplitter v-model="sizes" layout="vertical" style="height:240px">
    <template #panel-0>上</template>
    <template #panel-1>下</template>
  </KbSplitter>
</template>
```

## 最小占比

`min` 限制相邻面板各自的最小占比，键盘与拖拽都受此约束。

```vue
<template>
  <KbSplitter v-model="sizes" :min="20" style="height:160px">
    <template #panel-0>左</template>
    <template #panel-1>右</template>
  </KbSplitter>
</template>
```

## 键盘操作

分隔条可获得焦点，按方向键以 2% 步进调整：横向布局用 `←` `→`，纵向布局用 `↑` `↓`。

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `modelValue` | `number[]` | `[50, 50]` | 各面板占比（%），长度即面板数量 |
| `layout` | `'horizontal' \| 'vertical'` | `'horizontal'` | 排列方向 |
| `min` | `number` | `10` | 面板最小占比（%） |
| `disabled` | `boolean` | `false` | 禁用拖拽 |

### 事件

| 事件 | 参数 | 说明 |
|---|---|---|
| `update:modelValue` | `number[]` | 占比变化 |

### 插槽

| 插槽 | 说明 |
|---|---|
| `panel-{index}` | 第 index 个面板内容 |
