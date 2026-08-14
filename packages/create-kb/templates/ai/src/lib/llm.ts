import OpenAI from 'openai'
import { config } from '../config'

let client: OpenAI | null = null

/** 单例 OpenAI 客户端（兼容协议：DeepSeek/Moonshot/Ollama 等） */
export function getClient(): OpenAI {
  if (!client) {
    client = new OpenAI({
      apiKey: config.apiKey || 'sk-placeholder',
      baseURL: config.baseURL,
    })
  }
  return client
}

/** 可选模型列表（按服务能力增减） */
export const modelOptions = [
  { label: 'GPT-4o mini', value: 'gpt-4o-mini' },
  { label: 'GPT-4o', value: 'gpt-4o' },
  { label: 'DeepSeek Chat', value: 'deepseek-chat' },
  { label: 'DeepSeek Reasoner', value: 'deepseek-reasoner' },
  { label: '本地 Ollama', value: 'llama3.1' },
]
