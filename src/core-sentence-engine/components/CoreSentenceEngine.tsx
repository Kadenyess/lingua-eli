import { useMemo, useState } from 'react'
import { ArrowLeft, CheckCircle2, RotateCcw } from 'lucide-react'
import { getCoreSentenceLevel } from '../levels'
import { getOrCreateStudentId, recordAttempt, updateVocabMastery, getVocabMastery } from '../storage/localTracking'
import { validateSentenceSelection } from '../validation/validator'
import type { LevelTask, SlotType, WordEntry } from '../types/engine'
import './CoreSentenceEngine.css'

interface Props {
  level: number
  onBack: () => void
  onAddPoints: (points: number, message: string) => void
}

const roleColorClass: Record<SlotType, string> = {
  subject: 'subject',
  verb: 'verb',
  object: 'object',
  descriptor: 'object',
  article: 'article',
  linkingVerb: 'verb',
}

export function CoreSentenceEngine({ level, onBack, onAddPoints }: Props) {
  const currentLevel = getCoreSentenceLevel(level)
  const task = currentLevel.tasks[0] as LevelTask
  const studentId = useMemo(() => getOrCreateStudentId(), [])
  const mastery = useMemo(() => getVocabMastery(), [level])

  const [selectedBySlot, setSelectedBySlot] = useState<Partial<Record<SlotType, WordEntry>>>({})
  const [activeSlot, setActiveSlot] = useState<SlotType | null>(task.slots[0] ?? null)
  const [validationResult, setValidationResult] = useState<ReturnType<typeof validateSentenceSelection> | null>(null)
  const [checkedCount, setCheckedCount] = useState(0)

  const wordPools = useMemo(() => {
    const pools: { label: string; category: keyof LevelTask['wordBanks']; words: WordEntry[] }[] = [
      { label: 'Articles', category: 'article', words: task.wordBanks.article || [] },
      { label: 'Nouns', category: 'noun', words: task.wordBanks.noun || [] },
      { label: 'Verbs', category: 'verb', words: task.wordBanks.verb || [] },
      { label: 'Adjectives', category: 'adjective', words: task.wordBanks.adjective || [] },
    ]
    return pools.filter((p) => p.words.length > 0)
  }, [task])

  const nextUnfilledSlot = task.slots.find((slot) => !selectedBySlot[slot]) ?? null

  const normalizedWords = task.slots.map((slot) => selectedBySlot[slot]?.text || '___')

  const assignWordToSlot = (word: WordEntry) => {
    const target = activeSlot || nextUnfilledSlot
    if (!target) return

    const slotAllowedIds = task.slotOptions[target]
    if (slotAllowedIds && !slotAllowedIds.includes(word.id)) return

    if (target === 'subject' && word.role && word.role !== 'subject') return
    if (target === 'object' && word.role && word.role !== 'object') return
    if (target === 'descriptor' && word.category !== 'adjective') return
    if (target === 'verb' && !(word.role === 'verb')) return
    if (target === 'linkingVerb' && !(word.role === 'linkingVerb')) return
    if (target === 'article' && word.category !== 'article') return

    setSelectedBySlot((prev) => ({ ...prev, [target]: word }))
    setActiveSlot(null)
    setValidationResult(null)
  }

  const clearSlot = (slot: SlotType) => {
    setSelectedBySlot((prev) => {
      const next = { ...prev }
      delete next[slot]
      return next
    })
    setActiveSlot(slot)
    setValidationResult(null)
  }

  const handleCheck = () => {
    const result = validateSentenceSelection(task, selectedBySlot)
    setValidationResult(result)
    setCheckedCount((c) => c + 1)

    const selectedWords = Object.values(selectedBySlot).filter(Boolean) as WordEntry[]
    updateVocabMastery(selectedWords, result.isCorrect)

    recordAttempt({
      studentId,
      level: currentLevel.level,
      taskId: task.id,
      selectedWordIds: selectedWords.map((w) => w.id),
      normalizedSentence: result.normalizedSentence,
      isCorrect: result.isCorrect,
      errorType: result.errorType,
      createdAt: new Date().toISOString(),
    })

    if (result.isCorrect) {
      onAddPoints(15, '¡Oración correcta!')
    }
  }

  const handleTryAgain = () => {
    setSelectedBySlot({})
    setActiveSlot(task.slots[0] ?? null)
    setValidationResult(null)
  }

  const unlockedCount = Object.values(mastery).filter((m) => m.unlocked).length

  return (
    <div className="core-sentence-engine">
      <div className="cse-header">
        <button className="cse-back" onClick={onBack}>
          <ArrowLeft size={20} />
          <span>Home</span>
        </button>
        <div className="cse-title-wrap">
          <h2>Sandbox Mode</h2>
          <p>{currentLevel.title}</p>
        </div>
      </div>

      <div className="cse-progress-card">
        <div className="cse-progress-labels">
          <span>Level {currentLevel.level} of 5</span>
          <span>{task.targetGrammarSkill}</span>
        </div>
        <div className="cse-progress-bar"><span style={{ width: `${(currentLevel.level / 5) * 100}%` }} /></div>
      </div>

      <div className="cse-task-card">
        <h3>{task.prompt}</h3>
        <p className="cse-frame-label">Frame: {task.displayFrame}</p>

        <div className="cse-slots" role="list" aria-label="Sentence slots">
          {task.slots.map((slot, idx) => {
            const selected = selectedBySlot[slot]
            return (
              <div key={`${slot}-${idx}`} className={`cse-slot ${roleColorClass[slot]} ${activeSlot === slot ? 'active' : ''}`}>
                <button type="button" className="cse-slot-main" onClick={() => setActiveSlot(slot)}>
                  <span className="cse-slot-role">{slot}</span>
                  <span className="cse-slot-text">{selected?.text || 'Tap to fill'}</span>
                </button>
                {selected && (
                  <button type="button" className="cse-slot-clear" onClick={() => clearSlot(slot)} aria-label={`Clear ${slot}`}>
                    ×
                  </button>
                )}
              </div>
            )
          })}
        </div>

        <div className="cse-preview">{normalizedWords.join(' ')} .</div>
      </div>

      <div className="cse-wordbanks">
        {wordPools.map((pool) => (
          <section key={pool.category} className="cse-wordbank-group">
            <h4>{pool.label}</h4>
            <div className="cse-wordbank-grid">
              {pool.words.map((word) => (
                <button
                  key={word.id}
                  type="button"
                  className={`cse-word-btn ${word.role ? roleColorClass[word.role] : pool.category === 'adjective' ? 'object' : pool.category === 'verb' ? 'verb' : pool.category === 'article' ? 'article' : 'subject'}`}
                  onClick={() => assignWordToSlot(word)}
                >
                  {word.text}
                  {mastery[word.id]?.unlocked && <CheckCircle2 size={14} className="cse-unlocked-icon" />}
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      {validationResult && (
        <div className={`cse-feedback ${validationResult.isCorrect ? 'success' : 'needs-fix'}`}>
          <h4>{validationResult.feedback.title}</h4>
          <p>{validationResult.feedback.message}</p>
          <p className="hint">{validationResult.feedback.hint}</p>
          {!validationResult.isCorrect && validationResult.errorType && (
            <p className="tag">Tag: {validationResult.errorType}</p>
          )}
          {validationResult.isCorrect && <p className="sentence">{validationResult.normalizedSentence}</p>}
        </div>
      )}

      <div className="cse-actions">
        <button className="cse-check" onClick={handleCheck}>Check Answer</button>
        <button className="cse-try" onClick={handleTryAgain}>
          <RotateCcw size={16} />
          <span>Try Again</span>
        </button>
      </div>

      <div className="cse-footer-stats">
        <span>Unlocked words: {unlockedCount}</span>
        <span>Checks: {checkedCount}</span>
      </div>
    </div>
  )
}
