<script setup lang="ts">
import { onMounted, ref } from 'vue'

const items = ref<{ id: number; name: string; done: boolean }[]>([])
const name = ref('')
const error = ref('')

const API = import.meta.env.VITE_API ?? 'http://localhost:3000'

async function load() {
  try {
    const res = await fetch(`${API}/items`)
    items.value = await res.json()
    error.value = ''
  } catch {
    error.value = '无法连接 API（请先启动后端）'
  }
}

async function add() {
  if (!name.value) return
  await fetch(`${API}/items`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name: name.value }),
  })
  name.value = ''
  await load()
}

onMounted(load)
</script>

<template>
  <main class="page">
    <h1>Fullstack 模板</h1>
    <p class="sub">前端 Vue + 后端 Express，通过 HTTP 通信</p>
    <p v-if="error" class="error">{{ error }}</p>
    <form class="row" @submit.prevent="add">
      <input v-model="name" placeholder="新任务名称" />
      <button type="submit">添加</button>
    </form>
    <ul class="list">
      <li v-for="item in items" :key="item.id">
        <span :class="{ done: item.done }">{{ item.name }}</span>
        <small>#{{ item.id }}</small>
      </li>
    </ul>
  </main>
</template>

<style>
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  font-family: system-ui, sans-serif;
  background: #f6f7f9;
}
.page {
  max-width: 560px;
  margin: 48px auto;
  padding: 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgb(0 0 0 / 8%);
}
.sub {
  color: #888;
}
.error {
  color: #d33;
  font-size: 14px;
}
.row {
  display: flex;
  gap: 8px;
}
.row input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.row button {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: #3b82f6;
  color: #fff;
  cursor: pointer;
}
.list {
  padding: 0;
  list-style: none;
}
.list li {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}
.done {
  text-decoration: line-through;
  color: #999;
}
</style>
