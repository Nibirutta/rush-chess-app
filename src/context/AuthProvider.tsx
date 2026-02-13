import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { PlayerInfo, RequestLoginType } from "../types/playerServiceTypes";
import {
  requestLogin,
  requestLogout,
  requestRefresh,
} from "../api/player/playerService";
import { setAccessToken } from "../api/apiFetch";
import { addAccountEventListener } from "../api/accountEvents";
import { type IAuthContext, AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [player, setPlayer] = useState<PlayerInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const wasRun = useRef(false);

  const login = useCallback(async (data: RequestLoginType) => {
    try {
      const response = await requestLogin(data);

      setPlayer(response.player);
      setAccessToken(response.accessToken);
    } catch {
      setPlayer(null);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await requestLogout();
    } catch {
      // Empty for now
    } finally {
      setPlayer(null);
      setAccessToken(null);
    }
  }, []);

  useEffect(() => {
    async function CheckAuthStatus() {
      if (wasRun.current) return;

      wasRun.current = true;

      try {
        const response = await requestRefresh();

        setPlayer(response.player);
        setAccessToken(response.accessToken);
      } catch {
        logout();
      } finally {
        setIsLoading(false);
      }
    }

    function HandleForceLogout() {
      logout();
    }

    CheckAuthStatus();
    addAccountEventListener("forceLogout", HandleForceLogout);
  }, [logout]);

  const value = useMemo<IAuthContext>(
    () => ({
      isAuthenticated: !!player,
      player,
      isLoading,
      login,
      logout,
    }),
    [login, logout, player, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
