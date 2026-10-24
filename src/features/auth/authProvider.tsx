import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type PropsWithChildren,
} from 'react';

import { HttpRequestError } from '../../lib/http/httpErrors';
import { login, logout, refresh, register } from './services/authApi';
import {
  clearLogoutPending,
  hasPendingLogout,
  markLogoutPending,
} from './logoutPending';
import {
  AuthContext,
  type AuthenticatedResponse,
  type AuthState,
} from './authContext';
import type { LoginRequest, RegisterRequest } from './schemas/auth.schemas';

type AuthAction =
  | { type: 'authentication_started' }
  | { type: 'authentication_succeeded'; payload: AuthenticatedResponse }
  | { type: 'authentication_failed'; error: Error }
  | { type: 'session_check_failed'; error: Error; invalidate: boolean }
  | { type: 'logout_started' }
  | { type: 'logout_failed'; error: Error }
  | { type: 'logged_out' };

const initialState: AuthState = {
  status: 'checking',
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'authentication_started':
      return { ...state, status: 'checking', error: undefined };
    case 'authentication_succeeded':
      return {
        status: 'authenticated',
        profile: action.payload.profile,
        accessToken: action.payload.access_token,
        error: undefined,
      };
    case 'authentication_failed':
      return {
        status: 'unauthenticated',
        profile: undefined,
        accessToken: undefined,
        error: action.error,
      };
    case 'session_check_failed':
      return action.invalidate || state.status !== 'authenticated'
        ? {
            status: 'unauthenticated',
            profile: undefined,
            accessToken: undefined,
            error: action.error,
          }
        : { ...state, error: action.error };
    case 'logout_started':
      return {
        status: 'logout_pending',
        profile: undefined,
        accessToken: undefined,
        error: undefined,
      };
    case 'logout_failed':
      return {
        status: 'logout_pending',
        profile: undefined,
        accessToken: undefined,
        error: action.error,
      };
    case 'logged_out':
      return {
        status: 'unauthenticated',
        profile: undefined,
        accessToken: undefined,
        error: undefined,
      };
  }
};

const toError = (error: unknown): Error =>
  error instanceof Error
    ? error
    : new Error('Não foi possível concluir a operação de autenticação.');

const isInvalidSessionError = (error: unknown): boolean =>
  error instanceof HttpRequestError &&
  (error.status === 401 || error.status === 403);

export function AuthProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const hasBootstrapped = useRef(false);

  const applyAuthentication = useCallback((response: AuthenticatedResponse) => {
    dispatch({ type: 'authentication_succeeded', payload: response });
  }, []);

  const authenticate = useCallback(
    async (credentials: LoginRequest) => {
      dispatch({ type: 'authentication_started' });
      try {
        const response = await login(credentials);
        clearLogoutPending();
        applyAuthentication(response);
      } catch (error) {
        dispatch({ type: 'authentication_failed', error: toError(error) });
        throw error;
      }
    },
    [applyAuthentication],
  );

  const createAccount = useCallback(
    async (credentials: RegisterRequest) => {
      dispatch({ type: 'authentication_started' });
      try {
        const response = await register(credentials);
        clearLogoutPending();
        applyAuthentication(response);
      } catch (error) {
        dispatch({ type: 'authentication_failed', error: toError(error) });
        throw error;
      }
    },
    [applyAuthentication],
  );

  const retrySession = useCallback(async () => {
    if (hasPendingLogout()) {
      throw new Error(
        'O refresh está bloqueado enquanto o logout estiver pendente.',
      );
    }

    dispatch({ type: 'authentication_started' });
    try {
      applyAuthentication(await refresh());
    } catch (error) {
      const normalizedError = toError(error);
      dispatch({
        type: 'session_check_failed',
        error: isInvalidSessionError(error)
          ? new Error('A sessão expirou. Faça login novamente.')
          : normalizedError,
        invalidate: isInvalidSessionError(error),
      });
      throw error;
    }
  }, [applyAuthentication]);

  const completeLogout = useCallback(async () => {
    dispatch({ type: 'logout_started' });

    try {
      await logout();
      clearLogoutPending();
      dispatch({ type: 'logged_out' });
    } catch (error) {
      const normalizedError = toError(error);
      dispatch({ type: 'logout_failed', error: normalizedError });
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    markLogoutPending();
    await completeLogout();
  }, [completeLogout]);

  const retryLogout = useCallback(async () => {
    markLogoutPending();
    await completeLogout();
  }, [completeLogout]);

  useEffect(() => {
    if (hasBootstrapped.current) {
      return;
    }

    hasBootstrapped.current = true;
    try {
      if (hasPendingLogout()) {
        void retryLogout().catch(() => undefined);
        return;
      }

      void retrySession().catch(() => undefined);
    } catch (error) {
      dispatch({ type: 'logout_failed', error: toError(error) });
    }
  }, [retryLogout, retrySession]);

  const value = useMemo(
    () => ({
      ...state,
      authenticate,
      createAccount,
      signOut,
      retryLogout,
      retrySession,
    }),
    [authenticate, createAccount, retryLogout, retrySession, signOut, state],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
