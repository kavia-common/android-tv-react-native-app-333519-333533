import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './App.css';

const SCREEN_IDS = {
  HOME: 'home',
  CONTENT_INFO: 'content-info',
};

const HOME_SCREEN = {
  id: SCREEN_IDS.HOME,
  title: 'Claro video home',
  initialFocusId: 'nav-home',
  statusPrefix: 'Home',
  hero: {
    eyebrow: 'Featured highlights',
    title: 'Discover stories that feel made for the big screen.',
    subtitle:
      'Jump between top navigation, continue watching picks, and live TV channels with the remote.',
  },
  header: {
    logo: {
      primary: 'Claro',
      secondary: 'video',
    },
    items: [
      { id: 'nav-home', label: 'Inicio', screenId: SCREEN_IDS.HOME, isActive: true },
      { id: 'nav-movies', label: 'Películas', screenId: SCREEN_IDS.CONTENT_INFO },
      { id: 'nav-series', label: 'Series', screenId: SCREEN_IDS.CONTENT_INFO },
      { id: 'nav-live', label: 'TV en vivo', screenId: SCREEN_IDS.CONTENT_INFO },
      { id: 'nav-kids', label: 'Kids', screenId: SCREEN_IDS.CONTENT_INFO },
      { id: 'nav-library', label: 'Mis Contenidos', screenId: SCREEN_IDS.CONTENT_INFO },
    ],
  },
  continueWatching: {
    title: 'Seguí viendo',
    items: [
      {
        id: 'continue-rogue-one',
        title: 'Rogue One',
        progress: 72,
        isFeatured: true,
        screenId: SCREEN_IDS.CONTENT_INFO,
      },
      {
        id: 'continue-ex-machina',
        title: 'Ex Machina',
        progress: 64,
        screenId: SCREEN_IDS.CONTENT_INFO,
      },
      {
        id: 'continue-sing-street',
        title: 'Sing Street',
        progress: 48,
        screenId: SCREEN_IDS.CONTENT_INFO,
      },
      {
        id: 'continue-2012',
        title: '2012',
        progress: 36,
        screenId: SCREEN_IDS.CONTENT_INFO,
      },
      {
        id: 'continue-ad-astra',
        title: 'Ad Astra',
        progress: 58,
        screenId: SCREEN_IDS.CONTENT_INFO,
      },
    ],
  },
  channels: {
    title: 'Canales de TV',
    items: [
      {
        id: 'channel-claro-radio-1',
        title: 'Marca Claro Radio',
        metadata: '004 | Claro sports',
        playtime: '11:30 - 12:30',
        screenId: SCREEN_IDS.CONTENT_INFO,
      },
      {
        id: 'channel-et',
        title: 'E.T.',
        metadata: '005 | HBO Channel',
        playtime: '11:30 - 12:30',
        tag: 'ALQUILÁ',
        isFeatured: true,
        screenId: SCREEN_IDS.CONTENT_INFO,
      },
      {
        id: 'channel-claro-radio-2',
        title: 'Marca Claro Radio',
        metadata: '004 | Claro sports',
        playtime: '11:30 - 12:30',
        screenId: SCREEN_IDS.CONTENT_INFO,
      },
    ],
  },
  utilityActions: [
    {
      id: 'header-search',
      label: 'Search',
      statusMessage: 'Search is ready. Use the current row to browse categories.',
    },
    {
      id: 'header-profile',
      label: 'Profile',
      statusMessage: 'Profile selected. Account switcher would open here.',
    },
    {
      id: 'continue-rogue-one-open',
      label: 'Open Rogue One',
      screenId: SCREEN_IDS.CONTENT_INFO,
    },
    {
      id: 'continue-rogue-one-delete',
      label: 'Delete Rogue One',
      statusMessage: 'Rogue One removed from Continue Watching.',
    },
  ],
};

const CONTENT_DETAILS = {
  id: SCREEN_IDS.CONTENT_INFO,
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
    {
      id: 'back-home',
      label: 'Back to Home',
      variant: 'secondary',
      screenId: SCREEN_IDS.HOME,
      statusMessage: 'Returning to Home.',
    },
  ],
};

const SCREEN_CONFIG = {
  [SCREEN_IDS.HOME]: {
    initialFocusId: HOME_SCREEN.initialFocusId,
    defaultStatus: 'Focus is on Inicio.',
  },
  [SCREEN_IDS.CONTENT_INFO]: {
    initialFocusId: CONTENT_DETAILS.actions[0].id,
    defaultStatus: 'Focus is on Watch Now.',
  },
};

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

