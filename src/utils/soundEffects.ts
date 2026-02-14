// Sound effects utility using Web Audio API and browser speech synthesis

export class SoundEffects {
  private audioContext: AudioContext | null = null
  private enabled: boolean = true
  private englishVoice: SpeechSynthesisVoice | null = null
  private spanishVoice: SpeechSynthesisVoice | null = null
  private ttsRate: number = 1.0 // Default speech rate

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.loadVoices()
      // Voices may load asynchronously
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.loadVoices()
      }
      // Load saved rate from localStorage
      const savedRate = localStorage.getItem('ttsRate')
      if (savedRate) {
        this.ttsRate = parseFloat(savedRate)
      }
    }
  }

  // Get current TTS rate
  getRate(): number {
    return this.ttsRate
  }

  // Set TTS rate (0.5 = slow, 1.0 = normal, 1.5 = fast)
  setRate(rate: number) {
    this.ttsRate = Math.max(0.5, Math.min(1.5, rate))
    localStorage.setItem('ttsRate', this.ttsRate.toString())
  }

  private loadVoices() {
    const voices = speechSynthesis.getVoices()
    if (voices.length > 0) {
      // Pre-select a good English voice
      this.englishVoice = 
        voices.find(v => v.name.includes('Google US English')) ||
        voices.find(v => v.name.includes('Google UK English')) ||
        voices.find(v => v.name.includes('Microsoft David') || v.name.includes('Microsoft Zira') || v.name.includes('Microsoft Mark')) ||
        voices.find(v => v.lang === 'en-US' || v.lang === 'en-GB') ||
        voices.find(v => v.lang && v.lang.startsWith('en')) ||
        null
      
      // Pre-select a good Spanish voice
      this.spanishVoice =
        voices.find(v => v.name.includes('Google español')) ||
        voices.find(v => v.name.includes('Microsoft Sabina') || v.name.includes('Microsoft Pablo')) ||
        voices.find(v => v.lang === 'es-MX' || v.lang === 'es-ES') ||
        voices.find(v => v.lang && v.lang.startsWith('es')) ||
        null
    }
  }

  enable() {
    this.enabled = true
  }

  disable() {
    this.enabled = false
    this.stopSpeaking()
  }

  // Stop any ongoing speech
  stopSpeaking() {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel()
    }
  }

  // Speak English text with browser TTS
  speakEnglish(text: string) {
    if (!this.enabled) return

    // Stop any current speech
    this.stopSpeaking()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = this.ttsRate // Use configurable speed
    utterance.pitch = 1.0
    utterance.volume = 1.0

    // Use pre-selected English voice
    if (this.englishVoice) {
      utterance.voice = this.englishVoice
    }

    speechSynthesis.speak(utterance)
  }

  // Speak Spanish text with browser TTS
  speakSpanish(text: string) {
    if (!this.enabled) return

    // Stop any current speech
    this.stopSpeaking()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'es-MX'
    utterance.rate = this.ttsRate // Use configurable speed
    utterance.pitch = 1.0
    utterance.volume = 1.0

    // Use pre-selected Spanish voice
    if (this.spanishVoice) {
      utterance.voice = this.spanishVoice
    }

    speechSynthesis.speak(utterance)
  }

  // Play a pleasant success sound
  playSuccess() {
    if (!this.enabled || !this.audioContext) return
    
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    
    oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime) // C5
    oscillator.frequency.setValueAtTime(659.25, this.audioContext.currentTime + 0.1) // E5
    oscillator.frequency.setValueAtTime(783.99, this.audioContext.currentTime + 0.2) // G5
    
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5)
    
    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 0.5)
  }

  // Play an encouraging "try again" sound
  playTryAgain() {
    if (!this.enabled || !this.audioContext) return
    
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    
    oscillator.frequency.setValueAtTime(392.00, this.audioContext.currentTime) // G4
    oscillator.frequency.setValueAtTime(349.23, this.audioContext.currentTime + 0.15) // F4
    oscillator.frequency.setValueAtTime(392.00, this.audioContext.currentTime + 0.3) // G4
    
    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5)
    
    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 0.5)
  }

  // Play a click/selection sound
  playClick() {
    if (!this.enabled || !this.audioContext) return
    
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    const filter = this.audioContext.createBiquadFilter()
    
    oscillator.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    
    filter.type = 'highpass'
    filter.frequency.setValueAtTime(1000, this.audioContext.currentTime)
    
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.08)
    
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.15, this.audioContext.currentTime + 0.005)
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.08)
    
    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 0.08)
  }

  // Play a softer click for subtle interactions
  playSoftClick() {
    if (!this.enabled || !this.audioContext) return
    
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.05)
    
    gainNode.gain.setValueAtTime(0.08, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.05)
    
    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 0.05)
  }

  // Play a level completion celebration sound
  playLevelComplete() {
    if (!this.enabled || !this.audioContext) return
    
    const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
    
    notes.forEach((freq, index) => {
      const oscillator = this.audioContext!.createOscillator()
      const gainNode = this.audioContext!.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext!.destination)
      
      const startTime = this.audioContext!.currentTime + index * 0.15
      
      oscillator.frequency.setValueAtTime(freq, startTime)
      
      gainNode.gain.setValueAtTime(0, startTime)
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05)
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4)
      
      oscillator.start(startTime)
      oscillator.stop(startTime + 0.4)
    })
  }

  // Encouraging voice messages
  speakEncouragement(type: 'correct' | 'tryAgain' | 'complete' | 'welcome') {
    if (!this.enabled) return
    
    const messages = {
      correct: ['¡Excelente!', '¡Muy bien!', '¡Perfecto!', '¡Lo lograste!', '¡Genial!'],
      tryAgain: ['¡Casi!', 'Inténtalo otra vez', '¡Tú puedes!', 'Sigue intentando'],
      complete: ['¡Nivel completado!', '¡Increíble trabajo!', '¡Eres asombroso!'],
      welcome: ['¡Bienvenido!', '¡Empecemos!', '¡Vamos a aprender!']
    }
    
    const message = messages[type][Math.floor(Math.random() * messages[type].length)]
    
    const utterance = new SpeechSynthesisUtterance(message)
    utterance.lang = 'es-MX'
    utterance.rate = 0.9
    utterance.pitch = 1.1
    speechSynthesis.speak(utterance)
  }
}

// Create singleton instance
export const soundEffects = new SoundEffects()
