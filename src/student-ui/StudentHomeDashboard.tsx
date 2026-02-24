import { Link, useLocation } from 'react-router-dom'
import { STUDENT_MODES } from './modes/modeCatalog'
import { StudentTopNav } from './StudentTopNav'
import { useStudentI18n } from './i18n/useI18n'
import { SpeakerButton } from './tts/SpeakerButton'
import { ReadPageControls } from './tts/ReadPageControls'
import './student-ui.css'

export default function StudentHomeDashboard() {
  const location = useLocation()
  const isModesDirectory = location.pathname === '/modes'
  const { dict, ttsLocale } = useStudentI18n()

  const stats = [
    { key: 'level', label: dict.dashboardPage.statCurrentLevel, value: dict.dashboardPage.statCurrentLevelValue, note: dict.dashboardPage.statCurrentLevelNote },
    { key: 'words', label: dict.dashboardPage.statWordsUnlocked, value: dict.dashboardPage.statWordsUnlockedValue, note: dict.dashboardPage.statWordsUnlockedNote },
    { key: 'streak', label: dict.dashboardPage.statStreak, value: dict.dashboardPage.statStreakValue, note: dict.dashboardPage.statStreakNote },
  ]

  const readPageItems = [
    dict.dashboardPage.welcomeTitle,
    dict.dashboardPage.welcomeShort,
    dict.dashboardPage.progressOverviewTitle,
    ...stats.flatMap((s) => [s.label, s.value, s.note]),
    dict.dashboardPage.learningModesTitle,
    ...STUDENT_MODES.map((m) => dict.modes[m.id].title),
    dict.dashboardPage.recentActivityTitle,
    dict.dashboardPage.recentSentenceBuilderTitle,
    dict.dashboardPage.recentSentenceBuilderNote,
  ]

  return (
    <div className="student-app-bg">
      <StudentTopNav />
      <div className="student-page-container">
        <main className="student-dashboard" aria-label={dict.common.dashboard}>
          <section className="dashboard-hero-card" aria-labelledby="dashboard-hero-title">
            <div>
              <div className="title-row">
                <p className="dashboard-eyebrow">{dict.dashboardPage.welcomeEyebrow}</p>
                <SpeakerButton text={dict.dashboardPage.welcomeEyebrow} lang={ttsLocale} label={dict.tts.readTitle} id="dash-welcome-eyebrow" />
              </div>
              <div className="title-row">
                <h1 id="dashboard-hero-title">{dict.dashboardPage.welcomeTitle}</h1>
                <SpeakerButton text={dict.dashboardPage.welcomeTitle} lang={ttsLocale} label={dict.tts.readTitle} id="dash-welcome-title" />
              </div>
              <div className="title-row compact">
                <p className="dashboard-hero-copy">{dict.dashboardPage.welcomeShort}</p>
                <SpeakerButton text={dict.dashboardPage.welcomeShort} lang={ttsLocale} label={dict.tts.readInstruction} id="dash-welcome-short" />
              </div>
              <div className="dashboard-hero-actions" role="group" aria-label={dict.tts.readButtons}>
                <Link className="student-btn primary" to="/modes/sentence-builder">{dict.dashboardPage.startPractice}</Link>
                <Link className="student-btn secondary" to="/progress">{dict.dashboardPage.viewProgress}</Link>
                <SpeakerButton
                  text={`${dict.dashboardPage.startPractice}. ${dict.dashboardPage.viewProgress}.`}
                  lang={ttsLocale}
                  label={dict.tts.readButtons}
                  id="dash-cta-buttons"
                />
              </div>
            </div>

            <aside className="dashboard-hero-side" aria-label={dict.dashboardPage.recentActivityTitle}>
              <div className="hero-side-card">
                <div className="card-head-row">
                  <span className="hero-side-label">{dict.dashboardPage.todayGoalLabel}</span>
                  <SpeakerButton text={`${dict.dashboardPage.todayGoalLabel}. ${dict.dashboardPage.todayGoalValue}. ${dict.dashboardPage.todayGoalNote}`} lang={ttsLocale} label={dict.tts.readCard} id="goal-card" />
                </div>
                <strong>{dict.dashboardPage.todayGoalValue}</strong>
                <p>{dict.dashboardPage.todayGoalNote}</p>
              </div>
              <div className="hero-side-card muted">
                <div className="card-head-row">
                  <span className="hero-side-label">{dict.dashboardPage.nextRecommendationLabel}</span>
                  <SpeakerButton text={`${dict.dashboardPage.nextRecommendationLabel}. ${dict.dashboardPage.nextRecommendationValue}. ${dict.dashboardPage.nextRecommendationNote}`} lang={ttsLocale} label={dict.tts.readCard} id="next-card" />
                </div>
                <strong>{dict.dashboardPage.nextRecommendationValue}</strong>
                <p>{dict.dashboardPage.nextRecommendationNote}</p>
              </div>
            </aside>
          </section>

          <section className="dashboard-section" aria-labelledby="progress-overview-title">
            <div className="section-header-row">
              <div className="title-row">
                <h2 id="progress-overview-title">{dict.dashboardPage.progressOverviewTitle}</h2>
                <SpeakerButton text={dict.dashboardPage.progressOverviewTitle} lang={ttsLocale} label={dict.tts.readSection} id="progress-overview-title-tts" />
              </div>
              <span className="section-caption">{dict.dashboardPage.progressOverviewCaption}</span>
            </div>
            <div className="stats-grid">
              {stats.map((card) => (
                <article key={card.key} className="stat-card">
                  <div className="card-head-row">
                    <p className="stat-label">{card.label}</p>
                    <SpeakerButton text={`${card.label}. ${card.value}. ${card.note}`} lang={ttsLocale} label={dict.tts.readStat} id={`stat-${card.key}`} />
                  </div>
                  <p className="stat-value">{card.value}</p>
                  <p className="stat-note">{card.note}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="dashboard-section" id="learning-modes" aria-labelledby="learning-modes-title">
            <div className="section-header-row">
              <div className="title-row">
                <h2 id="learning-modes-title">{dict.dashboardPage.learningModesTitle}</h2>
                <SpeakerButton text={dict.dashboardPage.learningModesTitle} lang={ttsLocale} label={dict.tts.readSection} id="modes-title-tts" />
              </div>
              <span className="section-caption">{dict.dashboardPage.learningModesCaption}</span>
            </div>
            {isModesDirectory && <div className="directory-banner" role="status">{dict.dashboardPage.directoryBanner}</div>}
            <div className="mode-grid">
              {STUDENT_MODES.map((mode) => {
                const modeText = dict.modes[mode.id]
                return (
                  <Link key={mode.id} className="mode-card" to={mode.path} data-mode={mode.id}>
                    <span className="mode-icon" aria-hidden="true">{mode.icon}</span>
                    <span className="mode-copy">
                      <div className="card-head-row">
                        <h3>{modeText.title}</h3>
                        <SpeakerButton text={`${modeText.title}. ${modeText.short}`} lang={ttsLocale} label={dict.tts.readModeTile} id={`mode-${mode.id}-tts`} />
                      </div>
                      <p>{modeText.short}</p>
                    </span>
                    <span className="mode-link-cta" aria-hidden="true">{dict.common.open}</span>
                  </Link>
                )
              })}
            </div>
          </section>

          <section className="dashboard-section" aria-labelledby="recent-activity-title">
            <div className="section-header-row">
              <div className="title-row">
                <h2 id="recent-activity-title">{dict.dashboardPage.recentActivityTitle}</h2>
                <SpeakerButton text={dict.dashboardPage.recentActivityTitle} lang={ttsLocale} label={dict.tts.readSection} id="recent-title-tts" />
              </div>
              <Link className="text-link" to="/progress">{dict.dashboardPage.seeAllActivity}</Link>
            </div>
            <div className="recent-activity-card">
              <div className="recent-activity-item">
                <div>
                  <div className="card-head-row">
                    <p className="recent-label">{dict.dashboardPage.lastCompletedLabel}</p>
                    <SpeakerButton
                      text={`${dict.dashboardPage.lastCompletedLabel}. ${dict.dashboardPage.recentSentenceBuilderTitle}. ${dict.dashboardPage.recentSentenceBuilderNote}`}
                      lang={ttsLocale}
                      label={dict.tts.readCard}
                      id="recent-card-tts"
                    />
                  </div>
                  <h3>{dict.dashboardPage.recentSentenceBuilderTitle}</h3>
                  <p className="recent-meta">{dict.dashboardPage.recentSentenceBuilderNote}</p>
                </div>
                <Link className="student-btn tertiary" to="/modes/sentence-builder">{dict.common.continue}</Link>
              </div>
              <div className="recent-divider" />
              <div className="recent-activity-list">
                <div className="recent-chip">{dict.dashboardPage.chipGrammar}</div>
                <div className="recent-chip">{dict.dashboardPage.chipVocab}</div>
                <div className="recent-chip">{dict.dashboardPage.chipTimed}</div>
              </div>
            </div>
          </section>

          <ReadPageControls items={readPageItems} pageId="dashboard" />
        </main>
      </div>
    </div>
  )
}
