# Collapse 折叠面板

可折叠的内容区域，支持手风琴模式。

## 基础用法

```vue
<template>
  <KbCollapse :items="[{ title: '面板一', content: '内容' }]" />
</template>
```

<KbCollapse :items="[{ title: '面板一', content: '这是第一个面板的内容。' }, { title: '面板二', content: '这是第二个面板的内容。' }]" style="max-width: 480px" />

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `items` | ``CollapseItem[]`` | `[]` | 面板项（title/content） |
| `accordion` | ``boolean`` | `false` | 手风琴模式 |
| `modelValue` | ``string[]`` | `[]` | 展开面板 key 列表 |

### 事件

| 事件 | 参数 | 说明 |
|---|---|---|
| ``update:modelValue`` | ``string[]`` | 展开状态变化 |

