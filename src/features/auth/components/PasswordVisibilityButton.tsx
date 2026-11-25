import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
      <FontAwesomeIcon
        aria-hidden="true"
        className="password-visibility-icon"
        icon={isVisible ? faEye : faEyeSlash}
      />
    </button>
  );
}
