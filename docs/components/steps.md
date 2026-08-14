# Steps 步骤条

分步流程指示，支持自定义标题/描述/状态。

## 基础用法

```vue
<template>
  <KbSteps :items="[{ title: '第一步' }, { title: '第二步' }]" :current="1" />
</template>
```

<KbSteps :items="[{ title: '填写信息', description: '基础资料' }, { title: '确认订单', description: '核对内容' }, { title: '完成', description: '提交成功' }]" :current="1" />

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `items` | ``StepsItem[]`` | `[]` | 步骤项（title/description） |
| `current` | ``number`` | `0` | 当前步骤 |

