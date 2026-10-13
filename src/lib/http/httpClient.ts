import { apiConfig } from '../../config/apiConfig'
import { httpErrorSchema } from '../../types'
import { HttpRequestError, HttpResponseValidationError } from './httpErrors'
import type {
  HttpClientOptions,
  HttpRequestOptions,
  ResponseSchema,
} from './httpTypes'

const buildUrl = (
  baseUrl: string,
  path: string,
  query?: Record<string, string | number | undefined>,
) => {
  const url = new URL(path, `${baseUrl}/`)

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value))
      }
    })
  }

  return url
}

const readJson = async (response: Response): Promise<unknown> => {
  if (response.status === 204) {
    return undefined
  }

  const contentType = response.headers.get('content-type')
  if (!contentType?.includes('application/json')) {
    throw new HttpRequestError(
      'O servidor retornou uma resposta em formato inesperado.',
      response.status,
    )
  }

  return response.json()
}

export class HttpClient {
  private readonly baseUrl: string

  constructor({ baseUrl }: HttpClientOptions) {
    this.baseUrl = baseUrl
  }

  async request<T>(
    options: HttpRequestOptions,
    responseSchema?: ResponseSchema<T>,
  ): Promise<T> {
    const url = buildUrl(this.baseUrl, options.path, options.query)
    const response = await fetch(url, {
      method: options.method,
      credentials: 'include',
      headers: options.body === undefined
        ? undefined
        : { 'Content-Type': 'application/json' },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: options.signal,
    })

    const payload = await readJson(response)

    if (!response.ok) {
      const parsedError = httpErrorSchema.safeParse(payload)
      if (parsedError.success) {
        throw new HttpRequestError(
          parsedError.data.message,
          response.status,
          parsedError.data,
        )
      }

      throw new HttpRequestError(
        `A requisição falhou com status ${response.status}, erro indefinido.`,
        response.status,
      )
    }

    if (responseSchema === undefined) {
      return payload as T
    }

    const parsedResponse = responseSchema.safeParse(payload)
    if (!parsedResponse.success) {
      throw HttpResponseValidationError.fromZodError(
        response.status,
        parsedResponse.error,
      )
    }

    return parsedResponse.data
  }
}

export const httpClient = new HttpClient({ baseUrl: apiConfig.serverUrl })
