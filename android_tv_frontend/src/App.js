import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './App.css';

const CONTENT_DETAILS = {
  badge: 'Featured',
  title: 'The Last Voyage',
  metadata: ['2026', 'Action', '2h 08m', '4K', 'Dolby Atmos'],
  description:
    'A stranded crew races across hostile waters to expose a global conspiracy before the final signal disappears forever.',
  supportingInfo: [
    'Remote: Use arrow keys to move focus',
    'Press Enter to confirm selection',
  ],
  actions: [
    {
      id: 'watch-now',
      label: 'Watch Now',
      variant: 'primary',
      statusMessage: 'Launching Watch Now. Playback starting…',
    },
    {
      id: 'trailer',
      label: 'Trailer',
      variant: 'secondary',
      statusMessage: 'Opening Trailer. Preview is now ready.',
    },
    {
      id: 'watchlist',
      label: 'Add to Watchlist',
      variant: 'secondary',
      statusMessage: 'Saved to Watchlist.',
    },
  ],
};

const FOCUSABLE_ROW = {
  ACTIONS: 'actions',
};

/**
 * Returns a formatted date/time object for the TV system clock.
 *
 * Contract:
 * - Inputs: none.
 * - Outputs: object containing formatted time, weekday, and dayMonth strings.
 * - Errors: none expected; relies on built-in Date and locale formatting.
 * - Side effects: none.
 */
function getFormattedClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return {
    time: `${hours}:${minutes}`,
    weekday: now.toLocaleDateString('en-US', { weekday: 'short' }),
    dayMonth: now.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
    }),
  };
}

/**
 * Creates a focus grid description for TV D-pad navigation.
 *
 * Contract:
 * - Inputs: array of action definitions with stable ids.
 * - Outputs: array of focus target descriptors in row order.
 * - Errors: none; empty arrays produce an empty focus model.
 * - Side effects: none.
 */
function buildFocusTargets(actions) {
  return actions.map((action, index) => ({
    id: action.id,
    row: FOCUSABLE_ROW.ACTIONS,
    index,
  }));
}

// PUBLIC_INTERFACE
function App() {
  /**
   * ContentInfoTvFlow is the single reusable entrypoint for rendering and
   * operating the TV content-details experience. Inputs are static content
   * metadata plus keyboard events; outputs are focus position, status text, and
   * rendered UI. Failures are limited to browser event/runtime issues and are
   * surfaced by React. Side effects include document-level key handling and a
   * recurring clock update timer.
   */
  const focusTargets = useMemo(
    () => buildFocusTargets(CONTENT_DETAILS.actions),
    []
  );
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Focus is on Watch Now.');
  const [clock, setClock] = useState(() => getFormattedClock());

  const applyFocus = useCallback(
    (nextIndex) => {
      if (!focusTargets.length) {
        return;
      }

      const normalizedIndex =
        (nextIndex + focusTargets.length) % focusTargets.length;
      const nextTarget = focusTargets[normalizedIndex];
      const nextAction = CONTENT_DETAILS.actions[nextTarget.index];

      setFocusedIndex(normalizedIndex);
      setStatusMessage(`Focus is on ${nextAction.label}.`);
    },
    [focusTargets]
  );

  const activateFocusedAction = useCallback(() => {
    const activeTarget = focusTargets[focusedIndex];
    const activeAction = activeTarget
      ? CONTENT_DETAILS.actions[activeTarget.index]
      : null;

    if (!activeAction) {
      return;
    }

    setStatusMessage(activeAction.statusMessage);
  }, [focusTargets, focusedIndex]);

  useEffect(() => {
    const updateClock = () => {
      setClock(getFormattedClock());
    };

    updateClock();
    const timerId = window.setInterval(updateClock, 30000);

    return () => {
      window.clearInterval(timerId);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!focusTargets.length) {
        return;
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        applyFocus(focusedIndex + 1);
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        applyFocus(focusedIndex - 1);
        return;
      }

      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        applyFocus(focusedIndex);
        return;
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activateFocusedAction();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activateFocusedAction, applyFocus, focusTargets.length, focusedIndex]);

  return (
    <main className="tv-app tv-screen content-info-screen" aria-label="OTT content details screen">
      <div className="content-info-screen__bg" aria-hidden="true" />
      <div className="content-info-screen__overlay" aria-hidden="true" />

      <section className="content-info-screen__panel" aria-labelledby="content-title">
        <div className="content-info-screen__header">
          <div className="content-info-screen__eyebrow">
            <span className="content-info-screen__eyebrow-dot" aria-hidden="true" />
            <span>{CONTENT_DETAILS.badge}</span>
          </div>

          <h1 id="content-title" className="content-info-screen__title">
            {CONTENT_DETAILS.title}
          </h1>

          <div className="content-info-screen__meta" aria-label="Content metadata">
            {CONTENT_DETAILS.metadata.map((item) => (
              <span key={item} className="content-info-screen__meta-chip">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="content-info-screen__body">
          <p className="content-info-screen__description">{CONTENT_DETAILS.description}</p>

          <div className="content-info-screen__actions" role="group" aria-label="Primary actions">
            {CONTENT_DETAILS.actions.map((action, index) => {
              const isFocused = index === focusedIndex;

              return (
                <button
                  key={action.id}
                  type="button"
                  className={[
                    'content-info-screen__button',
                    action.variant === 'primary'
                      ? 'content-info-screen__button--primary'
                      : 'content-info-screen__button--secondary',
                    'tv-focusable',
                    isFocused ? 'is-focused' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onFocus={() => applyFocus(index)}
                  onClick={() => setStatusMessage(action.statusMessage)}
                  aria-label={action.label}
                >
                  {action.label}
                </button>
              );
            })}
          </div>

          <div className="content-info-screen__supporting" role="group" aria-label="Supporting information">
            {CONTENT_DETAILS.supportingInfo.map((item) => (
              <div key={item} className="content-info-screen__info-pill">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <aside className="content-info-screen__date" aria-label="System date and time">
        <div className="content-info-screen__time" id="system-time">
          {clock.time}
        </div>
        <div className="content-info-screen__day" id="system-date">
          <span>{clock.weekday}</span>
          <span>{clock.dayMonth}</span>
        </div>
      </aside>

      <div className="content-info-screen__status" id="app-status" role="status" aria-live="polite">
        {statusMessage}
      </div>
    </main>
  );
}

export default App;
