# Layout 布局

页面的顶层骨架：`Layout` 容器 + `Header` / `Sider` / `Content` / `Footer` 四个语义区块。包含 `Sider` 时自动切换为水平布局，否则为上下结构。

## 基础用法

```vue
<template>
  <KbLayout style="height: 240px">
    <KbHeader>Header</KbHeader>
    <KbLayout>
      <KbSider collapsible v-model:collapsed="collapsed">Sider</KbSider>
      <KbContent>Content</KbContent>
    </KbLayout>
    <KbFooter>Footer</KbFooter>
  </KbLayout>
</template>

<script setup>
import { ref } from 'vue'
const collapsed = ref(false)
</script>
```

<KbLayout style="height:220px;border:1px solid var(--kb-border,#dcdfe6)">
  <KbHeader><div style="padding:12px">Header</div></KbHeader>
  <KbLayout>
    <KbSider collapsible><div style="padding:12px">Sider</div></KbSider>
    <KbContent><div style="padding:12px">Content</div></KbContent>
  </KbLayout>
  <KbFooter><div style="padding:12px">Footer</div></KbFooter>
</KbLayout>

## 上 - 中（左 + 右）- 下

外层 `KbLayout` 垂直排布，内层嵌套一个 `KbLayout` 水平排布（自动检测到 `Sider`）。

## 收起侧边栏

`Sider` 传 `collapsible` 显示内置触发器，`v-model:collapsed` 双向绑定收起状态；触发器文案跟随语言包（`layout.sider.collapse` / `layout.sider.expand`）。

## 指定方向

不传 `direction` 时按是否含 `Sider` 自动判断；也可显式指定：

```vue
<KbLayout direction="horizontal">…</KbLayout>
```

## API

### Layout Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `direction` | `'horizontal' \| 'vertical'` | 自动 | 布局方向；缺省时含 Sider 为 horizontal，否则 vertical |

### Sider Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `width` | `number \| string` | `200` | 展开宽度 |
| `collapsedWidth` | `number \| string` | `64` | 收起宽度 |
| `collapsed` | `boolean` | `false` | 是否收起（`v-model:collapsed`） |
| `collapsible` | `boolean` | `false` | 是否显示折叠触发器 |
| `reverseArrow` | `boolean` | `false` | 翻转触发器箭头（右侧侧边栏用） |

### Sider 事件

| 事件 | 参数 | 说明 |
|---|---|---|
| `update:collapsed` | `boolean` | 收起状态变化 |
| `collapse` | `(collapsed, type)` | 状态变化后触发，`type` 为触发来源 |

### 区块组件

`Header` / `Content` / `Footer` 无 Props，均为默认插槽容器；`Sider` 同样使用默认插槽。
