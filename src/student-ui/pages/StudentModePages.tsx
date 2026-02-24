import { useMemo, useState } from 'react'
import { StudentModeShell } from '../StudentModeShell'
import { CoreSentenceEngine } from '../../core-sentence-engine/components/CoreSentenceEngine'
import '../student-ui.css'

interface SimpleModeProps {
  title: string
  breadcrumb: string
  description: string
  progressLabel: string
  progressCurrent: number
  progressTotal: number
  choices: string[]
  feedbackCorrect: string
  feedbackTryAgain: string
  nextHref?: string
}

function SimpleChoiceModePage({
  title,
  breadcrumb,
  description,
  progressLabel,
  progressCurrent,
  progressTotal,
  choices,
  feedbackCorrect,
  feedbackTryAgain,
  nextHref,
}: SimpleModeProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)

  return (
    <StudentModeShell
      title={title}
      breadcrumb={breadcrumb}
      description={description}
      progressLabel={progressLabel}
      progressCurrent={progressCurrent}
      progressTotal={progressTotal}
      nextHref={nextHref}
    >
      <section className="mode-activity-card" aria-label={`${title} activity`}>
        <h2>{title} Activity</h2>
        <p>{description}</p>
        <div className="mode-choice-grid">
          {choices.map((choice, index) => (
            <button
              key={choice}
              type="button"
              className={`mode-choice-btn ${selected === index ? 'selected' : ''}`}
              onClick={() => {
                setSelected(index)
                setChecked(false)
              }}
            >
              {choice}
            </button>
          ))}
        </div>
        <div className="simple-task-row">
          <input
            value={selected === null ? '' : choices[selected]}
            readOnly
            aria-label="Selected answer"
            placeholder="Tap a choice above"
          />
          <button
            type="button"
            onClick={() => setChecked(true)}
            disabled={selected === null}
            style={selected === null ? { opacity: 0.6, cursor: 'not-allowed' } : undefined}
          >
            Check Answer
          </button>
        </div>
        {checked && selected !== null && (
          <div className="mode-inline-feedback" role="status">
            {selected === 0 ? feedbackCorrect : feedbackTryAgain}
          </div>
        )}
      </section>
    </StudentModeShell>
  )
}

export function SentenceBuilderModePage() {
  const [points, setPoints] = useState(0)
  const level = 1

  const message = useMemo(() => {
    if (points <= 0) return 'Build one sentence with word blocks.'
    return `Great work. You earned ${points} practice points in this session.`
  }, [points])

  return (
    <StudentModeShell
      title="Sentence Builder"
      breadcrumb="Sentence Builder"
      description={message}
      progressLabel="Level 1 of 5"
      progressCurrent={1}
      progressTotal={5}
      nextHref="/modes/grammar-detective"
    >
        <CoreSentenceEngine
          level={level}
          embedded
          onBack={() => {}}
          onAddPoints={(pts) => setPoints((p) => p + pts)}
        />
    </StudentModeShell>
  )
}

export function GrammarDetectiveModePage() {
  return (
    <SimpleChoiceModePage
      title="Grammar Detective"
      breadcrumb="Grammar Detective"
      description="Find the grammar clue in one sentence."
      progressLabel="Task 1 of 4"
      progressCurrent={1}
      progressTotal={4}
      choices={[
        'The verb is runs.',
        'The article is dog.',
        'The subject is blue.',
      ]}
      feedbackCorrect="Nice job. You found the grammar clue. The verb is runs."
      feedbackTryAgain="Good try. Look for the action word in the sentence."
      nextHref="/modes/logic-check"
    />
  )
}

export function LogicCheckModePage() {
  return (
    <SimpleChoiceModePage
      title="Logic Check"
      breadcrumb="Logic Check"
      description="Choose the sentence that makes sense."
      progressLabel="Task 1 of 4"
      progressCurrent={1}
      progressTotal={4}
      choices={[
        'The cat runs.',
        'The pencil swims.',
        'The desk barks.',
      ]}
      feedbackCorrect="Nice job. That sentence makes sense."
      feedbackTryAgain="Nice try. Pick the sentence that matches a real action."
      nextHref="/modes/sentence-expansion"
    />
  )
}

