# Divider 分割线

用于分隔内容的分割线，支持带文字。

## 基础用法

<KbDivider />

## 带文字

<KbDivider content-position="center">居中</KbDivider>
<KbDivider content-position="left">靠左</KbDivider>
<KbDivider content-position="right">靠右</KbDivider>

## 竖向分割线

<KbSpace align="center">
  <span>文本</span>
  <KbDivider direction="vertical" />
  <span>文本</span>
  <KbDivider direction="vertical" />
  <span>文本</span>
</KbSpace>

## API

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | 方向 |
| `contentPosition` | `'left' \| 'center' \| 'right'` | `'center'` | 文字位置（仅水平） |

### 插槽

| 名称 | 说明 |
|---|---|
| `default` | 分割线文字（仅水平） |
