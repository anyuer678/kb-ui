# Avatar 头像

用户头像或占位图，支持图片、文字回退与自定义尺寸。

## 基础用法

<KbSpace wrap>
  <KbAvatar fallback="张" round />
  <KbAvatar fallback="KB" :size="56" round />
  <KbAvatar :size="48" round />
  <KbAvatar fallback="李" :size="32" />
</KbSpace>

```vue
<KbAvatar fallback="张" round />
<KbAvatar fallback="KB" :size="56" round />
<KbAvatar :size="48" round />
<KbAvatar fallback="李" :size="32" />
```

## 图片头像

```vue
<KbAvatar src="https://example.com/avatar.png" alt="用户" round />
```

## API

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `src` | `string` | `''` | 图片地址 |
| `alt` | `string` | `''` | 图片替代文本 |
| `fallback` | `string` | `''` | 无图时显示的文字（如名字首字符） |
| `size` | `number \| 'small' \| 'medium' \| 'large'` | `'medium'` | 尺寸（数字为 px，字号自动减半） |
| `round` | `boolean` | `false` | 圆形 |

### 插槽

| 名称 | 说明 |
|---|---|
| `default` | 自定义头像内容（优先于 fallback） |
