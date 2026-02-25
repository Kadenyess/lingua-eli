import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StudentModeShell } from '../StudentModeShell'
import { CoreSentenceEngine } from '../../core-sentence-engine/components/CoreSentenceEngine'
import { useStudentI18n } from '../i18n/useI18n'
import { SpeakerButton } from '../tts/SpeakerButton'
import {
  buildTeacherLevelPerformanceRecord,
  didPassLevelSession,
  getModuleLevel,
  getModuleProgression,
  getShuffledLevelQuestions,
  literacyStageDefinitions,
  type CurriculumErrorType,
  type CurriculumModuleId,
  type TeacherLevelQuestionResult,
} from '../../curriculum'
import {
  appendLevelPerformanceRecord,
  clearStoredLevelSessionState,
  getStoredLevelSessionState,
  saveStoredLevelSessionState,
  type StoredLevelSessionState,
} from '../storage/levelSessionStorage'
import '../student-ui.css'

type SimpleModeId = 'grammar-detective' | 'logic-check' | 'sentence-expansion' | 'story-builder' | 'peer-review' | 'vocabulary-unlock' | 'timed-practice'

const modeToCurriculumModule: Record<SimpleModeId | 'sentence-builder', CurriculumModuleId> = {
  'sentence-builder': 'sentence_builder',
  'grammar-detective': 'grammar_detective',
  'logic-check': 'logic_check',
  'sentence-expansion': 'sentence_expansion',
  'story-builder': 'story_builder',
  'peer-review': 'peer_review',
  'vocabulary-unlock': 'vocabulary',
  'timed-practice': 'fluency_challenge',
}

function getStageName(stageId: string) {
  return literacyStageDefinitions.find((stage) => stage.id === stageId)?.display_name ?? stageId
}

function initialSeed(moduleId: string, levelNumber: number) {
  return Date.now() + moduleId.length * 17 + levelNumber * 101
}

function toQuestionResultsArray(resultsByQuestionNumber: Record<number, TeacherLevelQuestionResult>, totalQuestions: number) {
  const results: TeacherLevelQuestionResult[] = []
  for (let i = 1; i <= totalQuestions; i += 1) {
    const row = resultsByQuestionNumber[i]
    if (row) results.push(row)
  }
  return results
}

interface SimpleModeProps {
  modeId: SimpleModeId
  progressCurrent: number
  nextHref?: string
}

