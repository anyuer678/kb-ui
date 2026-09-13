# ImagePreview 图片预览

全屏图片查看器，支持缩放、旋转、切换与键盘操作。通常由 [Image](/components/image) 自动唤起，也可单独使用。

## 基础用法

```vue
<template>
  <button @click="visible = true">查看大图</button>
  <KbImagePreview v-model:visible="visible" :images="images" />
</template>

<script setup>
import { ref } from 'vue'
const visible = ref(false)
const images = ['/a.png', '/b.png', '/c.png']
</script>
```

<button class="kb-btn kb-btn--primary" @click="visible = true">查看大图</button>
<KbImagePreview v-model:visible="visible" v-model:index="index" :images="images" />

## 操作方式

| 操作 | 行为 |
|---|---|
| 点击左右箭头 / `←` `→` | 上一张 / 下一张（多图时） |
| 滚轮上滑 / `+` | 放大 |
| 滚轮下滑 / `-` | 缩小 |
| 旋转按钮 | 顺时针 90° |
| `Esc` / 点击遮罩 | 关闭 |

缩放范围限制在 `0.25 ~ 5`，每次重新打开都会重置缩放与旋转。

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `visible` | `boolean` | `false` | 是否显示 |
| `images` | `string[]` | `[]` | 图片列表 |
| `index` | `number` | `0` | 当前第几张（从 0 开始） |
| `teleportTo` | `string` | `'body'` | 挂载位置 |

### 事件

| 事件 | 参数 | 说明 |
|---|---|---|
| `update:visible` | `boolean` | 关闭时派发 |
| `update:index` | `number` | 切换图片 |
| `change` | `number` | 切换图片 |
| `close` | — | 关闭 |

<script setup>
import { ref } from 'vue'
const svg = (fill, text) =>
  `data:image/svg+xml;charset=utf8,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%22240%22%20height=%22160%22%3E%3Crect%20width=%22240%22%20height=%22160%22%20fill=%22${fill}%22/%3E%3Ctext%20x=%22120%22%20y=%2292%22%20fill=%22white%22%20font-size=%2236%22%20text-anchor=%22middle%22%3E${text}%3C/text%3E%3C/svg%3E`
const visible = ref(false)
const index = ref(0)
const images = [svg('%23409eff', 'A'), svg('%2300b578', 'B'), svg('%23f5a623', 'C')]
</script>
