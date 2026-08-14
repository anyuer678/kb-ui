# CountUp 数字滚动

数字滚动动画，支持缓动/前缀后缀/小数位。

## 基础用法

```vue
<template>
  <KbCountUp :end="100" :duration="1500" prefix="$" />
</template>
```

<KbCountUp :end="12345" prefix="¥" :duration="1200" />

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `end` | ``number`` | — | 目标值 |
| `start` | ``number`` | `0` | 起始值 |
| `duration` | ``number`` | `1500` | 时长 ms |
| `prefix` / `suffix` | ``string`` | '' | 前后缀 |
| `decimals` | ``number`` | `0` | 小数位 |

