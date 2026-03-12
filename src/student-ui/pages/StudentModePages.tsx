import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StudentModeShell } from '../StudentModeShell'
import { CoreSentenceEngine } from '../../core-sentence-engine/components/CoreSentenceEngine'
import { useStudentI18n } from '../i18n/useI18n'
import { SpeakerButton } from '../tts/SpeakerButton'
import { SpanishAudioButton } from '../tts/SpanishAudioButton'
import {
  buildTeacherGapCheckRecord,
  buildTeacherLevelPerformanceRecord,
  type ComprehensionDimension,
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
  appendStoredGapCheckEvent,
  appendLevelPerformanceRecord,
  clearStoredLevelSessionState,
  getStoredModuleCurrentLevel,
  getStoredLevelSessionState,
  saveStoredLevelSessionState,
  setStoredModuleCurrentLevel,
  type StoredLevelSessionState,
} from '../storage/levelSessionStorage'
import { getOrCreateStudentId } from '../../core-sentence-engine/storage/localTracking'
import { isFirebaseConfigured } from '../../utils/firebase'
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

function clampDimensionScore(value: number) {
  return Math.max(0, Math.min(2, value))
}

function defaultGapDimensionScores(): Record<ComprehensionDimension, number> {
  return {
    literal_understanding: 2,
    inferencing: 2,
    vocabulary_in_context: 2,
    syntax_grammar_comprehension: 2,
    discourse_cohesion: 2,
    knowledge_integration: 2,
  }
}

function buildGapDimensionScores(
  questionResults: TeacherLevelQuestionResult[],
  totalQuestions: number,
): Partial<Record<ComprehensionDimension, number>> {
  const scores = defaultGapDimensionScores()
  const incorrect = questionResults.filter((row) => !row.correct)
  const rolePenalty: Record<TeacherLevelQuestionResult['question_role'], Partial<Record<ComprehensionDimension, number>>> = {
    core_skill: { literal_understanding: 1, syntax_grammar_comprehension: 1 },
    reinforcement: { vocabulary_in_context: 1 },
    application: { inferencing: 1, syntax_grammar_comprehension: 1 },
    challenge: { discourse_cohesion: 1, knowledge_integration: 1 },
  }

  for (const result of incorrect) {
    const roleMap = rolePenalty[result.question_role]
    for (const [dimension, amount] of Object.entries(roleMap) as [ComprehensionDimension, number][]) {
      scores[dimension] = clampDimensionScore(scores[dimension] - amount)
    }

    for (const errorType of result.error_types) {
      switch (errorType) {
        case 'missing_component':
          scores.literal_understanding = clampDimensionScore(scores.literal_understanding - 1)
          scores.syntax_grammar_comprehension = clampDimensionScore(scores.syntax_grammar_comprehension - 1)
          break
        case 'word_order':
          scores.syntax_grammar_comprehension = clampDimensionScore(scores.syntax_grammar_comprehension - 1)
          scores.discourse_cohesion = clampDimensionScore(scores.discourse_cohesion - 1)
          break
        case 'subject_verb_agreement':
        case 'article_usage':
        case 'pronoun_reference':
        case 'tense_consistency':
        case 'conjunction_usage':
        case 'multi_error_detection':
          scores.syntax_grammar_comprehension = clampDimensionScore(scores.syntax_grammar_comprehension - 1)
          break
        case 'paragraph_sequence':
          scores.discourse_cohesion = clampDimensionScore(scores.discourse_cohesion - 1)
          scores.knowledge_integration = clampDimensionScore(scores.knowledge_integration - 1)
          break
        case 'logic_mismatch':
          scores.inferencing = clampDimensionScore(scores.inferencing - 1)
          scores.vocabulary_in_context = clampDimensionScore(scores.vocabulary_in_context - 1)
          scores.knowledge_integration = clampDimensionScore(scores.knowledge_integration - 1)
          break
        case 'noun_identification':
        case 'verb_identification':
          scores.literal_understanding = clampDimensionScore(scores.literal_understanding - 1)
          scores.vocabulary_in_context = clampDimensionScore(scores.vocabulary_in_context - 1)
          break
      }
    }
  }

  const incorrectRatio = totalQuestions > 0 ? incorrect.length / totalQuestions : 0
  if (incorrectRatio >= 0.4) {
    scores.inferencing = clampDimensionScore(scores.inferencing - 1)
    scores.knowledge_integration = clampDimensionScore(scores.knowledge_integration - 1)
  }
  if (incorrectRatio >= 0.6) {
    scores.literal_understanding = clampDimensionScore(scores.literal_understanding - 1)
    scores.vocabulary_in_context = clampDimensionScore(scores.vocabulary_in_context - 1)
  }

  return scores
}

