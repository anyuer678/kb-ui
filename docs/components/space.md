# Space 间距

为子元素提供统一的间距。

## 基础用法

```vue
<template>
  <KbSpace>
    <KbButton>按钮一</KbButton>
    <KbButton>按钮二</KbButton>
  </KbSpace>
</template>
```

<KbSpace>
  <KbButton>按钮一</KbButton>
  <KbButton>按钮二</KbButton>
  <KbButton>按钮三</KbButton>
</KbSpace>

## 竖向与自定义间距

<KbSpace direction="vertical" :size="12">
  <KbButton type="primary" block style="width: 160px">一</KbButton>
  <KbButton type="success" style="width: 160px">二</KbButton>
  <KbButton type="warning" style="width: 160px">三</KbButton>
</KbSpace>

## API

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | 排列方向 |
| `size` | `'small' \| 'medium' \| 'large' \| number` | `'medium'` | 间距（数字为 px） |
| `align` | `'start' \| 'center' \| 'end' \| 'baseline'` | `'start'` | 对齐方式 |
| `wrap` | `boolean` | `false` | 是否换行 |
