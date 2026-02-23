import { useState } from 'react'
import { ArrowLeft, Send, Sparkles, AlertCircle, BookOpen, PenLine, Layers, RefreshCw, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react'
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

interface SentenceBoxFeedback {
  whatYouDidWell: {
    english: string
    spanish: string
  }
  oneStepToImprove: {
    english: string
    spanish: string
  }
  suggestedSentence: {
    english: string
    spanish: string
  }
  microPractice: {
    english: string
    spanish: string
  }
}

export function SandboxJournal({ level, onBack, onAddPoints }: SandboxJournalProps) {
  const [sentence1, setSentence1] = useState('')
  const [sentence2, setSentence2] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [sentenceFeedbacks, setSentenceFeedbacks] = useState<(SentenceBoxFeedback | null)[]>([null, null])
  const [sentenceFeedbackErrors, setSentenceFeedbackErrors] = useState<(string | null)[]>([null, null])
  const [sentenceFeedbackLoading, setSentenceFeedbackLoading] = useState<boolean[]>([false, false])
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
  const sentenceValues = [sentence1, sentence2]

  const getSandboxApiCandidates = () => {
    const path = '/.netlify/functions/openai-proxy'
    if (typeof window === 'undefined') return [path]
    const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname)
    if (!isLocal) return [path]
    return [
      path,
      `http://localhost:8888${path}`, // netlify dev
      `http://127.0.0.1:8888${path}`,
      `http://localhost:9999${path}`, // netlify functions:serve
      `http://127.0.0.1:9999${path}`,
    ]
  }

  const handleChangeTopic = () => {
    soundEffects.playClickSafe()
    setPromptOffset(prev => prev + 1)
    setSentence1('')
    setSentence2('')
    setError('')
    setSentenceFeedbacks([null, null])
    setSentenceFeedbackErrors([null, null])
    setSentenceFeedbackLoading([false, false])
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
    setSentenceFeedbacks([null, null])
    setSentenceFeedbackErrors([null, null])
    setSentenceFeedbackLoading(sentenceValues.map(() => true))

    // ELD-tier context for the AI system prompt
    const tierContext = eldTier === 'emerging'
      ? `The student is at Emerging ELD level. They used a sentence frame: "${currentPrompt.levels.emerging.sentenceFrame}". Focus feedback on vocabulary and basic grammar. Be extra encouraging and simple.`
      : eldTier === 'expanding'
      ? `The student is at Expanding ELD level. They had this model: "${currentPrompt.levels.expanding.sentenceFrame}". Encourage more complex sentences and varied vocabulary.`
      : `The student is at Bridging ELD level. Encourage academic language, complex sentences, and natural expression.`

    // Helper to call the Netlify proxy with one retry, for one sentence box
    const callProxyForSentence = async (sentenceText: string, index: number, retries = 1): Promise<SentenceBoxFeedback | null> => {
      const payload = {
        feedbackMode: 'single_sentence',
        sentence: sentenceText,
        level,
        sentenceIndex: index,
        tierContext,
        topic: currentPrompt.topic,
        languageFunction: currentPrompt.languageFunction,
      }

      let res: Response | null = null
      let lastNetworkError: unknown = null

      for (const endpoint of getSandboxApiCandidates()) {
        try {
          res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
          break
        } catch (networkErr) {
          lastNetworkError = networkErr
        }
      }

      if (!res) {
        if (retries > 0) {
          await new Promise(r => setTimeout(r, 800))
          return callProxyForSentence(sentenceText, index, retries - 1)
        }
        throw new Error(lastNetworkError instanceof Error ? lastNetworkError.message : 'Network error')
      }

      if (!res.ok) {
        const errorPayload = await res.json().catch(() => ({}))
        const errorMessage = String(errorPayload?.error || '')

        if (res.status === 500 && /key configured|No sandbox AI key configured/i.test(errorMessage)) {
          throw new Error('SANDBOX_API_KEY_MISSING')
        }

        if (retries > 0) {
          await new Promise(r => setTimeout(r, 2000))
          return callProxyForSentence(sentenceText, index, retries - 1)
        }
        throw new Error(errorMessage || 'AI service error')
      }
      return res.json()
    }

    try {
      const results = await Promise.allSettled(
        sentenceValues.map((sentenceText, index) => callProxyForSentence(sentenceText, index)),
      )

      const nextFeedbacks: (SentenceBoxFeedback | null)[] = [null, null]
      const nextErrors: (string | null)[] = [null, null]
      const nextLoading: boolean[] = [false, false]

      let successCount = 0

      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          nextFeedbacks[index] = result.value
          successCount += 1
          return
        }

        const message =
          result.status === 'rejected' && result.reason instanceof Error
            ? result.reason.message
            : 'No se pudo obtener retroalimentación para esta oración.'

        nextErrors[index] =
          message === 'SANDBOX_API_KEY_MISSING'
            ? 'AI no configurada para esta oración. Agrega OPENAI_API_KEY u OPENAI_SANDBOX_API_KEY.'
            : 'No se pudo obtener retroalimentación para esta oración. Intenta otra vez.'
      })

      setSentenceFeedbacks(nextFeedbacks)
      setSentenceFeedbackErrors(nextErrors)
      setSentenceFeedbackLoading(nextLoading)

      if (successCount > 0) {
        onAddPoints(successCount * 10, '¡Retroalimentación por oración completada!')
        soundEffects.playSuccess()
      }
    } catch (err) {
      if (err instanceof Error && err.message === 'SANDBOX_API_KEY_MISSING') {
        setError('Sandbox AI no está configurado. Agrega OPENAI_API_KEY u OPENAI_SANDBOX_API_KEY y reinicia el servidor.')
      } else {
        setError('No se pudo procesar la retroalimentación. Intenta otra vez.')
      }
    } finally {
      setIsLoading(false)
      setSentenceFeedbackLoading(sentenceValues.map(() => false))
    }
  }

  const handleReset = () => {
    soundEffects.playClickSafe()
    setSentence1('')
    setSentence2('')
    setError('')
    setSentenceFeedbacks([null, null])
    setSentenceFeedbackErrors([null, null])
    setSentenceFeedbackLoading([false, false])
    setShowHintFrame(false)
    if (isBuildOnlyStage) setInputMode('build')
  }

  const renderSentenceFeedback = (index: number) => {
    const loading = sentenceFeedbackLoading[index]
    const boxError = sentenceFeedbackErrors[index]
    const boxFeedback = sentenceFeedbacks[index]

    if (loading) {
      return (
        <div className="sentence-feedback-card loading">
          <p>Analizando esta oración...</p>
        </div>
      )
    }

    if (boxError) {
      return (
        <div className="sentence-feedback-card error">
          <h4>Retroalimentación</h4>
          <p>{boxError}</p>
        </div>
      )
    }

    if (!boxFeedback) return null

    return (
      <div className="sentence-feedback-card" key={`feedback-${index}`}>
        <h4>Retroalimentación de la oración {index + 1}</h4>
        <div className="sentence-feedback-grid">
          <div className="sentence-feedback-item">
            <label>What you did well</label>
            <p>{boxFeedback.whatYouDidWell.english}</p>
            <p className="es">{boxFeedback.whatYouDidWell.spanish}</p>
          </div>
          <div className="sentence-feedback-item">
            <label>One step to improve</label>
            <p>{boxFeedback.oneStepToImprove.english}</p>
            <p className="es">{boxFeedback.oneStepToImprove.spanish}</p>
          </div>
          <div className="sentence-feedback-item">
            <label>Suggested sentence</label>
            <p>{boxFeedback.suggestedSentence.english}</p>
            <p className="es">{boxFeedback.suggestedSentence.spanish}</p>
          </div>
          <div className="sentence-feedback-item">
            <label>Micro practice</label>
            <p>{boxFeedback.microPractice.english}</p>
            <p className="es">{boxFeedback.microPractice.spanish}</p>
          </div>
        </div>
      </div>
    )
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
            {renderSentenceFeedback(0)}
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
            {renderSentenceFeedback(1)}
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
            <div className="builder-preview-box">
              <p>{sentence1}</p>
              {renderSentenceFeedback(0)}
            </div>
            <div className="builder-preview-box">
              <p>{sentence2}</p>
              {renderSentenceFeedback(1)}
            </div>
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
    </div>
  )
}
