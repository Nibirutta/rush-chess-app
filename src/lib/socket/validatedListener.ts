import type { ZodType } from 'zod';

import { SocketPayloadValidationError } from './socketErrors';
import type { SocketConnection } from './socketTypes';

export const parseValidated = <T>(
  event: string,
  schema: ZodType<T>,
  payload: unknown,
): T => {
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    throw new SocketPayloadValidationError(event, parsed.error);
  }
  return parsed.data;
};

export const listenValidated = <T>(
  socket: SocketConnection,
  event: string,
  schema: ZodType<T>,
  handler: (payload: T) => void,
  onValidationError?: (error: SocketPayloadValidationError) => void,
) => {
  const listener = (payload: unknown) => {
    try {
      handler(parseValidated(event, schema, payload));
    } catch (error) {
      if (!(error instanceof SocketPayloadValidationError)) {
        throw error;
      }
      if (onValidationError) {
        onValidationError(error);
        return;
      }
      throw error;
    }
  };

  socket.on(event, listener);
  return () => socket.off(event, listener);
};
