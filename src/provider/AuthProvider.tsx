import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { PlayerInfo, RequestLoginType, SessionInfo } from "../types/playerServiceTypes";
import {
  requestLogin,
  requestLogout,
  requestRefresh,
} from "../api/player/playerService";
import { setAccessToken } from "../api/apiFetch";
import { addAccountEventListener, removeAccountEventListener } from "../api/accountEvents";
import { type IAuthContext, AuthContext } from "../context/AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [player, setPlayer] = useState<PlayerInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeToken, setActiveToken] = useState<string | null>(null);
  const wasRun = useRef(false);

  const login = useCallback(async (data: RequestLoginType) => {
    try {
      await requestLogin(data);
    } catch {
      setPlayer(null);
      setAccessToken(null);
      setActiveToken(null);
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
      setActiveToken(null);
    }
  }, []);

  useEffect(() => {
    async function CheckAuthStatus() {
      if (wasRun.current) return;

      wasRun.current = true;
      
      try {
        await requestRefresh();
      } catch {
        logout();
      } finally {
        setIsLoading(false);
      }
    }

    function HandleForceLogout() {
      logout();
    }

    function HandlePlayerInfo(event: Event) {
      const customEvent = event as CustomEvent<SessionInfo>;

      setPlayer(customEvent.detail.player);
      setAccessToken(customEvent.detail.activeToken);
      setActiveToken(customEvent.detail.activeToken);
    }
    
    addAccountEventListener('forceLogout', HandleForceLogout);
    addAccountEventListener('syncPlayer', HandlePlayerInfo);
    CheckAuthStatus();

    return () => {
      removeAccountEventListener('syncPlayer', HandlePlayerInfo);
      removeAccountEventListener('forceLogout', HandleForceLogout);
    }
  }, [logout]);

  const value = useMemo<IAuthContext>(
    () => ({
      isAuthenticated: !!player,
      player,
      isLoading,
      activeToken,
      login,
      logout,
    }),
    [login, logout, player, isLoading, activeToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
