# Grid 栅格

24 栅格布局系统，`KbRow` + `KbCol` 组合使用。

## 基础用法

<KbRow :gutter="12">
  <KbCol :span="8"><div class="demo-grid">span 8</div></KbCol>
  <KbCol :span="8"><div class="demo-grid">span 8</div></KbCol>
  <KbCol :span="8"><div class="demo-grid">span 8</div></KbCol>
</KbRow>

<KbRow :gutter="12" justify="space-between" style="margin-top: 12px">
  <KbCol :span="6"><div class="demo-grid">span 6</div></KbCol>
  <KbCol :span="6"><div class="demo-grid">span 6</div></KbCol>
  <KbCol :span="6"><div class="demo-grid">span 6</div></KbCol>
</KbRow>

## API

### Row

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `gutter` | `number` | `0` | 栅格间距（px，左右各一半） |
| `justify` | `'start' \| 'center' \| 'end' \| 'space-between' \| 'space-around'` | `'start'` | 水平排列 |
| `align` | `'top' \| 'middle' \| 'bottom'` | `'top'` | 垂直对齐 |

### Col

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `span` | `number` | `24` | 栅格占位（1-24） |
| `offset` | `number` | `0` | 左侧偏移（1-24） |

<style>
.demo-grid {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  border-radius: var(--kb-radius-sm);
  background: color-mix(in srgb, var(--kb-color-primary) 12%, transparent);
  color: var(--kb-color-primary);
  font-size: var(--kb-font-size-sm);
}
</style>
