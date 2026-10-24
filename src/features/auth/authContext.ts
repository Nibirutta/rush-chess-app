import { createContext, useContext } from 'react';
import type {
  AuthenticationResponse,
  LoginRequest,
  PlayerProfile,
  RegisterRequest,
} from './schemas/auth.schemas';

export type AuthenticationStatus =
  'checking' | 'authenticated' | 'unauthenticated' | 'logout_pending';

export interface AuthState {
  status: AuthenticationStatus;
  profile?: PlayerProfile;
  accessToken?: string;
  error?: Error;
}

export interface AuthContextValue extends AuthState {
  authenticate(credentials: LoginRequest): Promise<void>;
  createAccount(credentials: RegisterRequest): Promise<void>;
  signOut(): Promise<void>;
  retryLogout(): Promise<void>;
  retrySession(): Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider.');
  }

  return context;
};

export type AuthenticatedResponse = AuthenticationResponse;
