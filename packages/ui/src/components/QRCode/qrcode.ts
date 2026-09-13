/**
 * 自实现的 QR Code 编码器（零运行时依赖）。
 *
 * 严格遵循 ISO/IEC 18004:2006 规范，算法结构参考 MIT 许可的
 * Kazuhiko Arase `qrcode-generator` / node `qrcode` 实现，
 * 但全部代码为本库自有实现，便于 tree-shaking 与 SSR。
 *
 * 测试（`__tests__/QRCode.spec.ts`）会以固定 mode / version / maskPattern
 * 与 `qrcode` 参考库逐模块比对，确保编码结果完全一致。
 */

export type ECLevelName = 'L' | 'M' | 'Q' | 'H'
export type QRModeName = 'numeric' | 'alphanumeric' | 'byte'

export interface QRCreateOptions {
  /** 错误校正等级，默认 M */
  level?: ECLevelName
  /** 指定版本 1-40（不指定则自动选择能容纳数据的最小版本） */
  version?: number
  /** 指定编码模式；不指定则按数据自动选择 */
  mode?: QRModeName
  /** 指定掩码 0-7；不指定则由惩罚函数自动选择最优掩码 */
  maskPattern?: number
  /** 强制使用 UTF-8 字节模式（用于含中文等非 ASCII 文本） */
  utf8?: boolean
}

export interface QRResult {
  /** 模块矩阵，行优先，true = 暗模块 */
  modules: boolean[]
  /** 模块边长（不含静默区） */
  moduleCount: number
  version: number
  level: ECLevelName
  maskPattern: number
}

/* ------------------------------------------------------------------ *
 * 1. ISO 18004 数据表
 * ------------------------------------------------------------------ */

// 每个版本、每个 EC 等级的纠错块数量（L M Q H）
const EC_BLOCKS_TABLE: number[] = [
  1, 1, 1, 1, // v1
  1, 1, 1, 1, // v2
  1, 1, 2, 2, // v3
  1, 2, 2, 4, // v4
  1, 2, 4, 4, // v5
  2, 4, 4, 4, // v6
  2, 4, 6, 5, // v7
  2, 4, 6, 6, // v8
  2, 5, 8, 8, // v9
  4, 5, 8, 8, // v10
  4, 5, 8, 11, // v11
  4, 8, 10, 11, // v12
  4, 9, 12, 16, // v13
  4, 9, 16, 16, // v14
  6, 10, 12, 18, // v15
  6, 10, 17, 16, // v16
  6, 11, 16, 19, // v17
  6, 13, 18, 21, // v18
  7, 14, 21, 25, // v19
  8, 16, 20, 25, // v20
  8, 17, 23, 25, // v21
  9, 17, 23, 34, // v22
  9, 18, 25, 30, // v23
  10, 20, 27, 32, // v24
  12, 21, 29, 35, // v25
  12, 23, 34, 37, // v26
  12, 25, 34, 40, // v27
  13, 26, 35, 42, // v28
  14, 28, 38, 45, // v29
  15, 29, 40, 48, // v30
  16, 31, 43, 51, // v31
  17, 33, 45, 54, // v32
  18, 35, 48, 57, // v33
  19, 37, 51, 60, // v34
  19, 38, 53, 63, // v35
  20, 40, 56, 66, // v36
  21, 43, 59, 70, // v37
  22, 45, 62, 74, // v38
  24, 47, 65, 77, // v39
  25, 49, 68, 81, // v40
]

