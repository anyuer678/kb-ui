# Popconfirm 气泡确认框

点击元素弹出确认框，确定/取消回调。

## 基础用法

```vue
<template>
  <KbPopconfirm title="确认删除？" @confirm="del"><KbButton>删除</KbButton></KbPopconfirm>
</template>
```

<KbPopconfirm title="确认删除该条记录？" @confirm="() => {}"><KbButton type="danger" plain>删除</KbButton></KbPopconfirm>

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `title` | ``string`` | '' | 确认文案 |
| `confirm-text` | ``string`` | '确定' | 确定按钮 |
| `cancel-text` | ``string`` | '取消' | 取消按钮 |

### 事件

| 事件 | 参数 | 说明 |
|---|---|---|
| ``confirm`` | `—` | 点击确定 |
| ``cancel`` | `—` | 点击取消 |

### 插槽

| 名称 | 说明 |
|---|---|
| ``default`` | 触发元素 |

