<script setup lang="ts">
import {
  KbCard,
  KbAvatar,
  KbTag,
  KbProgress,
  KbStatistic,
  KbButton,
  KbDivider,
  message,
} from '@kb/ui'

const skills = [
  { label: 'Vue.js', value: 90 },
  { label: 'TypeScript', value: 85 },
  { label: 'Node.js', value: 75 },
  { label: 'UI 设计', value: 70 },
]
</script>

<template>
  <div class="profile-module">
    <div class="profile-module__head">
      <KbAvatar fallback="KB" :size="72" round />
      <div class="profile-module__info">
        <h3 class="profile-module__name">知识库作者</h3>
        <p class="profile-module__bio">前端工程师 · 组件库维护者 · 开源爱好者</p>
        <div class="profile-module__tags">
          <KbTag type="primary">Vue</KbTag>
          <KbTag type="success">TypeScript</KbTag>
          <KbTag type="info">开源</KbTag>
        </div>
      </div>
      <div class="profile-module__actions">
        <KbButton type="primary" size="small" @click="message.success('已关注（演示）')">关注</KbButton>
        <KbButton size="small">发消息</KbButton>
      </div>
    </div>

    <KbDivider />

    <div class="profile-module__stats">
      <KbStatistic title="文章" :value="128" />
      <KbStatistic title="粉丝" :value="2345" />
      <KbStatistic title="获赞" :value="10240" />
      <KbStatistic title="开源项目" :value="10" />
    </div>

    <KbDivider />

    <KbCard title="技能标签">
      <div class="profile-module__skills">
        <div v-for="skill in skills" :key="skill.label" class="profile-module__skill">
          <span class="profile-module__skill-label">{{ skill.label }}</span>
          <KbProgress :percentage="skill.value" :stroke-width="10" />
        </div>
      </div>
    </KbCard>
  </div>
</template>

<style scoped>
.profile-module {
  padding: var(--kb-space-5);
  border: 1px solid var(--kb-color-border);
  border-radius: var(--kb-radius-lg);
  background: var(--kb-color-bg);
}

.profile-module__head {
  display: flex;
  align-items: center;
  gap: var(--kb-space-4);
  flex-wrap: wrap;
}

.profile-module__info {
  flex: 1;
  min-width: 200px;
}

.profile-module__name {
  margin: 0;
  color: var(--kb-color-text-1);
  font-size: var(--kb-font-size-xl);
}

.profile-module__bio {
  margin: var(--kb-space-1) 0 var(--kb-space-2);
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-sm);
}

.profile-module__tags {
  display: flex;
  gap: var(--kb-space-1);
}

.profile-module__actions {
  display: flex;
  gap: var(--kb-space-2);
}

.profile-module__stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--kb-space-3);
  text-align: center;
}

.profile-module__skills {
  display: flex;
  flex-direction: column;
  gap: var(--kb-space-3);
}

.profile-module__skill-label {
  display: block;
  margin-bottom: var(--kb-space-1);
  color: var(--kb-color-text-2);
  font-size: var(--kb-font-size-sm);
}
</style>
