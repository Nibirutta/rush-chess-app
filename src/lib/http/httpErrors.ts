import type { ZodError } from 'zod';
import type { HttpError } from '../../types';

export class HttpRequestError extends Error {
  readonly status: number;
  readonly payload?: HttpError;

  constructor(message: string, status: number, payload?: HttpError) {
    super(message);
    this.name = 'HttpRequestError';
    this.status = status;
    this.payload = payload;
  }
}

export class HttpResponseValidationError extends Error {
  readonly status: number;
  readonly issues: ZodError['issues'];

  constructor(status: number, issues: ZodError['issues']) {
    super('A resposta do servidor não corresponde ao contrato esperado.');
    this.name = 'HttpResponseValidationError';
    this.status = status;
    this.issues = issues;
  }

  static fromZodError(status: number, error: ZodError) {
    return new HttpResponseValidationError(status, error.issues);
  }
}
