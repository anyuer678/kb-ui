<script setup lang="ts">
import { ref } from 'vue'
import { KbForm, KbFormItem, KbInput, KbInputPassword, KbButton, KbSelect, KbSwitch, message } from 'kb-ui-vue'

const form = ref({ name: '', email: '', password: '', role: '', notify: true })
const rules = {
  name: [{ required: true, message: '请输入姓名' }],
  email: [
    { required: true, message: '请输入邮箱' },
    { pattern: /^\S+@\S+\.\S+$/, message: '邮箱格式不正确' },
  ],
  password: [{ required: true, message: '请输入密码' }],
}
const formRef = ref()
const roleOptions = [
  { label: '管理员', value: 'admin' },
  { label: '编辑', value: 'editor' },
]

async function submit() {
  const ok = await formRef.value?.validate()
  if (ok) message.success('资料已保存（演示）')
  else message.error('请检查表单')
}
</script>

<template>
  <div class="profile-edit-module">
    <h3 class="profile-edit-module__title">编辑资料</h3>
    <KbForm ref="formRef" :model="form" :rules="rules">
      <KbFormItem label="姓名" prop="name">
        <KbInput v-model="form.name" placeholder="请输入姓名" clearable />
      </KbFormItem>
      <KbFormItem label="邮箱" prop="email">
        <KbInput v-model="form.email" placeholder="you@example.com" clearable />
      </KbFormItem>
      <KbFormItem label="密码" prop="password">
        <KbInputPassword v-model="form.password" placeholder="新密码" />
      </KbFormItem>
      <KbFormItem label="角色" prop="role">
        <KbSelect v-model="form.role" :options="roleOptions" placeholder="选择角色" />
      </KbFormItem>
      <KbFormItem label="通知">
        <KbSwitch v-model="form.notify" />
      </KbFormItem>
    </KbForm>
    <div class="profile-edit-module__actions">
      <KbButton type="primary" @click="submit">保存</KbButton>
      <KbButton>取消</KbButton>
    </div>
  </div>
</template>

<style scoped>
.profile-edit-module {
  max-width: 440px;
  padding: var(--kb-space-5);
  border: 1px solid var(--kb-color-border);
  border-radius: var(--kb-radius-lg);
  background: var(--kb-color-bg);
}

.profile-edit-module__title {
  margin: 0 0 var(--kb-space-4);
  color: var(--kb-color-text-1);
}

.profile-edit-module__actions {
  display: flex;
  gap: var(--kb-space-2);
}
</style>
