# Tabs 标签页

页签切换容器，支持卡片样式与插槽内容。

## 基础用法

```vue
<template>
  <KbTabs :tabs="[{ label: 'Tab 1', key: '1' }]"><template #1>内容</template></KbTabs>
</template>
```

<KbTabs :tabs="[{ label: '简介', key: 'a' }, { label: '特性', key: 'b' }, { label: 'API', key: 'c' }]"><template #a>第一个面板</template><template #b>第二个面板</template><template #c>第三个面板</template></KbTabs>

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `tabs` | ``TabItem[]`` | `[]` | 页签列表（label/key） |
| `modelValue` | ``string`` | '' | 当前激活 key |
| `card` | ``boolean`` | `false` | 卡片风格 |

### 事件

| 事件 | 参数 | 说明 |
|---|---|---|
| ``update:modelValue`` | ``string`` | 切换 |

### 插槽

| 名称 | 说明 |
|---|---|
| ``[key]`` | 对应页签内容 |

