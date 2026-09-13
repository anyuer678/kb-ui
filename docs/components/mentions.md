# Mentions 提及

在文本域中输入触发前缀（默认 `@`）唤起候选项下拉，选中后插入对应值。适合 @ 好友、引用成员等场景。

## 基础用法

```vue
<template>
  <KbMentions
    v-model="text"
    :options="options"
    placeholder="输入 @ 唤起提及"
    @select="onSelect"
  />
</template>

<script setup>
import { ref } from 'vue'
const text = ref('')
const options = [
  { value: 'afc163' },
  { value: 'zombiej', label: '僵尸' },
  { value: 'admin', disabled: true },
]
function onSelect(option, prefix) {
  console.log('选中', option.value, prefix)
}
</script>
```

<KbMentions :options="[{ value: 'afc163' }, { value: 'zombiej', label: '僵尸' }, { value: 'admin', disabled: true }]" placeholder="输入 @ 试试" style="max-width:420px" />

## 自定义前缀

`prefix` 可传多个字符，例如同时支持 `@` 与 `#` 话题：

```vue
<KbMentions :prefix="['@', '#']" :options="options" />
```

## 自定义过滤

默认按 `label ?? value` 包含匹配；传 `filterOption` 完全接管，传 `false` 关闭过滤（展示全部候选）。

```ts
const filter = (search: string, option: MentionOption) =>
  option.value.toLowerCase().startsWith(search.toLowerCase())
```

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `modelValue` | `string` | `''` | 绑定文本（`v-model`） |
| `options` | `MentionOption[]` | `[]` | 候选项 |
| `prefix` | `string \| string[]` | `'@'` | 触发前缀，可传多个 |
| `rows` | `number` | `2` | 文本域行数 |
| `placeholder` | `string` | — | 占位提示 |
| `disabled` | `boolean` | `false` | 禁用 |
| `readonly` | `boolean` | `false` | 只读 |
| `filterOption` | `(search, option) => boolean \| false` | 包含匹配 | 自定义过滤；`false` 关闭 |
| `notFoundContent` | `string` | — | 无匹配时的文案 |

### MentionOption

| 属性 | 类型 | 说明 |
|---|---|---|
| `value` | `string` | 插入文本时使用的值 |
| `label` | `string` | 展示文案，缺省用 `value` |
| `disabled` | `boolean` | 禁用该候选 |

### 事件

| 事件 | 参数 | 说明 |
|---|---|---|
| `update:modelValue` | `string` | 文本变化 |
| `select` | `(option, prefix)` | 选中候选项 |
| `search` | `(text, prefix)` | 搜索词变化 |
