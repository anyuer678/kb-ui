# Radio 单选框

## 基础用法

<KbSpace wrap>
  <KbRadio v-model="value" value="a">选项 A</KbRadio>
  <KbRadio v-model="value" value="b">选项 B</KbRadio>
  <KbRadio v-model="value" value="c" disabled>选项 C（禁用）</KbRadio>
</KbSpace>

<p class="demo-hint">当前选中：{{ value }}</p>

## API

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `modelValue` | `string \| number \| boolean` | — | 当前选中值 |
| `value` | `string \| number \| boolean` | — | 本选项的值 |
| `disabled` | `boolean` | `false` | 禁用 |

### 事件

| 事件 | 参数 | 说明 |
|---|---|---|
| `update:modelValue` | `string \| number \| boolean` | 选中时触发 |

<script setup>
import { ref } from 'vue'
const value = ref('a')
</script>

<style>
.demo-hint { color: var(--kb-color-text-3); font-size: var(--kb-font-size-sm); }
</style>
