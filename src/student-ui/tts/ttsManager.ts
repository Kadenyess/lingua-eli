export type TtsLocale = 'en-US' | 'es-ES'

type Listener = (state: { speaking: boolean; paused: boolean; currentId: string | null }) => void

interface QueueItem {
  id: string
  text: string
  lang: TtsLocale
}

class TtsManager {
  private queue: QueueItem[] = []
  private current: SpeechSynthesisUtterance | null = null
  private currentId: string | null = null
  private listeners = new Set<Listener>()

  private emit() {
    const speaking = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis.speaking : false
    const paused = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis.paused : false
    const payload = { speaking, paused, currentId: this.currentId }
    this.listeners.forEach((l) => l(payload))
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener)
    this.emit()
    return () => this.listeners.delete(listener)
  }

  private pickVoice(lang: TtsLocale) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null
    const voices = window.speechSynthesis.getVoices()
    return (
      voices.find((v) => v.lang.toLowerCase() === lang.toLowerCase()) ||
      voices.find((v) => v.lang.toLowerCase().startsWith(lang.slice(0, 2).toLowerCase())) ||
      null
    )
  }

  private playNext() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    if (this.current || this.queue.length === 0) {
      this.emit()
      return
    }

    const item = this.queue.shift()!
    const utterance = new SpeechSynthesisUtterance(item.text)
    utterance.lang = item.lang
    const voice = this.pickVoice(item.lang)
    if (voice) utterance.voice = voice
    utterance.rate = 0.95
    utterance.pitch = 1
    this.current = utterance
    this.currentId = item.id
    utterance.onend = () => {
      this.current = null
      this.currentId = null
      this.emit()
      this.playNext()
    }
    utterance.onerror = () => {
      this.current = null
      this.currentId = null
      this.emit()
      this.playNext()
    }
    window.speechSynthesis.speak(utterance)
    this.emit()
  }

  speak(text: string, lang: TtsLocale, id = 'single') {
    this.stop()
    this.enqueue({ id, text, lang })
  }

  enqueue(item: QueueItem) {
    if (!item.text.trim()) return
    this.queue.push(item)
    this.playNext()
  }

  enqueueMany(items: QueueItem[]) {
    items.forEach((item) => {
      if (item.text.trim()) this.queue.push(item)
    })
    this.playNext()
  }

  stop() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    this.queue = []
    this.current = null
    this.currentId = null
    window.speechSynthesis.cancel()
    this.emit()
  }

  pause() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.pause()
    this.emit()
  }

  resume() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.resume()
    this.emit()
  }
}

export const ttsManager = new TtsManager()
