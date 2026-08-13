# Button 按钮

基础交互按钮，支持多种类型、尺寸与状态。

## 基础用法

```vue
<template>
  <KbButton type="primary" @click="handleClick">主要按钮</KbButton>
</template>
```

<KbSpace wrap>
  <KbButton type="default">默认</KbButton>
  <KbButton type="primary">主要</KbButton>
  <KbButton type="success">成功</KbButton>
  <KbButton type="warning">警告</KbButton>
  <KbButton type="danger">危险</KbButton>
  <KbButton type="info">信息</KbButton>
</KbSpace>

## 状态与尺寸

<KbSpace wrap>
  <KbButton type="primary" disabled>禁用</KbButton>
  <KbButton type="primary" round>圆角</KbButton>
  <KbButton type="primary" plain>朴素</KbButton>
  <KbButton type="primary" size="small">小</KbButton>
  <KbButton type="primary">中</KbButton>
  <KbButton type="primary" size="large">大</KbButton>
</KbSpace>

## API

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `type` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` | 按钮类型 |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | 尺寸 |
| `disabled` | `boolean` | `false` | 禁用 |
| `round` | `boolean` | `false` | 圆角（pill） |
| `plain` | `boolean` | `false` | 朴素（浅底深字） |
| `nativeType` | `'button' \| 'submit' \| 'reset'` | `'button'` | 原生 type |

### 事件

| 事件 | 参数 | 说明 |
|---|---|---|
| `click` | `MouseEvent` | 点击（disabled 时不触发） |

### 插槽

| 名称 | 说明 |
|---|---|
| `default` | 按钮内容 |
