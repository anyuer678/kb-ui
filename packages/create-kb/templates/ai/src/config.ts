/** 环境配置（启动时校验，缺失给出明确提示） */
export const config = {
  apiKey: process.env.OPENAI_API_KEY ?? '',
  baseURL: process.env.OPENAI_BASE_URL ?? 'https://api.openai.com/v1',
  defaultModel: process.env.DEFAULT_MODEL ?? 'gpt-4o-mini',
  port: Number(process.env.PORT ?? 3000),
}

export function checkConfig(): void {
  if (!config.apiKey) {
    console.warn('⚠ 未设置 OPENAI_API_KEY（复制 .env.example 为 .env 并填写）')
  }
}
