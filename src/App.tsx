import { useAuth } from './features/auth';
import { AuthenticationScreen } from './features/auth/pages/AuthenticationScreen';
import { GameScreen } from './features/game/pages/GameScreen';
import { LoadingScreen } from './components/feedback/LoadingScreen';
import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/header.css';
import './styles/footer.css';
import './styles/components.css';
import './styles/auth.css';
import './styles/game.css';
import './styles/loading.css';

function App() {
  const auth = useAuth();

  switch (auth.status) {
    case 'checking':
      return <LoadingScreen message="Verificando sua sessão..." />;
    case 'logout_pending':
      return (
        <LoadingScreen
          message="Finalizando seu logout..."
          error={auth.error}
          onRetry={() => void auth.retryLogout()}
        />
      );
    case 'authenticated':
      return <GameScreen />;
    case 'unauthenticated':
      return <AuthenticationScreen error={auth.error} />;
  }
}

export default App;