// 每个版本、每个 EC 等级的纠错码字数（L M Q H）
const EC_CODEWORDS_TABLE: number[] = [
  7, 10, 13, 17,
  10, 16, 22, 28,
  15, 26, 36, 44,
  20, 36, 52, 64,
  26, 48, 72, 88,
  36, 64, 96, 112,
  40, 72, 108, 130,
  48, 88, 132, 156,
  60, 110, 160, 192,
  72, 130, 192, 224,
  80, 150, 224, 264,
  96, 176, 260, 308,
  104, 198, 288, 352,
  120, 216, 320, 384,
  132, 240, 360, 432,
  144, 280, 408, 480,
  168, 308, 448, 532,
  180, 338, 504, 588,
  196, 364, 546, 650,
  224, 416, 600, 700,
  224, 442, 644, 750,
  252, 476, 690, 816,
  270, 504, 750, 900,
  300, 560, 810, 960,
  312, 588, 870, 1050,
  336, 644, 952, 1110,
  360, 700, 1020, 1200,
  390, 728, 1050, 1260,
  420, 784, 1140, 1350,
  450, 812, 1200, 1440,
  480, 868, 1290, 1530,
  510, 924, 1350, 1620,
  540, 980, 1440, 1710,
  570, 1036, 1530, 1800,
  570, 1064, 1590, 1890,
  600, 1120, 1680, 1980,
  630, 1204, 1770, 2100,
  660, 1260, 1860, 2220,
  720, 1316, 1950, 2310,
  750, 1372, 2040, 2430,
]

// 每个版本的总码字数（数据 + 纠错）
const CODEWORDS_COUNT: number[] = [
  0,
  26, 44, 70, 100, 134, 172, 196, 242, 292, 346,
  404, 466, 532, 581, 655, 733, 815, 901, 991, 1085,
  1156, 1258, 1364, 1474, 1588, 1706, 1828, 1921, 2051, 2185,
  2323, 2465, 2611, 2761, 2876, 3034, 3196, 3362, 3532, 3706,
]

// EC 等级对应的格式位（用于格式信息 BCH）
const EC_BITS: Record<ECLevelName, number> = { L: 1, M: 0, Q: 3, H: 2 }

// 模式指示符（4 bit）
const MODE_BITS: Record<QRModeName, number> = {
  numeric: 1,
  alphanumeric: 2,
  byte: 4,
}

// 字符计数指示符位数 [v1-9, v10-26, v27-40]
const CC_BITS: Record<QRModeName, [number, number, number]> = {
  numeric: [10, 12, 14],
  alphanumeric: [9, 11, 13],
  byte: [8, 16, 16],
}

const ALPHANUMERIC_CHARS =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:'

/* ------------------------------------------------------------------ *
 * 2. Galois Field GF(256)
 * ------------------------------------------------------------------ */

const EXP_TABLE = new Uint8Array(512)
const LOG_TABLE = new Uint8Array(256)

;(function initGaloisField() {
  let x = 1
  for (let i = 0; i < 255; i++) {
    EXP_TABLE[i] = x
    LOG_TABLE[x] = i
    x <<= 1
    if (x & 0x100) x ^= 0x11d
  }
  for (let i = 255; i < 512; i++) EXP_TABLE[i] = EXP_TABLE[i - 255]
})()

function gfExp(n: number): number {
  return EXP_TABLE[n]
}
function gfMul(x: number, y: number): number {
  if (x === 0 || y === 0) return 0
  return EXP_TABLE[LOG_TABLE[x] + LOG_TABLE[y]]
}

/* ------------------------------------------------------------------ *
 * 3. 多项式运算（Reed-Solomon 生成多项式 / 取余）
 * ------------------------------------------------------------------ */

function polyMul(p1: Uint8Array, p2: Uint8Array): Uint8Array {
  const coeff = new Uint8Array(p1.length + p2.length - 1)
  for (let i = 0; i < p1.length; i++) {
    for (let j = 0; j < p2.length; j++) {
      coeff[i + j] ^= gfMul(p1[i], p2[j])
    }
  }
  return coeff
}

function polyMod(dividend: Uint8Array, divisor: Uint8Array): Uint8Array {
  let result = new Uint8Array(dividend)
  while (result.length - divisor.length >= 0) {
    const coeff = result[0]
    if (coeff !== 0) {
      for (let i = 0; i < divisor.length; i++) {
        result[i] ^= gfMul(divisor[i], coeff)
      }
    }
    let offset = 0
    while (offset < result.length && result[offset] === 0) offset++
    result = result.slice(offset)
  }
  return result
}

function generateECPolynomial(degree: number): Uint8Array {
  let poly: Uint8Array = new Uint8Array([1])
  for (let i = 0; i < degree; i++) {
    poly = polyMul(poly, new Uint8Array([1, gfExp(i)]))
  }
  return poly
}

