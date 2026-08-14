# Upload 文件上传

文件选择与列表展示，支持多选/大小限制/删除。

## 基础用法

```vue
<template>
  <KbUpload v-model="files" accept="image/*" />
</template>
```

<KbUpload :model-value="[{ name: '示例文件.txt', size: 1024 }]" @update:model-value="() => {}" />

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `modelValue` | ``UploadFile[]`` | `[]` | 文件列表（name/size/status） |
| `accept` | ``string`` | '' | 接受类型 |
| `multiple` | ``boolean`` | `false` | 多选 |
| `max-size` | ``number`` | `0` | 大小上限 MB，0 不限 |

### 事件

| 事件 | 参数 | 说明 |
|---|---|---|
| ``update:modelValue`` | ``UploadFile[]`` | 列表变化 |
| ``remove`` | ``UploadFile`` | 删除 |

