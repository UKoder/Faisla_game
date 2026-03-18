import { BrowserRouter, Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion' // eslint-disable-line no-unused-vars
import { useEffect } from 'react'
import './index.css'
import { useGameStore } from './state/gameStore'
import { PillarsBar } from './components/PillarsBar'
import { DebtTrapVisualizer } from './components/DebtTrapVisualizer'
import { DecisionCard } from './components/DecisionCard'
import { NarratorHint } from './components/NarratorHint'
import { speak, stopSpeech, isTtsSupported } from './services/tts'

const phaseLabel = {
  pre_sowing: 'Pre-Sowing',
  sowing:     'Sowing',
  growing:    'Growing',
  harvest:    'Harvest',
  off_season: 'Off-Season',
}

const fadeUp = {
  initial:    { opacity: 0, y: 18 },
  animate:    { opacity: 1, y: 0 },
  exit:       { opacity: 0, y: -18 },
  transition: { duration: 0.35, ease: 'easeOut' },
}

/* ─────────────────── LAYOUT ─────────────────── */
function AppLayout({ children }) {
  const { ttsEnabled, toggleTts, lightMode, toggleLightMode } = useGameStore()

  const navLinks = [
    { to: '/',           label: 'Home' },
    { to: '/play',       label: 'Play' },
    { to: '/how-it-works', label: 'Learn' },
    { to: '/languages',  label: '🌐 Lang' },
  ]

  return (
    <div
      data-theme={lightMode ? 'light' : 'dark'}
      className="bg-field min-h-screen flex justify-center relative overflow-hidden"
      style={{ color: 'var(--text-primary)' }}
    >
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="relative z-10 w-full max-w-md px-4 py-4 flex flex-col gap-4">

        {/* Header — logo + theme/TTS toggles only */}
        <header className="nm-card rounded-3xl px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌾</span>
            <div className="flex flex-col leading-none">
              <span className="text-base font-black tracking-[0.2em] uppercase"
                style={{ background: 'linear-gradient(90deg,#d4a843,#f0c96a,#4caf50)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Faisla
              </span>
              <span className="text-xs tracking-widest uppercase mt-0.5" style={{ color: 'var(--text-muted)' }}>
                Farmer decision game
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleLightMode}
              title={lightMode ? 'Switch to dark mode' : 'Switch to light mode'}
              className="nm-btn w-9 h-9 rounded-full flex items-center justify-center text-base"
            >
              {lightMode ? '🌙' : '☀️'}
            </button>

            {isTtsSupported() && (
              <button
                type="button"
                onClick={() => { toggleTts(); stopSpeech() }}
                title={ttsEnabled ? 'Mute voice' : 'Unmute voice'}
                className="nm-btn w-9 h-9 rounded-full flex items-center justify-center text-base"
              >
                {ttsEnabled ? '🔊' : '🔇'}
              </button>
            )}
          </div>
        </header>

        {/* Nav bar — separate row so it never overflows */}
        <nav className="nm-card rounded-2xl px-3 py-2 flex gap-2 justify-center">
          {navLinks.map(({ to, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `nav-pill flex-1 text-center px-2 py-1.5 rounded-xl text-xs font-bold tracking-wide ${
                  isActive ? 'btn-wheat' : 'nm-btn'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Main */}
        <main className="flex-1 nm-card rounded-3xl px-5 py-5 flex justify-center">
          <AnimatePresence mode="wait">
            {children}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

/* ─────────────────── HOME ─────────────────── */
function HomeScreen() {
  const navigate    = useNavigate()
  const startNewRun = useGameStore((s) => s.startNewRun)

  const features = [
    { icon: '↔️', title: 'Swipe to decide', desc: 'Left or right on loans, insurance, mandi rates, and more.' },
    { icon: '⚖️', title: 'Four pillars',    desc: 'Balance family, crops, finance, and resilience.' },
    { icon: '📴', title: 'Offline-first',   desc: 'Works without internet. Add to Home Screen.' },
    { icon: '🎓', title: 'Real scenarios',  desc: 'Based on actual decisions rural farmers face.' },
  ]

  return (
    <motion.div className="flex flex-col gap-4 w-full" {...fadeUp}>
      <div className="nm-glow-wheat rounded-3xl px-5 py-5 text-center">
        <div className="text-5xl mb-3 animate-bounce" style={{ animationDuration: '2.5s' }}>🚜</div>
        <h1 className="text-xl font-black leading-snug"
          style={{ background: 'linear-gradient(90deg,#d4a843,#f0c96a,#8bc34a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Survive the season.
        </h1>
        <h1 className="text-xl font-black leading-snug" style={{ color: 'var(--text-primary)' }}>
          Keep your farm out of debt.
        </h1>
        <p className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          Every swipe is a real decision Indian farmers face across an agricultural year.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {features.map(({ icon, title, desc }) => (
          <div key={title} className="feature-card nm-raised rounded-2xl px-4 py-4"
            style={{ border: '1px solid var(--border-wheat)' }}>
            <div className="text-2xl mb-2">{icon}</div>
            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{title}</p>
            <p className="mt-1 text-xs leading-snug" style={{ color: 'var(--text-muted)' }}>{desc}</p>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => { startNewRun(); navigate('/play') }}
        className="btn-wheat w-full rounded-full py-3.5 text-sm tracking-wide"
      >
        🌱 Start New Season
      </button>
    </motion.div>
  )
}

/* ─────────────────── HELPERS ─────────────────── */
function formatSeasonsAndDays(totalDays) {
  return { seasons: Math.floor(totalDays / 365), days: totalDays % 365 }
}

function lossReasonMessage(reason) {
  switch (reason) {
    case 'family_collapse':     return 'Your family welfare dropped to zero — stress and hardship forced you to stop.'
    case 'crops_collapse':      return 'Your crops failed completely — the field could not sustain another season.'
    case 'finance_collapse':    return 'Your finances collapsed — debt and cash flow left the farm insolvent.'
    case 'resilience_collapse': return 'Your resilience ran out — repeated shocks left you unable to recover.'
    case 'year_complete':       return 'You completed a full farming year. Few farmers manage such balance.'
    default:                    return 'Your farm could not continue this season.'
  }
}

function lossIcon(reason) {
  return { family_collapse:'👨‍👩‍👧', crops_collapse:'🌾', finance_collapse:'💸', resilience_collapse:'🛡️', year_complete:'🏆' }[reason] ?? '💔'
}

/* ─────────────────── PLAY ─────────────────── */
function PlayScreen() {
  const {
    deck, currentIndex, metrics, inDebtTrap,
    gameOver, gameOverReason, day, seasonPhase,
    bestDaysSurvived, applyChoice, reset, ttsEnabled, ttsLang,
  } = useGameStore()

  const card    = deck[currentIndex]
  const current = formatSeasonsAndDays(day)
  const best    = formatSeasonsAndDays(bestDaysSurvived ?? 0)
  const isWin   = gameOverReason === 'year_complete'

  function cardPromptForLang(c) {
    if (!c) return ''
    if (ttsLang === 'hi-IN' && c.prompt_hi) return c.prompt_hi
    if (ttsLang === 'ta-IN' && c.prompt_ta) return c.prompt_ta
    return c.prompt
  }

  useEffect(() => {
    if (!ttsEnabled || !card) return
    speak(cardPromptForLang(card), { lang: ttsLang })
    return () => stopSpeech()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card?.id, ttsEnabled, ttsLang])

  if (gameOver) {
    return (
      <motion.div className="flex flex-col gap-4 w-full" {...fadeUp}>
        <div className={`rounded-3xl px-5 py-5 text-center ${isWin ? 'nm-glow-green' : 'nm-glow-red'}`}>
          <div className="text-5xl mb-2">{lossIcon(gameOverReason)}</div>
          <h2 className={`text-lg font-black ${isWin ? 'text-green-500' : 'text-red-500'}`}>
            {isWin ? 'Season Complete!' : 'Game Over'}
          </h2>
          <p className="mt-1.5 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {lossReasonMessage(gameOverReason)}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-left">
            <div className="nm-inset rounded-2xl px-4 py-3">
              <p className="text-xs uppercase tracking-widest font-bold" style={{ color: 'var(--text-muted)' }}>This run</p>
              <p className="mt-1 font-black text-sm" style={{ color: 'var(--text-primary)' }}>
                S{current.seasons + 1} · D{current.days}
              </p>
            </div>
            <div className="nm-inset rounded-2xl px-4 py-3"
              style={{ border: '1px solid rgba(76,175,80,0.25)' }}>
              <p className="text-xs uppercase tracking-widest font-bold text-green-600">Best run</p>
              <p className="mt-1 font-black text-sm text-green-500">
                S{best.seasons + 1} · D{best.days}
              </p>
            </div>
          </div>
        </div>

        <PillarsBar metrics={metrics} />

        <button type="button" className="btn-wheat w-full rounded-full py-3.5 text-sm" onClick={reset}>
          🔄 Try Again
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div className="relative flex flex-col gap-3 w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <DebtTrapVisualizer active={inDebtTrap} />

      <div className="nm-raised rounded-2xl px-4 py-3" style={{ border: '1px solid var(--border-wheat)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🌤️</span>
            <div>
              <span className="text-sm font-black" style={{ color: 'var(--text-primary)' }}>
                Season {current.seasons + 1}
              </span>
              <span className="text-xs ml-2" style={{ color: 'var(--text-muted)' }}>
                Day {current.days}
              </span>
            </div>
          </div>
          <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full phase-${seasonPhase}`}>
            {phaseLabel[seasonPhase] ?? seasonPhase}
          </span>
        </div>
        <p className="mt-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
          Keep family, field, money, and safety in balance.
        </p>
      </div>

      <PillarsBar metrics={metrics} />
      <DecisionCard card={card} onChoice={applyChoice} />

      <div className="flex items-center justify-between text-xs px-1" style={{ color: 'var(--text-muted)' }}>
        <span>🏆 Best: S{best.seasons + 1} · D{best.days}</span>
        <span>{currentIndex + 1} / {deck.length} cards</span>
      </div>

      <NarratorHint narrator={card?.narrator} audioKey={card?.audioKey} cardPrompt={cardPromptForLang(card)} />
    </motion.div>
  )
}

/* ─────────────────── LEARN ─────────────────── */
function HowItWorksScreen() {
  const steps = [
    { icon: '👨‍🌾', text: 'You play as a small Indian farmer across one agricultural year.' },
    { icon: '🃏', text: 'Each card is a real decision: loan offers, insurance, mandi prices, fraud calls, and more.' },
    { icon: '⚖️', text: 'Every swipe changes four pillars: Family Welfare, Crop Health, Financial Standing, and Risk Resilience.' },
    { icon: '📉', text: 'If any pillar collapses, the season ends — but you keep the learning, not the loss.' },
    { icon: '📴', text: 'Fully offline-first. Progress saved locally. No account needed.' },
  ]

  return (
    <motion.div className="flex flex-col gap-4 w-full" {...fadeUp}>
      <h2 className="text-lg font-black"
        style={{ background: 'linear-gradient(90deg,#d4a843,#8bc34a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        How Faisla works
      </h2>
      <div className="space-y-2">
        {steps.map(({ icon, text }, i) => (
          <motion.div key={i}
            className="feature-card nm-raised flex items-start gap-3 rounded-2xl px-3 py-3"
            style={{ border: '1px solid var(--border-wheat)' }}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07, duration: 0.3 }}
          >
            <span className="text-xl shrink-0">{icon}</span>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{text}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

/* ─────────────────── LANGUAGES ─────────────────── */
function LanguagesScreen() {
  const { ttsLang, setTtsLang, ttsEnabled } = useGameStore()

  const options = [
    {
      code: 'en-IN',
      name: 'English',
      native: 'English',
      icon: '🇮🇳',
      sample: 'You need money for seeds and fertilizer.',
      note: 'Default language. Widely supported on all devices.',
    },
    {
      code: 'hi-IN',
      name: 'Hindi',
      native: 'हिन्दी',
      icon: '🇮🇳',
      sample: 'आपको बीज और खाद के लिए पैसों की ज़रूरत है।',
      note: 'Requires a Hindi voice installed on your device. Available on most Android phones and Windows.',
    },
    {
      code: 'ta-IN',
      name: 'Tamil',
      native: 'தமிழ்',
      icon: '🇮🇳',
      sample: 'உங்களுக்கு விதைகள் மற்றும் உரத்திற்கு பணம் தேவை.',
      note: 'Requires a Tamil voice installed on your device. Available on Android and some desktop browsers.',
    },
  ]

  function handleSelect(code) {
    setTtsLang(code)
    stopSpeech()
    if (ttsEnabled) {
      const opt = options.find((o) => o.code === code)
      if (opt) speak(opt.sample, { lang: code })
    }
  }

  return (
    <motion.div className="flex flex-col gap-4 w-full" {...fadeUp}>
      <div>
        <h2 className="text-lg font-black"
          style={{ background: 'linear-gradient(90deg,#d4a843,#8bc34a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Voice Language
        </h2>
        <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
          Choose the language for text-to-speech. Tap a card to select and hear a sample.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {options.map(({ code, name, native, icon, sample, note }) => {
          const active = ttsLang === code
          return (
            <button
              key={code}
              type="button"
              onClick={() => handleSelect(code)}
              className={`w-full text-left rounded-2xl px-4 py-4 transition-all duration-200 ${
                active ? 'nm-glow-wheat' : 'nm-raised feature-card'
              }`}
              style={{ border: active ? '1px solid rgba(212,168,67,0.5)' : '1px solid var(--border-wheat)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <span className="text-sm font-black" style={{ color: 'var(--text-primary)' }}>{name}</span>
                    <span className="ml-2 text-xs font-bold" style={{ color: 'var(--text-muted)' }}>{native}</span>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  active ? 'border-yellow-400' : 'border-gray-500'
                }`}>
                  {active && <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />}
                </div>
              </div>

              <p className="text-xs italic leading-snug mb-2" style={{ color: 'var(--text-secondary)' }}>
                "{sample}"
              </p>
              <p className="text-xs leading-snug" style={{ color: 'var(--text-muted)' }}>{note}</p>

              {active && (
                <div className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold"
                  style={{ color: '#d4a843' }}>
                  <span>✓</span>
                  <span>Active — voice will read cards in {name}</span>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {!ttsEnabled && (
        <div className="nm-inset rounded-2xl px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          🔇 Voice is muted. Tap the 🔊 button in the header to enable audio.
        </div>
      )}
    </motion.div>
  )
}

/* ─────────────────── ROOT ─────────────────── */
export default function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/"             element={<HomeScreen />} />
          <Route path="/play"         element={<PlayScreen />} />
          <Route path="/how-it-works" element={<HowItWorksScreen />} />
          <Route path="/languages"    element={<LanguagesScreen />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  )
}
