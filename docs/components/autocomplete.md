# AutoComplete 自动补全

输入框带候选提示，支持本地过滤与远程取数。

## 基础用法

本地数据源会按输入内容自动过滤。

```vue
<template>
  <KbAutoComplete v-model="value" :options="['Vue', 'React', 'Svelte']" />
</template>
```

<KbAutoComplete :model-value="'R'" :options="['Vue', 'React', 'Svelte', 'Solid']" @update:model-value="() => {}" />

## 远程取数

`fetch-suggestions` 返回候选数组（同步或 Promise），返回空数组表示无结果。

```vue
<template>
  <KbAutoComplete :fetch-suggestions="search" placeholder="搜索用户" />
</template>

<script setup>
const search = async (query) => {
  const res = await fetch(`/api/users?q=${query}`)
  return res.json()
}
</script>
```

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `modelValue` | `string` | `''` | 输入值 |
| `options` | `string[] \| { value, label, disabled }[]` | `[]` | 候选数据源 |
| `placeholder` | `string` | 语言包 `common.placeholder` | 占位文案 |
| `disabled` | `boolean` | `false` | 禁用 |
| `clearable` | `boolean` | `false` | 可清空 |
| `filter` | `boolean` | `true` | 是否本地过滤 |
| `fetchSuggestions` | `(query) => Option[] \| Promise<Option[]>` | — | 远程取数 |
| `size` | `'small' \| 'medium' \| 'large'` | ConfigProvider | 尺寸 |

### 事件

| 事件 | 参数 | 说明 |
|---|---|---|
| `update:modelValue` | `string` | 输入变化 |
| `select` | `Option` | 选中候选项 |
| `change` | `string` | 值变化 |

### 键盘

| 按键 | 行为 |
|---|---|
| `↑` / `↓` | 移动高亮项 |
| `Enter` | 选中高亮项 |
| `Esc` | 关闭面板 |
