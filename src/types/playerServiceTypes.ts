export interface PlayerInfo {
  createdAt: string;
  id: string;
  nickname: string;
  updatedAt: string;
  username: string;
}

export interface SessionInfo {
  player: PlayerInfo,
  activeToken: string,
}

// Requests

export interface RequestLoginType {
  username: string;
  password: string;
}

// Responses

export interface ResponseLoginType {
  accessToken: string;
  player: PlayerInfo;
}

export interface ResponseRefreshType {
  accessToken: string;
  player: PlayerInfo;
}