function createFocusTarget({
  id,
  label,
  row,
  column,
  screenId,
  actionType = 'status',
  statusMessage = '',
  navigateTo = null,
}) {
  return {
    id,
    label,
    row,
    column,
    screenId,
    actionType,
    statusMessage,
    navigateTo,
  };
}

function buildHomeFocusTargets() {
  const headerTargets = [
    createFocusTarget({
      id: 'header-search',
      label: 'Search',
      row: 0,
      column: 0,
      screenId: SCREEN_IDS.HOME,
      actionType: 'status',
      statusMessage: 'Search is ready. Use the current row to browse categories.',
    }),
    ...HOME_SCREEN.header.items.map((item, index) =>
      createFocusTarget({
        id: item.id,
        label: item.label,
        row: 0,
        column: index + 1,
        screenId: SCREEN_IDS.HOME,
        actionType: item.screenId === SCREEN_IDS.HOME ? 'status' : 'navigate',
        navigateTo: item.screenId === SCREEN_IDS.HOME ? null : item.screenId,
        statusMessage:
          item.screenId === SCREEN_IDS.HOME
            ? 'Already on Home.'
            : `Opening ${item.label}.`,
      })
    ),
    createFocusTarget({
      id: 'header-profile',
      label: 'Profile',
      row: 0,
      column: HOME_SCREEN.header.items.length + 1,
      screenId: SCREEN_IDS.HOME,
      actionType: 'status',
      statusMessage: 'Profile selected. Account switcher would open here.',
    }),
  ];

  const continueTargets = HOME_SCREEN.continueWatching.items.flatMap((item, index) => {
    const baseColumn = index * 2;

    if (item.isFeatured) {
      return [
        createFocusTarget({
          id: item.id,
          label: item.title,
          row: 1,
          column: baseColumn,
          screenId: SCREEN_IDS.HOME,
          actionType: 'navigate',
          navigateTo: item.screenId,
          statusMessage: `Opening ${item.title}.`,
        }),
        createFocusTarget({
          id: 'continue-rogue-one-open',
          label: 'Open Rogue One',
          row: 1,
          column: baseColumn + 1,
          screenId: SCREEN_IDS.HOME,
          actionType: 'navigate',
          navigateTo: SCREEN_IDS.CONTENT_INFO,
          statusMessage: 'Opening Rogue One.',
        }),
        createFocusTarget({
          id: 'continue-rogue-one-delete',
          label: 'Delete Rogue One',
          row: 1,
          column: baseColumn + 2,
          screenId: SCREEN_IDS.HOME,
          actionType: 'status',
          statusMessage: 'Rogue One removed from Continue Watching.',
        }),
      ];
    }

    return [
      createFocusTarget({
        id: item.id,
        label: item.title,
        row: 1,
        column: baseColumn + 2,
        screenId: SCREEN_IDS.HOME,
        actionType: 'navigate',
        navigateTo: item.screenId,
        statusMessage: `Opening ${item.title}.`,
      }),
    ];
  });

  const channelTargets = HOME_SCREEN.channels.items.map((item, index) =>
    createFocusTarget({
      id: item.id,
      label: item.title,
      row: 2,
      column: index,
      screenId: SCREEN_IDS.HOME,
      actionType: 'navigate',
      navigateTo: item.screenId,
      statusMessage: `Opening ${item.title}.`,
    })
  );

  return [...headerTargets, ...continueTargets, ...channelTargets];
}

function buildContentFocusTargets() {
  return CONTENT_DETAILS.actions.map((action, index) =>
    createFocusTarget({
      id: action.id,
      label: action.label,
      row: 0,
      column: index,
      screenId: SCREEN_IDS.CONTENT_INFO,
      actionType: action.screenId ? 'navigate' : 'status',
      navigateTo: action.screenId,
      statusMessage: action.statusMessage,
    })
  );
}

function buildFocusModel() {
  const targets = [...buildHomeFocusTargets(), ...buildContentFocusTargets()];
  const byScreen = targets.reduce((accumulator, target) => {
    if (!accumulator[target.screenId]) {
      accumulator[target.screenId] = [];
    }

    accumulator[target.screenId].push(target);
    return accumulator;
  }, {});

  return {
    targets,
    byScreen,
  };
}

function clampColumn(targetsInRow, desiredColumn) {
  if (!targetsInRow.length) {
    return null;
  }

  return targetsInRow.reduce((bestTarget, currentTarget) => {
    if (!bestTarget) {
      return currentTarget;
    }

    const currentDistance = Math.abs(currentTarget.column - desiredColumn);
    const bestDistance = Math.abs(bestTarget.column - desiredColumn);

    return currentDistance < bestDistance ? currentTarget : bestTarget;
  }, null);
}

