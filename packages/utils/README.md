# @yuer678/kb-utils

> 通用 TypeScript 工具函数库：**60+ 函数 / 11 个模块**，零运行时依赖，全量 TS 类型。

[kb-ui](https://github.com/anyuer678/kb-ui) monorepo 的工具库包。组件库演示、脚手架模板与日常业务共用的底层函数，构建产物 ESM + CJS 双格式。

## 安装

```bash
npm i @yuer678/kb-utils
```

## 模块一览

| 模块 | 内容 |
|------|------|
| `format` | 日期 / 数字 / 文件大小 / 时长 / 金额格式化 |
| `time` | 时间戳、相对时间、等待 |
| `array` | 去重、分组、分块、排序等 |
| `object` | 深拷贝、深合并、取值 |
| `string` | 常用字符串处理与判空 |
| `regex` | 手机号 / 邮箱 / URL 等常用校验 |
| `storage` | localStorage 封装（带过期与 JSON 序列化） |
| `async` | 并发控制 `pLimit`、失败重试 `retry`（指数退避）、防抖节流 |
| `dom` | 元素查找、滚动、事件辅助 |
| `math` | 数值精度与范围工具 |
| `http` | 请求层 `createHttp`：baseURL / 参数拼接 / 超时 / 请求响应钩子 / 指数退避重试 |

## 使用示例

```ts
import { retry, pLimit, formatDate } from '@yuer678/kb-utils'

await retry(() => fetch(url), { retries: 3 })        // 指数退避重试
const limit = pLimit(5)                              // 并发上限 5
formatDate(new Date(), 'YYYY-MM-DD')
```

## 相关包

- [`kb-ui-vue`](https://www.npmjs.com/package/kb-ui-vue) —— Vue 3 组件库（73 组件 / 46 主题）
- [`@yuer678/kb-api`](https://www.npmjs.com/package/@yuer678/kb-api) —— 可复用的参考后端（Express + Zod）
- [`@yuer678/create-kb`](https://www.npmjs.com/package/@yuer678/create-kb) —— 项目脚手架（7 种模板）
- 仓库与文档：<https://github.com/anyuer678/kb-ui>

## License

MIT
