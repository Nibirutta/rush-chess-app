import { z } from 'zod';
import type { SocketError } from '../../../types';

export const matchStateSchema = z.enum(['waiting', 'started']);
export const chessColorSchema = z.enum(['w', 'b']);
export const promotionPieceSchema = z.enum(['q', 'r', 'b', 'n']);
export const boardPositionSchema = z.templateLiteral([
  z.enum(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']),
  z.enum(['1', '2', '3', '4', '5', '6', '7', '8']),
]);

export const matchSchema = z.object({
  matchID: z.uuid(),
  matchState: matchStateSchema,
  turn: chessColorSchema,
  fenHistory: z.array(z.string()),
  playerWhiteID: z.uuid(),
  isWhiteConnected: z.boolean(),
  playerBlackID: z.uuid(),
  isBlackConnected: z.boolean(),
  spectators: z.array(z.string()),
  drawAvailable: z.boolean(),
});

export const getAvailableMovesPayloadSchema = z.object({
  piecePosition: boardPositionSchema,
});

export const makeMovePayloadSchema = z.object({
  from: boardPositionSchema,
  to: boardPositionSchema,
  promotion: promotionPieceSchema.optional(),
});

export const matchFinishedReasonSchema = z.enum([
  'Abandoned',
  'Expired',
  'Draw',
  'Checkmate',
  'Surrendered',
]);

export const drawTypeSchema = z.enum([
  'Draw by fifty moves',
  'Draw by insufficient materials',
  'Draw by stalemate',
  'Draw by threefold repetition',
]);

export const finishedMatchSchema = z.object({
  matchID: z.uuid(),
  reason: matchFinishedReasonSchema,
  playerIDs: z.array(z.uuid()),
  winnerID: z.uuid().optional(),
  loserID: z.uuid().optional(),
  drawType: drawTypeSchema.optional(),
});

export type MatchState = z.infer<typeof matchStateSchema>;
export type ChessColor = z.infer<typeof chessColorSchema>;
export type PromotionPiece = z.infer<typeof promotionPieceSchema>;
export type BoardPosition = z.infer<typeof boardPositionSchema>;
export type Match = z.infer<typeof matchSchema>;
export type GetAvailableMovesPayload = z.infer<
  typeof getAvailableMovesPayloadSchema
>;
export type MakeMovePayload = z.infer<typeof makeMovePayloadSchema>;
export type MatchFinishedReason = z.infer<typeof matchFinishedReasonSchema>;
export type DrawType = z.infer<typeof drawTypeSchema>;
export type FinishedMatch = z.infer<typeof finishedMatchSchema>;

export interface MatchClientEvents {
  get_available_moves: (payload: GetAvailableMovesPayload) => void;
  make_move: (payload: MakeMovePayload) => void;
  request_draw: () => void;
  request_surrender: () => void;
  leave_match: () => void;
}

export interface MatchServerEvents {
  notify_load_match: (payload: Match) => void;
  notify_match_update: (payload: Match) => void;
  notify_available_moves: (moves: BoardPosition[]) => void;
  notify_player_in_check: (attackingPositions: BoardPosition[]) => void;
  notify_finished_match: (payload: FinishedMatch) => void;
  notify_invalid_match: () => void;
  notify_exception: (payload: SocketError) => void;
}
