import { httpClient } from '../../../lib/http/httpClient';
import {
  lobbyMessagesResponseSchema,
  lobbyMessagesRequestSchema,
} from '../schemas/lobby.schemas';
import type { LobbyMessagesRequest } from '../schemas/lobby.schemas';

export const getMessages = async (
  request: LobbyMessagesRequest = {},
): Promise<string[]> => {
  const validatedRequest = lobbyMessagesRequestSchema.parse(request);

  return httpClient.request(
    {
      method: 'GET',
      path: '/lobby/messages',
      query: validatedRequest,
    },
    lobbyMessagesResponseSchema,
  );
};
