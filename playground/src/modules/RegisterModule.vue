<script setup lang="ts">
import { ref } from 'vue'
import {
  KbButton,
  KbInput,
  KbInputNumber,
  KbCheckbox,
  KbDivider,
  message,
} from '@kb/ui'

const form = ref({
  username: '',
  email: '',
  password: '',
  confirm: '',
  age: 18,
  agree: false,
})

function register() {
  if (!form.value.username || !form.value.email || !form.value.password) {
    message.warning('请填写完整信息')
    return
  }
  if (form.value.password !== form.value.confirm) {
    message.error('两次密码不一致')
    return
  }
  if (!form.value.agree) {
    message.warning('请阅读并同意用户协议')
    return
  }
  message.success(`注册成功，欢迎 ${form.value.username}（演示）`)
}
</script>

<template>
  <div class="register-module">
    <div class="register-module__card">
      <h2 class="register-module__title">创建账户</h2>
      <p class="register-module__subtitle">加入我们，开启你的知识库之旅</p>

      <div class="register-module__field">
        <label class="register-module__label">用户名</label>
        <KbInput v-model="form.username" placeholder="设置用户名" clearable size="large" />
      </div>
      <div class="register-module__field">
        <label class="register-module__label">邮箱</label>
        <KbInput v-model="form.email" placeholder="you@example.com" clearable size="large" />
      </div>
      <div class="register-module__field">
        <label class="register-module__label">密码</label>
        <KbInput v-model="form.password" type="password" placeholder="至少 8 位" size="large" />
      </div>
      <div class="register-module__field">
        <label class="register-module__label">确认密码</label>
        <KbInput v-model="form.confirm" type="password" placeholder="再次输入" size="large" />
      </div>
      <div class="register-module__field">
        <label class="register-module__label">年龄</label>
        <KbInputNumber v-model="form.age" :min="1" :max="120" />
      </div>

      <div class="register-module__agree">
        <KbCheckbox v-model="form.agree">我已阅读并同意《用户协议》和《隐私政策》</KbCheckbox>
      </div>

      <KbButton type="primary" size="large" style="width: 100%" @click="register">注 册</KbButton>

      <KbDivider>已有账号？</KbDivider>
      <p class="register-module__login">
        <a class="register-module__link" href="javascript:void(0)">直接登录</a>
      </p>
    </div>
  </div>
</template>

<style scoped>
.register-module {
  display: flex;
  justify-content: center;
  padding: var(--kb-space-4);
}

.register-module__card {
  width: 400px;
  box-sizing: border-box;
  padding: var(--kb-space-6);
  border: 1px solid var(--kb-color-border);
  border-radius: var(--kb-radius-lg);
  background: var(--kb-color-bg);
  box-shadow: var(--kb-shadow-2);
}

.register-module__title {
  margin: 0;
  text-align: center;
  color: var(--kb-color-text-1);
  font-size: var(--kb-font-size-xl);
}

.register-module__subtitle {
  margin: var(--kb-space-1) 0 var(--kb-space-5);
  text-align: center;
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-sm);
}

.register-module__field {
  display: flex;
  flex-direction: column;
  gap: var(--kb-space-1);
  margin-bottom: var(--kb-space-3);
}

.register-module__label {
  color: var(--kb-color-text-2);
  font-size: var(--kb-font-size-sm);
}

.register-module__agree {
  margin: var(--kb-space-2) 0 var(--kb-space-4);
}

.register-module__login {
  margin: 0;
  text-align: center;
}

.register-module__link {
  color: var(--kb-color-primary);
  text-decoration: none;
}
</style>
