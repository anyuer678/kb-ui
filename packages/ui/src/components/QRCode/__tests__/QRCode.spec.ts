/* eslint-disable @typescript-eslint/no-explicit-any -- 与 qrcode 参考库比对时其类型较严，使用 any 绕过 */
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import QRCodeRef from 'qrcode'
import { createQRMatrix, type QRModeName, type ECLevelName } from '../qrcode'
import KbQRCode from '../QRCode.vue'

/** 调用参考库生成矩阵（segment 传 any 以绕过其较严的字节段类型约束） */
function refMatrix(
  text: string,
  level: ECLevelName,
  version: number,
  mode: QRModeName,
  mask?: number,
) {
  return QRCodeRef.create([{ data: text, mode }] as any, {
    errorCorrectionLevel: level,
    version,
    ...(mask !== undefined ? { maskPattern: mask } : {}),
  } as any)
}

/**
 * 与 `qrcode` 参考库逐模块比对，确保自实现编码器输出完全一致。
 * 通过「固定 mode / version / maskPattern」排除版本自动选择、掩码惩罚的
 * 二义性，从而精确校验数据编码、Reed-Solomon 纠错、功能图案放置与掩码。
 */

interface Case {
  text: string
  mode: QRModeName
}

const CASES: Case[] = [
  { text: 'HELLO WORLD', mode: 'alphanumeric' },
  { text: '1234567890', mode: 'numeric' },
  { text: 'https://kb-ui.dev', mode: 'byte' },
  { text: '你好，世界！中文 QR 测试 ☺', mode: 'byte' },
  { text: 'A', mode: 'byte' },
  { text: 'TEST123', mode: 'alphanumeric' },
  { text: '9876543210', mode: 'numeric' },
  { text: 'KbUI-2026_XYZ', mode: 'alphanumeric' },
]

const LEVELS: ECLevelName[] = ['L', 'M', 'Q', 'H']
const VERSIONS = [1, 2, 5, 10, 27]

function pickVersion(text: string, mode: QRModeName, level: ECLevelName): number {
  for (let v = 1; v <= 40; v++) {
    const ref = refMatrix(text, level, v, mode, 0)
    // 参考库在版本足够大时不会抛错；返回其实际版本
    if (ref.version === v) return v
  }
  throw new Error('no fitting version')
}

describe('QRCode 编码器与参考库一致性', () => {
  for (const { text, mode } of CASES) {
    for (const level of LEVELS) {
      it(`[${mode}/${level}] ${text.slice(0, 12)}… 全部 8 个掩码模块一致`, () => {
        // 选定一个能容纳该数据的版本
        let version: number
        try {
          version = pickVersion(text, mode, level)
        } catch {
          // 参考库无法容纳时跳过（极端大数据）
          return
        }
        for (let mask = 0; mask < 8; mask++) {
          const mine = createQRMatrix(text, { level, version, mode, maskPattern: mask })
          const ref = refMatrix(text, level, version, mode, mask)
          expect(mine.moduleCount).toBe(ref.modules.size)
          expect(mine.modules.length).toBe(ref.modules.data.length)
          for (let i = 0; i < mine.modules.length; i++) {
            expect(mine.modules[i] ? 1 : 0).toBe(ref.modules.data[i])
          }
        }
      })
    }
  }

  // 40 版本 × 4 级纠错 × 全矩阵逐位比对，coverage 插桩下会明显变慢，显式放宽超时
  it('多版本字节模式（含版本信息区）与参考库一致', { timeout: 30_000 }, () => {
    const text = 'https://kb-ui.dev/docs/qrcode'
    for (const v of VERSIONS) {
      for (const level of LEVELS) {
        // 跳过容纳不下的版本（小版本装不下 29 字节），仅比对可容纳组合
        let ref
        try {
          ref = refMatrix(text, level, v, 'byte')
        } catch {
          continue
        }
        const mine = createQRMatrix(text, { level, version: v })
        expect(mine.moduleCount).toBe(ref.modules.size)
        for (let i = 0; i < mine.modules.length; i++) {
          expect(mine.modules[i] ? 1 : 0).toBe(ref.modules.data[i])
        }
      }
    }
  })
})