/* ------------------------------------------------------------------ *
 * 4. 位缓冲
 * ------------------------------------------------------------------ */

class BitBuffer {
  buffer: number[] = []
  length = 0

  get(index: number): boolean {
    const byteIndex = Math.floor(index / 8)
    return ((this.buffer[byteIndex] >>> (7 - (index % 8))) & 1) === 1
  }

  put(num: number, len: number): void {
    for (let i = 0; i < len; i++) {
      this.putBit(((num >>> (len - i - 1)) & 1) === 1)
    }
  }

  putBit(bit: boolean): void {
    const byteIndex = Math.floor(this.length / 8)
    if (this.buffer.length <= byteIndex) this.buffer.push(0)
    if (bit) this.buffer[byteIndex] |= 0x80 >>> (this.length % 8)
    this.length++
  }

  getLengthInBits(): number {
    return this.length
  }
}

/* ------------------------------------------------------------------ *
 * 5. 位矩阵
 * ------------------------------------------------------------------ */

class BitMatrix {
  size: number
  data: Uint8Array
  reserved: Uint8Array

  constructor(size: number) {
    this.size = size
    this.data = new Uint8Array(size * size)
    this.reserved = new Uint8Array(size * size)
  }

  set(row: number, col: number, value: boolean, reserved = false): void {
    const index = row * this.size + col
    this.data[index] = value ? 1 : 0
    if (reserved) this.reserved[index] = 1
  }

  get(row: number, col: number): boolean {
    return this.data[row * this.size + col] === 1
  }

  xor(row: number, col: number, value: boolean): void {
    this.data[row * this.size + col] ^= value ? 1 : 0
  }

  isReserved(row: number, col: number): boolean {
    return this.reserved[row * this.size + col] === 1
  }
}

/* ------------------------------------------------------------------ *
 * 6. 工具
 * ------------------------------------------------------------------ */

function getSymbolSize(version: number): number {
  if (version < 1 || version > 40) throw new Error('version 必须在 1-40 之间')
  return version * 4 + 17
}

function getSymbolTotalCodewords(version: number): number {
  return CODEWORDS_COUNT[version]
}

function getBCHDigit(data: number): number {
  let digit = 0
  while (data !== 0) {
    digit++
    data >>>= 1
  }
  return digit
}

function getCharCountIndicator(mode: QRModeName, version: number): number {
  const bits = CC_BITS[mode]
  if (version >= 1 && version < 10) return bits[0]
  if (version < 27) return bits[1]
  return bits[2]
}

/* ------------------------------------------------------------------ *
 * 7. 数据编码
 * ------------------------------------------------------------------ */

function toUtf8Bytes(str: string): Uint8Array {
  if (typeof TextEncoder !== 'undefined') {
    return new Uint8Array(new TextEncoder().encode(str))
  }
  // 兜底：手动 UTF-8 编码
  const out: number[] = []
  for (let i = 0; i < str.length; i++) {
    const code = str.codePointAt(i)!
    if (code > 0xffff) i++
    if (code < 0x80) {
      out.push(code)
    } else if (code < 0x800) {
      out.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f))
    } else if (code < 0x10000) {
      out.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f))
    } else {
      out.push(
        0xf0 | (code >> 18),
        0x80 | ((code >> 12) & 0x3f),
        0x80 | ((code >> 6) & 0x3f),
        0x80 | (code & 0x3f),
      )
    }
  }
  return new Uint8Array(out)
}

function isNumeric(data: string): boolean {
  return /^[0-9]*$/.test(data)
}
function isAlphanumeric(data: string): boolean {
  return /^[0-9A-Z $%*+\-./:]*$/.test(data)
}

function detectMode(data: string): QRModeName {
  if (isNumeric(data)) return 'numeric'
  if (isAlphanumeric(data)) return 'alphanumeric'
  return 'byte'
}

interface Segment {
  mode: QRModeName
  /** 字符数（numeric/alphanumeric）或 UTF-8 字节数（byte） */
  length: number
  write(buffer: BitBuffer): void
}