function SimpleChoiceModePage({ modeId, progressCurrent, nextHref }: SimpleModeProps) {
  const navigate = useNavigate()
  const { dict, ttsLocale } = useStudentI18n()
  const curriculumModuleId = modeToCurriculumModule[modeId]
  const curriculumLevel = getModuleLevel(curriculumModuleId, progressCurrent)
  const curriculumProgression = getModuleProgression(curriculumModuleId)
  const totalQuestions = curriculumLevel.total_questions_per_level
  const stored = useMemo(() => getStoredLevelSessionState(curriculumModuleId, progressCurrent), [curriculumModuleId, progressCurrent])
  const [seed, setSeed] = useState<number>(() => stored?.seed ?? initialSeed(modeId, progressCurrent))
  const [questionIndex, setQuestionIndex] = useState<number>(() => Math.min(totalQuestions - 1, stored?.questionIndex ?? 0))
  const [resultsByQuestionNumber, setResultsByQuestionNumber] = useState<Record<number, TeacherLevelQuestionResult>>(
    () => stored?.resultsByQuestionNumber ?? {},
  )
  const [reattemptCount, setReattemptCount] = useState<number>(() => stored?.reattemptCount ?? 0)
  const [selected, setSelected] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [levelOutcomeMessage, setLevelOutcomeMessage] = useState<string | null>(null)
  const sessionQuestions = useMemo(
    () => getShuffledLevelQuestions(curriculumModuleId, progressCurrent, seed),
    [curriculumModuleId, progressCurrent, seed],
  )
  const currentQuestion = sessionQuestions[questionIndex] ?? sessionQuestions[0]
  const currentQuestionNumber = currentQuestion?.question_number ?? questionIndex + 1
  const currentRecordedResult = resultsByQuestionNumber[currentQuestionNumber]
  const canContinue = !!currentRecordedResult
  const isLastQuestion = questionIndex >= totalQuestions - 1

  const modeText = dict.modes[modeId]
  const modeContent = dict.modeContent[modeId]
  const stageName = getStageName(curriculumLevel.literacy_stage)
  const progressLabel = `Level ${curriculumLevel.level_number} of ${curriculumProgression.levels.length} • Q ${questionIndex + 1}/${totalQuestions}`
  const description = levelOutcomeMessage ?? `${modeText.instruction} ${currentQuestion?.prompt_focus ?? curriculumLevel.level_objective}`
  const readPageItems = [
    modeText.title,
    modeText.instruction,
    stageName,
    currentQuestion?.prompt_focus ?? curriculumLevel.level_objective,
    ...modeContent.choices,
    ...(checked && selected !== null ? [selected === 0 ? modeContent.feedbackCorrect : modeContent.feedbackTryAgain] : []),
  ]

  const persistSessionState = (
    nextState: Pick<StoredLevelSessionState, 'questionIndex' | 'reattemptCount' | 'seed' | 'resultsByQuestionNumber'>,
  ) => {
    saveStoredLevelSessionState({
      moduleId: curriculumModuleId,
      levelNumber: progressCurrent,
      questionIndex: nextState.questionIndex,
      reattemptCount: nextState.reattemptCount,
      seed: nextState.seed,
      resultsByQuestionNumber: nextState.resultsByQuestionNumber,
      updatedAt: new Date().toISOString(),
    })
  }

  const handleCheckAnswer = () => {
    if (selected === null || !currentQuestion) return
    const correct = selected === 0
    const result: TeacherLevelQuestionResult = {
      question_id: currentQuestion.question_id,
      question_number: currentQuestion.question_number,
      correct,
      error_types: correct ? [] : (currentQuestion.expected_error_types.slice(0, 1) as CurriculumErrorType[]),
      question_role: currentQuestion.question_role,
    }
    const nextResults = { ...resultsByQuestionNumber, [result.question_number]: result }
    setResultsByQuestionNumber(nextResults)
    setChecked(true)
    persistSessionState({
      questionIndex,
      reattemptCount,
      seed,
      resultsByQuestionNumber: nextResults,
    })
  }

  const handleNext = () => {
    if (!canContinue) return
    setLevelOutcomeMessage(null)
    if (!isLastQuestion) {
      const nextIndex = Math.min(totalQuestions - 1, questionIndex + 1)
      setQuestionIndex(nextIndex)
      setSelected(null)
      setChecked(false)
      persistSessionState({
        questionIndex: nextIndex,
        reattemptCount,
        seed,
        resultsByQuestionNumber,
      })
      return
    }
    const questionResults = toQuestionResultsArray(resultsByQuestionNumber, totalQuestions)
    const correctCount = questionResults.filter((r) => r.correct).length
    appendLevelPerformanceRecord(
      buildTeacherLevelPerformanceRecord(curriculumModuleId, progressCurrent, questionResults, reattemptCount),
    )
    const passed = didPassLevelSession(curriculumModuleId, progressCurrent, correctCount)
    if (passed) {
      clearStoredLevelSessionState(curriculumModuleId, progressCurrent)
      if (nextHref) navigate(nextHref)
      return
    }
    const nextRetryCount = reattemptCount + 1
    const nextSeed = initialSeed(modeId, progressCurrent) + nextRetryCount * 1009
    setReattemptCount(nextRetryCount)
    setSeed(nextSeed)
    setQuestionIndex(0)
    setSelected(null)
    setChecked(false)
    setResultsByQuestionNumber({})
    setLevelOutcomeMessage(`Score ${correctCount}/10. Repeat this level.`)
    persistSessionState({
      questionIndex: 0,
      reattemptCount: nextRetryCount,
      seed: nextSeed,
      resultsByQuestionNumber: {},
    })
  }

  return (
    <StudentModeShell
      title={modeText.title}
      breadcrumb={modeText.title}
      description={description}
      progressLabel={progressLabel}
      progressCurrent={progressCurrent}
      progressTotal={curriculumProgression.levels.length}
      onNextClick={handleNext}
      nextDisabled={!canContinue}
      nextLabel={isLastQuestion ? dict.common.next : dict.common.continue}
      readPageItems={readPageItems}
    >
      <section className="mode-activity-card" aria-label={modeText.title}>
        <div className="card-head-row">
          <h2>{modeText.title} {dict.simpleMode.activityTitle}</h2>
          <SpeakerButton text={`${modeText.title}. ${modeText.instruction}`} lang={ttsLocale} label={dict.tts.readCard} id={`${modeId}-activity-head`} />
        </div>
        <div className="card-head-row compact">
          <p>{modeText.short}</p>
          <SpeakerButton text={modeText.short} lang={ttsLocale} label={dict.tts.readInstruction} id={`${modeId}-short`} />
        </div>
        <div className="card-head-row compact">
          <p>{`Stage: ${stageName}`}</p>
          <SpeakerButton text={`Stage: ${stageName}`} lang={ttsLocale} label={dict.tts.readThis} id={`${modeId}-stage`} />
        </div>
        <div className="card-head-row compact">
          <p>{`Question ${questionIndex + 1}: ${currentQuestion?.question_role.replace('_', ' ')}`}</p>
          <SpeakerButton text={`Question ${questionIndex + 1}`} lang={ttsLocale} label={dict.tts.readInstruction} id={`${modeId}-qnum`} />
        </div>
        <div className="card-head-row compact">
          <p>{currentQuestion?.prompt_focus ?? curriculumLevel.level_objective}</p>
          <SpeakerButton text={currentQuestion?.prompt_focus ?? curriculumLevel.level_objective} lang={ttsLocale} label={dict.tts.readInstruction} id={`${modeId}-objective`} />
        </div>

        <div className="mode-choice-grid" role="list" aria-label={modeText.instruction}>
          {modeContent.choices.map((choice, index) => (
            <div key={`${modeId}-${index}`} className="choice-row">
              <button
                type="button"
                className={`mode-choice-btn ${selected === index ? 'selected' : ''}`}
                onClick={() => {
                  setSelected(index)
                  setChecked(false)
                }}
              >
                {choice}
              </button>
              <SpeakerButton text={choice} lang={ttsLocale} label={dict.tts.readThis} id={`${modeId}-choice-${index}`} />
            </div>
          ))}
        </div>

        <div className="simple-task-row">
          <input
            value={selected === null ? '' : modeContent.choices[selected]}
            readOnly
            aria-label={dict.simpleMode.selectedAnswer}
            placeholder={dict.simpleMode.tapChoicePlaceholder}
          />
          <button
            type="button"
            onClick={handleCheckAnswer}
            disabled={selected === null}
            style={selected === null ? { opacity: 0.6, cursor: 'not-allowed' } : undefined}
          >
            {dict.simpleMode.checkAnswer}
          </button>
        </div>

        {canContinue && selected !== null && (
          <div className="mode-inline-feedback" role="status">
            <div className="card-head-row compact">
              <span>{(currentRecordedResult?.correct ?? (selected === 0)) ? modeContent.feedbackCorrect : modeContent.feedbackTryAgain}</span>
              <SpeakerButton
                text={(currentRecordedResult?.correct ?? (selected === 0)) ? modeContent.feedbackCorrect : modeContent.feedbackTryAgain}
                lang={ttsLocale}
                label={dict.tts.readFeedback}
                id={`${modeId}-feedback`}
              />
            </div>
          </div>
        )}
      </section>
    </StudentModeShell>
  )
}

