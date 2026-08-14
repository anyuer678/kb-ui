<script setup lang="ts">
import { ref } from 'vue'
import {
  KbInput,
  KbInputNumber,
  KbSelect,
  KbRadio,
  KbCheckbox,
  KbSwitch,
  KbTextarea,
  KbButton,
  KbDivider,
  message,
} from '@kb/ui'

const form = ref({
  name: '',
  email: '',
  role: '',
  age: 18,
  gender: 'male',
  subscribe: true,
  notify: false,
  bio: '',
})

const roleOptions = [
  { label: '前端工程师', value: 'frontend' },
  { label: '后端工程师', value: 'backend' },
  { label: '产品经理', value: 'pm' },
]

function handleSubmit() {
  if (!form.value.name || !form.value.email) {
    message.warning('请填写姓名与邮箱')
    return
  }
  message.success(`提交成功：${form.value.name}（演示）`)
}

function handleReset() {
  form.value = {
    name: '',
    email: '',
    role: '',
    age: 18,
    gender: 'male',
    subscribe: true,
    notify: false,
    bio: '',
  }
}
</script>

<template>
  <div class="form-module">
    <div class="form-module__header">
      <h2 class="form-module__title">创建账户</h2>
      <p class="form-module__subtitle">填写以下信息完成注册（演示表单）</p>
    </div>

    <KbDivider />

    <div class="form-module__grid">
      <div class="form-module__field">
        <label class="form-module__label">姓名 <span class="form-module__required">*</span></label>
        <KbInput v-model="form.name" placeholder="你的姓名" clearable />
      </div>
      <div class="form-module__field">
        <label class="form-module__label">邮箱 <span class="form-module__required">*</span></label>
        <KbInput v-model="form.email" placeholder="you@example.com" clearable />
      </div>
      <div class="form-module__field">
        <label class="form-module__label">职位</label>
        <KbSelect v-model="form.role" :options="roleOptions" placeholder="请选择职位" />
      </div>
      <div class="form-module__field">
        <label class="form-module__label">年龄</label>
        <KbInputNumber v-model="form.age" :min="1" :max="100" />
      </div>
      <div class="form-module__field">
        <label class="form-module__label">性别</label>
        <KbSpace>
          <KbRadio v-model="form.gender" value="male">男</KbRadio>
          <KbRadio v-model="form.gender" value="female">女</KbRadio>
        </KbSpace>
      </div>
      <div class="form-module__field">
        <label class="form-module__label">偏好</label>
        <KbSpace vertical :size="8">
          <KbCheckbox v-model="form.subscribe">订阅更新通知</KbCheckbox>
          <KbSpace align="center">
            <KbSwitch v-model="form.notify" />
            <span class="form-module__hint">消息推送</span>
          </KbSpace>
        </KbSpace>
      </div>
      <div class="form-module__field form-module__field--full">
        <label class="form-module__label">个人简介</label>
        <KbTextarea v-model="form.bio" placeholder="介绍一下自己（可选）" :rows="3" :maxlength="200" />
      </div>
    </div>

    <div class="form-module__actions">
      <KbButton type="primary" @click="handleSubmit">提交</KbButton>
      <KbButton @click="handleReset">重置</KbButton>
    </div>
  </div>
</template>

<style scoped>
.form-module {
  box-sizing: border-box;
  padding: var(--kb-space-5);
  border: 1px solid var(--kb-color-border);
  border-radius: var(--kb-radius-lg);
  background: var(--kb-color-bg);
}

.form-module__title {
  margin: 0;
  color: var(--kb-color-text-1);
  font-size: var(--kb-font-size-xl);
}

.form-module__subtitle {
  margin: var(--kb-space-1) 0 0;
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-sm);
}

.form-module__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--kb-space-4);
}

.form-module__field {
  display: flex;
  flex-direction: column;
  gap: var(--kb-space-2);
}

.form-module__field--full {
  grid-column: 1 / -1;
}

.form-module__label {
  color: var(--kb-color-text-2);
  font-size: var(--kb-font-size-sm);
}

.form-module__required {
  color: var(--kb-color-danger);
}

.form-module__hint {
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-sm);
}

.form-module__actions {
  display: flex;
  gap: var(--kb-space-2);
  margin-top: var(--kb-space-5);
}

@media (max-width: 720px) {
  .form-module__grid {
    grid-template-columns: 1fr;
  }
}
</style>