function buildSegment(mode: QRModeName, data: string): Segment {
  if (mode === 'numeric') {
    return {
      mode,
      length: data.length,
      write(buffer: BitBuffer) {
        let i = 0
        for (; i + 3 <= data.length; i += 3) {
          const value = parseInt(data.substr(i, 3), 10)
          buffer.put(value, 10)
        }
        const rem = data.length - i
        if (rem > 0) {
          buffer.put(parseInt(data.substr(i), 10), rem * 3 + 1)
        }
      },
    }
  }
  if (mode === 'alphanumeric') {
    return {
      mode,
      length: data.length,
      write(buffer: BitBuffer) {
        let i = 0
        for (; i + 2 <= data.length; i += 2) {
          const value =
            ALPHANUMERIC_CHARS.indexOf(data[i]) * 45 +
            ALPHANUMERIC_CHARS.indexOf(data[i + 1])
          buffer.put(value, 11)
        }
        if (data.length % 2 === 1) {
          buffer.put(ALPHANUMERIC_CHARS.indexOf(data[i]), 6)
        }
      },
    }
  }
  // byte / UTF-8
  const bytes = toUtf8Bytes(data)
  return {
    mode,
    length: bytes.length,
    write(buffer: BitBuffer) {
      for (let i = 0; i < bytes.length; i++) buffer.put(bytes[i], 8)
    },
  }
}

/* ------------------------------------------------------------------ *
 * 8. 容量与版本选择
 * ------------------------------------------------------------------ */

function getCapacity(version: number, level: ECLevelName, mode: QRModeName): number {
  const totalCodewords = getSymbolTotalCodewords(version)
  const ecTotal = EC_CODEWORDS_TABLE[(version - 1) * 4 + ('LMQH'.indexOf(level))]
  const dataBits = (totalCodewords - ecTotal) * 8
  const reserved = getCharCountIndicator(mode, version) + 4
  const usable = dataBits - reserved
  switch (mode) {
    case 'numeric':
      return Math.floor((usable / 10) * 3)
    case 'alphanumeric':
      return Math.floor((usable / 11) * 2)
    case 'byte':
    default:
      return Math.floor(usable / 8)
  }
}

function getBestVersion(mode: QRModeName, length: number, level: ECLevelName): number {
  for (let v = 1; v <= 40; v++) {
    if (length <= getCapacity(v, level, mode)) return v
  }
  throw new Error('数据量过大，无法存入 QR Code（最大版本 40）')
}

/* ------------------------------------------------------------------ *
 * 9. 纠错码字与交织
 * ------------------------------------------------------------------ */

function createData(version: number, level: ECLevelName, segment: Segment): Uint8Array {
  const buffer = new BitBuffer()

  buffer.put(MODE_BITS[segment.mode], 4)
  buffer.put(segment.length, getCharCountIndicator(segment.mode, version))
  segment.write(buffer)

  const totalCodewords = getSymbolTotalCodewords(version)
  const ecTotal = EC_CODEWORDS_TABLE[(version - 1) * 4 + ('LMQH'.indexOf(level))]
  const dataBits = (totalCodewords - ecTotal) * 8

  if (buffer.getLengthInBits() + 4 <= dataBits) buffer.put(0, 4)
  while (buffer.getLengthInBits() % 8 !== 0) buffer.putBit(false)

  const remainingBytes = (dataBits - buffer.getLengthInBits()) / 8
  for (let i = 0; i < remainingBytes; i++) {
    buffer.put(i % 2 ? 0x11 : 0xec, 8)
  }

  return createCodewords(buffer, version, level)
}

