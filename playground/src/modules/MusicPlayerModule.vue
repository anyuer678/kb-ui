<script setup lang="ts">
import { ref } from 'vue'
import { KbSlider, KbButton, KbTag } from 'kb-ui-vue'

const playing = ref(false)
const progress = ref(35)
const track = { title: '深夜代码', artist: 'KB Studio', album: '组件库主题曲' }
</script>

<template>
  <div class="player-module">
    <div class="player-module__cover">
      <div class="player-module__disc" :class="{ 'player-module__disc--spin': playing }">🎵</div>
    </div>
    <div class="player-module__info">
      <h3 class="player-module__title">{{ track.title }}</h3>
      <p class="player-module__artist">{{ track.artist }} · {{ track.album }}</p>
      <KbTag type="primary" size="small">正在播放</KbTag>
    </div>
    <div class="player-module__progress">
      <KbSlider v-model="progress" />
      <div class="player-module__times">
        <span>1:24</span><span>3:58</span>
      </div>
    </div>
    <div class="player-module__controls">
      <KbButton>⏮</KbButton>
      <KbButton type="primary" round @click="playing = !playing">{{ playing ? '⏸' : '▶' }}</KbButton>
      <KbButton>⏭</KbButton>
    </div>
  </div>
</template>

<style scoped>
.player-module {
  max-width: 360px;
  padding: var(--kb-space-5);
  border: 1px solid var(--kb-color-border);
  border-radius: var(--kb-radius-lg);
  background: var(--kb-color-bg);
  text-align: center;
}

.player-module__cover {
  display: flex;
  justify-content: center;
  margin-bottom: var(--kb-space-3);
}

.player-module__disc {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--kb-color-bg-elevated) 30%, var(--kb-color-primary) 31%);
  color: var(--kb-color-bg);
  font-size: 40px;
}

.player-module__disc--spin {
  animation: disc-spin 4s linear infinite;
}

@keyframes disc-spin {
  to {
    transform: rotate(360deg);
  }
}

.player-module__title {
  margin: 0;
  color: var(--kb-color-text-1);
  font-size: var(--kb-font-size-lg);
}

.player-module__artist {
  margin: var(--kb-space-1) 0 var(--kb-space-2);
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-sm);
}

.player-module__progress {
  margin: var(--kb-space-4) 0;
}

.player-module__times {
  display: flex;
  justify-content: space-between;
  margin-top: var(--kb-space-1);
  color: var(--kb-color-text-3);
  font-size: var(--kb-font-size-xs);
}

.player-module__controls {
  display: flex;
  justify-content: center;
  gap: var(--kb-space-2);
}
</style>