export function SentenceBuilderModePage() {
  const navigate = useNavigate()
  const [points, setPoints] = useState(0)
  const { dict, lang } = useStudentI18n()
  const curriculumModuleId = modeToCurriculumModule['sentence-builder']
  const curriculumLevel = getModuleLevel(curriculumModuleId, 1)
  const curriculumProgression = getModuleProgression(curriculumModuleId)
  const totalQuestions = curriculumLevel.total_questions_per_level
  const stored = useMemo(() => getStoredLevelSessionState(curriculumModuleId, 1), [curriculumModuleId])
  const [seed, setSeed] = useState<number>(() => stored?.seed ?? initialSeed('sentence-builder', 1))
  const [questionIndex, setQuestionIndex] = useState<number>(() => Math.min(totalQuestions - 1, stored?.questionIndex ?? 0))
  const [resultsByQuestionNumber, setResultsByQuestionNumber] = useState<Record<number, TeacherLevelQuestionResult>>(
    () => stored?.resultsByQuestionNumber ?? {},
  )
  const [reattemptCount, setReattemptCount] = useState<number>(() => stored?.reattemptCount ?? 0)
  const [levelOutcomeMessage, setLevelOutcomeMessage] = useState<string | null>(null)
  const sessionQuestions = useMemo(() => getShuffledLevelQuestions(curriculumModuleId, 1, seed), [curriculumModuleId, seed])
  const currentQuestion = sessionQuestions[questionIndex] ?? sessionQuestions[0]
  const currentQuestionNumber = currentQuestion?.question_number ?? questionIndex + 1
  const hasCheckedCurrent = !!resultsByQuestionNumber[currentQuestionNumber]
  const isLastQuestion = questionIndex >= totalQuestions - 1
  const modeText = dict.modes['sentence-builder']
  const message = useMemo(() => {
    if (levelOutcomeMessage) return levelOutcomeMessage
    if (points <= 0) return currentQuestion?.prompt_focus ?? curriculumLevel.level_objective
    return lang === 'es' ? `Ganaste ${points} puntos de práctica.` : `You earned ${points} practice points.`
  }, [curriculumLevel.level_objective, currentQuestion, lang, levelOutcomeMessage, points])

  const persistSessionState = (
    nextState: Pick<StoredLevelSessionState, 'questionIndex' | 'reattemptCount' | 'seed' | 'resultsByQuestionNumber'>,
  ) => {
    saveStoredLevelSessionState({
      moduleId: curriculumModuleId,
      levelNumber: 1,
      questionIndex: nextState.questionIndex,
      reattemptCount: nextState.reattemptCount,
      seed: nextState.seed,
      resultsByQuestionNumber: nextState.resultsByQuestionNumber,
      updatedAt: new Date().toISOString(),
    })
  }

  const handleSentenceBuilderCheckResult = (result: { isCorrect: boolean; errorType: string | null }) => {
    if (!currentQuestion) return
    const row: TeacherLevelQuestionResult = {
      question_id: currentQuestion.question_id,
      question_number: currentQuestion.question_number,
      correct: result.isCorrect,
      error_types: result.isCorrect ? [] : (result.errorType ? [result.errorType as CurriculumErrorType] : []),
      question_role: currentQuestion.question_role,
    }
    const nextResults = { ...resultsByQuestionNumber, [row.question_number]: row }
    setResultsByQuestionNumber(nextResults)
    persistSessionState({
      questionIndex,
      reattemptCount,
      seed,
      resultsByQuestionNumber: nextResults,
    })
  }

  const handleSentenceBuilderNext = () => {
    if (!hasCheckedCurrent) return
    setLevelOutcomeMessage(null)
    if (!isLastQuestion) {
      const nextIndex = Math.min(totalQuestions - 1, questionIndex + 1)
      setQuestionIndex(nextIndex)
      persistSessionState({
        questionIndex: nextIndex,
        reattemptCount,
        seed,
        resultsByQuestionNumber,
      })
      return
    }

    const questionResults = toQuestionResultsArray(resultsByQuestionNumber, totalQuestions)
    const correctCount = questionResults.filter((r) => r.correct).length
    appendLevelPerformanceRecord(
      buildTeacherLevelPerformanceRecord(curriculumModuleId, 1, questionResults, reattemptCount),
    )
    const passed = didPassLevelSession(curriculumModuleId, 1, correctCount)
    if (passed) {
      clearStoredLevelSessionState(curriculumModuleId, 1)
      navigate('/modes/grammar-detective')
      return
    }

    const nextRetryCount = reattemptCount + 1
    const nextSeed = initialSeed('sentence-builder', 1) + nextRetryCount * 1009
    setReattemptCount(nextRetryCount)
    setSeed(nextSeed)
    setQuestionIndex(0)
    setResultsByQuestionNumber({})
    setLevelOutcomeMessage(`Score ${correctCount}/10. Repeat this level.`)
    persistSessionState({
      questionIndex: 0,
      reattemptCount: nextRetryCount,
      seed: nextSeed,
      resultsByQuestionNumber: {},
    })
  }

  return (
    <StudentModeShell
      title={modeText.title}
      breadcrumb={modeText.title}
      description={message}
      progressLabel={lang === 'es'
        ? `Nivel ${curriculumLevel.level_number} de ${curriculumProgression.levels.length} • P ${questionIndex + 1}/${totalQuestions}`
        : `Level ${curriculumLevel.level_number} of ${curriculumProgression.levels.length} • Q ${questionIndex + 1}/${totalQuestions}`}
      progressCurrent={curriculumLevel.level_number}
      progressTotal={curriculumProgression.levels.length}
      onNextClick={handleSentenceBuilderNext}
      nextDisabled={!hasCheckedCurrent}
      nextLabel={isLastQuestion ? dict.common.next : dict.common.continue}
      readPageItems={[modeText.title, modeText.short, getStageName(curriculumLevel.literacy_stage), currentQuestion?.prompt_focus ?? curriculumLevel.level_objective, message]}
    >
      <CoreSentenceEngine
        key={`cse-l1-r${reattemptCount}-q${questionIndex}`}
        level={1}
        embedded
        onBack={() => {}}
        onAddPoints={(pts) => setPoints((p) => p + pts)}
        onCheckResult={handleSentenceBuilderCheckResult}
      />
    </StudentModeShell>
  )
}

