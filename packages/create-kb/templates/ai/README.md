# {{projectName}} · AI 工作台模板

OpenAI 兼容协议的 LLM 接入骨架：非流式 + SSE 流式对话、多模型切换、温度调节、内置聊天前端。

## 快速开始

```bash
cp .env.example .env    # 填入 OPENAI_API_KEY（可选换 baseURL）
pnpm install
pnpm dev                # http://localhost:3000
```

支持任意 OpenAI 兼容服务：OpenAI / DeepSeek / Moonshot / Ollama（本地）——改 `.env` 的 `OPENAI_BASE_URL` 即可。

## 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | / | 内置聊天页面 |
| POST | /chat | 非流式对话 |
| POST | /chat/stream | SSE 流式对话 |

## 结构

```
src/
├── app.ts          # Express 应用（可测试）
├── config.ts       # 环境配置 + 启动校验
├── lib/llm.ts      # OpenAI 客户端单例 + 模型列表
└── routes/chat.ts  # 对话路由（zod 校验 + 流式）
public/             # 聊天前端（原生 JS）
test/               # 校验层单测
```

## 扩展

- 加角色：messages 支持 system 指令，前端或服务端预设
- 加 Skill：在 chat 路由前加命令解析（如 /sql），命中则拼入 system
- 会话持久化：把 history 存入数据库/文件
