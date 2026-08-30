<script setup lang="ts">
import { ref } from 'vue'
import { KbSteps, KbButton, KbInput, KbInputNumber, KbTag, message } from 'kb-ui-vue'

const active = ref(0)
const form = ref({ name: '', age: 18, email: '' })

const steps = [
  { title: '基本信息', description: '姓名与年龄' },
  { title: '联系方式', description: '邮箱' },
  { title: '完成', description: '提交确认' },
]

function next() {
  if (active.value === 0 && !form.value.name) {
    message.warning('请填写姓名')
    return
  }
  if (active.value === 1 && !form.value.email) {
    message.warning('请填写邮箱')
    return
  }
  active.value++
  if (active.value === 2) message.success('提交成功（演示）')
}
</script>

<template>
  <div class="wizard-module">
    <KbSteps :steps="steps" :active="active" />
    <div class="wizard-module__body">
      <template v-if="active === 0">
        <div class="wizard-module__field">
          <label>姓名</label>
          <KbInput v-model="form.name" placeholder="请输入姓名" clearable />
        </div>
        <div class="wizard-module__field">
          <label>年龄</label>
          <KbInputNumber v-model="form.age" :min="1" :max="120" />
        </div>
      </template>
      <template v-else-if="active === 1">
        <div class="wizard-module__field">
          <label>邮箱</label>
          <KbInput v-model="form.email" placeholder="you@example.com" clearable />
        </div>
      </template>
      <template v-else>
        <div class="wizard-module__done">
          <div>🎉 已提交，请确认你的信息</div>
          <div class="wizard-module__summary">
            <KbTag type="primary">{{ form.name }}</KbTag>
            <KbTag type="success">{{ form.age }} 岁</KbTag>
            <KbTag type="info">{{ form.email }}</KbTag>
          </div>
        </div>
      </template>
    </div>
    <div class="wizard-module__actions">
      <KbButton v-if="active > 0" @click="active--">上一步</KbButton>
      <KbButton v-if="active < 2" type="primary" @click="next">下一步</KbButton>
      <KbButton v-else type="primary" @click="message.success('完成（演示）')">完成</KbButton>
    </div>
  </div>
</template>

<style scoped>
.wizard-module {
  max-width: 480px;
  padding: var(--kb-space-5);
  border: 1px solid var(--kb-color-border);
  border-radius: var(--kb-radius-lg);
  background: var(--kb-color-bg);
}

.wizard-module__body {
  margin: var(--kb-space-5) 0;
  min-height: 120px;
}

.wizard-module__field {
  display: flex;
  flex-direction: column;
  gap: var(--kb-space-1);
  margin-bottom: var(--kb-space-3);
}

.wizard-module__field label {
  color: var(--kb-color-text-2);
  font-size: var(--kb-font-size-sm);
}

.wizard-module__done {
  text-align: center;
  color: var(--kb-color-text-1);
  font-size: var(--kb-font-size-md);
}

.wizard-module__summary {
  display: flex;
  justify-content: center;
  gap: var(--kb-space-1);
  margin-top: var(--kb-space-3);
}

.wizard-module__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--kb-space-2);
}
</style>
