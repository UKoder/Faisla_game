import { useState } from 'react'
import { speak, stopSpeech } from '../services/tts'
import { useGameStore } from '../state/gameStore'

const narratorMeta = {
  elder: {
    label: 'Wise Elder',
    tone: 'Shares long-term wisdom from experience.',
    icon: '🧓',
    cssClass: 'narrator-elder',
    textColor: '#d4a843',
  },
  bank_mitr: {
    label: 'Bank Mitr',
    tone: 'Explains formal schemes and safe options.',
    icon: '🏦',
    cssClass: 'narrator-bank_mitr',
    textColor: '#4caf50',
  },
  scammer: {
    label: 'Scammer',
    tone: 'Sounds helpful, but is dangerous.',
    icon: '⚠️',
    cssClass: 'narrator-scammer',
    textColor: '#ef4444',
  },
  self: {
    label: 'Your Inner Voice',
    tone: 'Reminds you of your own experience.',
    icon: '💭',
    cssClass: 'narrator-self',
    textColor: '#4a9eca',
  },
}

export function NarratorHint({ narrator, audioKey, cardPrompt }) {
  const meta       = narratorMeta[narrator] ?? narratorMeta.self
  const ttsEnabled = useGameStore((s) => s.ttsEnabled)
  const ttsLang    = useGameStore((s) => s.ttsLang)
  const [playing, setPlaying] = useState(false)

  function handlePlay() {
    if (!ttsEnabled) return
    if (playing) {
      stopSpeech()
      setPlaying(false)
      return
    }
    const text = cardPrompt ?? meta.tone
    setPlaying(true)
    speak(text, { lang: ttsLang ?? 'en-IN' })
    setTimeout(() => {
      if (!window.speechSynthesis?.speaking) setPlaying(false)
    }, (text.length / 12) * 1000 + 500)
  }

  const canPlay = ttsEnabled && (audioKey || cardPrompt)

  return (
    <div className={`nm-raised rounded-2xl border px-4 py-4 flex items-start gap-3 ${meta.cssClass}`}>
      <div className="text-2xl mt-0.5 shrink-0">{meta.icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-black uppercase tracking-widest" style={{ color: meta.textColor }}>
          {meta.label}
        </div>
        <div className="text-xs mt-1 leading-snug" style={{ color: 'var(--text-muted)' }}>{meta.tone}</div>

        {canPlay && (
          <button
            type="button"
            className="tts-btn mt-2.5 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold"
            style={{
              color: 'var(--text-secondary)',
              background: playing ? 'rgba(212,168,67,0.15)' : 'rgba(128,100,60,0.08)',
              border: playing ? '1px solid rgba(212,168,67,0.4)' : '1px solid var(--border-wheat)',
            }}
            onClick={handlePlay}
          >
            <span>{playing ? '⏹' : '▶'}</span>
            <span>{playing ? 'Stop' : 'Read aloud'}</span>
          </button>
        )}

        {!ttsEnabled && (
          <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            Voice is muted — tap 🔊 in the header to enable.
          </p>
        )}
      </div>
    </div>
  )
}
