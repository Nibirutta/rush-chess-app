import { apiConfig } from '../../../config/apiConfig';
import { createSocketClient, type SocketConnection } from '../../../lib/socket';
import { SocketPayloadValidationError } from '../../../lib/socket/socketErrors';
import { listenValidated } from '../../../lib/socket/validatedListener';
import { parseValidated } from '../../../lib/socket/validatedListener';
import { socketErrorSchema, type SocketError } from '../../../types';
import {
  boardPositionSchema,
  finishedMatchSchema,
  getAvailableMovesPayloadSchema,
  makeMovePayloadSchema,
  matchSchema,
  type BoardPosition,
  type FinishedMatch,
  type Match,
  type MatchClientEvents,
  type MatchServerEvents,
  type PromotionPiece,
} from '../schemas/match.schemas';

export interface MatchSocketOptions {
  accessToken: string;
  matchID: string;
  autoConnect?: boolean;
  onValidationError?: (error: SocketPayloadValidationError) => void;
}

export interface MatchSocketAdapter {
  socket: SocketConnection<MatchServerEvents, MatchClientEvents>;
  getAvailableMoves(piecePosition: BoardPosition): void;
  makeMove(
    from: BoardPosition,
    to: BoardPosition,
    promotion?: PromotionPiece,
  ): void;
  requestDraw(): void;
  requestSurrender(): void;
  leaveMatch(): void;
  onLoadMatch(handler: (match: Match) => void): () => void;
  onMatchUpdate(handler: (match: Match) => void): () => void;
  onAvailableMoves(handler: (moves: BoardPosition[]) => void): () => void;
  onPlayerInCheck(handler: (positions: BoardPosition[]) => void): () => void;
  onFinishedMatch(handler: (match: FinishedMatch) => void): () => void;
  onInvalidMatch(handler: () => void): () => void;
  onException(handler: (error: SocketError) => void): () => void;
}

export const createMatchSocket = ({
  accessToken,
  matchID,
  autoConnect,
  onValidationError,
}: MatchSocketOptions): MatchSocketAdapter => {
  const socket = createSocketClient<MatchServerEvents, MatchClientEvents>({
    url: apiConfig.matchSocketUrl,
    accessToken,
    autoConnect,
    query: { matchID },
  });

  return {
    socket,
    getAvailableMoves: (piecePosition) =>
      socket.emit(
        'get_available_moves',
        parseValidated('get_available_moves', getAvailableMovesPayloadSchema, {
          piecePosition,
        }),
      ),
    makeMove: (from, to, promotion) =>
      socket.emit(
        'make_move',
        parseValidated('make_move', makeMovePayloadSchema, {
          from,
          to,
          promotion,
        }),
      ),
    requestDraw: () => socket.emit('request_draw'),
    requestSurrender: () => socket.emit('request_surrender'),
    leaveMatch: () => socket.emit('leave_match'),
    onLoadMatch: (handler) =>
      listenValidated(
        socket,
        'notify_load_match',
        matchSchema,
        handler,
        onValidationError,
      ),
    onMatchUpdate: (handler) =>
      listenValidated(
        socket,
        'notify_match_update',
        matchSchema,
        handler,
        onValidationError,
      ),
    onAvailableMoves: (handler) =>
      listenValidated(
        socket,
        'notify_available_moves',
        boardPositionSchema.array(),
        handler,
        onValidationError,
      ),
    onPlayerInCheck: (handler) =>
      listenValidated(
        socket,
        'notify_player_in_check',
        boardPositionSchema.array(),
        handler,
        onValidationError,
      ),
    onFinishedMatch: (handler) =>
      listenValidated(
        socket,
        'notify_finished_match',
        finishedMatchSchema,
        handler,
        onValidationError,
      ),
    onInvalidMatch: (handler) => {
      socket.on('notify_invalid_match', handler);
      return () => socket.off('notify_invalid_match', handler);
    },
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
