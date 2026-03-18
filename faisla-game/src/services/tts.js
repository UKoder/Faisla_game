/**
 * Text-to-speech — Web Speech API, fully offline.
 *
 * Key fixes:
 * - Don't force a voice when no exact match exists. Setting utterance.lang
 *   and letting the browser pick is more reliable than forcing voices[0].
 * - Re-fetch voices on every call (Chrome may load them lazily after first call).
 * - voiceschanged listener kept for initial cache warm-up.
 */

let cachedVoices = []

function refreshVoices() {
  if (!window.speechSynthesis) return
  const list = window.speechSynthesis.getVoices()
  if (list.length) cachedVoices = list
}

function setupVoiceListener() {
  if (!window.speechSynthesis) return
  refreshVoices()
  // Chrome fires this event once voices are asynchronously ready
  window.speechSynthesis.addEventListener('voiceschanged', refreshVoices)
}

if (typeof window !== 'undefined') setupVoiceListener()

/**
 * Find the best available voice for a given BCP-47 lang tag.
 * Returns null if no reasonable match — caller should NOT set utterance.voice
 * in that case, letting the browser use its own default for that language.
 * @param {string} lang  e.g. 'hi-IN', 'ta-IN', 'en-IN'
 * @returns {SpeechSynthesisVoice|null}
 */
function pickVoice(lang) {
  refreshVoices()
  const voices = cachedVoices

  if (!voices.length) return null

  const langLower    = lang.toLowerCase()
  const prefix       = langLower.split('-')[0]   // e.g. 'hi', 'ta', 'en'
  const regionSuffix = langLower.split('-')[1]   // e.g. 'in'

  // 1. Exact match (case-insensitive)
  const exact = voices.find((v) => v.lang.toLowerCase() === langLower)
  if (exact) return exact

  // 2. Same language + same region (e.g. hi-IN matches hi-IN-x-something)
  const sameRegion = voices.find(
    (v) => v.lang.toLowerCase().startsWith(prefix + '-' + regionSuffix)
  )
  if (sameRegion) return sameRegion

  // 3. Same language prefix only (e.g. 'hi' matches 'hi-IN', 'hi-Latn')
  const samePrefix = voices.find((v) => v.lang.toLowerCase().startsWith(prefix))
  if (samePrefix) return samePrefix

  // 4. No match — return null so the browser picks its own default
  return null
}

/**
 * Speak text aloud.
 * @param {string} text
 * @param {{ lang?: string; rate?: number; pitch?: number }} opts
 */
export function speak(text, { lang = 'en-IN', rate = 0.92, pitch = 1 } = {}) {
  if (!text || !window.speechSynthesis) return

  window.speechSynthesis.cancel()

  const utterance  = new SpeechSynthesisUtterance(text)
  utterance.lang   = lang    // always set lang — browser uses this even without a voice
  utterance.rate   = rate
  utterance.pitch  = pitch

  const voice = pickVoice(lang)
  // Only assign voice when we found a real match — avoids forcing wrong language
  if (voice) utterance.voice = voice

  // 50 ms gap lets cancel() flush (fixes Chrome silent-after-cancel bug)
  setTimeout(() => window.speechSynthesis.speak(utterance), 50)
}

export function stopSpeech() {
  window.speechSynthesis?.cancel()
}

export function isTtsSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}