function getScreenRows(screenTargets) {
  const rows = new Map();

  screenTargets.forEach((target) => {
    if (!rows.has(target.row)) {
      rows.set(target.row, []);
    }

    rows.get(target.row).push(target);
  });

  rows.forEach((targetsInRow) => {
    targetsInRow.sort((left, right) => left.column - right.column);
  });

  return rows;
}

function moveFocusHorizontally(screenTargets, activeTarget, direction) {
  const rows = getScreenRows(screenTargets);
  const rowTargets = rows.get(activeTarget.row) || [];
  const activeIndex = rowTargets.findIndex((target) => target.id === activeTarget.id);

  if (activeIndex === -1 || !rowTargets.length) {
    return activeTarget.id;
  }

  const nextIndex = (activeIndex + direction + rowTargets.length) % rowTargets.length;
  return rowTargets[nextIndex].id;
}

function moveFocusVertically(screenTargets, activeTarget, direction) {
  const rows = getScreenRows(screenTargets);
  const rowNumbers = Array.from(rows.keys()).sort((left, right) => left - right);
  const activeRowIndex = rowNumbers.indexOf(activeTarget.row);

  if (activeRowIndex === -1) {
    return activeTarget.id;
  }

  const nextRowIndex = (activeRowIndex + direction + rowNumbers.length) % rowNumbers.length;
  const nextRowTargets = rows.get(rowNumbers[nextRowIndex]) || [];
  const nextTarget = clampColumn(nextRowTargets, activeTarget.column);

  return nextTarget ? nextTarget.id : activeTarget.id;
}

function findTargetById(screenTargets, targetId, fallbackId) {
  return (
    screenTargets.find((target) => target.id === targetId) ||
    screenTargets.find((target) => target.id === fallbackId) ||
    screenTargets[0] ||
    null
  );
}

function getStatusForFocus(target) {
  return target ? `Focus is on ${target.label}.` : '';
}

function getHomeContinueCardClass(item, isFocused) {
  return [
    'continue-card',
    item.isFeatured ? 'continue-card--featured' : '',
    'tv-focusable',
    isFocused ? 'is-focused' : '',
  ]
    .filter(Boolean)
    .join(' ');
}

function getHomeHeaderItemClass(item, isFocused) {
  return [
    'home-header__nav-item',
    'tv-focusable',
    item.isActive ? 'is-active' : '',
    isFocused ? 'is-focused' : '',
  ]
    .filter(Boolean)
    .join(' ');
}

function getContentActionClass(action, isFocused) {
  return [
    'content-info-screen__button',
    action.variant === 'primary'
      ? 'content-info-screen__button--primary'
      : 'content-info-screen__button--secondary',
    'tv-focusable',
    isFocused ? 'is-focused' : '',
  ]
    .filter(Boolean)
    .join(' ');
}

