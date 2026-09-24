# 发版 runbook

给「要发一个新版本」这件事一个可执行清单，以及首发时踩过的坑。仓库用 [changesets](https://github.com/changesets/changesets) 管版本，`release.yml` 手动触发。

## 包与 npm 归属现状

| 包 | npm 名 | 状态 | 是否在发布范围 |
| --- | --- | --- | --- |
| 组件库 | `kb-ui-vue` | 已发布，维护者 `yuer678` | ✅ 正常发布 |
| 工具库 | `@yuer678/kb-utils` | 已发布 | ✅ 正常发布 |
| API 参考后端 | `@yuer678/kb-api` | 已发布 | ✅ 正常发布 |
| 脚手架 | `@yuer678/create-kb` | 已发布（CLI 命令名仍是 `create-kb`） | ✅ 正常发布 |
| 共享配置 | `@kb/config` | 私有，不发 | ❌ |
| `kb-playground` / `kb-docs` | — | 私有，不发 | ❌ |

历史上的两个阻塞（2026-09-24 已解决，包名整体迁到用户 scope `@yuer678/*`，详见 `docs/PUBLISH.md` 决策记录）：

- `@kb` scope 归属未确认 → 不再依赖 org，改用用户 scope。
- 无 scope 的 `create-kb` 被无关项目占用（`kb-base`）→ 脚手架改名 `@yuer678/create-kb`，CLI 命令名不变。

## 发布范围的开关：`.changeset/config.json` 的 `ignore`

```json
"ignore": ["@kb/config", "kb-playground", "kb-docs"]
```

这个列表对 **version 和 publish 双向生效**——`@changesets/cli` 的 `getPublishPlan.mjs`（publish 时算待发列表）和 `version.mjs`（升版本）都会过 `shouldSkipPackage(pkg, { ignore })`。被忽略的包：

- 不会升版本、不会写 CHANGELOG
- 不会被 `changeset publish` 尝试发布
- **对应的 changeset 文件原地保留**，解除 ignore 后下次 release 自动应用

不要为了"先不发"把包改成 `private: true`——那会改变包的语义，而且被忽略包若是别的包的依赖，会造成发布出去的包依赖一个不存在的版本。

改完想预演，就在本地跑一次看影响面，再回滚：

```bash
pnpm changeset version          # 看哪些 package.json / CHANGELOG 被改
git status --short
git checkout -- packages .changeset   # 回滚，别把版本提交流出去
```

## 发版步骤

1. 确认待发布的 changeset 都在（`ls .changeset/*.md`，排除 `README.md`）
2. GitHub Actions → **Release** → Run workflow：
   - 先 `dry_run=true` 看会发哪些包
   - 确认无误再 `dry_run=false`
3. workflow 会自动：`npm whoami` 校验 → build → `changeset version` → `changeset publish` → **API 建 tag**（`Create release tags (API)`，指向触发 commit）→ 推 `release/writeback-*` 分支并尝试自动开回写 PR
4. 发布后验证（见下）；registry 实测用 `npm view <pkg>@<version> version`，**别只 curl packument**（新包 packument 有 CDN 负缓存，会 404 一阵子）
5. 回写 PR 合并后，若需要 tag 精确锚在 merge commit，手动把 tag 重打到该 commit（API 重打即可，npm 版本才是真源）

没配 `NPM_TOKEN` 时 workflow 只打印「跳过发布」并正常结束，不会红。

## NPM_TOKEN

必须是 **带 publish 权限的 npm Automation token**，`Settings → Secrets → NPM_TOKEN`。

仓库 Secrets 的 `NPM_TOKEN` 已于 2026-09-22 轮换为有效的 Automation token（`kb-ui-vue@0.4.0` 即由 Release 工作流发出）。

本机验证 token 的几条命令（**必须显式带 `--registry`，否则走 `~/.npmrc` 里的 npmmirror**）：

```bash
npm whoami --registry=https://registry.npmjs.org
npm access list collaborators kb-ui-vue --registry=https://registry.npmjs.org   # 期望 read-write
curl -s --noproxy '*' https://registry.npmjs.org/<pkg>                          # 查包名占用
```

## 故障定位

| 现象 | 真因 |
| --- | --- |
| `E404: Not Found - PUT .../kb-ui-vue - 'x.y.z' is not in this registry` | **不是包不存在，是 token 没有发布权限**。npm 对无权限的 PUT 只回 404。先 `npm whoami` 确认 |
| `npm whoami` 401 / 输出空 | token 失效、被吊销，或不是 npmjs.com 的 token |
| npm 上有新版本、仓库里 `package.json` 还停在旧版本 | `changeset version` 只改 runner 工作区。workflow 现在会提交回写；手工发版时记得自己 commit + `pnpm changeset tag` + `git push --follow-tags` |
| changesets 报某个包没 changeset | 要么补 changeset，要么把它加进 `ignore` |
| 校验步骤写 `echo "$(cmd)"` 却在失败时还是绿的 | 命令替换的退出码被 `echo` 吞掉，`set -e` 不生效。用 `set -euo pipefail` + `VAR=$(cmd)` |
| 发完 `curl https://registry.npmjs.org/<pkg>` 404，以为没发出去 | **新包 packument 有 CDN 负缓存**。用 `npm view <pkg>@<version> version` 或版本端点验证（run 35989660546 实证：publish 真成功了，packument 404 迷惑了排查半小时） |
| `changeset tag` 自称 Created、`git push --tags` 报 Everything up-to-date，远端却没 tag | v3.0.3 在 scoped 包名上静默失灵（机理未深究）。workflow 已改用 Git Data API 建 tag（可核验、可重跑） |
| `gh pr create` 报 `GitHub Actions is not permitted to create or approve pull requests` | repo 设置没开（且该设置不在 Update Repository API 里，改不了）。workflow 已 `continue-on-error` 降级为警告；手动从 `release/writeback-*` 分支开 PR 即可 |

## 发布后验证

装回来的包能不能真用，只有这一步能发现（exports 映射错、样式漏打、组件编译坏掉都藏在这）：

```bash
mkdir /tmp/smoke && cd /tmp/smoke
echo '{"name":"smoke","private":true,"type":"module"}' > package.json
npm i kb-ui-vue@<version> vue --registry=https://registry.npmjs.org
```

然后跑：ESM `import` / CJS `require` / `import.meta.resolve('kb-ui-vue/styles/tokens.css')` 子路径 / 用 `@vue/server-renderer` 实际渲染几个组件。`kb-ui-vue@0.3.0` 首发时就是这样验的：56 个组件、117 个具名导出，Table 传 `total=100&pageSize=10` 能渲染出 10 页（服务端分页进了产物）。
