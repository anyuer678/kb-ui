# Drawer 抽屉

从侧边滑出的面板，支持四个方向与插槽。

## 基础用法

```vue
<template>
  <KbDrawer v-model="visible" title="抽屉标题">内容</KbDrawer>
</template>
```

<KbDrawer :model-value="false" title="抽屉标题">（通过 v-model 控制）</KbDrawer>

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `modelValue` | ``boolean`` | `false` | 是否显示 |
| `title` | ``string`` | '' | 标题 |
| `placement` | `'left' \| 'right' \| 'top' \| 'bottom'` | 'right' | 滑出方向 |
| `width` | ``string`` | '320px' | 宽度（左右） |

### 事件

| 事件 | 参数 | 说明 |
|---|---|---|
| ``update:modelValue`` | ``boolean`` | 关闭 |
| ``close`` | `—` | 关闭动画后 |

### 插槽

| 名称 | 说明 |
|---|---|
| ``default`` | 内容 |
| ``footer`` | 底部 |

