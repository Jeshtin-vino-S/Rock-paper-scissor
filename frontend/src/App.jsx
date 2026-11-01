import { useState, useEffect } from 'react';
import {
  RockIcon,
  PaperIcon,
  ScissorsIcon,
  TiltedFistIcon,
  StarOutlineIcon,
  TrophyIcon,
  DefeatCrossIcon,
  DrawEqualIcon,
  QuestionIcon,
  SoundIcon,
  StatsIcon,
  InfoIcon,
  PlayIcon,
  HomeIcon,
  CloseIcon,
} from './icons';

export default function App() {
  // Screens: 'home' | 'countdown' | 'battle' | 'result'
  const [currentScreen, setCurrentScreen] = useState('home');

  // Match Configuration
  const [bestOf, setBestOf] = useState(3);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeModal, setActiveModal] = useState(null); // 'stats' | 'howto' | null

  // Persistent Career Stats
  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem('rps_career_stats');
      if (saved) return JSON.parse(saved);
    } catch {
      // storage unavailable
    }
    return { wins: 0, losses: 0, draws: 0, streak: 0 };
  });

  // Match State
  const [round, setRound] = useState(1);
  const [playerScore, setPlayerScore] = useState(0);
  const [cpuScore, setCpuScore] = useState(0);

  // Round State
  const [countdownStep, setCountdownStep] = useState(0); // 0=ROCK, 1=PAPER, 2=SCISSORS, 3=SHOOT
  const [selectedMove, setSelectedMove] = useState(null); // 'rock' | 'paper' | 'scissors'
  const [cpuMove, setCpuMove] = useState(null);
  const [cpuCardFlipped, setCpuCardFlipped] = useState(false);
  const [roundOutcome, setRoundOutcome] = useState(null); // 'win' | 'lose' | 'draw'

  const winsNeeded = Math.ceil(bestOf / 2);

  // Audio synthesizer (Web Audio API)
  const playSfx = (type) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'tap') {
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.exponentialRampToValueAtTime(640, now + 0.08);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'fist') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.12);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'win') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.1);
        osc.frequency.setValueAtTime(783.99, now + 0.2);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'lose') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.linearRampToValueAtTime(130, now + 0.25);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'draw') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(360, now);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch {
      // AudioContext unavailable
    }
  };

  // Start new match
  const handleStartGame = () => {
    playSfx('tap');
    setPlayerScore(0);
    setCpuScore(0);
    setRound(1);
    setSelectedMove(null);
    setCpuMove(null);
    setCpuCardFlipped(false);
    setRoundOutcome(null);
    setCountdownStep(0);
    setCurrentScreen('countdown');
  };

  // Countdown timer effect
  useEffect(() => {
    if (currentScreen !== 'countdown') return;

    playSfx('fist');
    const timer = setInterval(() => {
      setCountdownStep((prev) => {
        if (prev < 3) {
          playSfx('fist');
          return prev + 1;
        }
        clearInterval(timer);
        setTimeout(() => {
          setCurrentScreen('battle');
        }, 450);
        return 3;
      });
    }, 650);

    return () => clearInterval(timer);
  }, [currentScreen]);

  // Player picks a move
  const handlePlayerMove = (move) => {
    if (roundOutcome) return;
    playSfx('tap');
    setSelectedMove(move);

    const choices = ['rock', 'paper', 'scissors'];
    const cpuPick = choices[Math.floor(Math.random() * choices.length)];
    setCpuMove(cpuPick);
    setCpuCardFlipped(true);

    let outcome = 'draw';
    let newPlayerScore = playerScore;
    let newCpuScore = cpuScore;

    if (move === cpuPick) {
      outcome = 'draw';
    } else if (
      (move === 'rock' && cpuPick === 'scissors') ||
      (move === 'paper' && cpuPick === 'rock') ||
      (move === 'scissors' && cpuPick === 'paper')
    ) {
      outcome = 'win';
      newPlayerScore = playerScore + 1;
      setPlayerScore(newPlayerScore);
    } else {
      outcome = 'lose';
      newCpuScore = cpuScore + 1;
      setCpuScore(newCpuScore);
    }

    setRoundOutcome(outcome);
    playSfx(outcome);

    // If match ended
    if (newPlayerScore >= winsNeeded || newCpuScore >= winsNeeded) {
      setStats((prev) => {
        const isMatchVictory = newPlayerScore >= winsNeeded;
        const updated = {
          wins: prev.wins + (isMatchVictory ? 1 : 0),
          losses: prev.losses + (!isMatchVictory ? 1 : 0),
          draws: prev.draws,
          streak: isMatchVictory ? prev.streak + 1 : 0,
        };
        try {
          localStorage.setItem('rps_career_stats', JSON.stringify(updated));
        } catch {
          // ignore storage error
        }
        return updated;
      });
    }
  };

  // Next round
  const handleNextRound = () => {
    playSfx('tap');
    setRound((r) => r + 1);
    setSelectedMove(null);
    setCpuMove(null);
    setCpuCardFlipped(false);
    setRoundOutcome(null);
    setCountdownStep(0);
    setCurrentScreen('countdown');
  };

  // See result
  const handleSeeResult = () => {
    playSfx('tap');
    setCurrentScreen('result');
  };

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Close modal on Escape
      if (e.key === 'Escape' && activeModal) {
        setActiveModal(null);
        return;
      }

      if (currentScreen === 'battle') {
        if (!roundOutcome) {
          if (e.key === '1' || e.key.toLowerCase() === 'r') handlePlayerMove('rock');
          if (e.key === '2' || e.key.toLowerCase() === 'p') handlePlayerMove('paper');
          if (e.key === '3' || e.key.toLowerCase() === 's') handlePlayerMove('scissors');
        } else {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            if (isMatchOver) handleSeeResult();
            else handleNextRound();
          }
        }
      } else if (currentScreen === 'result') {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleStartGame();
        }
      } else if (currentScreen === 'home') {
        if (e.key === 'Enter') {
          handleStartGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentScreen, roundOutcome, activeModal, playerScore, cpuScore, winsNeeded]);

  // Helper: render move icon
  const renderMoveIcon = (move, size = 48, color = 'currentColor') => {
    if (move === 'rock') return <RockIcon size={size} color={color} />;
    if (move === 'paper') return <PaperIcon size={size} color={color} />;
    if (move === 'scissors') return <ScissorsIcon size={size} color={color} />;
    return <QuestionIcon size={size} color={color} />;
  };

  // Helper: reason text
  const getReasonText = (pMove, cMove, outcome) => {
    if (outcome === 'win') {
      if (pMove === 'rock') return 'ROCK CRUSHES SCISSORS';
      if (pMove === 'paper') return 'PAPER COVERS ROCK';
      return 'SCISSORS CUTS PAPER';
    }
    if (outcome === 'lose') {
      if (cMove === 'rock') return 'ROCK CRUSHES SCISSORS';
      if (cMove === 'paper') return 'PAPER COVERS ROCK';
      return 'SCISSORS CUTS PAPER';
    }
    return `BOTH CHOSE ${(pMove || 'SAME').toUpperCase()}`;
  };

  const isMatchOver = playerScore >= winsNeeded || cpuScore >= winsNeeded;
  const isMatchVictory = playerScore >= winsNeeded;

  return (
    <div className="app-container">
      {/* ========================================================
          TOP NAVIGATION BAR (RESPONSIVE)
         ======================================================== */}
      <header className="app-navbar">
        <div className="navbar-inner">
          <div
            className="nav-brand"
            onClick={() => {
              playSfx('tap');
              setCurrentScreen('home');
            }}
          >
            <span className="brand-rock">ROCK</span>
            <span className="brand-paper">PAPER</span>
            <span className="brand-scissors">SCISSORS</span>
          </div>

          <div className="nav-actions">
            {currentScreen !== 'home' && (
              <button
                className="nav-pill-btn"
                onClick={() => {
                  playSfx('tap');
                  setCurrentScreen('home');
                }}
                title="Home"
              >
                <HomeIcon size={16} />
                <span className="pill-text">Home</span>
              </button>
            )}

            <button
              className="nav-pill-btn"
              onClick={() => {
                playSfx('tap');
                setActiveModal('stats');
              }}
            >
              <StatsIcon size={16} />
              <span className="pill-text">Stats</span>
            </button>

            <button
              className={`nav-pill-btn ${soundEnabled ? 'active' : ''}`}
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                playSfx('tap');
              }}
              title="Toggle Sound"
            >
              <SoundIcon size={16} muted={!soundEnabled} />
              <span className="pill-text">{soundEnabled ? 'Sound' : 'Muted'}</span>
            </button>

            <button
              className="nav-pill-btn"
              onClick={() => {
                playSfx('tap');
                setActiveModal('howto');
              }}
            >
              <InfoIcon size={16} />
              <span className="pill-text">How to</span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================
          MAIN SCREEN CONTENT
         ======================================================== */}
      <main className="main-content">
        {/* ==================== SCREEN 1: HOME ==================== */}
        {currentScreen === 'home' && (
          <div className="home-section">
            <div className="home-hero-title">
              <span className="title-rock">ROCK</span>
              <span className="title-paper">PAPER</span>
              <span className="title-scissors">SCISSORS</span>
            </div>

            <p className="home-subtitle">
              Duel against the CPU in a classic test of reflex and strategy. First to score the target wins the arena!
            </p>

            {/* 3 icon tiles with middle one raised */}
            <div className="icon-tiles-row">
              <div className="icon-tile">
                <RockIcon size={42} color="#F4F2FF" />
                <span className="icon-tile-label">ROCK</span>
              </div>
              <div className="icon-tile raised">
                <PaperIcon size={48} color="#FF5C7A" />
                <span className="icon-tile-label">PAPER</span>
              </div>
              <div className="icon-tile">
                <ScissorsIcon size={42} color="#3DE0FF" />
                <span className="icon-tile-label">SCISSORS</span>
              </div>
            </div>

            {/* Best of selector (3/5/7) */}
            <div className="best-of-box">
              <span className="section-label">Select Match Mode</span>
              <div className="best-of-selector">
                {[3, 5, 7].map((num) => (
                  <button
                    key={num}
                    className={`best-of-opt ${bestOf === num ? 'selected' : ''}`}
                    onClick={() => {
                      playSfx('tap');
                      setBestOf(num);
                    }}
                  >
                    <span className="opt-num">BEST OF {num}</span>
                    <span className="opt-sub">First to {Math.ceil(num / 2)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Full-width yellow PLAY button */}
            <button className="btn-primary-yellow" onClick={handleStartGame}>
              <PlayIcon size={22} color="#12101F" />
              PLAY GAME
            </button>

            {/* Quick action pills on Home: Stats, Sound, How to */}
            <div className="home-pill-buttons">
              <button
                className="pill-btn"
                onClick={() => {
                  playSfx('tap');
                  setActiveModal('stats');
                }}
              >
                <StatsIcon size={16} />
                <span>Stats</span>
              </button>
              <button
                className={`pill-btn ${soundEnabled ? 'active' : ''}`}
                onClick={() => {
                  setSoundEnabled(!soundEnabled);
                  playSfx('tap');
                }}
              >
                <SoundIcon size={16} muted={!soundEnabled} />
                <span>{soundEnabled ? 'Sound On' : 'Muted'}</span>
              </button>
              <button
                className="pill-btn"
                onClick={() => {
                  playSfx('tap');
                  setActiveModal('howto');
                }}
              >
                <InfoIcon size={16} />
                <span>How to Play</span>
              </button>
            </div>
          </div>
        )}

        {/* ==================== SCREEN 2: COUNTDOWN ==================== */}
        {currentScreen === 'countdown' && (
          <div className="countdown-section">
            <div className="round-header-chip">
              <span>ROUND {round} / {bestOf}</span>
              <span style={{ color: '#FFD84D' }}>•</span>
              <span style={{ color: '#A9A5C4' }}>FIRST TO {winsNeeded}</span>
            </div>

            <div className="countdown-duel-grid">
              {/* YOU tall card */}
              <div className="tall-card card-you">
                <span className="card-tag tag-you">YOU</span>
                <div className="card-center-icon shake-3x">
                  <TiltedFistIcon size={84} color="#FF5C7A" />
                </div>
                <span style={{ fontSize: '12px', color: '#A9A5C4', fontWeight: 600 }}>READY</span>
              </div>

              {/* Center Countdown Beat & Chips */}
              <div className="countdown-center-col">
                <div className="countdown-huge-text">
                  {countdownStep === 0 && 'ROCK...'}
                  {countdownStep === 1 && 'PAPER...'}
                  {countdownStep === 2 && 'SCISSORS...'}
                  {countdownStep === 3 && 'SHOOT!'}
                </div>

                <div className="step-chips-container">
                  {['ROCK', 'PAPER', 'SCISSORS', 'SHOOT'].map((step, idx) => (
                    <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div className={`step-chip ${countdownStep === idx ? 'active' : ''}`}>
                        {step}
                      </div>
                      {idx < 3 && <span className="step-divider">&gt;</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* CPU tall card */}
              <div className="tall-card card-cpu">
                <span className="card-tag tag-cpu">CPU</span>
                <div className="card-center-icon shake-3x flip">
                  <TiltedFistIcon size={84} color="#3DE0FF" flip />
                </div>
                <span style={{ fontSize: '12px', color: '#A9A5C4', fontWeight: 600 }}>READY</span>
              </div>
            </div>

            <div className="countdown-hint">Get ready to pick your move in the arena!</div>
          </div>
        )}

        {/* ==================== SCREEN 3: BATTLE ==================== */}
        {currentScreen === 'battle' && (
          <div className="battle-section">
            {/* Scoreboard Bar */}
            <div className="battle-score-bar">
              <div className="score-pill pill-you">
                <span className="score-pill-name">YOU</span>
                <span className="score-pill-val">{playerScore}</span>
              </div>

              <div className="round-header-chip" style={{ fontSize: '12px', padding: '6px 14px' }}>
                ROUND {round} / {bestOf} (TARGET: {winsNeeded})
              </div>

              <div className="score-pill pill-cpu">
                <span className="score-pill-name">CPU</span>
                <span className="score-pill-val">{cpuScore}</span>
              </div>
            </div>

            {/* Duel Arena: Side by side on desktop, stacked on mobile */}
            <div className="arena-grid">
              {/* Player Card */}
              <div
                className={`arena-card player-arena ${
                  roundOutcome === 'lose'
                    ? 'card-shake'
                    : roundOutcome === 'draw'
                    ? 'card-pulse'
                    : ''
                }`}
              >
                <div className="arena-card-label">
                  <span className="arena-sub">YOUR MOVE</span>
                  <span className="arena-main">
                    {selectedMove ? selectedMove.toUpperCase() : 'WAITING...'}
                  </span>
                </div>
                <div>
                  {selectedMove
                    ? renderMoveIcon(selectedMove, 52, '#FF5C7A')
                    : <QuestionIcon size={52} color="#FF5C7A" />}
                </div>
              </div>

              {/* Yellow circular VS Badge */}
              <div className="vs-badge">VS</div>

              {/* CPU Card */}
              <div
                className={`arena-card cpu-arena ${
                  cpuCardFlipped ? 'card-flip' : ''
                } ${roundOutcome === 'draw' ? 'card-pulse' : ''}`}
              >
                <div className="arena-card-label">
                  <span className="arena-sub">CPU PICK</span>
                  <span className="arena-main">
                    {cpuMove ? cpuMove.toUpperCase() : '?'}
                  </span>
                </div>
                <div>
                  {cpuMove
                    ? renderMoveIcon(cpuMove, 52, '#3DE0FF')
                    : <QuestionIcon size={52} color="#3DE0FF" />}
                </div>
              </div>
            </div>

            {/* Outcome Banner with Reason */}
            {roundOutcome && (
              <div
                className={`battle-outcome-banner ${
                  roundOutcome === 'win'
                    ? 'outcome-banner-win'
                    : roundOutcome === 'lose'
                    ? 'outcome-banner-lose'
                    : 'outcome-banner-draw'
                }`}
              >
                <div className="banner-left">
                  {roundOutcome === 'win' && <TrophyIcon size={26} color="#FFD84D" />}
                  {roundOutcome === 'lose' && <DefeatCrossIcon size={26} color="#3DE0FF" />}
                  {roundOutcome === 'draw' && <DrawEqualIcon size={26} color="#F4F2FF" />}
                  <div>
                    <div className="banner-title">
                      {roundOutcome === 'win'
                        ? 'YOU WIN!'
                        : roundOutcome === 'lose'
                        ? 'CPU WINS!'
                        : "IT'S A DRAW!"}
                    </div>
                    <div className="banner-reason">
                      {getReasonText(selectedMove, cpuMove, roundOutcome)}
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 'bold' }}>
                  {roundOutcome === 'win' ? '+1 YOU' : roundOutcome === 'lose' ? '+1 CPU' : 'TIE'}
                </span>
              </div>
            )}

            {/* Controls / Thumb Zone */}
            <div className="controls-container">
              {roundOutcome ? (
                <div style={{ width: '100%', maxWidth: '540px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {isMatchOver ? (
                    <button className="btn-primary-yellow" onClick={handleSeeResult}>
                      SEE MATCH RESULT &gt;
                    </button>
                  ) : (
                    <button className="btn-primary-yellow" onClick={handleNextRound}>
                      NEXT ROUND &gt;
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <span className="section-label">Pick Your Move (or Press 1, 2, 3)</span>
                  <div className="move-buttons-row">
                    {[
                      { id: 'rock', key: '1 / R' },
                      { id: 'paper', key: '2 / P' },
                      { id: 'scissors', key: '3 / S' },
                    ].map(({ id: m, key }) => (
                      <button
                        key={m}
                        className={`move-btn ${selectedMove === m ? 'selected-coral' : ''}`}
                        onClick={() => handlePlayerMove(m)}
                        title={m}
                      >
                        {renderMoveIcon(m, 38, selectedMove === m ? '#FF5C7A' : '#F4F2FF')}
                        <span className="move-btn-name">{m.toUpperCase()}</span>
                        <span className="key-badge">{key}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ==================== SCREEN 4: RESULT ==================== */}
        {currentScreen === 'result' && (
          <div className="result-section">
            {/* Win Confetti Shower */}
            {isMatchVictory && (
              <div className="confetti-layer">
                {[...Array(24)].map((_, i) => (
                  <div
                    key={i}
                    className="confetti-piece"
                    style={{
                      left: `${(i * 4.2) + 1}%`,
                      backgroundColor:
                        i % 3 === 0 ? '#FFD84D' : i % 3 === 1 ? '#FF5C7A' : '#3DE0FF',
                      animationDelay: `${i * 0.12}s`,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Hero Banner */}
            <div className="result-hero">
              {isMatchVictory ? (
                <div className="star-spin-anim">
                  <StarOutlineIcon size={84} color="#FFD84D" />
                </div>
              ) : (
                <div className="card-shake">
                  <DefeatCrossIcon size={84} color="#3DE0FF" />
                </div>
              )}

              <h1
                className={`result-title ${
                  isMatchVictory ? 'title-victory' : 'title-defeat'
                }`}
              >
                {isMatchVictory ? 'VICTORY' : 'DEFEAT'}
              </h1>
              <p className="result-subtitle">
                {isMatchVictory
                  ? 'Champion of the Arena!'
                  : 'Better luck in the next duel!'}
              </p>
            </div>

            {/* Score Duel Card */}
            <div className="result-score-card">
              <div className="score-numbers-row">
                <div className="score-side side-player">
                  <span className="score-tag">YOU</span>
                  <span className="score-big-num">{playerScore}</span>
                </div>
                <span className="score-hyphen">-</span>
                <div className="score-side side-cpu">
                  <span className="score-tag">CPU</span>
                  <span className="score-big-num">{cpuScore}</span>
                </div>
              </div>

              {/* Career Stats Chips */}
              <div className="chips-row">
                <div className="stat-chip">
                  <span className="chip-label">Win Streak</span>
                  <span className="chip-value">
                    {isMatchVictory ? `🔥 ${stats.streak}` : '0'}
                  </span>
                </div>
                <div className="stat-chip">
                  <span className="chip-label">Career Wins</span>
                  <span className="chip-value">{stats.wins}</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="result-ctas">
              <button className="btn-primary-yellow" onClick={handleStartGame}>
                PLAY AGAIN
              </button>
              <button
                className="btn-outlined-home"
                onClick={() => {
                  playSfx('tap');
                  setCurrentScreen('home');
                }}
              >
                <HomeIcon size={18} />
                HOME
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================
          MODAL DIALOGS: Detailed How to Play & Career Stats
         ======================================================== */}
      {activeModal && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            {/* STATS MODAL */}
            {activeModal === 'stats' && (
              <>
                <div className="sheet-title-row">
                  <span className="sheet-title">CAREER STATS</span>
                  <button className="icon-touch-btn" onClick={() => setActiveModal(null)}>
                    <CloseIcon size={18} />
                  </button>
                </div>
                <div className="chips-row">
                  <div className="stat-chip">
                    <span className="chip-label">Total Matches</span>
                    <span className="chip-value">
                      {stats.wins + stats.losses + stats.draws}
                    </span>
                  </div>
                  <div className="stat-chip">
                    <span className="chip-label">Win Rate</span>
                    <span className="chip-value">
                      {stats.wins + stats.losses + stats.draws > 0
                        ? Math.round(
                            (stats.wins / (stats.wins + stats.losses + stats.draws)) * 100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </div>
                <div className="chips-row">
                  <div className="stat-chip">
                    <span className="chip-label">Victories</span>
                    <span className="chip-value" style={{ color: '#FFD84D' }}>
                      {stats.wins}
                    </span>
                  </div>
                  <div className="stat-chip">
                    <span className="chip-label">Defeats</span>
                    <span className="chip-value" style={{ color: '#3DE0FF' }}>
                      {stats.losses}
                    </span>
                  </div>
                  <div className="stat-chip">
                    <span className="chip-label">Current Streak</span>
                    <span className="chip-value" style={{ color: '#FF5C7A' }}>
                      {stats.streak}
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* DETAILED HOW TO PLAY MODAL */}
            {activeModal === 'howto' && (
              <div className="how-to-section">
                <div className="sheet-title-row">
                  <span className="sheet-title">HOW TO PLAY</span>
                  <button className="icon-touch-btn" onClick={() => setActiveModal(null)}>
                    <CloseIcon size={18} />
                  </button>
                </div>

                {/* 1. Objective */}
                <div className="guide-block">
                  <span className="guide-heading">1. MATCH OBJECTIVE</span>
                  <p className="guide-desc">
                    Duel against the CPU in a series of rounds. The first participant to reach the target score based on the chosen <strong>Best Of</strong> format wins the match and claims arena victory!
                  </p>
                </div>

                {/* 2. Move Rules & Matchups (6 Ways to Win + 1 Draw) */}
                <div className="guide-block">
                  <span className="guide-heading">2. MOVE RULES &amp; MATCHUPS (6 WAYS TO WIN + 1 DRAW)</span>

                  {/* 3 Ways You Win */}
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--player-coral)', letterSpacing: '1px', marginTop: '4px' }}>
                    WAYS YOU WIN (3 WAYS):
                  </span>
                  <div className="rule-cards-grid">
                    <div className="sheet-rule-item">
                      <RockIcon size={22} color="#FF5C7A" />
                      <span><strong>ROCK</strong> crushes <strong>SCISSORS</strong></span>
                    </div>
                    <div className="sheet-rule-item">
                      <PaperIcon size={22} color="#FF5C7A" />
                      <span><strong>PAPER</strong> covers <strong>ROCK</strong></span>
                    </div>
                    <div className="sheet-rule-item">
                      <ScissorsIcon size={22} color="#FF5C7A" />
                      <span><strong>SCISSORS</strong> cuts <strong>PAPER</strong></span>
                    </div>
                  </div>

                  {/* 3 Ways CPU Wins */}
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--cpu-cyan)', letterSpacing: '1px', marginTop: '6px' }}>
                    WAYS CPU WINS (3 WAYS):
                  </span>
                  <div className="rule-cards-grid">
                    <div className="sheet-rule-item">
                      <RockIcon size={22} color="#3DE0FF" />
                      <span><strong>CPU ROCK</strong> crushes <strong>SCISSORS</strong></span>
                    </div>
                    <div className="sheet-rule-item">
                      <PaperIcon size={22} color="#3DE0FF" />
                      <span><strong>CPU PAPER</strong> covers <strong>ROCK</strong></span>
                    </div>
                    <div className="sheet-rule-item">
                      <ScissorsIcon size={22} color="#3DE0FF" />
                      <span><strong>CPU SCISSORS</strong> cuts <strong>PAPER</strong></span>
                    </div>
                  </div>

                  {/* 1 Way to Draw */}
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--highlight-yellow)', letterSpacing: '1px', marginTop: '6px' }}>
                    WAY TO DRAW (1 WAY):
                  </span>
                  <div className="rule-cards-grid">
                    <div className="sheet-rule-item">
                      <DrawEqualIcon size={22} color="#FFD84D" />
                      <span><strong>TIE / DRAW:</strong> Identical moves (Rock vs Rock, Paper vs Paper, Scissors vs Scissors)</span>
                    </div>
                  </div>
                </div>

                {/* 3. Match Formats */}
                <div className="guide-block">
                  <span className="guide-heading">3. MATCH FORMATS</span>
                  <ul className="guide-desc" style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <li><strong>Best of 3:</strong> First player to score <strong>2 points</strong> wins.</li>
                    <li><strong>Best of 5:</strong> First player to score <strong>3 points</strong> wins.</li>
                    <li><strong>Best of 7:</strong> First player to score <strong>4 points</strong> wins.</li>
                  </ul>
                </div>

                {/* 4. Desktop Controls & Keyboard Shortcuts */}
                <div className="guide-block">
                  <span className="guide-heading">4. CONTROLS &amp; SHORTCUTS</span>
                  <table className="shortcuts-table">
                    <tbody>
                      <tr>
                        <td><kbd>1</kbd> or <kbd>R</kbd></td>
                        <td>Select <strong>ROCK</strong></td>
                      </tr>
                      <tr>
                        <td><kbd>2</kbd> or <kbd>P</kbd></td>
                        <td>Select <strong>PAPER</strong></td>
                      </tr>
                      <tr>
                        <td><kbd>3</kbd> or <kbd>S</kbd></td>
                        <td>Select <strong>SCISSORS</strong></td>
                      </tr>
                      <tr>
                        <td><kbd>Space</kbd> / <kbd>Enter</kbd></td>
                        <td><strong>Next Round</strong> / <strong>Play Again</strong></td>
                      </tr>
                      <tr>
                        <td><kbd>Esc</kbd></td>
                        <td>Close dialog / modals</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 5. Career Streaks */}
                <div className="guide-block">
                  <span className="guide-heading">5. CAREER PROGRESS &amp; STREAKS</span>
                  <p className="guide-desc">
                    Every match outcome is saved locally in your browser. Consecutive match victories build your <strong>Win Streak 🔥</strong>. A defeat resets the active streak to 0, while total career wins accumulate over time.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