export function SentenceExpansionModePage() {
  return (
    <SimpleChoiceModePage
      title="Sentence Expansion"
      breadcrumb="Sentence Expansion"
      description="Add one detail to make one sentence stronger."
      progressLabel="Task 1 of 4"
      progressCurrent={1}
      progressTotal={4}
      choices={[
        'The dog runs fast.',
        'The dog and but runs.',
        'Runs the dog fast the.',
      ]}
      feedbackCorrect="Great job. You added one clear detail."
      feedbackTryAgain="One small improvement: choose the sentence with clear word order."
      nextHref="/modes/story-builder"
    />
  )
}

export function StoryBuilderModePage() {
  return (
    <SimpleChoiceModePage
      title="Interactive Story Builder"
      breadcrumb="Interactive Story Builder"
      description="Build one part of a story."
      progressLabel="Step 1 of 4"
      progressCurrent={1}
      progressTotal={4}
      choices={[
        'A girl walks to school.',
        'School girl to a walks.',
        'A girl walks because and but school.',
      ]}
      feedbackCorrect="Nice job. That is a clear story step."
      feedbackTryAgain="Good try. Choose one clear sentence with one idea."
      nextHref="/modes/peer-review"
    />
  )
}

export function PeerReviewModePage() {
  return (
    <SimpleChoiceModePage
      title="Peer Review"
      breadcrumb="Peer Review"
      description="Read one sentence and choose one kind fix."
      progressLabel="Task 1 of 3"
      progressCurrent={1}
      progressTotal={3}
      choices={[
        'Nice job. Add The at the start.',
        'This is bad.',
        'No idea.',
      ]}
      feedbackCorrect="Great job. That is kind and helpful feedback."
      feedbackTryAgain="Let’s try a kind sentence that helps a friend improve."
      nextHref="/modes/vocabulary-unlock"
    />
  )
}

export function VocabularyUnlockModePage() {
  return (
    <SimpleChoiceModePage
      title="Vocabulary Unlock"
      breadcrumb="Vocabulary Unlock"
      description="Practice words to unlock new blocks."
      progressLabel="Words 1 of 5"
      progressCurrent={1}
      progressTotal={5}
      choices={[
        'book',
        'runs',
        'happy',
      ]}
      feedbackCorrect="Nice job. You practiced a word. Keep going to unlock more."
      feedbackTryAgain="Nice try. Tap one word and press Check Answer."
      nextHref="/modes/timed-practice"
    />
  )
}

export function TimedPracticeModePage() {
  return (
    <SimpleChoiceModePage
      title="Timed Practice"
      breadcrumb="Timed Practice"
      description="Solve one task before time runs out."
      progressLabel="Round 1 of 3"
      progressCurrent={1}
      progressTotal={3}
      choices={[
        'The boy holds a book.',
        'Holds boy the a book.',
        'The boy book holds and runs.',
      ]}
      feedbackCorrect="Great job. Fast and correct."
      feedbackTryAgain="Good effort. Choose the sentence with the best word order."
      nextHref="/"
      />
  )
}

export function MyProgressPage() {
  return (
    <StudentModeShell
      title="My Progress"
      breadcrumb="My Progress"
      description="See your learning steps."
      progressLabel="Today"
      progressCurrent={2}
      progressTotal={8}
      nextHref="/"
      nextLabel="Home"
    >
      <section className="mode-activity-card" aria-label="Progress summary">
        <h2>Your Progress</h2>
        <div className="mode-choice-grid">
          <div className="mode-choice-btn selected" aria-hidden="true">Modes practiced: 2</div>
          <div className="mode-choice-btn" aria-hidden="true">Words unlocked: 6</div>
          <div className="mode-choice-btn" aria-hidden="true">Streak: 1 day</div>
        </div>
      </section>
    </StudentModeShell>
  )
}

export function SettingsPage() {
  return (
    <StudentModeShell
      title="Settings"
      breadcrumb="Settings"
      description="Choose how the app looks and works."
      progressLabel="Setup"
      progressCurrent={1}
      progressTotal={2}
      nextHref="/"
      nextLabel="Home"
    >
      <section className="mode-activity-card" aria-label="Settings choices">
        <h2>Simple Settings</h2>
        <p>Choose one option. These buttons are large and easy to tap.</p>
        <div className="mode-choice-grid">
          <button type="button" className="mode-choice-btn">Text Size: Large</button>
          <button type="button" className="mode-choice-btn">Language Help: English + Spanish</button>
          <button type="button" className="mode-choice-btn">High Contrast: On</button>
        </div>
      </section>
    </StudentModeShell>
  )
}
