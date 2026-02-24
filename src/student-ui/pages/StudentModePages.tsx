import { useMemo, useState } from 'react'
import { StudentModeShell } from '../StudentModeShell'
import { CoreSentenceEngine } from '../../core-sentence-engine/components/CoreSentenceEngine'
import { useStudentI18n } from '../i18n/useI18n'
import { SpeakerButton } from '../tts/SpeakerButton'
import { getModuleLevel, getModuleProgression, literacyStageDefinitions, type CurriculumModuleId } from '../../curriculum'
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

interface SimpleModeProps {
  modeId: SimpleModeId
  progressCurrent: number
  nextHref?: string
}

function SimpleChoiceModePage({ modeId, progressCurrent, nextHref }: SimpleModeProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const { dict, ttsLocale } = useStudentI18n()
  const curriculumModuleId = modeToCurriculumModule[modeId]
  const curriculumLevel = getModuleLevel(curriculumModuleId, progressCurrent)
  const curriculumProgression = getModuleProgression(curriculumModuleId)

  const modeText = dict.modes[modeId]
  const modeContent = dict.modeContent[modeId]
  const stageName = getStageName(curriculumLevel.literacy_stage)
  const progressLabel = `Level ${curriculumLevel.level_number} of ${curriculumProgression.levels.length}`
  const description = `${modeText.instruction} ${curriculumLevel.level_objective}`
  const readPageItems = [
    modeText.title,
    modeText.instruction,
    stageName,
    curriculumLevel.level_objective,
    ...modeContent.choices,
    ...(checked && selected !== null ? [selected === 0 ? modeContent.feedbackCorrect : modeContent.feedbackTryAgain] : []),
  ]

  return (
    <StudentModeShell
      title={modeText.title}
      breadcrumb={modeText.title}
      description={description}
      progressLabel={progressLabel}
      progressCurrent={progressCurrent}
      progressTotal={curriculumProgression.levels.length}
      nextHref={nextHref}
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
          <p>{curriculumLevel.level_objective}</p>
          <SpeakerButton text={curriculumLevel.level_objective} lang={ttsLocale} label={dict.tts.readInstruction} id={`${modeId}-objective`} />
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
            onClick={() => setChecked(true)}
            disabled={selected === null}
            style={selected === null ? { opacity: 0.6, cursor: 'not-allowed' } : undefined}
          >
            {dict.simpleMode.checkAnswer}
          </button>
        </div>

        {checked && selected !== null && (
          <div className="mode-inline-feedback" role="status">
            <div className="card-head-row compact">
              <span>{selected === 0 ? modeContent.feedbackCorrect : modeContent.feedbackTryAgain}</span>
              <SpeakerButton
                text={selected === 0 ? modeContent.feedbackCorrect : modeContent.feedbackTryAgain}
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
  const [points, setPoints] = useState(0)
  const { dict, lang } = useStudentI18n()
  const curriculumModuleId = modeToCurriculumModule['sentence-builder']
  const curriculumLevel = getModuleLevel(curriculumModuleId, 1)
  const curriculumProgression = getModuleProgression(curriculumModuleId)
  const modeText = dict.modes['sentence-builder']
  const message = useMemo(() => {
    if (points <= 0) return curriculumLevel.level_objective
    return lang === 'es' ? `Ganaste ${points} puntos de práctica.` : `You earned ${points} practice points.`
  }, [curriculumLevel.level_objective, lang, points])

  return (
    <StudentModeShell
      title={modeText.title}
      breadcrumb={modeText.title}
      description={message}
      progressLabel={lang === 'es' ? `Nivel ${curriculumLevel.level_number} de ${curriculumProgression.levels.length}` : `Level ${curriculumLevel.level_number} of ${curriculumProgression.levels.length}`}
      progressCurrent={curriculumLevel.level_number}
      progressTotal={curriculumProgression.levels.length}
      nextHref="/modes/grammar-detective"
      readPageItems={[modeText.title, modeText.short, getStageName(curriculumLevel.literacy_stage), curriculumLevel.level_objective, message]}
    >
      <CoreSentenceEngine
        level={1}
        embedded
        onBack={() => {}}
        onAddPoints={(pts) => setPoints((p) => p + pts)}
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
