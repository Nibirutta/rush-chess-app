import { useState, type SubmitEvent } from 'react';
import {
  registerRequestSchema,
  type RegisterRequest,
} from '../schemas/auth.schemas';
import { PasswordVisibilityButton } from './PasswordVisibilityButton';

interface RegisterFormProps {
  onSubmit: (credentials: RegisterRequest) => Promise<void>;
  backendError?: Error;
  onSwitchToLogin: () => void;
}

export function RegisterForm({
  onSubmit,
  backendError,
  onSwitchToLogin,
}: RegisterFormProps) {
  const [nickname, setNickname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [arePasswordsVisible, setArePasswordsVisible] = useState(false);
  const [validationError, setValidationError] = useState<string>();
  const [submissionError, setSubmissionError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError(undefined);
    setSubmissionError(undefined);

    const result = registerRequestSchema.safeParse({
      nickname,
      username,
      password,
    });
    if (!result.success) {
      setValidationError(
        result.error.issues[0]?.message ?? 'Revise os dados informados.',
      );
      return;
    }

    if (password !== passwordConfirmation) {
      setValidationError('As senhas precisam ser iguais.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(result.data);
    } catch (error) {
      setSubmissionError(
        error instanceof Error
          ? error.message
          : 'Não foi possível concluir o cadastro.',
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
        <label htmlFor="register-nickname">Apelido</label>
        <input
          id="register-nickname"
          name="nickname"
          type="text"
          autoComplete="nickname"
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          disabled={isSubmitting}
          required
        />
      </div>
      <div className="form-field">
        <label htmlFor="register-username">Usuário</label>
        <input
          id="register-username"
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
        <label htmlFor="register-password">Senha</label>
        <div className="password-input-wrapper">
          <input
            id="register-password"
            name="password"
            type={arePasswordsVisible ? 'text' : 'password'}
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isSubmitting}
            required
          />
          <PasswordVisibilityButton
            isVisible={arePasswordsVisible}
            onToggle={() => setArePasswordsVisible((visible) => !visible)}
            disabled={isSubmitting}
          />
        </div>
        <small>
          Use de 8 a 20 caracteres, com letras maiúsculas, minúsculas, número e
          caractere especial.
        </small>
      </div>
      <div className="form-field">
        <label htmlFor="register-password-confirmation">Confirmar senha</label>
        <div className="password-input-wrapper">
          <input
            id="register-password-confirmation"
            name="passwordConfirmation"
            type={arePasswordsVisible ? 'text' : 'password'}
            autoComplete="new-password"
            value={passwordConfirmation}
            onChange={(event) => setPasswordConfirmation(event.target.value)}
            disabled={isSubmitting}
            required
          />
          <PasswordVisibilityButton
            isVisible={arePasswordsVisible}
            onToggle={() => setArePasswordsVisible((visible) => !visible)}
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
        {isSubmitting ? 'Criando conta...' : 'Criar conta'}
      </button>
      <p className="form-switch">
        Já tem uma conta?{' '}
        <button type="button" onClick={onSwitchToLogin} disabled={isSubmitting}>
          Entre aqui
        </button>
      </p>
    </form>
  );
}