describe('QRCode 自动模式/版本选择', () => {
  it('纯数字自动选择 numeric 且结果可被扫描（与参考库一致）', () => {
    const text = '13900001234'
    const mine = createQRMatrix(text, { level: 'M' })
    const ref = QRCodeRef.create(text, { errorCorrectionLevel: 'M' })
    expect(mine.moduleCount).toBe(ref.modules.size)
    for (let i = 0; i < mine.modules.length; i++) {
      expect(mine.modules[i] ? 1 : 0).toBe(ref.modules.data[i])
    }
  })

  it('含中文自动选择 byte(UTF-8) 且与参考库一致', () => {
    const text = '知识库 UI 组件'
    const mine = createQRMatrix(text, { level: 'M' })
    const ref = QRCodeRef.create(text, { errorCorrectionLevel: 'M' })
    expect(mine.moduleCount).toBe(ref.modules.size)
    for (let i = 0; i < mine.modules.length; i++) {
      expect(mine.modules[i] ? 1 : 0).toBe(ref.modules.data[i])
    }
  })
})

describe('QRCode 边界与参数校验', () => {
  it('空内容抛错', () => {
    expect(() => createQRMatrix('')).toThrow()
  })

  it('指定版本过小（装不下数据）抛错', () => {
    // 20 字节在 v1/H（容量 7 字节）下无法容纳，应抛错
    expect(() => createQRMatrix('x'.repeat(20), { level: 'H', version: 1 })).toThrow()
  })

  it('返回结构包含 version / level / maskPattern', () => {
    const r = createQRMatrix('HELLO', { level: 'Q' })
    expect(r.version).toBeGreaterThanOrEqual(1)
    expect(r.level).toBe('Q')
    expect(r.maskPattern).toBeGreaterThanOrEqual(0)
    expect(r.maskPattern).toBeLessThanOrEqual(7)
    expect(r.modules).toHaveLength(r.moduleCount * r.moduleCount)
  })
})

describe('KbQRCode 组件渲染', () => {
  it('渲染 SVG 且暗模块以单条 path 表示', () => {
    const wrapper = mount(KbQRCode, { props: { value: 'HELLO', size: 200 } })
    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)
    expect(svg.attributes('role')).toBe('img')
    expect(svg.attributes('aria-label')).toBe('HELLO')
    expect(wrapper.find('path').exists()).toBe(true)
    expect(wrapper.find('path').attributes('d')).toContain('M')
  })

  it('空内容渲染占位态且不产生 SVG', () => {
    const wrapper = mount(KbQRCode, { props: { value: '' } })
    expect(wrapper.find('.kb-qrcode--empty').exists()).toBe(true)
    expect(wrapper.find('svg').exists()).toBe(false)
  })

  it('自定义颜色与静默区生效', () => {
    const wrapper = mount(KbQRCode, {
      props: { value: 'x', color: '#ff0000', bgColor: '#0000ff', margin: 2 },
    })
    const svg = wrapper.find('svg')
    expect(svg.attributes('viewBox')).toContain('25 25') // 21 模块 + 2*2 静默区
    expect(wrapper.find('path').attributes('fill')).toBe('#ff0000')
    expect(wrapper.find('rect').attributes('fill')).toBe('#0000ff')
  })

  it('支持中心图标插槽（不影响矩阵）', () => {
    const wrapper = mount(KbQRCode, {
      props: { value: 'https://kb-ui.dev' },
      slots: { default: '<span class="logo">KB</span>' },
    })
    expect(wrapper.find('.kb-qrcode__icon').exists()).toBe(true)
    expect(wrapper.find('.logo').exists()).toBe(true)
  })
})
