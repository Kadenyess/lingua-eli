import { useState } from 'react'
import { ArrowLeft, Send, Sparkles, CheckCircle, AlertCircle, BookOpen, PenLine, Layers, RefreshCw, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react'
import { soundEffects } from '../utils/soundEffects'
import { getDailyPrompt, getELDTier, ELD_TIER_LABELS, LF_LABELS_ES } from '../data/journalPrompts'
import type { ELDTier } from '../data/journalPrompts'
import './SandboxJournal.css'

type InputMode = 'type' | 'build'

interface SentenceBuilderProps {
  frame: string
  baseWordBank: string[]
  level: number
  onChange: (sentence1: string, sentence2: string) => void
}

const grade3AcademicWords = [
  'describe',
  'compare',
  'details',
  'cause',
  'effect',
  'predict',
  'solution',
  'region',
]

const grade4AcademicWords = [
  'summarize',
  'evidence',
  'infer',
  'estimate',
  'organize',
  'prefer',
  'result',
]

const grade5AcademicWords = [
  'analyze',
  'significant',
  'context',
  'conclude',
  'justify',
  'evaluate',
  'impact',
]

function getGradeBand(level: number): 3 | 4 | 5 {
  // Levels 1–20: Grade 3 focus (including pre-literacy + on-level)
  // Levels 21–30: Grade 4 focus
  // Levels 31–40: Grade 5 focus
  if (level <= 20) return 3
  if (level <= 30) return 4
  return 5
}

function SentenceBuilder({ frame, baseWordBank, level, onChange }: SentenceBuilderProps) {
  const blanks = frame.split('___').length - 1
  const [selectedWords, setSelectedWords] = useState<(string | null)[]>(Array(blanks).fill(null))
  const [activeBlankIndex, setActiveBlankIndex] = useState<number | null>(null)

  const gradeBand = getGradeBand(level)
  const extraWords =
    gradeBand === 3 ? grade3AcademicWords : gradeBand === 4 ? grade4AcademicWords : grade5AcademicWords

  const mergedBank = Array.from(new Set([...baseWordBank, ...extraWords]))

  const segments = frame.split('___')

  const buildSentences = (words: (string | null)[]) => {
    let filled = ''
    for (let i = 0; i < segments.length; i++) {
      filled += segments[i]
      if (i < words.length && words[i]) {
        filled += words[i]
      }
    }
    const trimmed = filled.trim()
    if (!trimmed) {
      onChange('', '')
      return
    }

    const parts = trimmed.split('.').map(p => p.trim()).filter(Boolean)

    if (parts.length >= 2) {
      const s1 = parts[0] + (parts[0].endsWith('.') ? '' : '.')
      const s2 = parts.slice(1).join('. ').replace(/\.+$/, '') + '.'
      onChange(s1, s2)
    } else {
      const s1 = trimmed.endsWith('.') ? trimmed : trimmed + '.'
      onChange(s1, '')
    }
  }

  const nextEmptyIndex = selectedWords.findIndex(w => w === null)
  const filledCount = selectedWords.filter(Boolean).length

  const handleWordClick = (word: string) => {
    const idx =
      activeBlankIndex !== null
        ? activeBlankIndex
        : selectedWords.findIndex(w => w === null)

    if (idx === -1) return

    const updated = [...selectedWords]
    updated[idx] = word
    setSelectedWords(updated)
    setActiveBlankIndex(null)
    buildSentences(updated)
  }

  const handleBlankClick = (index: number) => {
    setActiveBlankIndex(index)
  }

  const handleBlankClear = (index: number) => {
    const updated = [...selectedWords]
    updated[index] = null
    setSelectedWords(updated)
    setActiveBlankIndex(index)
    buildSentences(updated)
  }

  const handleClearAll = () => {
    const reset = Array(blanks).fill(null)
    setSelectedWords(reset)
    setActiveBlankIndex(0)
    buildSentences(reset)
  }

  return (
    <div className="sentence-builder">
      <div className="builder-toolbar">
        <div className="builder-progress-pill">
          <span>Espacios llenos</span>
          <strong>{filledCount} / {blanks}</strong>
        </div>
        <div className="builder-toolbar-actions">
          <button type="button" className="builder-mini-btn" onClick={handleClearAll}>
            Limpiar todo
          </button>
        </div>
      </div>

      <div className="builder-slot-panel">
        <label>1. Elige un espacio / Choose a blank</label>
        <div className="builder-slots">
          {Array.from({ length: blanks }).map((_, index) => (
            <div
              key={index}
              className={`builder-slot ${activeBlankIndex === index ? 'active' : ''} ${selectedWords[index] ? 'filled' : ''}`}
            >
              <button
                type="button"
                className="builder-slot-main"
                onClick={() => handleBlankClick(index)}
              >
                <span className="builder-slot-index">{index + 1}</span>
                <span className="builder-slot-text">{selectedWords[index] || 'Selecciona palabra'}</span>
              </button>
              {selectedWords[index] && (
                <button
                  type="button"
                  className="builder-slot-clear"
                  onClick={() => handleBlankClear(index)}
                  aria-label={`Quitar palabra del espacio ${index + 1}`}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="sentence-builder-frame">
        <label>Construye tu oración con tarjetas:</label>
        <p className="sentence-frame">
          {segments.map((seg, i) => (
            <span key={i}>
              {seg}
              {i < blanks && (
                <button
                  type="button"
                  className={`builder-blank ${activeBlankIndex === i ? 'active' : ''} ${selectedWords[i] ? 'filled' : ''}`}
                  onClick={() => handleBlankClick(i)}
                >
                  {selectedWords[i] || '___'}
                </button>
              )}
            </span>
          ))}
        </p>
      </div>

      <div className="word-bank">
        <label>2. Toca una palabra / Tap a word</label>
        <p className="builder-helper-text">
          {activeBlankIndex !== null
            ? `Estás llenando el espacio ${activeBlankIndex + 1}.`
            : nextEmptyIndex >= 0
            ? `Siguiente espacio recomendado: ${nextEmptyIndex + 1}.`
            : 'Todos los espacios están llenos. Puedes cambiar palabras si quieres.'}
        </p>
        <div className="word-bank-chips builder-chip-grid">
          {mergedBank.map((word) => (
            <button
              key={word}
              type="button"
              className={`word-chip builder-chip ${selectedWords.includes(word) ? 'used' : ''}`}
              onClick={() => handleWordClick(word)}
            >
              {word}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

interface SandboxJournalProps {
  level: number
  onBack: () => void
  onAddPoints: (points: number, message: string) => void
}

interface AIFeedback {
  corrected: string
  suggestions: string[]
  encouragement: string
  score: number
  grammarExplanations: {
    english: string
    spanish: string
  }
}

export function SandboxJournal({ level, onBack, onAddPoints }: SandboxJournalProps) {
  const [sentence1, setSentence1] = useState('')
  const [sentence2, setSentence2] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState<AIFeedback | null>(null)
  const [error, setError] = useState('')
  const [promptOffset, setPromptOffset] = useState(0)
  const [showHintFrame, setShowHintFrame] = useState(false)
  const [inputMode, setInputMode] = useState<InputMode>('type')
  const sandboxStage = level <= 5 ? 'foundational-build' : level <= 15 ? 'expanded-build' : 'free-response'
  const isBuildOnlyStage = sandboxStage === 'foundational-build' || sandboxStage === 'expanded-build'
  const isFreeResponseStage = sandboxStage === 'free-response'

  // Derived ELD values
  const eldTier: ELDTier = getELDTier(level)
  const currentPrompt = getDailyPrompt(promptOffset)
  const tierLabel = ELD_TIER_LABELS[eldTier]

  const handleChangeTopic = () => {
    soundEffects.playClickSafe()
    setPromptOffset(prev => prev + 1)
    setSentence1('')
    setSentence2('')
    setFeedback(null)
    setError('')
    setShowHintFrame(false)
    if (isBuildOnlyStage) {
      setInputMode('build')
    }
  }

  const handleWordBankClick = (word: string) => {
    soundEffects.playClickSafe()
    if (sentence1.length <= sentence2.length) {
      setSentence1(prev => prev ? `${prev} ${word}` : word)
    } else {
      setSentence2(prev => prev ? `${prev} ${word}` : word)
    }
  }

  const handleSubmit = async () => {
    if (!sentence1.trim() || !sentence2.trim()) {
      setError('Escribe 2 oraciones para continuar')
      return
    }

    soundEffects.playClickSafe()
    setIsLoading(true)
    setError('')
    setFeedback(null)

    // ELD-tier context for the AI system prompt
    const tierContext = eldTier === 'emerging'
      ? `The student is at Emerging ELD level. They used a sentence frame: "${currentPrompt.levels.emerging.sentenceFrame}". Focus feedback on vocabulary and basic grammar. Be extra encouraging and simple.`
      : eldTier === 'expanding'
      ? `The student is at Expanding ELD level. They had this model: "${currentPrompt.levels.expanding.sentenceFrame}". Encourage more complex sentences and varied vocabulary.`
      : `The student is at Bridging ELD level. Encourage academic language, complex sentences, and natural expression.`

    const pointsByTier = { emerging: 20, expanding: 15, bridging: 15 }

    // Helper to call the Netlify proxy with one retry
    const callProxy = async (retries = 1): Promise<AIFeedback | null> => {
      const res = await fetch('/.netlify/functions/openai-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sentence1,
          sentence2,
          tierContext,
          topic: currentPrompt.topic,
          languageFunction: currentPrompt.languageFunction,
        }),
      })
      if (!res.ok) {
        const errorPayload = await res.json().catch(() => ({}))
        const errorMessage = String(errorPayload?.error || '')

        if (res.status === 500 && /key configured|No sandbox AI key configured/i.test(errorMessage)) {
          throw new Error('SANDBOX_API_KEY_MISSING')
        }

        if (retries > 0) {
          await new Promise(r => setTimeout(r, 2000))
          return callProxy(retries - 1)
        }
        return null
      }
      return res.json()
    }

    try {
      const proxyFeedback = await callProxy()
      if (proxyFeedback) {
        setFeedback(proxyFeedback)
        onAddPoints(
          Math.floor((proxyFeedback.score ?? 70) / 10),
          '¡Diario completado!',
        )
        soundEffects.playSuccess()
      } else {
        throw new Error('Proxy returned no data')
      }
    } catch (err) {
      if (err instanceof Error && err.message === 'SANDBOX_API_KEY_MISSING') {
        setError('Sandbox AI no está configurado. Agrega OPENAI_API_KEY u OPENAI_SANDBOX_API_KEY y reinicia el servidor.')
        return
      }
      // Fallback to demo feedback (works offline / local dev)
      const demoFeedback: AIFeedback = generateDemoFeedback(sentence1, sentence2)
      setFeedback(demoFeedback)
      onAddPoints(pointsByTier[eldTier], '¡Diario completado!')
      soundEffects.playSuccess()
    } finally {
      setIsLoading(false)
    }
  }

  // Demo feedback generator when API is not available
  const generateDemoFeedback = (s1: string, s2: string): AIFeedback => {
    let score = 70
    const suggestions: string[] = []
    let grammarExplanationEnglish = ''
    let grammarExplanationSpanish = ''

    // Common error patterns and corrections
    const commonErrors = [
      { pattern: /\beated\b/g, correction: 'ate', explanation: { english: '"Eat" is an irregular verb. The past tense is "ate", not "eated".', spanish: '"Eat" es un verbo irregular. El pasado es "ate", no "eated".' } },
      { pattern: /\bhurted\b/g, correction: 'hurt', explanation: { english: '"Hurt" is a regular verb that stays the same in past tense. "Hurt", not "hurted".', spanish: '"Hurt" es un verbo regular que se mantiene igual en pasado. "Hurt", no "hurted".' } },
      { pattern: /\bgo(ed)?\b/g, correction: 'went', explanation: { english: '"Go" is an irregular verb. The past tense is "went", not "goed".', spanish: '"Go" es un verbo irregular. El pasado es "went", no "goed".' } },
      { pattern: /\bthinked\b/g, correction: 'thought', explanation: { english: '"Think" is an irregular verb. The past tense is "thought", not "thinked".', spanish: '"Think" es un verbo irregular. El pasado es "thought", no "thinked".' } },
      { pattern: /\bbuyed\b/g, correction: 'bought', explanation: { english: '"Buy" is an irregular verb. The past tense is "bought", not "buyed".', spanish: '"Buy" es un verbo irregular. El pasado es "bought", no "buyed".' } },
      { pattern: /\bcomed\b/g, correction: 'came', explanation: { english: '"Come" is an irregular verb. The past tense is "came", not "comed".', spanish: '"Come" es un verbo irregular. El pasado es "came", no "comed".' } },
      { pattern: /\bseed\b/g, correction: 'saw', explanation: { english: '"See" is an irregular verb. The past tense is "saw", not "seed".', spanish: '"See" es un verbo irregular. El pasado es "saw", no "seed".' } },
      { pattern: /\bteached\b/g, correction: 'taught', explanation: { english: '"Teach" is an irregular verb. The past tense is "taught", not "teached".', spanish: '"Teach" es un verbo irregular. El pasado es "taught", no "teached".' } },
      { pattern: /\bat morning time\b/gi, correction: 'in the morning', explanation: { english: 'We say "in the morning" or "for breakfast" instead of "at morning time".', spanish: 'Decimos "in the morning" o "for breakfast" en lugar de "at morning time".' } },
      { pattern: /\bat night time\b/gi, correction: 'at night', explanation: { english: 'We say "at night" instead of "at night time".', spanish: 'Decimos "at night" en lugar de "at night time".' } },
      { pattern: /\bsandwhich\b/gi, correction: 'sandwich', explanation: { english: 'The correct spelling is "sandwich".', spanish: 'La ortografía correcta es "sandwich".' } },
      { pattern: /\bI have (\d+) years old\b/gi, correction: 'I am $1 years old', explanation: { english: 'In English, we say "I am [age] years old" not "I have [age] years old".', spanish: 'En inglés, decimos "I am [edad] years old" no "I have [edad] years old".' } },
      { pattern: /\blike play\b/gi, correction: 'like playing', explanation: { english: 'After "like", we use gerund form (-ing) or "to + verb". "Like playing" or "like to play".', spanish: 'Después de "like", usamos la forma gerundio (-ing) o "to + verbo". "Like playing" o "like to play".' } },
      { pattern: /\bgo to the house\b/gi, correction: 'go home', explanation: { english: 'We say "go home" not "go to the house" when referring to our own home.', spanish: 'Decimos "go home" no "go to the house" cuando nos referimos a nuestra propia casa.' } },
      { pattern: /\bvery happy\b/gi, correction: 'very happy', explanation: { english: '"Very happy" is correct, but you could also say "really happy" or "excited".', spanish: '"Very happy" es correcto, pero también puedes decir "really happy" o "excited".' } },
      { pattern: /\bplay (soccer|basketball|tennis|football|baseball)\b/gi, correction: 'play $1', explanation: { english: 'For most sports, we say "play soccer" not "play soccer". Exception: "play the piano/guitar".', spanish: 'Para la mayoría de deportes, decimos "play soccer" no "play soccer". Excepción: "play the piano/guitar".' } }
    ]

    // Function to correct a single sentence
    const correctSentence = (sentence: string) => {
      let corrected = sentence.trim()
      const hasCapitalStart = /^[A-Z]/.test(corrected)
      const hasPeriodEnd = /[.!?]$/.test(corrected)
      let sentenceCorrections = 0

      // Apply common error corrections
      commonErrors.forEach(err => {
        if (err.pattern.test(corrected)) {
          corrected = corrected.replace(err.pattern, err.correction)
          sentenceCorrections++
        }
      })

      // Fix capitalization
      if (!hasCapitalStart && corrected.length > 0) {
        corrected = corrected.charAt(0).toUpperCase() + corrected.slice(1)
        sentenceCorrections++
      }

      // Fix punctuation
      if (!hasPeriodEnd && corrected.length > 0) {
        corrected = corrected + '.'
        sentenceCorrections++
      }

      return { corrected, corrections: sentenceCorrections }
    }

    // Process both sentences individually
    const sentence1Result = correctSentence(s1)
    const sentence2Result = correctSentence(s2)

    const totalCorrections = sentence1Result.corrections + sentence2Result.corrections

    // Build explanations based on corrections made
    if (totalCorrections > 0) {
      const originalText = `${s1} ${s2}`

      if (/\bhurted\b/gi.test(originalText)) {
        grammarExplanationEnglish = '"Hurt" is a regular verb that stays the same in past tense. "Hurt", not "hurted".'
        grammarExplanationSpanish = '"Hurt" es un verbo regular que se mantiene igual en pasado. "Hurt", no "hurted".'
        suggestions.push('¡Buen intento! "Hurt" no cambia en pasado.')
      } else if (/\beated\b/gi.test(originalText)) {
        grammarExplanationEnglish = '"Eat" is an irregular verb. The past tense is "ate", not "eated".'
        grammarExplanationSpanish = '"Eat" es un verbo irregular. El pasado es "ate", no "eated".'
        suggestions.push('¡Buen intento! Recuerda que "eat" en pasado es "ate".')
      } else if (/\bthinked\b/gi.test(originalText)) {
        grammarExplanationEnglish = '"Think" is an irregular verb. The past tense is "thought", not "thinked".'
        grammarExplanationSpanish = '"Think" es un verbo irregular. El pasado es "thought", no "thinked".'
        suggestions.push('¡Buen intento! "Think" en pasado es "thought".')
      } else if (/\bbuyed\b/gi.test(originalText)) {
        grammarExplanationEnglish = '"Buy" is an irregular verb. The past tense is "bought", not "buyed".'
        grammarExplanationSpanish = '"Buy" es un verbo irregular. El pasado es "bought", no "buyed".'
        suggestions.push('¡Buen intento! "Buy" en pasado es "bought".')
      } else if (/\bat morning time\b/gi.test(originalText)) {
        grammarExplanationEnglish = 'We say "in the morning" or "for breakfast" instead of "at morning time".'
        grammarExplanationSpanish = 'Decimos "in the morning" o "for breakfast" en lugar de "at morning time".'
        suggestions.push('¡Buen intento! En inglés decimos "in the morning".')
      } else if (/\bI have (\d+) years old\b/gi.test(originalText)) {
        grammarExplanationEnglish = 'In English, we say "I am [age] years old" not "I have [age] years old".'
        grammarExplanationSpanish = 'En inglés, decimos "I am [edad] years old" no "I have [edad] years old".'
        suggestions.push('¡Buen intento! Para decir la edad usamos "I am" no "I have".')
      } else if (/\blike play\b/gi.test(originalText)) {
        grammarExplanationEnglish = 'After "like", we use gerund form (-ing) or "to + verb". "Like playing" or "like to play".'
        grammarExplanationSpanish = 'Después de "like", usamos la forma gerundio (-ing) o "to + verbo". "Like playing" o "like to play".'
        suggestions.push('¡Buen intento! Después de "like" usa "playing" o "to play".')
      } else {
        grammarExplanationEnglish = 'Great job on trying to express yourself! I\'ve helped make your sentences more natural-sounding by fixing common grammar patterns.'
        grammarExplanationSpanish = '¡Buen trabajo al intentar expresarte! He ayudado a hacer tus oraciones más naturales corrigiendo patrones gramaticales comunes.'
        suggestions.push('¡Sigue así! Cada vez te irá mejor.')
      }

      score = Math.max(60, 85 - (totalCorrections * 5))
    } else {
      // No corrections needed
      suggestions.push('¡Excelente trabajo! Tus oraciones son claras y correctas.')
      score = 95
      grammarExplanationEnglish = 'Perfect! Your sentences follow the basic rules of capitalization, punctuation, and grammar. Keep up the great work!'
      grammarExplanationSpanish = '¡Perfecto! Tus oraciones siguen las reglas básicas de mayúsculas, puntuación y gramática. ¡Sigue así!'
    }

    suggestions.push('Sigue practicando todos los días.')

    // Adjust score for Emerging students (more generous)
    if (eldTier === 'emerging') {
      score = Math.min(score + 10, 100)
    }

    // Combine corrected sentences properly
    const correctedText = sentence1Result.corrected && sentence2Result.corrected
      ? `${sentence1Result.corrected} ${sentence2Result.corrected}`
      : sentence1Result.corrected || sentence2Result.corrected || ''

    // Tier-specific encouragement
    const tierEncouragements: Record<ELDTier, { high: string; low: string }> = {
      emerging: {
        high: '¡Muy bien! Usaste las palabras correctas. ¡Sigue practicando!',
        low: '¡Buen intento! Las oraciones con el modelo te ayudan mucho.',
      },
      expanding: {
        high: '¡Excelente! Tus oraciones son cada vez mejores.',
        low: '¡Buen trabajo! Intenta usar más detalles la próxima vez.',
      },
      bridging: {
        high: '¡Increíble! Tu inglés suena muy natural.',
        low: '¡Muy bien! Sigue escribiendo con más detalles.',
      },
    }

    return {
      corrected: correctedText,
      suggestions,
      encouragement: score >= 80
        ? tierEncouragements[eldTier].high
        : tierEncouragements[eldTier].low,
      score,
      grammarExplanations: {
        english: grammarExplanationEnglish,
        spanish: grammarExplanationSpanish
      }
    }
  }

  const handleReset = () => {
    soundEffects.playClickSafe()
    setSentence1('')
    setSentence2('')
    setFeedback(null)
    setError('')
    setShowHintFrame(false)
    if (isBuildOnlyStage) setInputMode('build')
  }

  const getScoreEmoji = (score: number) => {
    if (score >= 90) return '🌟'
    if (score >= 75) return '⭐'
    if (score >= 60) return '👍'
    return '💪'
  }

  return (
    <div className="sandbox-journal">
      <div className="journal-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={24} />
          <span>Volver</span>
        </button>
        <div className="journal-title">
          <BookOpen size={28} />
          <h2>Mi Diario de Inglés</h2>
        </div>
      </div>

      {/* ELD Level Banner */}
      <div className={`eld-level-banner tier-${eldTier}`}>
        <Layers size={18} />
        <span className="eld-tier-label">{tierLabel.es} ({tierLabel.en})</span>
        <span className="eld-level-badge">Nivel {level}</span>
      </div>

      <div className={`sandbox-stage-banner ${sandboxStage}`}>
        <span className="stage-pill-icon">{isBuildOnlyStage ? '🧩' : '✍️'}</span>
        <div>
          <strong>
            {sandboxStage === 'foundational-build' && 'Sandbox Mode: Foundational Building Blocks (Levels 1–5)'}
            {sandboxStage === 'expanded-build' && 'Sandbox Mode: Expanded Building Blocks (Levels 6–15)'}
            {sandboxStage === 'free-response' && 'Sandbox Mode: Free Response (Levels 16+)'}
          </strong>
          <p>
            {sandboxStage === 'foundational-build' && 'Build a sentence. Use the word bank and sentence frame only.'}
            {sandboxStage === 'expanded-build' && 'Put the words in order and complete the frames using structured word banks only.'}
            {sandboxStage === 'free-response' && 'Write 3 sentences explaining your ideas in your own words.'}
          </p>
        </div>
      </div>

      {/* Prompt Card */}
      <div className="prompt-card">
        <div className="prompt-header">
          <div className="prompt-topic">
            <span className="prompt-topic-label">{currentPrompt.topicEs}</span>
            <span className="prompt-function-tag">{LF_LABELS_ES[currentPrompt.languageFunction]}</span>
          </div>
          <button className="change-topic-btn" onClick={handleChangeTopic}>
            <RefreshCw size={16} />
            <span>Cambiar tema</span>
          </button>
        </div>

        {/* Emerging scaffold: sentence frame + word bank */}
        {eldTier === 'emerging' && (
          <div className="scaffold scaffold-emerging">
            <div className="sentence-frame-display">
              <label>Completa la oración / Complete the sentence:</label>
              <p className="sentence-frame">{currentPrompt.levels.emerging.sentenceFrame}</p>
            </div>
            <div className="example-sentence">
              <Lightbulb size={16} />
              <span>Ejemplo: {currentPrompt.levels.emerging.exampleSentence}</span>
            </div>
            <div className="word-bank">
              <label>Banco de palabras / Word Bank:</label>
              <div className="word-bank-chips">
                {currentPrompt.levels.emerging.wordBank.map((word) => (
                  <button
                    key={word}
                    className="word-chip"
                    onClick={() => handleWordBankClick(word)}
                    disabled={isLoading}
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Expanding scaffold: sentence frame model + guide question */}
        {eldTier === 'expanding' && (
          <div className="scaffold scaffold-expanding">
            <div className="sentence-frame-display">
              <label>Usa este modelo / Use this model:</label>
              <p className="sentence-frame">{currentPrompt.levels.expanding.sentenceFrame}</p>
            </div>
            <div className="guide-question">
              <Lightbulb size={16} />
              <span>{currentPrompt.levels.expanding.guideQuestionEs}</span>
            </div>
          </div>
        )}

        {/* Bridging scaffold: open prompt + optional hint */}
        {eldTier === 'bridging' && (
          <div className="scaffold scaffold-bridging">
            <p className="bridging-prompt">{currentPrompt.levels.bridging.promptEs}</p>
            <p className="bridging-prompt-en">{currentPrompt.levels.bridging.prompt}</p>
            {currentPrompt.levels.bridging.sentenceStarter && (
              <p className="sentence-starter">
                Puedes empezar con: <em>"{currentPrompt.levels.bridging.sentenceStarter}"</em>
              </p>
            )}
            <button
              className="hint-toggle"
              onClick={() => setShowHintFrame(!showHintFrame)}
            >
              {showHintFrame ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              <span>{showHintFrame ? 'Ocultar modelo' : 'Ver modelo de oración'}</span>
            </button>
            {showHintFrame && (
              <p className="sentence-frame hint-frame">
                {currentPrompt.levels.expanding.sentenceFrame}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Tier-aware instructions */}
      <div className="journal-instructions">
        <PenLine size={20} />
        <p>
          {eldTier === 'emerging'
            ? 'Usa las palabras del banco para completar 2 oraciones.'
            : eldTier === 'expanding'
            ? 'Escribe 2 oraciones usando el modelo como guía.'
            : 'Escribe 2 oraciones sobre el tema. ¡La IA te ayudará a mejorar!'}
        </p>
      </div>

      {!isBuildOnlyStage && !isFreeResponseStage && (
        <div className="journal-input-mode-toggle">
          <button
            type="button"
            className={`mode-btn ${inputMode === 'type' ? 'active' : ''}`}
            onClick={() => setInputMode('type')}
            disabled={isLoading}
          >
            Escribir con teclado
          </button>
          <button
            type="button"
            className={`mode-btn ${inputMode === 'build' ? 'active' : ''}`}
            onClick={() => setInputMode('build')}
            disabled={isLoading}
          >
            Construir con palabras
          </button>
        </div>
      )}

      {(isFreeResponseStage || inputMode === 'type') && (
        <div className="journal-inputs">
          <div className="input-group">
            <label>{isFreeResponseStage ? 'Oración 1 (Write 3 sentences total):' : 'Oración 1:'}</label>
            <textarea
              value={sentence1}
              onChange={(e) => setSentence1(e.target.value)}
              placeholder="Escribe tu primera oración en inglés..."
              rows={2}
              disabled={isLoading}
            />
          </div>

          <div className="input-group">
            <label>Oración 2:</label>
            <textarea
              value={sentence2}
              onChange={(e) => setSentence2(e.target.value)}
              placeholder="Escribe tu segunda oración en inglés..."
              rows={2}
              disabled={isLoading}
            />
          </div>
        </div>
      )}

      {isBuildOnlyStage && (
        <div className="journal-inputs">
          <SentenceBuilder
            frame={
              sandboxStage === 'foundational-build'
                ? 'The ___ can ___. It is ___.'
                : 'First, I ___. Then, I ___.'
            }
            baseWordBank={
              sandboxStage === 'foundational-build'
                ? ['dog', 'cat', 'bird', 'run', 'jump', 'swim', 'fast', 'small', 'happy', 'soft']
                : ['went', 'ate', 'played', 'read', 'helped', 'at school', 'at home', 'outside', 'first', 'then']
            }
            level={level}
            onChange={(s1, s2) => {
              setSentence1(s1)
              setSentence2(s2)
            }}
          />
          <div className="builder-preview">
            <label>Tus oraciones:</label>
            <p>{sentence1}</p>
            {sentence2 && <p>{sentence2}</p>}
            {!sentence2 && <p className="builder-preview-hint">Completa todos los espacios para formar 2 oraciones.</p>}
          </div>
        </div>
      )}

      {!isBuildOnlyStage && inputMode === 'build' && (
        <div className="journal-inputs">
          <div className="builder-removed-note">
            Building-block scaffolds are only available in Levels 1–15.
          </div>
        </div>
      )}

      {error && (
        <div className="error-message">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="journal-actions">
        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Sparkles size={20} className="spin" />
              <span>Analizando...</span>
            </>
          ) : (
            <>
              <Send size={20} />
              <span>Enviar a la IA</span>
            </>
          )}
        </button>

        <button
          className="reset-btn"
          onClick={handleReset}
          disabled={isLoading}
        >
          Escribir otra vez
        </button>
      </div>

      {feedback && (
        <div className="feedback-card">
          <div className="feedback-header">
            <CheckCircle size={24} className="feedback-icon" />
            <h3>¡Retroalimentación de la IA! {getScoreEmoji(feedback.score)}</h3>
          </div>

          <div className="corrected-text">
            <label>Versión mejorada:</label>
            <p>{feedback.corrected}</p>
          </div>

          <div className="suggestions">
            <label>Consejos para mejorar:</label>
            <ul>
              {feedback.suggestions.map((suggestion, idx) => (
                <li key={idx}>{suggestion}</li>
              ))}
            </ul>
          </div>

          <div className="grammar-explanations">
            <div className="explanation-section">
              <label>🇬🇧 English Explanation:</label>
              <p>{feedback.grammarExplanations.english}</p>
            </div>

            <div className="explanation-section">
              <label>🇪🇸 Explicación en Español:</label>
              <p>{feedback.grammarExplanations.spanish}</p>
            </div>
          </div>

          <div className="encouragement">
            <Sparkles size={18} />
            <p>{feedback.encouragement}</p>
          </div>

          <div className="score-badge">
            Puntuación: {feedback.score}/100
          </div>
        </div>
      )}
    </div>
  )
}
