---
'@yuer678/kb-utils': patch
'@yuer678/kb-api': patch
'@yuer678/create-kb': patch
'kb-ui-vue': patch
---

npm 页面观感补齐：为 kb-utils / kb-ui-vue / create-kb 补包级 README（此前 npm 页面显示 "No README data found"）；为 kb-ui-vue 与 create-kb 补 package.json description；create-kb `--template` 帮助文案列全 7 种模板并修正 description 中残留的旧包名 `@kb/ui`；kb-api 与 create-kb 的版本号改为运行时读取自身 package.json（此前 `/health` 与 `--version` 硬编码 0.1.0）。
