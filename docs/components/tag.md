# Tag 标签

用于标记和分类的小标签。

## 基础用法

<KbSpace wrap>
  <KbTag>默认</KbTag>
  <KbTag type="primary">主要</KbTag>
  <KbTag type="success">成功</KbTag>
  <KbTag type="warning">警告</KbTag>
  <KbTag type="danger">危险</KbTag>
  <KbTag type="info">信息</KbTag>
</KbSpace>

## 可关闭与圆角

<KbSpace wrap>
  <KbTag type="danger" closable @close="message.info('已关闭')">可关闭</KbTag>
  <KbTag type="primary" round>圆角</KbTag>
</KbSpace>

## API

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `type` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` | 标签类型 |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | 尺寸 |
| `closable` | `boolean` | `false` | 是否显示关闭按钮 |
| `round` | `boolean` | `false` | 圆角（pill） |

### 事件

| 事件 | 说明 |
|---|---|
| `close` | 点击关闭按钮时触发 |
