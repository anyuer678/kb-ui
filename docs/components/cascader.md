# Cascader 级联选择

多级级联选择，面板逐级展开，支持异步加载子级。

## 基础用法

```vue
<script setup lang="ts">
const options = [
  { label: '浙江', value: 'zj', children: [{ label: '杭州', value: 'hz' }] },
  { label: '广东', value: 'gd', children: [{ label: '广州', value: 'gz' }] },
]
</script>

<template>
  <KbCascader :options="options" />
</template>
```

<KbCascader :options="regionOptions" clearable />

`separator` 可自定义已选路径的展示分隔符：

```vue
<KbCascader :options="options" v-model="value" separator=" / " />
```

## 异步加载

大数据量或数据按需拉取的场景，打开 `lazy` 并实现 `lazyLoad(node, resolve)`：组件在**展开面板时**用 `node = null` 请求根级，之后每次点击节点用该节点请求下一级。

<KbCascader lazy :options="[]" :lazy-load="lazyLoad" />

```vue
<script setup lang="ts">
function lazyLoad(node, resolve) {
  setTimeout(() => {
    if (!node) {
      resolve([{ label: '浙江', value: 'zj' }, { label: '江苏', value: 'js' }])
    } else {
      resolve([
        { label: `${node.label}-子项 1`, value: `${node.value}-1` },
        { label: `${node.label}-子项 2`, value: `${node.value}-2` },
      ])
    }
  }, 300)
}
</script>

<template>
  <KbCascader lazy :options="[]" :lazy-load="lazyLoad" />
</template>
```

请求过程中被加载的那一列会显示「加载中…」。若某节点确定为末级、无需再请求，直接在数据里标记 `leaf: true`；`resolve` 返回**空数组**同样会被视为末级并自动收起。

## 禁用与清空

<KbCascader :options="regionOptions" disabled placeholder="禁用状态" />
<KbCascader v-model="cityValue" :options="regionOptions" clearable />

## API

### CascaderOption

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `label` | `string` | — | 选项文本 |
| `value` | `string \| number` | — | 选项值 |
| `children` | `CascaderOption[]` | — | 子级选项 |
| `leaf` | `boolean` | `false` | 标记为末级，异步模式下点击即收起 |
| `disabled` | `boolean` | `false` | 禁用该项 |

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `options` | `CascaderOption[]` | `[]` | 选项数据 |
| `modelValue` | `(string \| number)[]` | `[]` | 已选路径 |
| `placeholder` | `string` | `'请选择'` | 占位文案 |
| `separator` | `string` | `' / '` | 已选路径分隔符 |
| `disabled` | `boolean` | `false` | 禁用 |
| `clearable` | `boolean` | `false` | 显示清空按钮 |
| `lazy` | `boolean` | `false` | 开启异步加载 |
| `lazyLoad` | `(node, resolve) => void` | — | 异步加载子节点，`node` 为 `null` 表示根级 |

### 事件

| 名称 | 参数 | 说明 |
|---|---|---|
| `update:modelValue` | `(value: (string \| number)[])` | 选择变化 |

<script setup>
import { ref } from 'vue'

const regionOptions = [
  {
    label: '浙江',
    value: 'zj',
    children: [
      { label: '杭州', value: 'hz' },
      { label: '宁波', value: 'nb' },
    ],
  },
  {
    label: '广东',
    value: 'gd',
    children: [{ label: '广州', value: 'gz' }],
  },
]
const cityValue = ref(['zj', 'hz'])

function lazyLoad(node, resolve) {
  setTimeout(() => {
    if (!node) {
      resolve([
        { label: '浙江', value: 'zj' },
        { label: '江苏', value: 'js' },
      ])
      return
    }
    resolve([
      { label: `${node.label}-子项 1`, value: `${node.value}-1` },
      { label: `${node.label}-子项 2`, value: `${node.value}-2` },
    ])
  }, 300)
}
</script>
