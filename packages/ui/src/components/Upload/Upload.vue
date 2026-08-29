<script setup lang="ts">
import { ref } from 'vue'

defineOptions({ name: 'KbUpload' })

export type UploadStatus = 'pending' | 'uploading' | 'success' | 'error'

export interface UploadFile {
  name: string
  size: number
  /** 上传状态（配置 action 时有意义；未配置时恒为 pending） */
  status?: UploadStatus
  /** 上传进度百分比 0-100（配置 action 时有意义） */
  progress?: number
}

interface InternalItem extends UploadFile {
  raw: File
}

export interface UploadProps {
  /** 接受的文件类型 */
  accept?: string
  multiple?: boolean
  /** 上传目标 URL；不配置时组件退化为纯文件选择器 */
  action?: string
  /** 上传附带的请求头 */
  headers?: Record<string, string>
  /** 跨域请求是否携带 cookie */
  withCredentials?: boolean
  /** 表单字段名（默认 file） */
  name?: string
}

const props = withDefaults(defineProps<UploadProps>(), {
  accept: '',
  multiple: false,
  action: '',
  withCredentials: false,
  name: 'file',
})

const emit = defineEmits<{
  change: [files: UploadFile[]]
  remove: [file: UploadFile]
  progress: [file: UploadFile]
  success: [payload: { file: UploadFile; response: string }]
  error: [payload: { file: UploadFile; error: string }]
}>()

const items = ref<InternalItem[]>([])

function formatSize(size: number): string {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / 1024 / 1024).toFixed(1)} MB`
}

function toPublic(item: InternalItem): UploadFile {
  return { name: item.name, size: item.size, status: item.status, progress: item.progress }
}

function startUpload(item: InternalItem) {
  const xhr = new XMLHttpRequest()
  item.status = 'uploading'
  item.progress = 0
  xhr.upload.addEventListener('progress', (e) => {
    if (e.lengthComputable) {
      item.progress = Math.round((e.loaded / e.total) * 100)
      emit('progress', toPublic(item))
    }
  })
  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      item.status = 'success'
      item.progress = 100
      emit('success', { file: toPublic(item), response: xhr.responseText })
    } else {
      item.status = 'error'
      emit('error', { file: toPublic(item), error: `HTTP ${xhr.status}` })
    }
  })
  xhr.addEventListener('error', () => {
    item.status = 'error'
    emit('error', { file: toPublic(item), error: 'network error' })
  })
  xhr.addEventListener('abort', () => {
    item.status = 'error'
    emit('error', { file: toPublic(item), error: 'aborted' })
  })
  const fd = new FormData()
  fd.append(props.name, item.raw)
  for (const [k, v] of Object.entries(props.headers ?? {})) {
    xhr.setRequestHeader(k, v)
  }
  if (props.withCredentials) xhr.withCredentials = true
  xhr.open('POST', props.action)
  xhr.send(fd)
}

function handleChange(event: Event) {
  const input = event.target as HTMLInputElement
  const selected = Array.from(input.files ?? [])
  const newItems: InternalItem[] = selected.map((f) => ({
    name: f.name,
    size: f.size,
    raw: f,
    status: 'pending',
  }))
  items.value = props.multiple ? [...items.value, ...newItems] : newItems
  emit('change', newItems.map(toPublic))
  if (props.action) {
    // 用 items.value 的响应式代理遍历：直接改原始对象不会触发视图更新
    for (const item of items.value) startUpload(item)
  }
  input.value = ''
}

function removeAt(index: number) {
  const [item] = items.value.splice(index, 1)
  if (item) emit('remove', toPublic(item))
}
</script>

<template>
  <div class="kb-upload">
    <label class="kb-upload__button">
      <input
        type="file"
        :accept="accept"
        :multiple="multiple"
        aria-label="选择文件"
        @change="handleChange"
      />
      选择文件
    </label>
    <div v-if="items.length" class="kb-upload__list">
      <div v-for="(file, i) in items" :key="`${file.name}-${i}`" class="kb-upload__item">
        <span class="kb-upload__icon">📄</span>
        <span class="kb-upload__name">{{ file.name }}</span>
        <span class="kb-upload__size">{{ formatSize(file.size) }}</span>
        <span v-if="file.status === 'uploading'" class="kb-upload__status">
          上传中 {{ file.progress ?? 0 }}%
        </span>
        <span v-else-if="file.status === 'success'" class="kb-upload__status kb-upload__status--success">
          已上传
        </span>
        <span v-else-if="file.status === 'error'" class="kb-upload__status kb-upload__status--error">
          上传失败
        </span>
        <button class="kb-upload__delete" type="button" aria-label="删除" @click="removeAt(i)">×</button>
      </div>
    </div>
  </div>
</template>
