# Badge 徽标

用于标记数量或状态的小圆点/角标。

## 基础用法

<KbSpace wrap :size="28">
  <KbBadge :content="5"><KbButton>消息</KbButton></KbBadge>
  <KbBadge :content="120" :max="99"><KbButton>邮件</KbButton></KbBadge>
  <KbBadge dot><KbButton>小红点</KbButton></KbBadge>
  <KbBadge :content="'new'" color="#16a34a" />
</KbSpace>

```vue
<KbBadge :content="5"><KbButton>消息</KbButton></KbBadge>
<KbBadge :content="120" :max="99"><KbButton>邮件</KbButton></KbBadge>
<KbBadge dot><KbButton>小红点</KbButton></KbBadge>
<KbBadge :content="'new'" color="#16a34a" />
```

## API

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `content` | `string \| number` | `''` | 角标内容（数字超 `max` 封顶为 `max+`） |
| `dot` | `boolean` | `false` | 小红点模式（不显示文字） |
| `max` | `number` | `99` | 数字封顶值 |
| `color` | `string` | — | 自定义背景色 |

### 插槽

| 名称 | 说明 |
|---|---|
| `default` | 被标记的元素（无插槽时角标独立展示） |
