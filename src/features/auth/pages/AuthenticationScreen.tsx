import { SiteFooter } from '../../../components/layout/SiteFooter';
import { SiteHeader } from '../../../components/layout/SiteHeader';

interface AuthenticationScreenProps {
  error?: Error;
}

export function AuthenticationScreen({
  error,
}: AuthenticationScreenProps) {
  return (
    <div className="app-shell">
      <SiteHeader />
      <main className="page-content">
        <section className="placeholder-card" aria-labelledby="auth-title">
          <span className="eyebrow">Bem-vindo</span>
          <h1 id="auth-title">Entre para jogar</h1>
          <p>
            A tela de login e registro será adicionada na próxima etapa.
          </p>
          {error && <p className="feedback feedback-error">{error.message}</p>}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
