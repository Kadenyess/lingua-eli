import { useMemo, useState } from 'react'
import { ArrowLeft, CheckCircle2, RotateCcw } from 'lucide-react'
import { getCoreSentenceLevel } from '../levels'
import { getOrCreateStudentId, recordAttempt, updateVocabMastery, getVocabMastery } from '../storage/localTracking'
import { validateSentenceSelection } from '../validation/validator'
import type { LevelTask, SlotType, WordEntry } from '../types/engine'
import { useStudentI18n } from '../../student-ui/i18n/useI18n'
import { SpeakerButton } from '../../student-ui/tts/SpeakerButton'
import './CoreSentenceEngine.css'

interface Props {
  level: number
  onBack: () => void
  onAddPoints: (points: number, message: string) => void
  embedded?: boolean
}

const roleColorClass: Record<SlotType, string> = {
  subject: 'subject',
  verb: 'verb',
  object: 'object',
  descriptor: 'object',
  article: 'article',
  linkingVerb: 'verb',
}

export function CoreSentenceEngine({ level, onBack, onAddPoints, embedded = false }: Props) {
  const { dict, ttsLocale, lang } = useStudentI18n()
  const currentLevel = getCoreSentenceLevel(level)
  const task = currentLevel.tasks[0] as LevelTask
  const studentId = useMemo(() => getOrCreateStudentId(), [])
  const mastery = useMemo(() => getVocabMastery(), [level])

  const [selectedBySlot, setSelectedBySlot] = useState<Partial<Record<SlotType, WordEntry>>>({})
  const [activeSlot, setActiveSlot] = useState<SlotType | null>(task.slots[0] ?? null)
  const [validationResult, setValidationResult] = useState<ReturnType<typeof validateSentenceSelection> | null>(null)
  const [checkedCount, setCheckedCount] = useState(0)

  const slotLabels = dict.cse.slotLabels as Record<SlotType, string>

  const wordPools = useMemo(() => {
    const pools: { label: string; category: keyof LevelTask['wordBanks']; words: WordEntry[] }[] = [
      { label: dict.cse.wordBankTitles.article, category: 'article', words: task.wordBanks.article || [] },
      { label: dict.cse.wordBankTitles.noun, category: 'noun', words: task.wordBanks.noun || [] },
      { label: dict.cse.wordBankTitles.verb, category: 'verb', words: task.wordBanks.verb || [] },
      { label: dict.cse.wordBankTitles.adjective, category: 'adjective', words: task.wordBanks.adjective || [] },
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

  const localizedFeedback = validationResult
    ? (validationResult.isCorrect
      ? {
          title: dict.cse.feedback.successTitle,
          message: dict.cse.feedback.successMessage,
          hint: dict.cse.feedback.successHint,
        }
      : dict.cse.feedback[validationResult.errorType ?? 'logic_mismatch'])
    : null

  return (
    <div className="core-sentence-engine">
      {!embedded && (
        <>
          <div className="cse-header">
            <button className="cse-back" onClick={onBack}>
              <ArrowLeft size={20} />
              <span>{dict.cse.home}</span>
            </button>
            <div className="cse-title-wrap">
              <h2>{dict.cse.sandboxMode}</h2>
              <p>{currentLevel.title}</p>
            </div>
          </div>

          <div className="cse-progress-card">
            <div className="cse-progress-labels">
              <span>{dict.cse.levelOfFive(currentLevel.level)}</span>
              <span>{task.targetGrammarSkill}</span>
            </div>
            <div className="cse-progress-bar"><span style={{ width: `${(currentLevel.level / 5) * 100}%` }} /></div>
          </div>
        </>
      )}

      <div className="cse-task-card">
        <div className="cse-header-line">
          <h3>{lang === 'es' ? dict.cse.buildSentencePrompt : task.prompt}</h3>
          <SpeakerButton text={lang === 'es' ? dict.cse.buildSentencePrompt : task.prompt} lang={ttsLocale} label={dict.tts.readInstruction} id={`cse-prompt-${task.id}`} />
        </div>
        <p className="cse-frame-label">{dict.cse.frameLabel}: {task.displayFrame}</p>

        <div className="cse-slots" role="list" aria-label={dict.cse.sentenceSlotsAria}>
          {task.slots.map((slot, idx) => {
            const selected = selectedBySlot[slot]
            return (
              <div key={`${slot}-${idx}`} className={`cse-slot ${roleColorClass[slot]} ${activeSlot === slot ? 'active' : ''}`}>
                <button type="button" className="cse-slot-main" onClick={() => setActiveSlot(slot)}>
                  <span className="cse-slot-role">{slotLabels[slot]}</span>
                  <span className="cse-slot-text">{selected?.text || dict.cse.tapToFill}</span>
                </button>
                {selected && (
                  <button type="button" className="cse-slot-clear" onClick={() => clearSlot(slot)} aria-label={dict.cse.clearSlot(slotLabels[slot])}>
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
          <div className="card-head-row compact">
            <h4>{localizedFeedback?.title ?? validationResult.feedback.title}</h4>
            <SpeakerButton
              text={`${localizedFeedback?.title ?? validationResult.feedback.title}. ${localizedFeedback?.message ?? validationResult.feedback.message}. ${localizedFeedback?.hint ?? validationResult.feedback.hint}`}
              lang={ttsLocale}
              label={dict.tts.readFeedback}
              id={`cse-feedback-${task.id}`}
            />
          </div>
          <p>{localizedFeedback?.message ?? validationResult.feedback.message}</p>
          <p className="hint">{localizedFeedback?.hint ?? validationResult.feedback.hint}</p>
          {!validationResult.isCorrect && validationResult.errorType && (
            <p className="tag">{dict.cse.tagLabel}: {validationResult.errorType}</p>
          )}
          {validationResult.isCorrect && <p className="sentence">{validationResult.normalizedSentence}</p>}
        </div>
      )}

      <div className="cse-actions">
        <button className="cse-check" onClick={handleCheck}>{dict.cse.checkAnswer}</button>
        <button className="cse-try" onClick={handleTryAgain}>
          <RotateCcw size={16} />
          <span>{dict.cse.tryAgain}</span>
        </button>
        <SpeakerButton text={`${dict.cse.checkAnswer}. ${dict.cse.tryAgain}.`} lang={ttsLocale} label={dict.tts.readButtons} id={`cse-actions-${task.id}`} />
      </div>

      {!embedded && (
        <div className="cse-footer-stats">
          <span>{dict.cse.unlockedWords(unlockedCount)}</span>
          <span>{dict.cse.checks(checkedCount)}</span>
        </div>
      )}
    </div>
  )
}
