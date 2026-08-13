# Tooltip 文字提示

## 基础用法

<KbSpace wrap>
  <KbTooltip content="上方提示">
    <KbButton type="primary" plain>上方</KbButton>
  </KbTooltip>
  <KbTooltip content="下方提示" placement="bottom">
    <KbButton type="primary" plain>下方</KbButton>
  </KbTooltip>
  <KbTooltip content="左侧提示" placement="left">
    <KbButton type="primary" plain>左侧</KbButton>
  </KbTooltip>
  <KbTooltip content="右侧提示" placement="right">
    <KbButton type="primary" plain>右侧</KbButton>
  </KbTooltip>
  <KbTooltip content="点击触发" trigger="click">
    <KbButton type="primary" plain>点击触发</KbButton>
  </KbTooltip>
</KbSpace>

## API

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `content` | `string` | `''` | 提示内容 |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | 出现位置 |
| `trigger` | `'hover' \| 'click'` | `'hover'` | 触发方式 |
| `disabled` | `boolean` | `false` | 禁用提示 |

### 插槽

| 名称 | 说明 |
|---|---|
| `default` | 触发提示的元素 |
