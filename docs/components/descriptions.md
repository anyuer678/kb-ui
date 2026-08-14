# Descriptions 描述列表

只读信息描述列表，支持边框与列数。

## 基础用法

```vue
<template>
  <KbDescriptions :items="[{ label: '姓名', value: '张三' }]" :columns="2" />
</template>
```

<KbDescriptions :items="[{ label: '姓名', value: '张三' }, { label: '角色', value: '管理员' }, { label: '邮箱', value: 'a@b.com' }, { label: '状态', value: '在线' }]" :columns="2" border />

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `items` | ``DescriptionItem[]`` | `[]` | 条目（label/value） |
| `columns` | ``number`` | `1` | 列数 |
| `border` | ``boolean`` | `false` | 边框 |

