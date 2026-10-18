import type { Socket } from 'socket.io-client';

export type SocketEvents = Record<string, (...args: never[]) => void>;

export interface SocketClientOptions {
  url: string;
  accessToken: string;
  query?: Record<string, string>;
  autoConnect?: boolean;
}

export type SocketConnection<
  ServerEvents = SocketEvents,
  ClientEvents = SocketEvents,
> = Socket<ServerEvents & SocketEvents, ClientEvents & SocketEvents>;
