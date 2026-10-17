import { io } from 'socket.io-client'

import type {
  SocketClientOptions,
  SocketConnection,
  SocketEvents,
} from './socketTypes'

export const createSocketClient = <
  ServerEvents extends SocketEvents = SocketEvents,
  ClientEvents extends SocketEvents = ServerEvents,
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
  }) as SocketConnection<ServerEvents, ClientEvents>

export const updateSocketAccessToken = (
  socket: SocketConnection,
  accessToken: string,
) => {
  socket.auth = {
    access_token: accessToken,
  }
}
