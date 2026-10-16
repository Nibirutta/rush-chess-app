import { z } from 'zod'
import type { SocketError } from '../../../types'

export const playerStatusSchema = z.enum([
  'READY',
  'NOT_READY',
  'AWAITING',
  'ON_BATTLE',
])

export const onlinePlayerSchema = z.object({
  playerID: z.uuid(),
  socketID: z.string().min(1),
  nickname: z.string().min(1),
  status: playerStatusSchema,
})

export const lobbyMessageSchema = z.object({
  message: z.string(),
})

export const lobbyMessagesResponseSchema = z.array(z.string())

export const sendMessagePayloadSchema = z.object({
  content: z.string().trim().min(1).max(200),
})

export const sendInvitePayloadSchema = z.object({
  opponentID: z.uuid(),
})

export const inviteResponsePayloadSchema = z.object({
  inviteID: z.uuid(),
  accepted: z.boolean(),
})

export const setPlayerStatusPayloadSchema = z.object({
  ready: z.boolean(),
})

export const inviteNotificationSchema = z.object({
  inviteID: z.uuid(),
  challenger: z.string().min(1),
})

export const inviteAcceptedNotificationSchema = z.object({
  matchID: z.uuid(),
})

export const inviteExpiredNotificationSchema = z.object({
  message: z.string(),
})

export const playerUpdateNotificationSchema = z.object({
  playerID: z.uuid(),
  status: playerStatusSchema,
})

export const lobbyMessagesRequestSchema = z.object({
  skip: z.number().int().nonnegative().optional(),
  amount: z.number().int().positive().optional(),
})

export type PlayerStatus = z.infer<typeof playerStatusSchema>
export type OnlinePlayer = z.infer<typeof onlinePlayerSchema>
export type LobbyMessage = z.infer<typeof lobbyMessageSchema>
export type SendMessagePayload = z.infer<typeof sendMessagePayloadSchema>
export type SendInvitePayload = z.infer<typeof sendInvitePayloadSchema>
export type InviteResponsePayload = z.infer<
  typeof inviteResponsePayloadSchema
>
export type SetPlayerStatusPayload = z.infer<
  typeof setPlayerStatusPayloadSchema
>
export type InviteNotification = z.infer<typeof inviteNotificationSchema>
export type InviteAcceptedNotification = z.infer<
  typeof inviteAcceptedNotificationSchema
>
export type InviteExpiredNotification = z.infer<
  typeof inviteExpiredNotificationSchema
>
export type PlayerUpdateNotification = z.infer<
  typeof playerUpdateNotificationSchema
>
export type LobbyMessagesRequest = z.infer<typeof lobbyMessagesRequestSchema>

export interface LobbyClientEvents {
  send_message: (payload: SendMessagePayload) => void
  send_invite: (payload: SendInvitePayload) => void
  invite_response: (payload: InviteResponsePayload) => void
  set_player_status: (payload: SetPlayerStatusPayload) => void
}

export interface LobbyServerEvents {
  notify_online_players: (players: OnlinePlayer[]) => void
  notify_message: (payload: LobbyMessage) => void
  notify_invite: (payload: InviteNotification) => void
  notify_invite_accepted: (payload: InviteAcceptedNotification) => void
  notify_invite_not_accepted: () => void
  notify_invite_expired: (payload: InviteExpiredNotification) => void
  notify_player_update: (payload: PlayerUpdateNotification) => void
  notify_exception: (payload: SocketError) => void
}
