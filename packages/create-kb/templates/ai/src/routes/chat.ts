import { Router } from 'express'
import { z } from 'zod'
import { getClient } from '../lib/llm'
import { config } from '../config'

export const chatRouter = Router()

const messageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string(),
})

export const chatSchema = z.object({
  messages: z.array(messageSchema).min(1),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
})

/** 非流式对话：POST /chat */
chatRouter.post('/', async (req, res) => {
  const body = chatSchema.safeParse(req.body)
  if (!body.success) {
    res.status(400).json({ code: 400, message: '参数校验失败', errors: body.error.flatten() })
    return
  }
  const { messages, model, temperature } = body.data
  try {
    const completion = await getClient().chat.completions.create({
      model: model ?? config.defaultModel,
      messages,
      temperature: temperature ?? 0.7,
    })
    res.json({ content: completion.choices[0]?.message?.content ?? '', model: completion.model })
  } catch (error) {
    console.error('[chat error]', error)
    res.status(502).json({ code: 502, message: '调用模型服务失败，请检查 .env 配置' })
  }
})

/** 流式对话：POST /chat/stream（SSE） */
chatRouter.post('/stream', async (req, res) => {
  const body = chatSchema.safeParse(req.body)
  if (!body.success) {
    res.status(400).json({ code: 400, message: '参数校验失败' })
    return
  }
  const { messages, model, temperature } = body.data

  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()

  try {
    const stream = await getClient().chat.completions.create({
      model: model ?? config.defaultModel,
      messages,
      temperature: temperature ?? 0.7,
      stream: true,
    })
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content
      if (delta) res.write(`data: ${JSON.stringify({ delta })}\n\n`)
    }
    res.write('data: [DONE]\n\n')
  } catch (error) {
    console.error('[stream error]', error)
    res.write(`data: ${JSON.stringify({ error: '调用模型服务失败' })}\n\n`)
  } finally {
    res.end()
  }
})
