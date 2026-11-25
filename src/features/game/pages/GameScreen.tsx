import { useState } from 'react';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SiteFooter } from '../../../components/layout/SiteFooter';
import { SiteHeader } from '../../../components/layout/SiteHeader';

export function GameScreen() {
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);

  return (
    <div className="app-shell">
      <SiteHeader />
      <div className="game-screen-content">
        <main className="game-layout"></main>
        <div
          id="game-menu-panel"
          className={`game-menu${isMenuExpanded ? ' is-expanded' : ''}`}
          onClick={() => setIsMenuExpanded((expanded) => !expanded)}
        >
          <button
            className="game-menu-toggle"
            type="button"
            aria-label={isMenuExpanded ? 'Recolher menu' : 'Expandir menu'}
            aria-expanded={isMenuExpanded}
            aria-controls="game-menu-panel"
          >
            <FontAwesomeIcon
              className={`game-menu-icon${isMenuExpanded ? ' is-expanded' : ''}`}
              icon={faChevronUp}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
