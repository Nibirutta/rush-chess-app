import { useAuth } from '../../auth';
import { SiteFooter } from '../../../components/layout/SiteFooter';
import { SiteHeader } from '../../../components/layout/SiteHeader';

export function GameScreen() {
  const { profile, signOut } = useAuth();

  return (
    <div className="app-shell">
      <SiteHeader />
      <main className="game-layout">
        <section className="board-placeholder" aria-labelledby="board-title">
          <span className="eyebrow">Partida</span>
          <h1 id="board-title">Tabuleiro em breve</h1>
          <p>Este será o espaço central para sua próxima partida.</p>
        </section>
        <aside className="chat-placeholder" aria-labelledby="chat-title">
          <h2 id="chat-title">Chat</h2>
          <p>O chat da partida aparecerá aqui.</p>
        </aside>
      </main>
      <div className="session-bar">
        <span>Olá, {profile?.nickname ?? 'jogador'}!</span>
        <button
          className="button button-secondary"
          type="button"
          onClick={() => void signOut()}
        >
          Sair
        </button>
      </div>
      <SiteFooter />
    </div>
  );
}
