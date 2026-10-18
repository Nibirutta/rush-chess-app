import type { ZodError } from 'zod';

export class SocketPayloadValidationError extends Error {
  readonly event: string;
  readonly issues: ZodError['issues'];

  constructor(event: string, error: ZodError) {
    super(`O payload do evento "${event}" não corresponde ao contrato.`);
    this.name = 'SocketPayloadValidationError';
    this.event = event;
    this.issues = error.issues;
  }
}
