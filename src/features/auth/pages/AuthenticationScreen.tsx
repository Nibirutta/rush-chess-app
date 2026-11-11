import { useState } from 'react';
import { SiteFooter } from '../../../components/layout/SiteFooter';
import { SiteHeader } from '../../../components/layout/SiteHeader';
import { useAuth } from '../authContext';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';

type AuthenticationMode = 'login' | 'register';

interface AuthenticationScreenProps {
  error?: Error;
}

export function AuthenticationScreen({ error }: AuthenticationScreenProps) {
  const [mode, setMode] = useState<AuthenticationMode>('login');
  const { authenticate, createAccount } = useAuth();

  return (
    <div className="app-shell">
      <SiteHeader />
      <main className="page-content">
        <section className="authentication-card" aria-labelledby="auth-title">
          <div className="authentication-intro">
            <span className="eyebrow">Bem-vindo</span>
            <h1 id="auth-title">
              {mode === 'login' ? 'Entre para jogar' : 'Crie sua conta'}
            </h1>
            <p>
              {mode === 'login'
                ? 'Retome suas partidas e desafie novos jogadores.'
                : 'Junte-se ao Rush Chess e comece a jogar.'}
            </p>
          </div>

          <div className="authentication-tabs" aria-label="Tipo de acesso">
            <button
              className={`tab-button ${mode === 'login' ? 'tab-button-active' : 'tab-button-inactive'}`}
              type="button"
              aria-pressed={mode === 'login'}
              onClick={() => setMode('login')}
            >
              Entrar
            </button>
            <button
              className={`tab-button ${mode === 'register' ? 'tab-button-active' : 'tab-button-inactive'}`}
              type="button"
              aria-pressed={mode === 'register'}
              onClick={() => setMode('register')}
            >
              Registrar
            </button>
          </div>

          <div className="authentication-form-stage">
            {mode === 'login' ? (
              <LoginForm
                key="login"
                onSubmit={authenticate}
                backendError={error}
                onSwitchToRegister={() => setMode('register')}
              />
            ) : (
              <RegisterForm
                key="register"
                onSubmit={createAccount}
                backendError={error}
                onSwitchToLogin={() => setMode('login')}
              />
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
