# Statistic 统计数值

展示统计数据，支持千分位、小数位与前后缀。

## 基础用法

```vue
<template>
  <KbStatistic title="总用户" :value="12345" prefix="¥" />
</template>
```

<KbStatistic title="总用户" :value="1234567" />

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `title` | ``string`` | '' | 标题 |
| `value` | ``number`` | `0` | 数值 |
| `precision` | ``number`` | `0` | 小数位 |
| `prefix` / `suffix` | ``string`` | '' | 前后缀 |
| `group-separator` | ``boolean`` | `true` | 千分位 |

### 插槽

| 名称 | 说明 |
|---|---|
| ``default`` | 自定义数值显示 |

