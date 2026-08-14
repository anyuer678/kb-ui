# Result 结果页

操作反馈结果页，如成功/失败/404，支持自定义操作。

## 基础用法

```vue
<template>
  <KbResult status="success" title="提交成功" description="您的申请已受理。" />
</template>
```

<KbResult status="success" title="提交成功" description="您的申请已受理。" />

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `status` | `'success' \| 'warning' \| 'danger' \| 'info' \| '404'` | 'success' | 状态 |
| `title` | ``string`` | '' | 标题 |
| `description` | ``string`` | '' | 描述 |

### 插槽

| 名称 | 说明 |
|---|---|
| ``default`` | 操作区 |
| ``title`` | 自定义标题 |

