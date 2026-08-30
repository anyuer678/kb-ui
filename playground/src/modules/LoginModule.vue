<script setup lang="ts">
import { ref } from 'vue'
import { KbButton, KbInput, KbCheckbox, message } from 'kb-ui-vue'

const email = ref('')
const password = ref('')
const remember = ref(true)

function handleLogin() {
  if (!email.value || !password.value) {
    message.warning('请输入邮箱和密码')
    return
  }
  message.success(`欢迎回来，${email.value}（演示）`)
}
</script>

<template>
  <div class="login-module">
    <div class="login-module__card">
      <div class="login-module__brand">
        <div class="login-module__logo">KB</div>
        <h2 class="login-module__title">欢迎回来</h2>
        <p class="login-module__subtitle">登录到你的账户继续</p>
      </div>

      <form class="login-module__form" @submit.prevent="handleLogin">
        <label class="login-module__label" for="login-email">邮箱</label>
        <KbInput
          id="login-email"
          v-model="email"
          placeholder="you@example.com"
          clearable
          size="large"
        />
        <label class="login-module__label" for="login-password">密码</label>
        <KbInput
          id="login-password"
          v-model="password"
          type="password"
          placeholder="输入密码"
          size="large"
        />

        <div class="login-module__options">
          <KbCheckbox v-model="remember">记住我</KbCheckbox>
          <a class="login-module__link" href="javascript:void(0)">忘记密码？</a>
        </div>

        <KbButton type="primary" size="large" style="width: 100%" @click="handleLogin">
          登 录
        </KbButton>
      </form>

      <div class="login-module__divider"><span>或</span></div>

      <div class="login-module__social">
        <KbButton plain style="flex: 1">GitHub</KbButton>
        <KbButton plain style="flex: 1">微信</KbButton>
      </div>

      <p class="login-module__register">
        还没有账户？<a class="login-module__link" href="javascript:void(0)">立即注册</a>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-module {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--kb-space-6);
  border-radius: var(--kb-radius-lg);
  background:
    radial-gradient(
      at 20% 20%,
      color-mix(in srgb, var(--kb-color-primary) 10%, transparent),
      transparent 50%
    ),
    radial-gradient(
      at 80% 80%,
      color-mix(in srgb, var(--kb-color-success) 8%, transparent),
      transparent 50%
    ),
    var(--kb-color-bg-elevated);
}

.login-module__card {
  width: 380px;
  box-sizing: border-box;
  padding: var(--kb-space-6);
  border: 1px solid var(--kb-color-border);
  border-radius: var(--kb-radius-lg);
  background: var(--kb-color-bg);
  box-shadow: var(--kb-shadow-2);
}

.login-module__brand {
  margin-bottom: var(--kb-space-5);
  text-align: center;
}

.login-module__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--kb-radius-lg);
  background: var(--kb-color-primary);
  color: var(--kb-color-bg);
  font-size: var(--kb-font-size-xl);
  font-weight: 700;
}

.login-module__title {
  margin: var(--kb-space-3) 0 var(--kb-space-1);
  color: var(--kb-color-text-1);
  font-size: var(--kb-font-size-xl);
}

.login-module__subtitle {
  margin: 0;
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-sm);
}

.login-module__form {
  display: flex;
  flex-direction: column;
  gap: var(--kb-space-2);
}

.login-module__label {
  margin-top: var(--kb-space-2);
  color: var(--kb-color-text-2);
  font-size: var(--kb-font-size-sm);
}

.login-module__options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: var(--kb-space-1) 0 var(--kb-space-3);
}

.login-module__link {
  color: var(--kb-color-primary);
  text-decoration: none;
  font-size: var(--kb-font-size-sm);
}

.login-module__link:hover {
  text-decoration: underline;
}

.login-module__divider {
  display: flex;
  align-items: center;
  gap: var(--kb-space-2);
  margin: var(--kb-space-4) 0;
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-sm);
}

.login-module__divider::before,
.login-module__divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--kb-color-border);
}

.login-module__social {
  display: flex;
  gap: var(--kb-space-2);
}

.login-module__register {
  margin: var(--kb-space-4) 0 0;
  text-align: center;
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-sm);
}
</style>
