import { createContext } from "react";
import type { RequestLoginType, PlayerInfo } from "../types/playerServiceTypes";

export type IAuthContext = {
  player: PlayerInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: RequestLoginType) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<IAuthContext | undefined>(undefined);
