import { z } from 'zod';

export const httpErrorSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  error: z.string(),
  timestamp: z.iso.datetime({ offset: true }),
  details: z.array(z.unknown()).optional(),
});

export const socketErrorSchema = z.object({
  message: z.string(),
  error: z.string(),
  timestamp: z.iso.datetime({ offset: true }),
  details: z.array(z.unknown()).optional(),
});

export type HttpError = z.infer<typeof httpErrorSchema>;
export type SocketError = z.infer<typeof socketErrorSchema>;
