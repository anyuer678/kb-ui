# KB UI

[简体中文](README.md) | English

[![CI](https://github.com/anyuer678/kb-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/anyuer678/kb-ui/actions/workflows/ci.yml)

> **Status**: `portfolio` · Component library portfolio · Published on npm as [`kb-ui-vue`](https://www.npmjs.com/package/kb-ui-vue)
> **Relationship with design-assets**: the local design asset library is used only for docs/PPT/case illustrations — it does **not** replace component default themes or runtime skins.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Vue 3](https://img.shields.io/badge/Vue-3.5-42b883)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff)](https://vitejs.dev/)
[![pnpm](https://img.shields.io/badge/pnpm-10-f69220)](https://pnpm.io/)
[![Components](https://img.shields.io/badge/Components-73-10b981)](https://github.com/anyuer678/kb-ui)
[![Themes](https://img.shields.io/badge/Themes-46-8b5cf6)](https://github.com/anyuer678/kb-ui)
[![Page Modules](https://img.shields.io/badge/Page_Modules-36+-f59e0b)](https://github.com/anyuer678/kb-ui)

**A self-built frontend asset library and engineering template set**: a Vue 3 component library + 36 complete page modules + 46 multi-style themes + general-purpose utilities (with an HTTP request layer) + a reusable reference backend + 7 project scaffold templates + DevOps assets. Zero runtime dependencies, CSS-variable driven.

> 📦 The **publishing strategy** is documented in [docs/PUBLISH.md](docs/PUBLISH.md) (mapping between published and internal packages, and the record behind the two-release decision).

> 📦 The component library is published on npm: [`kb-ui-vue`](https://www.npmjs.com/package/kb-ui-vue) (`npm i kb-ui-vue`). The utilities, reference backend, and scaffold are also published: [`@yuer678/kb-utils`](https://www.npmjs.com/package/@yuer678/kb-utils), [`@yuer678/kb-api`](https://www.npmjs.com/package/@yuer678/kb-api), and [`@yuer678/create-kb`](https://www.npmjs.com/package/@yuer678/create-kb) — the scaffold uses a scoped name because the unscoped `create-kb` on npm is an unrelated project with the same name.

---

## Features

### Component library (`kb-ui-vue`, 73 components)
- **Common scenarios covered**: basics (Button/Icon/Tag/Space/Divider/Grid), forms (Input/Select/Checkbox/Radio/Switch/Form/DatePicker/TimePicker/AutoComplete/TreeSelect/Upload/Tree/Cascader/Transfer…), feedback (Dialog/Drawer/Message/Notification/Tooltip/Popover/Popconfirm…), data (Table/Calendar/Statistic/Descriptions/Timeline/Carousel…), images (Image/ImagePreview), scrolling & overlays (Affix/BackTop/Anchor/Splitter/Tour/ContextMenu…)
- **Global config & i18n**: `ConfigProvider` injects `locale` / `size` / `zIndex` / `theme` in one place; built-in `zh-CN` and `en-US` locale packs switch at runtime in one line, and every component with copy has been wired for i18n
- **On-demand imports**: `kb-ui-vue/resolver` exports `KbResolver` for `unplugin-vue-components` auto-import of components and their styles (including style reuse for `Row/Col→Grid` and `FormItem→Form`)
- **IDE type hints**: the build emits `dist/global.d.ts`, so typing `<KbXxx>` in templates gives completion and type checking
- **Functional APIs**: imperative `message` / `notification` calls out of the box
- **On-demand styles**: each component ships its own `style.css`; `dist/styles/*` can be imported individually
- **Zero runtime dependencies**: all styling is native CSS + design tokens, no third-party style framework

#### Component depth notes

| Depth | Components |
|------|------|
| ✅ Basic | Alert, Avatar, BackTop, Badge, Breadcrumb, Button, Calendar, Card, Carousel, Checkbox, Collapse, ColorPicker, ConfigProvider, CountUp, Descriptions, Dialog, Divider, Drawer, Dropdown, Empty, FloatButton, Icon, Image, Input, InputNumber, InputPassword, Layout, List, Loading, Mentions, Message, Notification, Pagination, Popconfirm, Popover, Progress, QRCode, Radio, Rate, Result, Search, Segmented, Skeleton, Slider, Space, Statistic, Steps, Switch, Tag, Textarea, TimePicker, Tooltip, Upload, VirtualList, Watermark |
| 🔧 Advanced | Affix (sticky top/bottom without jumpiness), Anchor (scroll-highlight nav), AutoComplete (local/remote suggestions), Cascader (async loading/clearing), ContextMenu (viewport edge flipping), DatePicker (single/range/multiple), Form (validation + dynamic fields), Grid (responsive layout), ImagePreview (zoom/rotate/keyboard nav), Select (search + keyboard nav), Splitter (drag/keyboard split), Table (sorting/pagination/fixed columns/row selection/server-side pagination), Tabs, Timeline, Tour (step-by-step guide), Transfer (search/pagination/select-all), Tree (virtual scroll/drag sort), TreeSelect (tree dropdown, single/multiple) |

### Recent updates (73 components / global config / on-demand imports / quality gates)

- **11 new components**: `AutoComplete`, `TreeSelect`, `TimePicker` (form trio), `Image`, `ImagePreview`, `Affix`, `BackTop`, `Anchor` (scroll-positioning trio), `Splitter`, `Tour`, `ContextMenu` — each with its own `style.css`, unit tests, and docs page
- **5 more components**: `Layout` (Header/Sider/Content/Footer compositions), `FloatButton` / `FloatButtonGroup`, `Mentions` (@ mentions input), `VirtualList` (fixed-height virtual scrolling list), `QRCode` (zero-dependency self-built QR encoder, single-path SVG rendering, cross-verified bit-for-bit against the reference `qrcode` library) — each with its own `style.css`, unit tests, playground demo, docs page, plus on-demand import and SSR smoke integration
- **`ConfigProvider` + i18n**: unified `locale` / `size` / `zIndex` / `theme` injection; built-in `zh-CN` and `en-US` packs with `useLocale()` returning a reactive `locale` for instant re-render; 16 components fully internationalized (Empty / List / Search / Popconfirm / Cascader / Calendar / Carousel / ColorPicker / InputPassword / Pagination / DatePicker / Table / Transfer / Upload / Dialog / Form), with theme sync to `<html data-theme>`
- **On-demand imports + IDE types**: a separate build entry `kb-ui-vue/resolver` (exporting `KbResolver`) and `dist/global.d.ts` (70 global component declarations)
- **Docs**: new `guide/i18n.md`, `guide/on-demand.md`, `components/config-provider.md`, plus 16 new component docs pages (11 + 5), all mounted in the sidebar
- **Stronger quality gates**: 606 unit tests across 77 test files all green; new **SSR smoke tests** (running `renderToString` for every component in Node to catch unguarded `window` / `document` access), **axe-core accessibility tests** (13 cases, which surfaced and fixed real defects such as missing ContextMenu keyboard navigation and unnamed comboboxes in TimePicker / TreeSelect), **coverage reporting** (v8), and **size budget checks** (including tree-shaking ratio, see below)
- **Visual regression rebuilt**: the original cases depended on playground routes, but that app is a "single page + side tabs" structure with no routes, so `/button` etc. all 404ed — it had never actually run. Replaced with a standalone **deterministic sampling harness** (`packages/ui/visual/harness`, fixed 800×520 canvas, animations off, inline placeholders) covering 23 components × 3 themes = **69 baselines**
- **Repo governance**: added `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, `.github/CODEOWNERS`, and Dependabot config

### Quality & testing

| Gate | Command | Notes |
|------|------|------|
| Unit / SSR / a11y | `pnpm test` | Vitest, 606 cases (incl. 81 SSR smoke + 13 axe a11y) |
| Coverage | `pnpm test:coverage` | v8 provider, currently 87%+ statement coverage; **below threshold fails the build** (85/72/84/87) |
| Size budget | `pnpm check-size` | Raw/gzip output ceilings + tree-shaking ratio for per-component imports (currently ~3.6%, threshold 25%) |
| Visual regression | `pnpm test:visual` | Playwright snapshot diffing, 69 baselines; `pnpm test:visual:update` to refresh |
| E2E | `pnpm e2e` | 48 checks in a real browser: legacy component interactions + 17 new components + theme tokens + docs site (incl. rendering of 5 new component doc pages) |

> Visual baselines depend strongly on "OS + font rendering + browser version" and must be generated on the same platform. This repo's baselines were generated on **Windows**, and CI's `visual` job also runs on `windows-latest` — wired in as a **mandatory gate**.

> `pnpm e2e` assumes `pnpm start` is already running; pass `--serve` to have the script start playground(:8070) and docs(:8071) itself and shut them down afterwards (CI uses this). Playwright's bundled Chromium is the default; set `E2E_CHANNEL=msedge` to use local Edge.

### Theme system (46 themes)
- **Two-dimensional switching**: 12 color themes (violet/teal/rose/ink/neon…) + 36 style themes (rounded/flat/gradient/glass/cyber/terminal/ink-wash/business/Memphis/pop/minimal/pastel/gilded/brush-painting…)
- **CSS-variable driven**: each theme is one `[data-theme]` override file, switchable at runtime in one line
- **Dark mode**: `[data-theme]` + `.dark` combination, auto-adapted

### Page module templates (36)
Login / Register / Dashboard / Data wall / Task board / Analytics / Order management / User management / Mail inbox / File manager / Blog posts / Chat window / Music player / Checkout / Pricing / Stepped wizard / Image gallery / Resume / Pet shop / Video list / Landing page … (all previewable in the playground)

### Utility library (`@yuer678/kb-utils`, 60+ functions)
Formatting (date/number/file size/duration/currency), arrays, objects (deep clone/deep merge), strings, regex validation, concurrency control (pLimit/retry), debounce & throttle, storage wrappers, DOM utilities, and an **HTTP request layer** (`createHttp`: baseURL / query building / timeout / request & response hooks / exponential-backoff retry)

### Reference backend (`@yuer678/kb-api`)
A directly `import`-able Express 5 + Zod 4 backend that doubles as the data source for component demos and the backend base for scaffold templates:

- **Out of the box**: `createApp()` returns a mountable Express app; `startServer()` boots the server in one call (default `127.0.0.1:8082`)
- **Built-in endpoints**: `/health` (with un-prefixed probe), `/api/users` (pagination + sorting + search with field/sort-key whitelists), `/api/regions` (tree + `parent` lazy loading), `/api/regions/tree`, `/api/options`
- **Middleware**: unified error handling (`HttpError` / `notFoundHandler` / `errorHandler`), Zod validation middleware `validate(schema)`, built-in CORS
- **Swappable data layer**: `src/data/*` is deterministic in-memory data (500 users / 440 region nodes / 240 options); routes depend only on accessors — swapping in a database means replacing just this layer
- **Same source as the scaffold**: `create-kb`'s `api` and `fullstack` template backends are synced from this package via `pnpm sync:api-template` — there is no second implementation

```bash
pnpm api        # start the local backend (tsx watch, default :8082)
```

### Scaffold templates (create-kb, 7 kinds)
| Template | Description |
|------|------|
| `base` | Minimal Vue 3 + Vite + TS frontend |
| `starter` | Frontend with full component examples |
| `api` | Express + TypeScript + Zod backend (source synced with `@yuer678/kb-api`, incl. 21 supertest cases) |
| `fullstack` | Vue frontend + Express API + Docker Compose one-command startup (backend also synced with `@yuer678/kb-api`) |
| `electron` | Electron desktop app skeleton (security model + packaging) |
| `react` | React 19 + Vite frontend |
| `ai` | LLM workbench (OpenAI-compatible + SSE streaming + chat frontend) |

### DevOps assets
CI (lint / typecheck / test / coverage / size budget / build / template consistency check, see `.github/workflows/ci.yml`), a separate visual-regression job (windows-latest), a separate E2E job (real browser, script-managed services), GitHub Pages docs deployment, changesets-powered releases, Dependabot updates, a multi-stage Node Dockerfile and multi-service docker-compose (inside the `fullstack` template), and a deployment checklist (see `docs/devops-模板.md`)

## Tech stack

| Layer | Technology |
|------|------|
| Frontend | Vue 3.5 + TypeScript 5.9 |
| Backend | Express 5 + Zod 4 (`@yuer678/kb-api`) |
| Build | Vite 8 (lib mode) + tsup |
| Package mgmt | pnpm 10 workspace monorepo |
| Testing | Vitest (606 unit + SSR smoke + axe a11y) + Playwright (e2e + 69 visual baselines) |
| Docs | Vitepress 1.6 |
| Versioning | changesets |

## Quick start

```bash
pnpm install       # install all dependencies
pnpm start         # start playground(:8070) + docs(:8071)
pnpm start:full    # additionally start the local backend @yuer678/kb-api(:8082) so playground "real API" examples work
```

- **playground** http://localhost:8070 — 46-theme switching + 36 module previews + real-API examples
- **docs** http://localhost:8071 — component documentation (with API tables and live examples)
- **api** http://localhost:8082/api — reference backend (start separately with `pnpm api`)

### Creating a project with create-kb

> ⚠️ The unscoped `create-kb` on npm is an **unrelated project with the same name** (from `adamBoualleiguie/knowledge-base`, maintainer `kb-base`).
> This repo's scaffold is published as [`@yuer678/create-kb`](https://www.npmjs.com/package/@yuer678/create-kb); the CLI command name is still `create-kb`. Use it locally from this repo:

```bash
pnpm --filter @yuer678/create-kb build                       # build the CLI first
node packages/create-kb/dist/index.js my-app        # interactive template picker
node packages/create-kb/dist/index.js my-api --template api   # pick a template directly (1 of 7)
```

### After modifying backend source, sync the templates

```bash
pnpm sync:api-template          # sync packages/api source into create-kb's api / fullstack templates
pnpm sync:api-template:check    # drift check only (CI runs this)
```

## Project structure

```
kb-ui/
├── packages/
│   ├── ui/            # kb-ui-vue component library (73 components; visual/ holds the visual-regression harness and baselines)
│   ├── utils/         # @yuer678/kb-utils utility library (incl. HTTP request layer)
│   ├── api/           # @yuer678/kb-api reference backend (Express + Zod)
│   ├── config/        # shared engineering config (tsconfig/eslint/prettier/stylelint)
│   └── create-kb/     # scaffold CLI (7 templates; backend templates generated by the sync script)
├── playground/        # component demo site (hot-reload from source, incl. real-API examples)
├── docs/              # Vitepress docs site + DevOps templates
├── scripts/           # build/docs-generation/template-sync/e2e scripts
└── internal-docs/     # design docs and implementation plans (internal)
```

## Common commands

```bash
pnpm start            # start playground + docs
pnpm start:full       # also start the local backend (needed by playground real-API examples)
pnpm api              # start only the reference backend
pnpm lint             # lint all packages
pnpm typecheck        # typecheck all packages
pnpm test             # unit tests for all packages (incl. SSR smoke + axe a11y)
pnpm test:coverage    # component library coverage (v8)
pnpm check-size       # component library size budget + tree-shaking ratio check
pnpm test:visual      # visual regression diff (Playwright snapshots)
pnpm test:visual:update  # refresh visual baselines (must match the running platform)
pnpm build            # build all packages (dist/styles: 72 style files)
pnpm e2e              # end-to-end tests (requires pnpm start; --serve starts services for you)
pnpm docs:build       # build the docs site
pnpm sync:api-template        # sync create-kb backend templates
pnpm sync:api-template:check  # verify templates match packages/api
```

## Versioning & releases

- The component library and scaffold are versioned via [changesets](https://github.com/changesets/changesets) with changelogs
- Flow: `pnpm changeset` → push → CI validates → merge → **manually** trigger `release.yml` (choose `dry_run` for a rehearsal)
- Releases do **not** happen automatically on merge, so irreversible external actions are never triggered as a side effect of merging code
- `NPM_TOKEN` must be an npm Automation token with publish rights; without it the release jobs skip safely
- Which packages publish is decided by the `ignore` list in `.changeset/config.json`; the full checklist, troubleshooting, and post-publish verification are in [`internal-docs/releasing.md`](internal-docs/releasing.md)

## Documentation

- [Component docs site](https://anyuer678.github.io/kb-ui/) (live after deployment)
- `docs/` contains component APIs, theming guides, backend module docs, and DevOps templates
- `internal-docs/` contains design docs (specs) and implementation plans

## Contributing

- Read [`CONTRIBUTING.md`](CONTRIBUTING.md) first: environment requirements, the difference between "changing the component library" and "changing other modules", and a pre-submit checklist
- For security issues please **do not** open a public issue; report privately per [`SECURITY.md`](SECURITY.md)
- Community interaction follows [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md); code ownership and review are in [`.github/CODEOWNERS`](.github/CODEOWNERS)
- Component library changes should include a changeset (`pnpm changeset`) and matching tests; if visuals change, refresh baselines with `pnpm test:visual:update`

## Disclaimer

This project is provided "AS IS" under the **MIT** license; the author and contributors are **not liable for any direct, indirect, incidental, or consequential damages** arising from its use. The project is intended primarily for feature demonstration and learning; its architecture, security baseline, fault tolerance, and performance have **not** been validated to production-grade standards and are **not suitable for production environments or mission-critical scenarios**. Deploying it into production systems, exposing it as a public service, or wiring it into real business workflows is the user's own decision, and the author bears no responsibility for any resulting consequences.

## License

[MIT License](LICENSE) — Copyright (c) 2026 anyuer678

### License highlights

- ✅ Free to use, modify, and distribute (keep the copyright and license notices)
- ✅ Commercial use permitted
- ℹ️ Provided "AS IS", without warranty or liability (see the disclaimer above)
