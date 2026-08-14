import { useState } from 'react'
import './App.css'

export default function App() {
  const [count, setCount] = useState(0)
  const appName = '{{projectName}}'
  return (
    <main className="page">
      <h1>{appName}</h1>
      <p className="sub">React 19 + Vite + TypeScript 模板</p>
      <button className="btn" onClick={() => setCount((c) => c + 1)}>
        点击计数：{count}
      </button>
    </main>
  )
}
