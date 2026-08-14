<script setup lang="ts">
import { ref } from 'vue'
import { KbCard, KbTag, KbButton, KbBadge, KbEmpty, message } from '@kb/ui'

const active = ref('all')
const cats = [
  { key: 'all', label: '全部' },
  { key: 'cat', label: '猫咪' },
  { key: 'dog', label: '狗狗' },
]
const pets = ref([
  { name: '布偶猫', price: 3280, cat: 'cat', tag: '热门', emoji: '🐱' },
  { name: '金渐层', price: 2680, cat: 'cat', tag: '', emoji: '🐱' },
  { name: '柯基犬', price: 1980, cat: 'dog', tag: '推荐', emoji: '🐶' },
  { name: '柴犬', price: 2380, cat: 'dog', tag: '', emoji: '🐶' },
])
const shown = ref(pets)

function switchCat(key: string) {
  active.value = key
  shown.value = key === 'all' ? pets.value : pets.value.filter((p) => p.cat === key)
}
</script>

<template>
  <div class="petshop-module">
    <div class="petshop-module__cats">
      <KbTag v-for="c in cats" :key="c.key" :type="active === c.key ? 'primary' : 'default'" class="petshop-module__cat" @click="switchCat(c.key)">{{ c.label }}</KbTag>
    </div>
    <div v-if="shown.length" class="petshop-module__grid">
      <KbCard v-for="p in shown" :key="p.name" shadow="hover">
        <div class="petshop-module__emoji">{{ p.emoji }}</div>
        <h3 class="petshop-module__name">{{ p.name }}</h3>
        <div class="petshop-module__row">
          <span class="petshop-module__price">¥{{ p.price.toLocaleString() }}</span>
          <KbBadge v-if="p.tag" :content="p.tag" color="#f59e0b">
            <KbButton size="small" @click="message.success(`已加入购物车：${p.name}（演示）`)">购买</KbButton>
          </KbBadge>
          <KbButton v-else size="small" @click="message.success(`已加入购物车：${p.name}（演示）`)">购买</KbButton>
        </div>
      </KbCard>
    </div>
    <KbEmpty v-else description="该分类暂无宠物" />
  </div>
</template>

<style scoped>
.petshop-module__cats {
  display: flex;
  gap: var(--kb-space-2);
  margin-bottom: var(--kb-space-3);
}

.petshop-module__cat {
  cursor: pointer;
}

.petshop-module__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--kb-space-3);
}

.petshop-module__emoji {
  display: grid;
  place-items: center;
  height: 90px;
  border-radius: var(--kb-radius-md);
  background: var(--kb-color-bg-elevated);
  font-size: 44px;
}

.petshop-module__name {
  margin: var(--kb-space-2) 0;
  color: var(--kb-color-text-1);
  font-size: var(--kb-font-size-md);
}

.petshop-module__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.petshop-module__price {
  color: var(--kb-color-danger);
  font-weight: 600;
}
</style>
