# Affix 固钉

滚动到阈值后把元素固定在视口某个位置，并保留占位元素避免布局跳动。

## 基础用法

向下滚动时元素吸附到距顶部 20px 的位置。

```vue
<template>
  <KbAffix :offset-top="20">
    <button>固定在这里</button>
  </KbAffix>
</template>
```

<div style="height:120px;overflow:auto;border:1px dashed #dcdfe6;padding:8px">
  <div style="height:60px;color:#909399">向下滚动 →</div>
  <KbAffix :offset-top="0" style="background:#eef4ff">
    <div style="padding:8px 12px">固定在容器顶部</div>
  </KbAffix>
  <div style="height:300px"></div>
</div>

## 固定在底部

传 `offset-bottom` 后改为「元素底部越过视口底线时吸附」。

```vue
<template>
  <KbAffix :offset-bottom="20">
    <button>固定在底部</button>
  </KbAffix>
</template>
```

## 限制在容器内

`target` 传边界容器的选择器，滚动出容器后自动解除固定。

```vue
<template>
  <div id="affix-scope">
    <KbAffix :offset-top="10" target="#affix-scope">
      <button>只在容器内固定</button>
    </KbAffix>
  </div>
</template>
```

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `offsetTop` | `number` | `0` | 距视口顶部固定偏移，与 `offsetBottom` 二选一，都传时以它为准 |
| `offsetBottom` | `number` | — | 距视口底部固定偏移 |
| `target` | `string` | — | 边界容器选择器，固定不会超出该容器 |
| `placeholder` | `boolean` | `true` | 是否保留占位元素 |

### 事件

| 事件 | 参数 | 说明 |
|---|---|---|
| `change` | `boolean` | 固定状态变化 |