function HomeScreen({ focusedTargetId, onFocusTarget, onActivateTarget }) {
  return (
    <main className="tv-app tv-screen home-page-screen" aria-label="OTT home page">
      <div className="home-page-screen__hero home-page-screen__hero--backdrop" aria-hidden="true">
        <div className="home-page-screen__hero-gradient" />
      </div>

      <header className="home-header" aria-label="Top navigation">
        <div className="home-header__logo" aria-label="Claro video logo">
          <span className="home-header__logo-claro">{HOME_SCREEN.header.logo.primary}</span>
          <span className="home-header__logo-video">{HOME_SCREEN.header.logo.secondary}</span>
        </div>

        <div className="home-header__nav-shell">
          <div className="home-header__nav-bg" aria-hidden="true" />
          <button
            type="button"
            className={[
              'home-header__search',
              'tv-focusable',
              focusedTargetId === 'header-search' ? 'is-focused' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onFocus={() => onFocusTarget('header-search')}
            onClick={() => onActivateTarget('header-search')}
            aria-label="Search"
          >
            <span className="home-header__search-icon" aria-hidden="true" />
          </button>

          {HOME_SCREEN.header.items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={getHomeHeaderItemClass(item, focusedTargetId === item.id)}
              onFocus={() => onFocusTarget(item.id)}
              onClick={() => onActivateTarget(item.id)}
              aria-current={item.isActive ? 'page' : undefined}
            >
              {item.label}
            </button>
          ))}

          <button
            type="button"
            className={[
              'home-header__profile',
              'tv-focusable',
              focusedTargetId === 'header-profile' ? 'is-focused' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onFocus={() => onFocusTarget('header-profile')}
            onClick={() => onActivateTarget('header-profile')}
            aria-label="Profile"
          >
            <span className="home-header__profile-ring" aria-hidden="true" />
            <span className="home-header__profile-avatar" aria-hidden="true">
              CV
            </span>
          </button>
        </div>
      </header>

      <section className="home-page-screen__hero-copy" aria-labelledby="home-hero-title">
        <div className="home-page-screen__hero-eyebrow">{HOME_SCREEN.hero.eyebrow}</div>
        <h1 id="home-hero-title" className="home-page-screen__hero-title">
          {HOME_SCREEN.hero.title}
        </h1>
        <p className="home-page-screen__hero-subtitle">{HOME_SCREEN.hero.subtitle}</p>
      </section>

      <section className="continue-row" aria-labelledby="continue-title">
        <h2 id="continue-title" className="continue-row__title">
          {HOME_SCREEN.continueWatching.title}
        </h2>

        <div className="continue-row__track">
          {HOME_SCREEN.continueWatching.items.map((item) => {
            const isFocused = focusedTargetId === item.id;

            return (
              <div key={item.id} className={getHomeContinueCardClass(item, isFocused)}>
                <button
                  type="button"
                  className="continue-card__surface"
                  onFocus={() => onFocusTarget(item.id)}
                  onClick={() => onActivateTarget(item.id)}
                  aria-label={item.title}
                >
                  <div
                    className={[
                      'continue-card__poster',
                      item.isFeatured ? 'continue-card__poster--featured' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    aria-hidden="true"
                  />
                  <div
                    className={[
                      'continue-card__progress',
                      item.isFeatured ? 'continue-card__progress--featured' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <span
                      className="continue-card__progress-fill"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <div
                    className={[
                      'continue-card__label',
                      item.isFeatured ? 'continue-card__label--featured' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <span>{item.title}</span>
                  </div>
                </button>

                {item.isFeatured ? (
                  <>
                    <button
                      type="button"
                      className={[
                        'continue-card__arrow',
                        'tv-focusable',
                        focusedTargetId === 'continue-rogue-one-open' ? 'is-focused' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onFocus={() => onFocusTarget('continue-rogue-one-open')}
                      onClick={() => onActivateTarget('continue-rogue-one-open')}
                      aria-label="Open Rogue One"
                    >
                      →
                    </button>
                    <button
                      type="button"
                      className={[
                        'continue-card__delete',
                        'tv-focusable',
                        focusedTargetId === 'continue-rogue-one-delete' ? 'is-focused' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onFocus={() => onFocusTarget('continue-rogue-one-delete')}
                      onClick={() => onActivateTarget('continue-rogue-one-delete')}
                      aria-label="Delete Rogue One"
                    >
                      🗑
                    </button>
                  </>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      <section className="channels-row" aria-labelledby="channels-title">
        <div className="channels-row__title-wrap">
          <h2 id="channels-title" className="channels-row__title">
            {HOME_SCREEN.channels.title}
          </h2>
        </div>

        <div className="channels-row__track">
          {HOME_SCREEN.channels.items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={[
                'channel-card',
                item.isFeatured ? 'channel-card--featured' : '',
                'tv-focusable',
                focusedTargetId === item.id ? 'is-focused' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onFocus={() => onFocusTarget(item.id)}
              onClick={() => onActivateTarget(item.id)}
              aria-label={item.title}
            >
              <div
                className={[
                  'channel-card__image',
                  item.isFeatured ? 'channel-card__image--large' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-hidden="true"
              />
              <div
                className={[
                  'channel-card__info',
                  item.isFeatured ? 'channel-card__info--featured' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <div className="channel-card__title">{item.title}</div>
                <div className="channel-card__meta">{item.metadata}</div>
                <div className="channel-card__playtime">{item.playtime}</div>
              </div>
              {item.tag ? <div className="channel-card__rent-tag">{item.tag}</div> : null}
              <div
                className={[
                  'channel-card__progress-svg',
                  item.isFeatured ? 'channel-card__progress-svg--featured' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-hidden="true"
              >
                <span className="channel-card__progress-fill" />
              </div>
              <div
                className={[
                  'channel-card__play',
                  item.isFeatured ? 'channel-card__play--featured' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-hidden="true"
              >
                <span className="channel-card__play-circle" />
                <span className="channel-card__play-icon" />
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

function ContentInfoScreen({ focusedTargetId, onFocusTarget, onActivateTarget, clock }) {
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
            {CONTENT_DETAILS.actions.map((action) => (
              <button
                key={action.id}
                type="button"
                className={getContentActionClass(action, focusedTargetId === action.id)}
                onFocus={() => onFocusTarget(action.id)}
                onClick={() => onActivateTarget(action.id)}
                aria-label={action.label}
              >
                {action.label}
              </button>
            ))}
          </div>

          <div
            className="content-info-screen__supporting"
            role="group"
            aria-label="Supporting information"
          >
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
    </main>
  );
}

// PUBLIC_INTERFACE
function App() {
  /**
   * TvScreenNavigationFlow is the canonical entrypoint for the Android TV web
   * experience. Inputs are remote/keyboard events plus local screen metadata;
   * outputs are the rendered active screen, focused target id, status text, and
   * current clock values. Errors are limited to browser/runtime event failures
   * surfaced by React. Side effects include document-level key listeners and a
   * recurring system clock timer.
   */
  const focusModel = useMemo(() => buildFocusModel(), []);
  const [currentScreenId, setCurrentScreenId] = useState(SCREEN_IDS.HOME);
  const [focusedTargetId, setFocusedTargetId] = useState(SCREEN_CONFIG[SCREEN_IDS.HOME].initialFocusId);
  const [statusMessage, setStatusMessage] = useState(SCREEN_CONFIG[SCREEN_IDS.HOME].defaultStatus);
  const [clock, setClock] = useState(() => getFormattedClock());

  const screenTargets = focusModel.byScreen[currentScreenId] || [];
  const activeTarget = useMemo(
    () =>
      findTargetById(
        screenTargets,
        focusedTargetId,
        SCREEN_CONFIG[currentScreenId]?.initialFocusId
      ),
    [currentScreenId, focusedTargetId, screenTargets]
  );

  const applyFocus = useCallback(
    (targetId) => {
      const nextTarget = findTargetById(
        focusModel.byScreen[currentScreenId] || [],
        targetId,
        SCREEN_CONFIG[currentScreenId]?.initialFocusId
      );

      if (!nextTarget) {
        return;
      }

      setFocusedTargetId(nextTarget.id);
      setStatusMessage(getStatusForFocus(nextTarget));
    },
    [currentScreenId, focusModel.byScreen]
  );

  const switchScreen = useCallback(
    (nextScreenId) => {
      const nextScreenTargets = focusModel.byScreen[nextScreenId] || [];
      const initialTarget = findTargetById(
        nextScreenTargets,
        SCREEN_CONFIG[nextScreenId]?.initialFocusId,
        SCREEN_CONFIG[nextScreenId]?.initialFocusId
      );

      setCurrentScreenId(nextScreenId);
      setFocusedTargetId(initialTarget ? initialTarget.id : '');
      setStatusMessage(initialTarget ? getStatusForFocus(initialTarget) : '');
    },
    [focusModel.byScreen]
  );

  const activateFocusedTarget = useCallback(
    (targetId) => {
      const screenSpecificTargets = focusModel.byScreen[currentScreenId] || [];
      const target = findTargetById(
        screenSpecificTargets,
        targetId,
        SCREEN_CONFIG[currentScreenId]?.initialFocusId
      );

      if (!target) {
        return;
      }

      if (target.actionType === 'navigate' && target.navigateTo) {
        switchScreen(target.navigateTo);
        return;
      }

      setStatusMessage(target.statusMessage || `${target.label} selected.`);
    },
    [currentScreenId, focusModel.byScreen, switchScreen]
  );

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
    if (activeTarget && activeTarget.id !== focusedTargetId) {
      setFocusedTargetId(activeTarget.id);
      setStatusMessage(getStatusForFocus(activeTarget));
    }
  }, [activeTarget, focusedTargetId]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!activeTarget || !screenTargets.length) {
        return;
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        applyFocus(moveFocusHorizontally(screenTargets, activeTarget, 1));
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        applyFocus(moveFocusHorizontally(screenTargets, activeTarget, -1));
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        applyFocus(moveFocusVertically(screenTargets, activeTarget, 1));
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        applyFocus(moveFocusVertically(screenTargets, activeTarget, -1));
        return;
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activateFocusedTarget(activeTarget.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activateFocusedTarget, activeTarget, applyFocus, screenTargets]);

  return (
    <div className="App">
      {currentScreenId === SCREEN_IDS.HOME ? (
        <HomeScreen
          focusedTargetId={focusedTargetId}
          onFocusTarget={applyFocus}
          onActivateTarget={activateFocusedTarget}
        />
      ) : (
        <ContentInfoScreen
          focusedTargetId={focusedTargetId}
          onFocusTarget={applyFocus}
          onActivateTarget={activateFocusedTarget}
          clock={clock}
        />
      )}

      <div className="tv-status" id="app-status" role="status" aria-live="polite">
        {statusMessage}
      </div>
    </div>
  );
}

export default App;
