# 文档站工具链的 9 条 Dependabot 告警：来源、现状与复审条件

对应 GitHub Security → Dependabot 里本仓 9 条 `tolerable_risk` 关闭记录（#34 / #36 / #37 / #65 / #66 / #67 / #68 / #69 / #33）。
本文件的目的不是"解释为什么不修"，而是把每一条的真实状态写清楚——其中 8 条已由本轮升级消除或被 override 缓解，剩 1 条在本轮修掉。

## 结论先行

- 9 条全部属于**文档站构建链**（VitePress 1.6.4 → vite 5.4.21 / esbuild 0.21.x），**不进 `kb-ui-vue` 发布产物**
- CI 里的 `pnpm audit --prod --audit-level=high` 是**硬门禁**，当前 0 告警；Dependabot 的 `OPEN = 0`
- 告警是**历史快照**：提出时仓内 vite 为 8.3.0 / 8.3.2，正处于 GHSA 影响区间内；升到 8.3.5 后这些区间已不覆盖

## 逐条状态

| # | 包 | 级别 | GHSA 影响区间 | 现状 |
| --- | --- | --- | --- | --- |
| 69 | vite | low | `>= 8.3.0, <= 8.3.2` | **已不适用**：仓内 vite 为 8.3.5，文档站为 5.4.21，均不在区间内 |
| 68 | vite | medium | `>= 8.3.0, <= 8.3.2` | **已不适用**（同上） |
| 36 | vite | medium | `>= 8.0.0, <= 8.0.15` | **已不适用**：8.3.5 / 5.4.21 均不在区间内 |
| 34 | vite | medium | `>= 8.0.0, <= 8.0.4` | **已不适用**（同上） |
| 66 | vite（实际是 `launch-editor`） | high | `<= 2.14.1` | **已缓解**：`overrides.launch-editor = ^2.14.2`，锁文件里全树只有 2.14.2 |
| 67 | vite（`launch-editor`） | medium | `<= 2.14.1` | **已缓解**（同上） |
| 65 | vite（`launch-editor`） | medium | `<= 2.14.1` | **已缓解**（同上） |
| 37 | vite（`launch-editor`） | medium | `<= 2.14.0` | **已缓解**（同上） |
| 33 | esbuild | medium | `<= 0.24.2` | **已修**：`overrides["esbuild@^0.21.3"]` 由 0.21.5 提到 0.25.12，`pnpm docs:build` 通过（13.76s） |

> 4 条 `launch-editor` 告警在 Dependabot 里挂在 `vite` 名下，是 vite 5 传递依赖该包导致的归类；真正受影响的是 `launch-editor <= 2.14.1`，override 后已不在影响区间。

## 为什么 vite 仍是 5.4.21

`overrides` 里有两条显式钉死，是**为了让文档站能构建**，不是遗漏：

```jsonc
"vite@^5.4.14": "5.4.21",      // vitepress 1.6.4 的 peer 区间只有 5.x
"esbuild@^0.21.3": "0.25.12"   // 本轮从 0.21.5 提到 0.25.12
```

`vitepress@1.6.4` 是 1.x 线的最新版，其 vite peer 区间仍停在 `^5.4.14`；把 vite 抬到 7/8 会让 `docs:build` 直接失败（已实测）。真正解除钉死的路径只有 **vitepress 2 正式版**（2.x 目前仍是 alpha）。

## 复审条件（触发即重开讨论）

1. `vitepress` 2.0 正式发布 → 删掉两条 `vite@^5.4.14` / 相关 override，文档站直接跑 vite 8
2. vitepress 1.x 发布新补丁且把 vite peer 放宽到 `>=5.4.21 <9` → 只删钉死、保留 override
3. `pnpm audit --prod --audit-level=high` 在 CI 转红 → 门禁优先，立即处理，不以"已关闭"为由跳过

## 本轮验证

- `pnpm install` ✅（2m28s，esbuild 0.25.12 落地）
- `pnpm docs:build` ✅ `build complete in 13.76s`
- `pnpm audit --prod --audit-level=high` 仍为 0（生产依赖未变）
