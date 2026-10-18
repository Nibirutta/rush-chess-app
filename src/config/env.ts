import { z } from 'zod';

const envSchema = z.object({
  SERVER_URL: z.url(),
  LOBBY_SOCKET_URL: z.url(),
  MATCH_SOCKET_URL: z.url(),
});

export const env = envSchema.parse({
  SERVER_URL: import.meta.env.SERVER_URL,
  LOBBY_SOCKET_URL: import.meta.env.LOBBY_SOCKET_URL,
  MATCH_SOCKET_URL: import.meta.env.MATCH_SOCKET_URL,
});
