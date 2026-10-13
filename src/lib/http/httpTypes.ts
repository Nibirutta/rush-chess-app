import type { z } from 'zod'

export type HttpMethod = 'GET' | 'POST'

export interface HttpRequestOptions {
  method: HttpMethod
  path: string
  body?: unknown
  query?: Record<string, string | number | undefined>
  signal?: AbortSignal
}

export interface HttpClientOptions {
  baseUrl: string
}

export type ResponseSchema<T> = z.ZodType<T>