export function GrammarDetectiveModePage() {
  return <SimpleChoiceModePage modeId="grammar-detective" progressCurrent={1} nextHref="/modes/logic-check" />
}
export function LogicCheckModePage() {
  return <SimpleChoiceModePage modeId="logic-check" progressCurrent={1} nextHref="/modes/sentence-expansion" />
}
export function SentenceExpansionModePage() {
  return <SimpleChoiceModePage modeId="sentence-expansion" progressCurrent={1} nextHref="/modes/story-builder" />
}
export function StoryBuilderModePage() {
  return <SimpleChoiceModePage modeId="story-builder" progressCurrent={1} nextHref="/modes/peer-review" />
}
export function PeerReviewModePage() {
  return <SimpleChoiceModePage modeId="peer-review" progressCurrent={1} nextHref="/modes/vocabulary-unlock" />
}
export function VocabularyUnlockModePage() {
  return <SimpleChoiceModePage modeId="vocabulary-unlock" progressCurrent={1} nextHref="/modes/timed-practice" />
}
export function TimedPracticeModePage() {
  return <SimpleChoiceModePage modeId="timed-practice" progressCurrent={1} nextHref="/" />
}

export function MyProgressPage() {
  const { dict, ttsLocale } = useStudentI18n()
  return (
    <StudentModeShell
      title={dict.progressPage.title}
      breadcrumb={dict.progressPage.title}
      description={dict.progressPage.short}
      progressLabel={dict.progressPage.progressLabel}
      progressCurrent={2}
      progressTotal={8}
      nextHref="/"
      nextLabel={dict.progressPage.nextLabel}
      readPageItems={[dict.progressPage.title, dict.progressPage.short, dict.progressPage.modesPracticed, dict.progressPage.wordsUnlocked, dict.progressPage.streak]}
    >
      <section className="mode-activity-card" aria-label={dict.progressPage.summaryTitle}>
        <div className="card-head-row">
          <h2>{dict.progressPage.summaryTitle}</h2>
          <SpeakerButton text={dict.progressPage.summaryTitle} lang={ttsLocale} label={dict.tts.readTitle} id="progress-summary-title" />
        </div>
        <div className="mode-choice-grid">
          {[dict.progressPage.modesPracticed, dict.progressPage.wordsUnlocked, dict.progressPage.streak].map((line, index) => (
            <div className="choice-row" key={`prog-${index}`}>
              <div className={`mode-choice-btn ${index === 0 ? 'selected' : ''}`} aria-hidden="true">{line}</div>
              <SpeakerButton text={line} lang={ttsLocale} label={dict.tts.readStat} id={`progress-line-${index}`} />
            </div>
          ))}
        </div>
      </section>
    </StudentModeShell>
  )
}

