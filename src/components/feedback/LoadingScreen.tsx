interface LoadingScreenProps {
  message: string;
  error?: Error;
  onRetry?: () => void;
}

export function LoadingScreen({
  message,
  error,
  onRetry,
}: LoadingScreenProps) {
  return (
    <div className="app-shell loading-shell">
      <div className="loading-backdrop" aria-hidden="true" />
      <main className="loading-card" aria-busy="true" aria-live="polite">
        <span className="spinner" aria-hidden="true" />
        <h1>{message}</h1>
        {error && <p className="feedback feedback-error">{error.message}</p>}
        {onRetry && (
          <button
            className="button button-secondary"
            type="button"
            onClick={onRetry}
          >
            Tentar novamente
          </button>
        )}
      </main>
    </div>
  );
}
