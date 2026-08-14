# Progress 进度条

展示操作进度，支持状态与自定义。

## 基础用法

<KbSpace direction="vertical" :size="12" style="width: 100%">
  <KbProgress :percentage="30" />
  <KbProgress :percentage="66" status="warning" />
  <KbProgress :percentage="100" status="success" />
  <KbProgress :percentage="80" :stroke-width="12" :show-text="false" />
</KbSpace>

```vue
<KbProgress :percentage="30" />
<KbProgress :percentage="66" status="warning" />
<KbProgress :percentage="100" status="success" />
<KbProgress :percentage="80" :stroke-width="12" :show-text="false" />
```

## API

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `percentage` | `number` | `0` | 进度百分比（0-100，超界自动收敛） |
| `strokeWidth` | `number` | `8` | 轨道高度（px） |
| `color` | `string` | — | 自定义颜色（覆盖状态色） |
| `showText` | `boolean` | `true` | 是否显示百分比文本 |
| `status` | `'normal' \| 'success' \| 'warning' \| 'danger'` | `'normal'` | 状态（决定颜色） |