function createCodewords(buffer: BitBuffer, version: number, level: ECLevelName): Uint8Array {
  const totalCodewords = getSymbolTotalCodewords(version)
  const ecTotal = EC_CODEWORDS_TABLE[(version - 1) * 4 + ('LMQH'.indexOf(level))]
  const dataTotal = totalCodewords - ecTotal
  const ecBlocks = EC_BLOCKS_TABLE[(version - 1) * 4 + ('LMQH'.indexOf(level))]

  const blocksInGroup2 = totalCodewords % ecBlocks
  const blocksInGroup1 = ecBlocks - blocksInGroup2
  const dataCwGroup1 = Math.floor(dataTotal / ecBlocks)
  const dataCwGroup2 = dataCwGroup1 + 1
  const ecCount = Math.floor(totalCodewords / ecBlocks) - dataCwGroup1

  const rs = generateECPolynomial(ecCount)

  let offset = 0
  const dcData: Uint8Array[] = []
  const ecData: Uint8Array[] = []
  const src = new Uint8Array(buffer.buffer)
  let maxDataSize = 0

  for (let b = 0; b < ecBlocks; b++) {
    const size = b < blocksInGroup1 ? dataCwGroup1 : dataCwGroup2
    const block = src.slice(offset, offset + size)
    dcData.push(block)

    // Reed-Solomon 纠错码字
    const padded = new Uint8Array(block.length + ecCount)
    padded.set(block)
    const remainder = polyMod(padded, rs)
    let ec: Uint8Array
    const start = ecCount - remainder.length
    if (start > 0) {
      ec = new Uint8Array(ecCount)
      ec.set(remainder, start)
    } else {
      ec = remainder
    }
    ecData.push(ec)
    offset += size
    maxDataSize = Math.max(maxDataSize, size)
  }

  const data = new Uint8Array(totalCodewords)
  let index = 0
  for (let i = 0; i < maxDataSize; i++) {
    for (let r = 0; r < ecBlocks; r++) {
      if (i < dcData[r].length) data[index++] = dcData[r][i]
    }
  }
  for (let i = 0; i < ecCount; i++) {
    for (let r = 0; r < ecBlocks; r++) {
      data[index++] = ecData[r][i]
    }
  }
  return data
}

/* ------------------------------------------------------------------ *
 * 10. 功能图案放置
 * ------------------------------------------------------------------ */

