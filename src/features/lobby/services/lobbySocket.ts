import { apiConfig } from '../../../config/apiConfig';
import { createSocketClient, type SocketConnection } from '../../../lib/socket';
import { SocketPayloadValidationError } from '../../../lib/socket/socketErrors';
import { listenValidated } from '../../../lib/socket/validatedListener';
import { parseValidated } from '../../../lib/socket/validatedListener';
import {
  inviteResponsePayloadSchema,
  sendInvitePayloadSchema,
  sendMessagePayloadSchema,
  setPlayerStatusPayloadSchema,
  type InviteAcceptedNotification,
  type InviteExpiredNotification,
  type InviteNotification,
  type InviteResponsePayload,
  type LobbyClientEvents,
  type LobbyMessage,
  type LobbyServerEvents,
  type OnlinePlayer,
  type PlayerUpdateNotification,
  type SendMessagePayload,
} from '../schemas/lobby.schemas';
import {
  inviteAcceptedNotificationSchema,
  inviteExpiredNotificationSchema,
  inviteNotificationSchema,
  lobbyMessageSchema,
  onlinePlayerSchema,
  playerUpdateNotificationSchema,
} from '../schemas/lobby.schemas';
import { socketErrorSchema, type SocketError } from '../../../types';

export interface LobbySocketOptions {
  accessToken: string;
  autoConnect?: boolean;
  onValidationError?: (error: SocketPayloadValidationError) => void;
}

export interface LobbySocketAdapter {
  socket: SocketConnection<LobbyServerEvents, LobbyClientEvents>;
  sendMessage(payload: SendMessagePayload): void;
  sendInvite(opponentID: string): void;
  respondToInvite(payload: InviteResponsePayload): void;
  setPlayerStatus(ready: boolean): void;
  onOnlinePlayers(handler: (players: OnlinePlayer[]) => void): () => void;
  onMessage(handler: (message: LobbyMessage) => void): () => void;
  onInvite(handler: (invite: InviteNotification) => void): () => void;
  onInviteAccepted(
    handler: (notification: InviteAcceptedNotification) => void,
  ): () => void;
  onInviteNotAccepted(handler: () => void): () => void;
  onInviteExpired(
    handler: (notification: InviteExpiredNotification) => void,
  ): () => void;
  onPlayerUpdate(
    handler: (notification: PlayerUpdateNotification) => void,
  ): () => void;
  onException(handler: (error: SocketError) => void): () => void;
}

export const createLobbySocket = ({
  accessToken,
  autoConnect,
  onValidationError,
}: LobbySocketOptions): LobbySocketAdapter => {
  const socket = createSocketClient<LobbyServerEvents, LobbyClientEvents>({
    url: apiConfig.lobbySocketUrl,
    accessToken,
    autoConnect,
  });

  return {
    socket,
    sendMessage: (payload) =>
      socket.emit(
        'send_message',
        parseValidated('send_message', sendMessagePayloadSchema, payload),
      ),
    sendInvite: (opponentID) => {
      const payload = parseValidated('send_invite', sendInvitePayloadSchema, {
        opponentID,
      });
      socket.emit('send_invite', payload);
    },
    respondToInvite: (payload) =>
      socket.emit(
        'invite_response',
        parseValidated('invite_response', inviteResponsePayloadSchema, payload),
      ),
    setPlayerStatus: (ready) =>
      socket.emit(
        'set_player_status',
        parseValidated('set_player_status', setPlayerStatusPayloadSchema, {
          ready,
        }),
      ),
    onOnlinePlayers: (handler) =>
      listenValidated(
        socket,
        'notify_online_players',
        onlinePlayerSchema.array(),
        handler,
        onValidationError,
      ),
    onMessage: (handler) =>
      listenValidated(
        socket,
        'notify_message',
        lobbyMessageSchema,
        handler,
        onValidationError,
      ),
    onInvite: (handler) =>
      listenValidated(
        socket,
        'notify_invite',
        inviteNotificationSchema,
        handler,
        onValidationError,
      ),
    onInviteAccepted: (handler) =>
      listenValidated(
        socket,
        'notify_invite_accepted',
        inviteAcceptedNotificationSchema,
        handler,
        onValidationError,
      ),
    onInviteNotAccepted: (handler) => {
      socket.on('notify_invite_not_accepted', handler);
      return () => socket.off('notify_invite_not_accepted', handler);
    },
    onInviteExpired: (handler) =>
      listenValidated(
        socket,
        'notify_invite_expired',
        inviteExpiredNotificationSchema,
        handler,
        onValidationError,
      ),
    onPlayerUpdate: (handler) =>
      listenValidated(
        socket,
        'notify_player_update',
        playerUpdateNotificationSchema,
        handler,
        onValidationError,
      ),
    onException: (handler) =>
      listenValidated(
        socket,
        'notify_exception',
        socketErrorSchema,
        handler,
        onValidationError,
      ),
  };
};
