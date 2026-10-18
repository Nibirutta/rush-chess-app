import { env } from './env';

export const apiConfig = {
  serverUrl: env.SERVER_URL,
  lobbySocketUrl: env.LOBBY_SOCKET_URL,
  matchSocketUrl: env.MATCH_SOCKET_URL,
} as const;
