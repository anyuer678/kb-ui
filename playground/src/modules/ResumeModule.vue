<script setup lang="ts">
import { KbCard, KbTag, KbProgress, KbDivider } from '@kb/ui'

const skills = [
  { name: 'Vue 3', level: 90 },
  { name: 'TypeScript', level: 85 },
  { name: 'Node.js', level: 75 },
  { name: 'UI 设计', level: 80 },
]
</script>

<template>
  <div class="resume-module">
    <div class="resume-module__side">
      <KbCard shadow="hover">
        <div class="resume-module__avatar">KB</div>
        <h2 class="resume-module__name">张三</h2>
        <p class="resume-module__role">前端工程师</p>
        <KbDivider />
        <p class="resume-module__info">📧 zhang@example.com</p>
        <p class="resume-module__info">📍 杭州</p>
        <p class="resume-module__info">🎂 5 年经验</p>
      </KbCard>
    </div>
    <div class="resume-module__main">
      <KbCard title="个人简介">
        <p>专注于组件库与前端工程化，主导过企业级设计系统建设。</p>
      </KbCard>
      <KbCard title="技能">
        <div class="resume-module__skills">
          <div v-for="s in skills" :key="s.name">
            <div class="resume-module__skill-row"><span>{{ s.name }}</span><b>{{ s.level }}%</b></div>
            <KbProgress :percentage="s.level" :stroke-width="8" />
          </div>
        </div>
      </KbCard>
      <KbCard title="工作经历">
        <div class="resume-module__job">
          <div class="resume-module__job-head"><b>某大厂</b><KbTag size="small" type="info">2021 - 至今</KbTag></div>
          <p>负责组件库维护与业务支撑。</p>
        </div>
      </KbCard>
    </div>
  </div>
</template>

<style scoped>
.resume-module {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: var(--kb-space-3);
}

.resume-module__avatar {
  display: grid;
  place-items: center;
  width: 72px;
  height: 72px;
  margin: 0 auto;
  border-radius: var(--kb-radius-round);
  background: var(--kb-color-primary-gradient);
  color: #fff;
  font-size: 24px;
  font-weight: 700;
}

.resume-module__name {
  margin: var(--kb-space-3) 0 0;
  text-align: center;
  color: var(--kb-color-text-1);
}

.resume-module__role {
  margin: 0 0 var(--kb-space-2);
  text-align: center;
  color: var(--kb-color-primary);
  font-size: var(--kb-font-size-sm);
}

.resume-module__info {
  margin: 0 0 var(--kb-space-2);
  color: var(--kb-color-text-2);
  font-size: var(--kb-font-size-sm);
}

.resume-module__skills {
  display: flex;
  flex-direction: column;
  gap: var(--kb-space-3);
}

.resume-module__skill-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  color: var(--kb-color-text-2);
  font-size: var(--kb-font-size-sm);
}

.resume-module__job-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
