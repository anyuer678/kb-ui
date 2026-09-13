import { describe, it, expect } from 'vitest'
import { readdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { KbResolver } from '../resolver'
import { styleEntryMap } from '../resolver-map'

const componentsDir = resolve(dirname(fileURLToPath(import.meta.url)), '../components')

describe('KbResolver', () => {
  const resolver = KbResolver()

  it('解析 Kb 前缀组件并附带样式', () => {
    expect(resolver.resolve('KbButton')).toEqual({
      name: 'KbButton',
      from: 'kb-ui-vue',
      sideEffects: ['kb-ui-vue/styles/Button.css'],
    })
  })

  it('Row / Col 指向 Grid 样式', () => {
    expect(resolver.resolve('KbRow')?.sideEffects).toEqual(['kb-ui-vue/styles/Grid.css'])
    expect(resolver.resolve('KbCol')?.sideEffects).toEqual(['kb-ui-vue/styles/Grid.css'])
  })

  it('FormItem 指向 Form 样式', () => {
    expect(resolver.resolve('KbFormItem')?.sideEffects).toEqual(['kb-ui-vue/styles/Form.css'])
  })

  it('无样式组件（ConfigProvider）不引入 CSS', () => {
    const result = resolver.resolve('KbConfigProvider')
    expect(result).toEqual({ name: 'KbConfigProvider', from: 'kb-ui-vue' })
    expect(result?.sideEffects).toBeUndefined()
  })

  it('importStyle=false 时不带样式', () => {
    const noStyle = KbResolver({ importStyle: false })
    expect(noStyle.resolve('KbButton')?.sideEffects).toBeUndefined()
  })

  it('非前缀 / 未知组件返回 undefined', () => {
    expect(resolver.resolve('ElButton')).toBeUndefined()
    expect(resolver.resolve('KbNotExists')).toBeUndefined()
    // 前缀本身不算组件名
    expect(resolver.resolve('Kb')).toBeUndefined()
  })

  it('支持自定义前缀（含多前缀），并统一映射回 Kb 前缀的真实导出名', () => {
    const multi = KbResolver({ prefix: ['Kb', 'KB'] })
    // 模板里写 <KBInput />，导入的仍是包内真实存在的 KbInput
    expect(multi.resolve('KBInput')?.name).toBe('KbInput')
    expect(multi.resolve('KBInput')?.sideEffects).toEqual(['kb-ui-vue/styles/Input.css'])
    expect(multi.resolve('KbInput')?.name).toBe('KbInput')
  })

  it('resolver 类型标记为 component', () => {
    expect(resolver.type).toBe('component')
  })
})

describe('styleEntryMap 与实际组件目录保持一致', () => {
  it('映射表里的每个样式入口都真实存在', () => {
    const missing = Object.entries(styleEntryMap)
      .filter(([, entry]) => entry && !existsSync(resolve(componentsDir, entry, 'style.css')))
      .map(([name, entry]) => `${name} -> ${entry}`)
    expect(missing).toEqual([])
  })

  it('每个带样式文件的组件都已登记，避免按需引入时丢样式', () => {
    const registered = new Set(Object.values(styleEntryMap))
    const unregistered = readdirSync(componentsDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .filter((name) => existsSync(resolve(componentsDir, name, 'style.css')))
      .filter((name) => !registered.has(name))
    expect(unregistered).toEqual([])
  })
})
