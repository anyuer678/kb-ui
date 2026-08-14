# Alert 警告提示

页面内提示信息，支持类型、标题、图标与关闭。

## 基础用法

<KbSpace direction="vertical" :size="12" style="width: 100%">
  <KbAlert type="info" title="提示" show-icon>这是一条普通提示信息。</KbAlert>
  <KbAlert type="success" title="成功" show-icon closable>操作已成功完成。</KbAlert>
  <KbAlert type="warning" title="注意" show-icon closable>部分功能暂不可用。</KbAlert>
  <KbAlert type="danger" title="错误" show-icon closable>发生了一个错误。</KbAlert>
</KbSpace>

```vue
<KbAlert type="success" title="成功" show-icon closable>操作已成功完成。</KbAlert>
```

## API

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `type` | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` | 提示类型 |
| `title` | `string` | `''` | 标题 |
| `closable` | `boolean` | `false` | 是否可关闭 |
| `showIcon` | `boolean` | `false` | 是否显示类型图标 |

### 插槽

| 名称 | 说明 |
|---|---|
| `default` | 提示内容（标题下方） |
