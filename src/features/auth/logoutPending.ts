const LOGOUT_PENDING_KEY = 'rush-chess:logout-pending';

const storageError = (operation: string, error: unknown): Error =>
  new Error(
    `Não foi possível ${operation} o estado pendente de logout no navegador.`,
    { cause: error },
  );

export const hasPendingLogout = (): boolean => {
  try {
    return localStorage.getItem(LOGOUT_PENDING_KEY) === 'true';
  } catch (error) {
    throw storageError('ler', error);
  }
};

export const markLogoutPending = (): void => {
  try {
    localStorage.setItem(LOGOUT_PENDING_KEY, 'true');
  } catch (error) {
    throw storageError('salvar', error);
  }
};

export const clearLogoutPending = (): void => {
  try {
    localStorage.removeItem(LOGOUT_PENDING_KEY);
  } catch (error) {
    throw storageError('remover', error);
  }
};
