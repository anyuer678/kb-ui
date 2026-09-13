# TreeSelect 树选择

下拉面板中展示可展开的树形结构，用于选择某个节点。

## 基础用法

```vue
<template>
  <KbTreeSelect v-model="value" :options="options" />
</template>
```

```js
const options = [
  { label: '浙江', value: 'zj', children: [{ label: '杭州', value: 'hz' }, { label: '宁波', value: 'nb' }] },
  { label: '江苏', value: 'js', children: [{ label: '南京', value: 'nj' }] },
]
```

<KbTreeSelect
  :options="[
    { label: '浙江', value: 'zj', children: [{ label: '杭州', value: 'hz' }, { label: '宁波', value: 'nb' }] },
    { label: '江苏', value: 'js', children: [{ label: '南京', value: 'nj' }] },
  ]"
  @update:model-value="() => {}"
/>

## 默认全展开

传 `default-expand-all` 让面板打开时所有父节点处于展开状态。

```vue
<template>
  <KbTreeSelect v-model="value" :options="options" default-expand-all />
</template>
```

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `options` | `TreeSelectNode[]` | `[]` | 树形数据 |
| `modelValue` | `string \| number` | — | 选中值 |
| `placeholder` | `string` | 语言包 `common.placeholder` | 占位文案 |
| `disabled` | `boolean` | `false` | 禁用 |
| `clearable` | `boolean` | `false` | 可清空 |
| `defaultExpandAll` | `boolean` | `false` | 初始展开全部 |

`TreeSelectNode` 字段：`label`、`value`、`children?`、`disabled?`。

### 事件

| 事件 | 参数 | 说明 |
|---|---|---|
| `update:modelValue` | `string \| number \| undefined` | 选中变化 |
| `change` | `string \| number \| undefined` | 选中变化 |
