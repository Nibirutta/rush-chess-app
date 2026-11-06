import { useState, type SubmitEvent } from 'react';
import { loginRequestSchema, type LoginRequest } from '../schemas/auth.schemas';
import { PasswordVisibilityButton } from './PasswordVisibilityButton';

interface LoginFormProps {
  onSubmit: (credentials: LoginRequest) => Promise<void>;
  backendError?: Error;
  onSwitchToRegister: () => void;
}

export function LoginForm({
  onSubmit,
  backendError,
  onSwitchToRegister,
}: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [validationError, setValidationError] = useState<string>();
  const [submissionError, setSubmissionError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError(undefined);
    setSubmissionError(undefined);

    const result = loginRequestSchema.safeParse({ username, password });
    if (!result.success) {
      setValidationError(
        result.error.issues[0]?.message ?? 'Revise os dados informados.',
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(result.data);
    } catch (error) {
      setSubmissionError(
        error instanceof Error
          ? error.message
          : 'Não foi possível concluir o login.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formError = validationError ?? submissionError ?? backendError?.message;

  return (
    <form
      className="authentication-form"
      onSubmit={(event) => void handleSubmit(event)}
    >
      <div className="form-field">
        <label htmlFor="login-username">Usuário</label>
        <input
          id="login-username"
          name="username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          disabled={isSubmitting}
          required
        />
      </div>
      <div className="form-field">
        <label htmlFor="login-password">Senha</label>
        <div className="password-input-wrapper">
          <input
            id="login-password"
            name="password"
            type={isPasswordVisible ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isSubmitting}
            required
          />
          <PasswordVisibilityButton
            isVisible={isPasswordVisible}
            onToggle={() => setIsPasswordVisible((visible) => !visible)}
            disabled={isSubmitting}
          />
        </div>
      </div>
      {formError && (
        <p className="form-error" role="alert">
          {formError}
        </p>
      )}
      <button
        className="button button-primary"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </button>
      <p className="form-switch">
        Ainda não tem uma conta?{' '}
        <button
          type="button"
          onClick={onSwitchToRegister}
          disabled={isSubmitting}
        >
          Registre-se
        </button>
      </p>
    </form>
  );
}