function appendGapCheckForCompletedLevel(
  moduleId: CurriculumModuleId,
  levelNumber: number,
  questionResults: TeacherLevelQuestionResult[],
  totalQuestions: number,
) {
  const classId = localStorage.getItem('student.activeClassId') ?? (isFirebaseConfigured() ? 'local-class' : 'c1')
  const studentId = getOrCreateStudentId()
  const dimensionScores = buildGapDimensionScores(questionResults, totalQuestions)
  const gapRecord = buildTeacherGapCheckRecord(moduleId, levelNumber, dimensionScores)
  appendStoredGapCheckEvent({
    id: `gap-${moduleId}-l${levelNumber}-${Date.now()}`,
    studentId,
    classId,
    moduleId,
    levelNumber,
    gapCheckId: gapRecord.gap_check_id,
    cleared: gapRecord.cleared,
    totalScore: gapRecord.total_score,
    maxTotalScore: gapRecord.max_total_score,
    dimensions: gapRecord.dimensions.map((dimension) => ({
      dimension: dimension.dimension,
      score: dimension.score,
      maxScore: dimension.max_score,
      severity: dimension.severity,
    })),
    recommendedPaths: gapRecord.recommended_paths,
    createdAt: new Date(),
  })
}

interface SimpleModeProps {
  modeId: SimpleModeId
  nextHref?: string
}

