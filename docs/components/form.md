# Form 表单

表单容器 + 校验（required/pattern/validator），与 FormItem 配合使用。

## 基础用法

```vue
<template>
  <KbForm ref="formRef" :model="form" :rules="rules"><KbFormItem label="姓名" prop="name"><KbInput v-model="form.name" /></KbFormItem></KbForm>
</template>
```

<KbForm :model="{ name: '' }" :rules="{ name: [{ required: true, message: '请输入姓名' }] }"><KbFormItem label="姓名" prop="name"><KbInput :model-value="''" @update:model-value="() => {}" /></KbFormItem></KbForm>

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `model` | ``object`` | `{}` | 表单数据 |
| `rules` | ``FormRules`` | `{}` | 校验规则 |
| `label-width` | ``string`` | 'auto' | 标签宽度 |

### 插槽

| 名称 | 说明 |
|---|---|
| ``default`` | FormItem 列表 |