function setupFinderPattern(matrix: BitMatrix): void {
  const size = matrix.size
  const positions = [
    [0, 0],
    [size - 7, 0],
    [0, size - 7],
  ]
  for (const [row, col] of positions) {
    for (let r = -1; r <= 7; r++) {
      if (row + r <= -1 || size <= row + r) continue
      for (let c = -1; c <= 7; c++) {
        if (col + c <= -1 || size <= col + c) continue
        const dark =
          (r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
          (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        matrix.set(row + r, col + c, dark, true)
      }
    }
  }
}

function setupTimingPattern(matrix: BitMatrix): void {
  const size = matrix.size
  for (let r = 8; r < size - 8; r++) {
    const value = r % 2 === 0
    matrix.set(r, 6, value, true)
    matrix.set(6, r, value, true)
  }
}

function setupAlignmentPattern(matrix: BitMatrix, version: number): void {
  if (version === 1) return
  const posCount = Math.floor(version / 7) + 2
  const size = getSymbolSize(version)
  const intervals = size === 145 ? 26 : Math.ceil((size - 13) / (2 * posCount - 2)) * 2
  const positions = [size - 7]
  for (let i = 1; i < posCount - 1; i++) positions[i] = positions[i - 1] - intervals
  positions.push(6)
  positions.reverse()

  const coords: Array<[number, number]> = []
  for (let i = 0; i < positions.length; i++) {
    for (let j = 0; j < positions.length; j++) {
      if ((i === 0 && j === 0) || (i === 0 && j === positions.length - 1) || (i === positions.length - 1 && j === 0)) {
        continue
      }
      coords.push([positions[i], positions[j]])
    }
  }
  for (const [row, col] of coords) {
    for (let r = -2; r <= 2; r++) {
      for (let c = -2; c <= 2; c++) {
        const dark = r === -2 || r === 2 || c === -2 || c === 2 || (r === 0 && c === 0)
        matrix.set(row + r, col + c, dark, true)
      }
    }
  }
}

const G18 =
  (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0)
const G18_BCH = getBCHDigit(G18)

function setupVersionInfo(matrix: BitMatrix, version: number): void {
  const size = matrix.size
  let d = version << 12
  while (getBCHDigit(d) - G18_BCH >= 0) d ^= G18 << (getBCHDigit(d) - G18_BCH)
  const bits = (version << 12) | d
  for (let i = 0; i < 18; i++) {
    const row = Math.floor(i / 3)
    const col = (i % 3) + size - 8 - 3
    const mod = ((bits >> i) & 1) === 1
    matrix.set(row, col, mod, true)
    matrix.set(col, row, mod, true)
  }
}

const G15 =
  (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0)
const G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1)
const G15_BCH = getBCHDigit(G15)

function getFormatBits(level: ECLevelName, mask: number): number {
  const data = (EC_BITS[level] << 3) | mask
  let d = data << 10
  while (getBCHDigit(d) - G15_BCH >= 0) d ^= G15 << (getBCHDigit(d) - G15_BCH)
  return ((data << 10) | d) ^ G15_MASK
}

function setupFormatInfo(matrix: BitMatrix, level: ECLevelName, mask: number): void {
  const size = matrix.size
  const bits = getFormatBits(level, mask)
  for (let i = 0; i < 15; i++) {
    const mod = ((bits >> i) & 1) === 1
    if (i < 6) {
      matrix.set(i, 8, mod, true)
    } else if (i < 8) {
      matrix.set(i + 1, 8, mod, true)
    } else {
      matrix.set(size - 15 + i, 8, mod, true)
    }
    if (i < 8) {
      matrix.set(8, size - i - 1, mod, true)
    } else if (i < 9) {
      matrix.set(8, 15 - i - 1 + 1, mod, true)
    } else {
      matrix.set(8, 15 - i - 1, mod, true)
    }
  }
  matrix.set(size - 8, 8, true, true)
}

function setupData(matrix: BitMatrix, data: Uint8Array): void {
  const size = matrix.size
  let inc = -1
  let row = size - 1
  let bitIndex = 7
  let byteIndex = 0
  for (let col = size - 1; col > 0; col -= 2) {
    if (col === 6) col--
    while (true) {
      for (let c = 0; c < 2; c++) {
        if (!matrix.isReserved(row, col - c)) {
          let dark = false
          if (byteIndex < data.length) {
            dark = ((data[byteIndex] >>> bitIndex) & 1) === 1
          }
          matrix.set(row, col - c, dark)
          bitIndex--
          if (bitIndex === -1) {
            byteIndex++
            bitIndex = 7
          }
        }
      }
      row += inc
      if (row < 0 || size <= row) {
        row -= inc
        inc = -inc
        break
      }
    }
  }
}

/* ------------------------------------------------------------------ *
 * 11. 掩码与惩罚
 * ------------------------------------------------------------------ */

function getMaskAt(pattern: number, i: number, j: number): boolean {
  switch (pattern) {
    case 0: return (i + j) % 2 === 0
    case 1: return i % 2 === 0
    case 2: return j % 3 === 0
    case 3: return (i + j) % 3 === 0
    case 4: return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0
    case 5: return ((i * j) % 2) + ((i * j) % 3) === 0
    case 6: return (((i * j) % 2) + ((i * j) % 3)) % 2 === 0
    case 7: return (((i * j) % 3) + ((i + j) % 2)) % 2 === 0
    default: throw new Error('bad maskPattern: ' + pattern)
  }
}

function applyMask(pattern: number, matrix: BitMatrix): void {
  const size = matrix.size
  for (let col = 0; col < size; col++) {
    for (let row = 0; row < size; row++) {
      if (matrix.isReserved(row, col)) continue
      matrix.xor(row, col, getMaskAt(pattern, row, col))
    }
  }
}

const N1 = 3
const N2 = 3
const N3 = 40
const N4 = 10

function getPenaltyN1(data: BitMatrix): number {
  const size = data.size
  let points = 0
  for (let row = 0; row < size; row++) {
    let sameCol = 0
    let sameRow = 0
    let lastCol: boolean | null = null
    let lastRow: boolean | null = null
    for (let col = 0; col < size; col++) {
      const mCol = data.get(row, col)
      if (mCol === lastCol) sameCol++
      else {
        if (sameCol >= 5) points += N1 + (sameCol - 5)
        lastCol = mCol
        sameCol = 1
      }
      const mRow = data.get(col, row)
      if (mRow === lastRow) sameRow++
      else {
        if (sameRow >= 5) points += N1 + (sameRow - 5)
        lastRow = mRow
        sameRow = 1
      }
    }
    if (sameCol >= 5) points += N1 + (sameCol - 5)
    if (sameRow >= 5) points += N1 + (sameRow - 5)
  }
  return points
}

function getPenaltyN2(data: BitMatrix): number {
  const size = data.size
  let points = 0
  for (let row = 0; row < size - 1; row++) {
    for (let col = 0; col < size - 1; col++) {
      const last =
        (data.get(row, col) ? 1 : 0) +
        (data.get(row, col + 1) ? 1 : 0) +
        (data.get(row + 1, col) ? 1 : 0) +
        (data.get(row + 1, col + 1) ? 1 : 0)
      if (last === 4 || last === 0) points++
    }
  }
  return points * N2
}

function getPenaltyN3(data: BitMatrix): number {
  const size = data.size
  let points = 0
  for (let row = 0; row < size; row++) {
    let bitsCol = 0
    let bitsRow = 0
    for (let col = 0; col < size; col++) {
      bitsCol = ((bitsCol << 1) & 0x7ff) | (data.get(row, col) ? 1 : 0)
      if (col >= 10 && (bitsCol === 0x5d0 || bitsCol === 0x05d)) points++
      bitsRow = ((bitsRow << 1) & 0x7ff) | (data.get(col, row) ? 1 : 0)
      if (col >= 10 && (bitsRow === 0x5d0 || bitsRow === 0x05d)) points++
    }
  }
  return points * N3
}

function getPenaltyN4(data: BitMatrix): number {
  let darkCount = 0
  for (let i = 0; i < data.data.length; i++) darkCount += data.data[i]
  const k = Math.abs(Math.ceil((darkCount * 100) / data.data.length / 5) - 10)
  return k * N4
}

function getBestMask(matrix: BitMatrix, setupFormat: (p: number) => void): number {
  let best = 0
  let lower = Infinity
  for (let p = 0; p < 8; p++) {
    setupFormat(p)
    applyMask(p, matrix)
    const penalty =
      getPenaltyN1(matrix) +
      getPenaltyN2(matrix) +
      getPenaltyN3(matrix) +
      getPenaltyN4(matrix)
    applyMask(p, matrix)
    if (penalty < lower) {
      lower = penalty
      best = p
    }
  }
  return best
}

/* ------------------------------------------------------------------ *
 * 12. 主入口
 * ------------------------------------------------------------------ */

export function createQRMatrix(value: string, options: QRCreateOptions = {}): QRResult {
  if (value === undefined || value === null || value === '') {
    throw new Error('QR Code 内容不能为空')
  }

  const level: ECLevelName = options.level ?? 'M'
  let mode: QRModeName = options.mode ?? detectMode(value)
  if (options.utf8 && mode !== 'byte') mode = 'byte'

  const segment = buildSegment(mode, value)
  let version = options.version
  if (!version) {
    version = getBestVersion(
      mode,
      mode === 'byte' ? segment.length : value.length,
      level,
    )
  } else {
    const cap = getCapacity(version, level, mode)
    const len = mode === 'byte' ? segment.length : value.length
    if (len > cap) {
      throw new Error(
        `指定的版本 ${version}（${level} 级）无法容纳 ${len} 个字符，需至少 ${getBestVersion(mode, len, level)} 版`,
      )
    }
  }

  const dataBits = createData(version, level, segment)
  const size = getSymbolSize(version)
  const matrix = new BitMatrix(size)

  setupFinderPattern(matrix)
  setupTimingPattern(matrix)
  setupAlignmentPattern(matrix, version)
  setupFormatInfo(matrix, level, 0) // 预留格式位（避免被掩码）
  if (version >= 7) setupVersionInfo(matrix, version)
  setupData(matrix, dataBits)

  let maskPattern = options.maskPattern
  if (maskPattern === undefined || isNaN(maskPattern)) {
    maskPattern = getBestMask(matrix, (p) => setupFormatInfo(matrix, level, p))
  } else if (maskPattern < 0 || maskPattern > 7) {
    throw new Error('maskPattern 必须在 0-7 之间')
  }

  applyMask(maskPattern, matrix)
  setupFormatInfo(matrix, level, maskPattern)

  const modules: boolean[] = []
  for (let i = 0; i < matrix.data.length; i++) modules.push(matrix.data[i] === 1)

  return { modules, moduleCount: size, version, level, maskPattern }
}
