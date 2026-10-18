import { io } from 'socket.io-client';

import type {
  SocketClientOptions,
  SocketConnection,
  SocketEvents,
} from './socketTypes';

export const createSocketClient = <
  ServerEvents = SocketEvents,
  ClientEvents = SocketEvents,
>({
  url,
  accessToken,
  query,
  autoConnect = true,
}: SocketClientOptions): SocketConnection<ServerEvents, ClientEvents> =>
  io(url, {
    autoConnect,
    withCredentials: true,
    auth: {
      access_token: accessToken,
    },
    query,
  }) as SocketConnection<ServerEvents, ClientEvents>;
