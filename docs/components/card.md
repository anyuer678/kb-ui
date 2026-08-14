# Card 卡片

容器组件，承载内容与操作。

## 基础用法

<KbRow :gutter="12">
  <KbCol :span="8">
    <KbCard title="基础卡片">
      <p>这是卡片内容，支持任意内容。</p>
    </KbCard>
  </KbCol>
  <KbCol :span="8">
    <KbCard title="带操作" shadow="hover">
      <p>悬停有阴影效果。</p>
      <template #footer>
        <KbButton type="primary" size="small">确定</KbButton>
        <KbButton size="small">取消</KbButton>
      </template>
    </KbCard>
  </KbCol>
  <KbCol :span="8">
    <KbCard title="无阴影" shadow="never">
      <p>简洁无阴影。</p>
    </KbCard>
  </KbCol>
</KbRow>

```vue
<KbCard title="带操作" shadow="hover">
  <p>卡片内容</p>
  <template #footer>
    <KbButton type="primary" size="small">确定</KbButton>
  </template>
</KbCard>
```

## API

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `title` | `string` | `''` | 卡片标题 |
| `shadow` | `'always' \| 'hover' \| 'never'` | `'always'` | 阴影策略 |

### 插槽

| 名称 | 说明 |
|---|---|
| `default` | 内容区 |
| `footer` | 底部操作区 |
