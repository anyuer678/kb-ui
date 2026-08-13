# Switch 开关

## 基础用法

<KbSpace wrap>
  <KbSwitch v-model="value" />
  <KbSwitch v-model="value2" />
  <KbSwitch :model-value="true" disabled />
</KbSpace>

<p class="demo-hint">开关 1：{{ value }} · 开关 2：{{ value2 }}</p>

## API

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `modelValue` | `boolean` | `false` | 开关状态 |
| `disabled` | `boolean` | `false` | 禁用 |

### 事件

| 事件 | 参数 | 说明 |
|---|---|---|
| `update:modelValue` | `boolean` | 切换时触发 |
| `change` | `boolean` | 切换时触发 |

<script setup>
import { ref } from 'vue'
const value = ref(false)
const value2 = ref(true)
</script>

<style>
.demo-hint { color: var(--kb-color-text-3); font-size: var(--kb-font-size-sm); }
</style>