export function SettingsPage() {
  const { dict, ttsLocale } = useStudentI18n()
  const options = [dict.settingsPage.textSizeLarge, dict.settingsPage.languageHelp, dict.settingsPage.highContrastOn]
  return (
    <StudentModeShell
      title={dict.settingsPage.title}
      breadcrumb={dict.settingsPage.title}
      description={dict.settingsPage.short}
      progressLabel={dict.settingsPage.progressLabel}
      progressCurrent={1}
      progressTotal={2}
      nextHref="/"
      nextLabel={dict.settingsPage.nextLabel}
      readPageItems={[dict.settingsPage.title, dict.settingsPage.short, ...options]}
    >
      <section className="mode-activity-card" aria-label={dict.settingsPage.panelTitle}>
        <div className="card-head-row">
          <h2>{dict.settingsPage.panelTitle}</h2>
          <SpeakerButton text={`${dict.settingsPage.panelTitle}. ${dict.settingsPage.panelShort}`} lang={ttsLocale} label={dict.tts.readCard} id="settings-panel-title" />
        </div>
        <p>{dict.settingsPage.panelShort}</p>
        <div className="mode-choice-grid">
          {options.map((option, index) => (
            <div key={`set-${index}`} className="choice-row">
              <button type="button" className="mode-choice-btn">{option}</button>
              <SpeakerButton text={option} lang={ttsLocale} label={dict.tts.readThis} id={`settings-option-${index}`} />
            </div>
          ))}
        </div>
      </section>
    </StudentModeShell>
  )
}