function SimpleChoiceModePage({ modeId, nextHref }: SimpleModeProps) {
  const navigate = useNavigate()
  const { dict, ttsLocale, lang } = useStudentI18n()
  const curriculumModuleId = modeToCurriculumModule[modeId]
  const curriculumProgression = getModuleProgression(curriculumModuleId)
  const [activeLevel, setActiveLevel] = useState<number>(() => {
    const storedLevel = getStoredModuleCurrentLevel(curriculumModuleId)
    if (!storedLevel) return 1
    return Math.min(curriculumProgression.levels.length, Math.max(1, storedLevel))
  })
  const curriculumLevel = getModuleLevel(curriculumModuleId, activeLevel)
  const totalQuestions = curriculumLevel.total_questions_per_level
  const [seed, setSeed] = useState<number>(() => initialSeed(modeId, activeLevel))
  const [questionIndex, setQuestionIndex] = useState<number>(0)
  const [resultsByQuestionNumber, setResultsByQuestionNumber] = useState<Record<number, TeacherLevelQuestionResult>>({})
  const [reattemptCount, setReattemptCount] = useState<number>(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [levelOutcomeMessage, setLevelOutcomeMessage] = useState<string | null>(null)
  const sessionQuestions = useMemo(
    () => getShuffledLevelQuestions(curriculumModuleId, activeLevel, seed),
    [curriculumModuleId, activeLevel, seed],
  )
  const currentQuestion = sessionQuestions[questionIndex] ?? sessionQuestions[0]
  const currentQuestionNumber = currentQuestion?.question_number ?? questionIndex + 1
  const currentRecordedResult = resultsByQuestionNumber[currentQuestionNumber]
  const canContinue = !!currentRecordedResult
  const isLastQuestion = questionIndex >= totalQuestions - 1

  const modeText = dict.modes[modeId]
  const modeContent = dict.modeContent[modeId]
  const stageName = getStageName(curriculumLevel.literacy_stage)
  const englishPrompt = currentQuestion?.prompt?.en ?? currentQuestion?.prompt_focus ?? curriculumLevel.level_objective
  const spanishPrompt = currentQuestion?.prompt?.es ?? englishPrompt
  const questionChoices = currentQuestion?.choices ?? []
  const englishChoiceTexts = questionChoices.map((choice) => choice.text.en)
  const feedbackText = currentRecordedResult
    ? currentRecordedResult.correct
      ? `${modeContent.feedbackCorrect} ${currentQuestion?.rationale?.[lang] ?? ''}`.trim()
      : `${modeContent.feedbackTryAgain} ${currentQuestion?.rationale?.[lang] ?? ''}`.trim()
    : ''
  const progressLabel = `Level ${curriculumLevel.level_number} of ${curriculumProgression.levels.length} • Q ${questionIndex + 1}/${totalQuestions}`
  const description = levelOutcomeMessage ?? `${modeText.instruction} ${englishPrompt}`
  const readPageItems = [
    modeText.title,
    modeText.instruction,
    stageName,
    englishPrompt,
    ...englishChoiceTexts,
    ...(checked && selected !== null && feedbackText ? [feedbackText] : []),
  ]

  useEffect(() => {
    const stored = getStoredLevelSessionState(curriculumModuleId, activeLevel)
    const loadedSeed = stored?.seed ?? initialSeed(modeId, activeLevel)
    const loadedQuestionIndex = Math.min(totalQuestions - 1, stored?.questionIndex ?? 0)
    setSeed(loadedSeed)
    setQuestionIndex(loadedQuestionIndex)
    setResultsByQuestionNumber(stored?.resultsByQuestionNumber ?? {})
    setReattemptCount(stored?.reattemptCount ?? 0)
    setSelected(null)
    setChecked(false)
    setLevelOutcomeMessage(null)
  }, [activeLevel, curriculumModuleId, modeId, totalQuestions])

  const persistSessionState = (
    nextState: Pick<StoredLevelSessionState, 'questionIndex' | 'reattemptCount' | 'seed' | 'resultsByQuestionNumber'>,
  ) => {
    saveStoredLevelSessionState({
      moduleId: curriculumModuleId,
      levelNumber: activeLevel,
      questionIndex: nextState.questionIndex,
      reattemptCount: nextState.reattemptCount,
      seed: nextState.seed,
      resultsByQuestionNumber: nextState.resultsByQuestionNumber,
      updatedAt: new Date().toISOString(),
    })
  }

  const handleCheckAnswer = () => {
    if (selected === null || !currentQuestion) return
    const selectedChoice = currentQuestion.choices[selected]
    if (!selectedChoice) return
    const correct = selectedChoice.is_correct
    const selectedError = selectedChoice.error_type
    const result: TeacherLevelQuestionResult = {
      question_id: currentQuestion.question_id,
      question_number: currentQuestion.question_number,
      correct,
      error_types: correct
        ? []
        : [selectedError ?? currentQuestion.expected_error_types[0]].filter(Boolean) as CurriculumErrorType[],
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
      buildTeacherLevelPerformanceRecord(curriculumModuleId, activeLevel, questionResults, reattemptCount),
    )
    appendGapCheckForCompletedLevel(curriculumModuleId, activeLevel, questionResults, totalQuestions)
    const passed = didPassLevelSession(curriculumModuleId, activeLevel, correctCount)
    if (passed) {
      clearStoredLevelSessionState(curriculumModuleId, activeLevel)
      if (activeLevel < curriculumProgression.levels.length) {
        const nextLevel = activeLevel + 1
        setStoredModuleCurrentLevel(curriculumModuleId, nextLevel)
        setActiveLevel(nextLevel)
      } else if (nextHref) {
        navigate(nextHref)
      } else {
        navigate('/')
      }
      return
    }
    const nextRetryCount = reattemptCount + 1
    const nextSeed = initialSeed(modeId, activeLevel) + nextRetryCount * 1009
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
      progressCurrent={curriculumLevel.level_number}
      progressTotal={curriculumProgression.levels.length}
      onNextClick={handleNext}
      nextDisabled={!canContinue}
      nextLabel={isLastQuestion && activeLevel >= curriculumProgression.levels.length ? dict.common.next : dict.common.continue}
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
          <p>{englishPrompt}</p>
          <div className="tts-inline-actions">
            <SpeakerButton text={englishPrompt} lang="en-US" label={dict.tts.readInstruction} id={`${modeId}-objective-en`} />
            <SpanishAudioButton text={spanishPrompt} id={`${modeId}-objective-es`} />
          </div>
        </div>

        <div className="mode-choice-grid" role="list" aria-label={modeText.instruction}>
          {questionChoices.map((choice, index) => (
            <div key={`${modeId}-${index}`} className="choice-row">
              <button
                type="button"
                className={`mode-choice-btn ${selected === index ? 'selected' : ''}`}
                onClick={() => {
                  setSelected(index)
                  setChecked(false)
                }}
              >
                {choice.text.en}
              </button>
              <div className="tts-inline-actions">
                <SpeakerButton text={choice.text.en} lang="en-US" label={dict.tts.readThis} id={`${modeId}-choice-en-${index}`} />
                <SpanishAudioButton text={choice.text.es} id={`${modeId}-choice-es-${index}`} compact />
              </div>
            </div>
          ))}
        </div>

        <div className="simple-task-row">
          <input
            value={selected === null ? '' : (questionChoices[selected]?.text.en ?? '')}
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
              <span>{feedbackText}</span>
              <SpeakerButton
                text={feedbackText}
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
  const curriculumProgression = getModuleProgression(curriculumModuleId)
  const [activeLevel, setActiveLevel] = useState<number>(() => {
    const storedLevel = getStoredModuleCurrentLevel(curriculumModuleId)
    if (!storedLevel) return 1
    return Math.min(curriculumProgression.levels.length, Math.max(1, storedLevel))
  })
  const curriculumLevel = getModuleLevel(curriculumModuleId, activeLevel)
  const totalQuestions = curriculumLevel.total_questions_per_level
  const [seed, setSeed] = useState<number>(() => initialSeed('sentence-builder', activeLevel))
  const [questionIndex, setQuestionIndex] = useState<number>(0)
  const [resultsByQuestionNumber, setResultsByQuestionNumber] = useState<Record<number, TeacherLevelQuestionResult>>({})
  const [reattemptCount, setReattemptCount] = useState<number>(0)
  const [levelOutcomeMessage, setLevelOutcomeMessage] = useState<string | null>(null)
  const sessionQuestions = useMemo(
    () => getShuffledLevelQuestions(curriculumModuleId, activeLevel, seed),
    [curriculumModuleId, activeLevel, seed],
  )
  const currentQuestion = sessionQuestions[questionIndex] ?? sessionQuestions[0]
  const currentQuestionNumber = currentQuestion?.question_number ?? questionIndex + 1
  const hasCheckedCurrent = !!resultsByQuestionNumber[currentQuestionNumber]
  const isLastQuestion = questionIndex >= totalQuestions - 1
  const modeText = dict.modes['sentence-builder']
  const message = useMemo(() => {
    if (levelOutcomeMessage) return levelOutcomeMessage
    if (points <= 0) return currentQuestion?.prompt?.en ?? currentQuestion?.prompt_focus ?? curriculumLevel.level_objective
    return lang === 'es' ? `Ganaste ${points} puntos de práctica.` : `You earned ${points} practice points.`
  }, [curriculumLevel.level_objective, currentQuestion, lang, levelOutcomeMessage, points])

  useEffect(() => {
    const stored = getStoredLevelSessionState(curriculumModuleId, activeLevel)
    const loadedSeed = stored?.seed ?? initialSeed('sentence-builder', activeLevel)
    const loadedQuestionIndex = Math.min(totalQuestions - 1, stored?.questionIndex ?? 0)
    setSeed(loadedSeed)
    setQuestionIndex(loadedQuestionIndex)
    setResultsByQuestionNumber(stored?.resultsByQuestionNumber ?? {})
    setReattemptCount(stored?.reattemptCount ?? 0)
    setLevelOutcomeMessage(null)
  }, [activeLevel, curriculumModuleId, totalQuestions])

  const persistSessionState = (
    nextState: Pick<StoredLevelSessionState, 'questionIndex' | 'reattemptCount' | 'seed' | 'resultsByQuestionNumber'>,
  ) => {
    saveStoredLevelSessionState({
      moduleId: curriculumModuleId,
      levelNumber: activeLevel,
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
      buildTeacherLevelPerformanceRecord(curriculumModuleId, activeLevel, questionResults, reattemptCount),
    )
    appendGapCheckForCompletedLevel(curriculumModuleId, activeLevel, questionResults, totalQuestions)
    const passed = didPassLevelSession(curriculumModuleId, activeLevel, correctCount)
    if (passed) {
      clearStoredLevelSessionState(curriculumModuleId, activeLevel)
      if (activeLevel < curriculumProgression.levels.length) {
        const nextLevel = activeLevel + 1
        setStoredModuleCurrentLevel(curriculumModuleId, nextLevel)
        setActiveLevel(nextLevel)
      } else {
        navigate('/modes/grammar-detective')
      }
      return
    }

    const nextRetryCount = reattemptCount + 1
    const nextSeed = initialSeed('sentence-builder', activeLevel) + nextRetryCount * 1009
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
      readPageItems={[
        modeText.title,
        modeText.short,
        getStageName(curriculumLevel.literacy_stage),
        currentQuestion?.prompt?.en ?? currentQuestion?.prompt_focus ?? curriculumLevel.level_objective,
        message,
      ]}
    >
      <CoreSentenceEngine
        key={`cse-l${activeLevel}-r${reattemptCount}-q${questionIndex}`}
        level={activeLevel}
        embedded
        onBack={() => {}}
        onAddPoints={(pts) => setPoints((p) => p + pts)}
        onCheckResult={handleSentenceBuilderCheckResult}
      />
    </StudentModeShell>
  )
}

export function GrammarDetectiveModePage() {
  return <SimpleChoiceModePage modeId="grammar-detective" nextHref="/modes/logic-check" />
}
export function LogicCheckModePage() {
  return <SimpleChoiceModePage modeId="logic-check" nextHref="/modes/sentence-expansion" />
}
export function SentenceExpansionModePage() {
  return <SimpleChoiceModePage modeId="sentence-expansion" nextHref="/modes/story-builder" />
}
export function StoryBuilderModePage() {
  return <SimpleChoiceModePage modeId="story-builder" nextHref="/modes/peer-review" />
}
export function PeerReviewModePage() {
  return <SimpleChoiceModePage modeId="peer-review" nextHref="/modes/vocabulary-unlock" />
}
export function VocabularyUnlockModePage() {
  return <SimpleChoiceModePage modeId="vocabulary-unlock" nextHref="/modes/timed-practice" />
}
export function TimedPracticeModePage() {
  return <SimpleChoiceModePage modeId="timed-practice" nextHref="/" />
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
