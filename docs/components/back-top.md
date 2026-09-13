# BackTop 回到顶部

滚动超过阈值后出现悬浮按钮，点击平滑回到顶部。

## 基础用法

```vue
<template>
  <div style="height:200vh">
    向下滚动页面，右下角会出现按钮
  </div>
  <KbBackTop />
</template>
```

::: tip 演示
按钮固定定位在视口右下角，请向下滚动当前页面查看效果。
:::

<KbBackTop :right="40" :bottom="40" />

## 自定义阈值与位置

```vue
<template>
  <KbBackTop :visibility-height="400" :right="24" :bottom="24" />
</template>
```

## 指定滚动容器

`target` 可传 CSS 选择器或元素，未传时监听窗口。

```vue
<template>
  <div id="scroll-box" style="height:300px;overflow:auto">
    <div style="height:1200px">内容</div>
  </div>
  <KbBackTop target="#scroll-box" />
</template>
```

## 自定义内容

```vue
<template>
  <KbBackTop>
    <span>UP</span>
  </KbBackTop>
</template>
```

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `visibilityHeight` | `number` | `200` | 滚动超过该值后显示 |
| `target` | `string \| HTMLElement` | — | 滚动监听目标，默认窗口 |
| `right` | `number` | `40` | 距视口右侧距离（px） |
| `bottom` | `number` | `40` | 距视口底部距离（px） |
| `duration` | `number` | `300` | 动画时长（ms），`0` 表示直接跳转 |

### 事件

| 事件 | 参数 | 说明 |
|---|---|---|
| `click` | `MouseEvent` | 点击按钮 |
