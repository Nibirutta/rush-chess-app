import {
  authenticationResponseSchema,
  loginRequestSchema,
  registerRequestSchema,
} from '../schemas/auth.schemas'
import type {
  AuthenticationResponse,
  LoginRequest,
  RegisterRequest,
} from '../schemas/auth.schemas'
import { httpClient } from '../../../lib/http'

export const register = async (
  payload: RegisterRequest,
): Promise<AuthenticationResponse> => {
  const validatedPayload = registerRequestSchema.parse(payload)

  return httpClient.request(
    {
      method: 'POST',
      path: '/player/register',
      body: validatedPayload,
    },
    authenticationResponseSchema,
  )
}

export const login = async (
  payload: LoginRequest,
): Promise<AuthenticationResponse> => {
  const validatedPayload = loginRequestSchema.parse(payload)

  return httpClient.request(
    {
      method: 'POST',
      path: '/player/login',
      body: validatedPayload,
    },
    authenticationResponseSchema,
  )
}

export const refresh = async (): Promise<AuthenticationResponse> =>
  httpClient.request(
    { method: 'GET', path: '/player/refresh' },
    authenticationResponseSchema,
  )

export const logout = async (): Promise<void> => {
  await httpClient.request<void>({ method: 'GET', path: '/player/logout' })
}
