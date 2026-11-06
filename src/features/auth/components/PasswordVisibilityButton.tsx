interface PasswordVisibilityButtonProps {
  isVisible: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function PasswordVisibilityButton({
  isVisible,
  onToggle,
  disabled = false,
}: PasswordVisibilityButtonProps) {
  const label = isVisible ? 'Ocultar senha' : 'Mostrar senha';

  return (
    <button
      className="password-visibility-button"
      type="button"
      aria-label={label}
      aria-pressed={isVisible}
      title={label}
      onClick={onToggle}
      disabled={disabled}
    >
      <svg
        aria-hidden="true"
        className="password-visibility-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {isVisible ? (
          <>
            <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
            <circle cx="12" cy="12" r="2.5" />
          </>
        ) : (
          <>
            <path d="m3 3 18 18" />
            <path d="M10.6 6.2A10.7 10.7 0 0 1 12 6c6 0 9.5 6 9.5 6a17.5 17.5 0 0 1-3.1 3.8" />
            <path d="M6.5 6.7C3.9 8.3 2.5 12 2.5 12s3.5 6 9.5 6a9.7 9.7 0 0 0 3-.5" />
          </>
        )}
      </svg>
    </button>
  );
}
