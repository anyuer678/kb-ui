# 发版 runbook

给「要发一个新版本」这件事一个可执行清单，以及首发时踩过的坑。仓库用 [changesets](https://github.com/changesets/changesets) 管版本，`release.yml` 手动触发。

## 包与 npm 归属现状

| 包 | 版本 | npm 状态 | 是否在发布范围 |
| --- | --- | --- | --- |
| `kb-ui-vue` | 0.3.0 | 已发布，维护者 `yuer678` | ✅ 正常发布 |
| `@kb/utils` | 0.1.0 | 404（未发布） | ⏸ 暂缓 |
| `@kb/api` | 0.1.0 | 404（未发布） | ⏸ 暂缓 |
| `@kb/config` | 0.0.0 | 私有，不发 | ❌ |
| `create-kb` | 0.2.0 | **名字被无关项目占用** | ⏸ 暂缓 |
| `kb-playground` / `kb-docs` | — | 私有，不发 | ❌ |

两个阻塞（解决前不要解禁）：

- **`@kb` 作用域归属未确认**。当前 npm token 只有发布权限，`npm org ls kb` / `npm access list packages` 都返回 403，查不了。确认归属后从 `ignore` 移除即可；若不归你所有，需要整体换成用户名 scope（如 `@yuer678/*`），届时 `docs`、`playground`、create-kb 的 api / fullstack 模板里的 `import '@kb/...'` 都要一起替换。
- **`create-kb` 是同名无关项目**（npm 上 0.1.1，来源 `adamBoualleiguie/knowledge-base`，维护者 `kb-base`）。直接发必 403。候选新名：`@kb/create-kb` 或 `kb-create`。

## 发布范围的开关：`.changeset/config.json` 的 `ignore`

```json
"ignore": ["@kb/config", "kb-playground", "kb-docs", "@kb/utils", "@kb/api", "create-kb"]
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
3. workflow 会自动：`npm whoami` 校验 → build → `changeset version` → `changeset publish` → `changeset tag` → commit + `git push --follow-tags`
4. 发布后验证（见下）

没配 `NPM_TOKEN` 时 workflow 只打印「跳过发布」并正常结束，不会红。

## NPM_TOKEN

必须是 **带 publish 权限的 npm Automation token**，`Settings → Secrets → NPM_TOKEN`。

现在仓库里那个是**无效凭据**（`npm whoami` 返回 401），kb-ui-vue@0.3.0 是改用本机 `~/.npmrc` 里的 token 手发的。换 token 后跑一次 Release 就能验证：`Verify npm auth` 步骤会打出账号名。

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

## 发布后验证

装回来的包能不能真用，只有这一步能发现（exports 映射错、样式漏打、组件编译坏掉都藏在这）：

```bash
mkdir /tmp/smoke && cd /tmp/smoke
echo '{"name":"smoke","private":true,"type":"module"}' > package.json
npm i kb-ui-vue@<version> vue --registry=https://registry.npmjs.org
```

然后跑：ESM `import` / CJS `require` / `import.meta.resolve('kb-ui-vue/styles/tokens.css')` 子路径 / 用 `@vue/server-renderer` 实际渲染几个组件。`kb-ui-vue@0.3.0` 首发时就是这样验的：56 个组件、117 个具名导出，Table 传 `total=100&pageSize=10` 能渲染出 10 页（服务端分页进了产物）。
