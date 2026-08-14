# Notification 通知提醒

函数式通知 API，从右上角弹出。

## 基础用法

```vue
<template>
  notification.success({ title: '成功', content: '操作完成' })
</template>
```

<KbButton @click="$event => $kbNotification?.success({ title: '示例', content: '这是一条通知' })">（函数式 API，见说明）</KbButton>

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `title` | ``string`` | '' | 标题 |
| `content` | ``string`` | '' | 内容 |
| `duration` | ``number`` | `3000` | 自动关闭 ms，0 不关闭 |

