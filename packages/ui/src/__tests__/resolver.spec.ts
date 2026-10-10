import { describe, it, expect } from 'vitest'
import { readdirSync, existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { KbResolver } from '../resolver'
import { styleEntryMap, compositeDeps } from '../resolver-map'

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

  it('复合组件别名指向宿主样式（FloatButtonGroup / Layout 子组件）', () => {
    expect(resolver.resolve('KbFloatButtonGroup')?.name).toBe('KbFloatButtonGroup')
    // FloatButton 内嵌 Icon（compositeDeps），按需引入需级联其样式
    expect(resolver.resolve('KbFloatButtonGroup')?.sideEffects).toEqual([
      'kb-ui-vue/styles/FloatButton.css',
      'kb-ui-vue/styles/Icon.css',
    ])
    for (const sub of ['KbHeader', 'KbSider', 'KbContent', 'KbFooter']) {
      expect(resolver.resolve(sub)?.name).toBe(sub)
      expect(resolver.resolve(sub)?.sideEffects).toEqual([
        'kb-ui-vue/styles/Layout.css',
        'kb-ui-vue/styles/Icon.css',
      ])
    }
  })

  it('复合组件级联内嵌子组件样式（Table/Transfer/Alert/Image 闭包）', () => {
    expect(resolver.resolve('KbTable')?.sideEffects).toEqual([
      'kb-ui-vue/styles/Table.css',
      'kb-ui-vue/styles/Checkbox.css',
      'kb-ui-vue/styles/Pagination.css',
    ])
    expect(resolver.resolve('KbTransfer')?.sideEffects).toEqual([
      'kb-ui-vue/styles/Transfer.css',
      'kb-ui-vue/styles/Checkbox.css',
    ])
    expect(resolver.resolve('KbAlert')?.sideEffects).toEqual([
      'kb-ui-vue/styles/Alert.css',
      'kb-ui-vue/styles/Icon.css',
    ])
    // Image → ImagePreview → Icon 传递闭包已平铺
    expect(resolver.resolve('KbImage')?.sideEffects).toEqual([
      'kb-ui-vue/styles/Image.css',
      'kb-ui-vue/styles/Icon.css',
      'kb-ui-vue/styles/ImagePreview.css',
    ])
    // 独立组件仍只带自身样式
    expect(resolver.resolve('KbInput')?.sideEffects).toEqual(['kb-ui-vue/styles/Input.css'])
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

  it('组件内嵌的子组件依赖全部登记在 compositeDeps（防新增漏登）', () => {
    const missing: string[] = []
    for (const dir of readdirSync(componentsDir, { withFileTypes: true })) {
      if (!dir.isDirectory()) continue
      const consumer = dir.name
      const vueFiles = readdirSync(resolve(componentsDir, consumer)).filter((f) =>
        f.endsWith('.vue'),
      )
      for (const file of vueFiles) {
        const src = readFileSync(resolve(componentsDir, consumer, file), 'utf-8')
        for (const m of src.matchAll(/from '\.\.\/([A-Z][A-Za-z]+)'/g)) {
          const subDir = m[1]
          // 子组件无样式（或映射为空）则无需级联
          const entry = styleEntryMap[subDir]
          if (!entry) continue
          const declared = compositeDeps[consumer] ?? []
          if (!declared.includes(subDir)) {
            missing.push(`${consumer} -> ${subDir}`)
          }
        }
      }
    }
    expect(missing).toEqual([])
  })

  it('compositeDeps 的每个键值都是已登记且带样式的导出名', () => {
    const bad: string[] = []
    for (const [consumer, deps] of Object.entries(compositeDeps)) {
      if (!(consumer in styleEntryMap)) bad.push(`unknown consumer: ${consumer}`)
      for (const dep of deps) {
        if (!styleEntryMap[dep]) bad.push(`${consumer} -> unstyled/unknown dep: ${dep}`)
      }
    }
    expect(bad).toEqual([])
  })
})
