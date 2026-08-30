<script setup lang="ts">
import { ref } from 'vue'
import {
  KbCard,
  KbSegmented,
  KbSwitch,
  KbSlider,
  KbSelect,
  KbRadio,
  KbButton,
  message,
} from 'kb-ui-vue'

const theme = ref('auto')
const language = ref('zh')
const notifications = ref(true)
const sound = ref(true)
const compact = ref(false)
const volume = ref(60)
const autoSave = ref(true)

const themeOptions = [
  { label: '跟随系统', value: 'auto' },
  { label: '浅色', value: 'light' },
  { label: '深色', value: 'dark' },
]
const langOptions = [
  { label: '简体中文', value: 'zh' },
  { label: 'English', value: 'en' },
  { label: '日本語', value: 'ja' },
]

function save() {
  message.success('设置已保存（演示）')
}
</script>

<template>
  <div class="settings-module">
    <KbCard title="外观">
      <div class="settings-module__row">
        <span class="settings-module__label">主题模式</span>
        <KbSegmented v-model="theme" :options="themeOptions" />
      </div>
      <div class="settings-module__row">
        <span class="settings-module__label">界面语言</span>
        <KbSelect v-model="language" :options="langOptions" style="width: 160px" />
      </div>
      <div class="settings-module__row">
        <span class="settings-module__label">紧凑模式</span>
        <KbSwitch v-model="compact" />
      </div>
    </KbCard>

    <KbCard title="通知">
      <div class="settings-module__row">
        <span class="settings-module__label">消息通知</span>
        <KbSwitch v-model="notifications" />
      </div>
      <div class="settings-module__row">
        <span class="settings-module__label">提示音效</span>
        <KbSwitch v-model="sound" />
      </div>
      <div class="settings-module__row">
        <span class="settings-module__label">自动保存</span>
        <KbSwitch v-model="autoSave" />
      </div>
    </KbCard>

    <KbCard title="音量">
      <div class="settings-module__row">
        <span class="settings-module__label">播放音量</span>
        <div class="settings-module__slider"><KbSlider v-model="volume" /></div>
        <span class="settings-module__value">{{ volume }}</span>
      </div>
      <div class="settings-module__row">
        <span class="settings-module__label">声音方案</span>
        <KbSpace>
          <KbRadio v-model="theme" value="light">标准</KbRadio>
          <KbRadio v-model="theme" value="dark">柔和</KbRadio>
        </KbSpace>
      </div>
    </KbCard>

    <div class="settings-module__footer">
      <KbButton type="primary" @click="save">保存设置</KbButton>
      <KbButton>恢复默认</KbButton>
    </div>
  </div>
</template>

<style scoped>
.settings-module {
  display: flex;
  flex-direction: column;
  gap: var(--kb-space-3);
  max-width: 560px;
}

.settings-module__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--kb-space-3);
  padding: var(--kb-space-2) 0;
}

.settings-module__label {
  color: var(--kb-color-text-2);
  font-size: var(--kb-font-size-md);
}

.settings-module__slider {
  width: 180px;
}

.settings-module__value {
  min-width: 24px;
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-sm);
}

.settings-module__footer {
  display: flex;
  gap: var(--kb-space-2);
}
</style>
