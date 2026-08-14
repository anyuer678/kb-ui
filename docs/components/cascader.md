# Cascader 级联选择

多级级联选择，面板逐级展开。

## 基础用法

```vue
<template>
  <KbCascader :options="[{ label: '浙江', value: 'zj', children: [] }]" />
</template>
```

<KbCascader :options="[{ label: '浙江', value: 'zj', children: [{ label: '杭州', value: 'hz' }, { label: '宁波', value: 'nb' }] }, { label: '广东', value: 'gd', children: [{ label: '广州', value: 'gz' }] }]" :model-value="['zj', 'hz']" @update:model-value="() => {}" />

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `options` | ``CascaderOption[]`` | `[]` | 选项（label/value/children） |
| `modelValue` | ``(string \| number)[]`` | `[]` | 已选路径 |
| `placeholder` | ``string`` | '请选择' | 占位 |

### 事件

| 事件 | 参数 | 说明 |
|---|---|---|
| ``update:modelValue`` | ``(string \| number)[]`` | 选择变化 |

