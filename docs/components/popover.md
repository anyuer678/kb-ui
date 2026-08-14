# Popover 气泡卡片

鼠标悬停/点击弹出的内容卡片，带标题与箭头。

## 基础用法

```vue
<template>
  <KbPopover title="标题" content="内容"><KbButton>悬停</KbButton></KbPopover>
</template>
```

<KbPopover title="提示标题" content="这里是气泡卡片的内容。"><KbButton>悬停查看</KbButton></KbPopover>

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `title` | ``string`` | '' | 标题 |
| `content` | ``string`` | '' | 内容 |
| `trigger` | `'hover' \| 'click'` | 'hover' | 触发方式 |

### 插槽

| 名称 | 说明 |
|---|---|
| ``default`` | 触发元素 |

