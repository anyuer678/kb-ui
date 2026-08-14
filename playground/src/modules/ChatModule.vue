<script setup lang="ts">
import { ref } from 'vue'
import { KbAvatar, KbInput, KbButton, KbEmpty, message } from '@kb/ui'

interface Msg {
  from: 'me' | 'other'
  text: string
}

const messages = ref<Msg[]>([
  { from: 'other', text: '你好！欢迎使用 KB UI 聊天模块示例 👋' },
  { from: 'me', text: '你好，这个界面真不错！' },
  { from: 'other', text: '是的，用组件库拼装就是这么简单～' },
])
const input = ref('')

function send() {
  const text = input.value.trim()
  if (!text) return
  messages.value.push({ from: 'me', text })
  input.value = ''
  setTimeout(() => {
    messages.value.push({ from: 'other', text: '收到（演示自动回复）' })
  }, 500)
}
</script>

<template>
  <div class="chat-module">
    <div class="chat-module__header">
      <KbAvatar fallback="助" :size="36" round />
      <div>
        <div class="chat-module__name">KB 助手</div>
        <div class="chat-module__status">● 在线</div>
      </div>
    </div>

    <div class="chat-module__body">
      <div v-for="(msg, i) in messages" :key="i" class="chat-module__row" :class="`chat-module__row--${msg.from}`">
        <KbAvatar v-if="msg.from === 'other'" fallback="助" :size="32" round />
        <div class="chat-module__bubble">{{ msg.text }}</div>
        <KbAvatar v-if="msg.from === 'me'" fallback="我" :size="32" round />
      </div>
      <KbEmpty v-if="messages.length === 0" description="开始聊天吧" />
    </div>

    <div class="chat-module__input">
      <KbInput
        v-model="input"
        placeholder="输入消息…"
        @keyup.enter="send"
        style="flex: 1"
      />
      <KbButton type="primary" @click="send">发送</KbButton>
    </div>
  </div>
</template>

<style scoped>
.chat-module {
  display: flex;
  flex-direction: column;
  height: 420px;
  border: 1px solid var(--kb-color-border);
  border-radius: var(--kb-radius-lg);
  background: var(--kb-color-bg);
  overflow: hidden;
}

.chat-module__header {
  display: flex;
  align-items: center;
  gap: var(--kb-space-2);
  padding: var(--kb-space-3) var(--kb-space-4);
  border-bottom: 1px solid var(--kb-color-border);
}

.chat-module__name {
  color: var(--kb-color-text-1);
  font-size: var(--kb-font-size-md);
  font-weight: 600;
}

.chat-module__status {
  color: var(--kb-color-success);
  font-size: var(--kb-font-size-xs);
}

.chat-module__body {
  flex: 1;
  overflow-y: auto;
  padding: var(--kb-space-4);
  display: flex;
  flex-direction: column;
  gap: var(--kb-space-3);
  background: var(--kb-color-bg-elevated);
}

.chat-module__row {
  display: flex;
  align-items: flex-end;
  gap: var(--kb-space-2);
}

.chat-module__row--me {
  justify-content: flex-end;
}

.chat-module__bubble {
  max-width: 70%;
  padding: var(--kb-space-2) var(--kb-space-3);
  border-radius: var(--kb-radius-lg);
  background: var(--kb-color-bg);
  color: var(--kb-color-text-1);
  font-size: var(--kb-font-size-md);
  line-height: 1.5;
}

.chat-module__row--me .chat-module__bubble {
  background: var(--kb-color-primary);
  color: var(--kb-color-bg);
}

.chat-module__input {
  display: flex;
  gap: var(--kb-space-2);
  padding: var(--kb-space-3);
  border-top: 1px solid var(--kb-color-border);
}
</style>
