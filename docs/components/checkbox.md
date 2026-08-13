# Checkbox 复选框

## 基础用法

<KbSpace wrap>
  <KbCheckbox v-model="checked1" label="选项 A" />
  <KbCheckbox v-model="checked2" label="选项 B" />
  <KbCheckbox :model-value="true" label="禁用选中" disabled />
  <KbCheckbox :model-value="false" label="禁用" disabled />
</KbSpace>

<p class="demo-hint">A：{{ checked1 }} · B：{{ checked2 }}</p>

## API

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `modelValue` | `boolean` | `false` | 是否选中 |
| `disabled` | `boolean` | `false` | 禁用 |
| `label` | `string` | — | 文字（也可用默认插槽） |

### 事件

| 事件 | 参数 | 说明 |
|---|---|---|
| `update:modelValue` | `boolean` | 切换时触发 |
| `change` | `boolean` | 切换时触发 |

<script setup>
import { ref } from 'vue'
const checked1 = ref(true)
const checked2 = ref(false)
</script>

<style>
.demo-hint { color: var(--kb-color-text-3); font-size: var(--kb-font-size-sm); }
</style>
