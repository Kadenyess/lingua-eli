import { Link, useLocation } from 'react-router-dom'
import { STUDENT_MODES } from './modes/modeCatalog'
import { StudentTopNav } from './StudentTopNav'
import './student-ui.css'

const progressCards = [
  { label: 'Current Level', value: 'Level 1', note: 'Foundations' },
  { label: 'Words Unlocked', value: '6', note: 'This week' },
  { label: 'Practice Streak', value: '1 day', note: 'Keep going' },
]

export default function StudentHomeDashboard() {
  const location = useLocation()
  const isModesDirectory = location.pathname === '/modes'

  return (
    <div className="student-app-bg">
      <StudentTopNav />

      <div className="student-page-container">
        <main className="student-dashboard" aria-label="Student dashboard">
          <section className="dashboard-hero-card" aria-labelledby="dashboard-hero-title">
            <div>
              <p className="dashboard-eyebrow">Welcome back</p>
              <h1 id="dashboard-hero-title">Ready for today&apos;s English learning?</h1>
              <p className="dashboard-hero-copy">
                Choose one activity and work on a single skill at a time. Every mode opens on its own page so the screen stays clear and focused.
              </p>
              <div className="dashboard-hero-actions">
                <Link className="student-btn primary" to="/modes/sentence-builder">Start Practice</Link>
                <Link className="student-btn secondary" to="/progress">View Progress</Link>
              </div>
            </div>
            <aside className="dashboard-hero-side" aria-label="Daily summary">
              <div className="hero-side-card">
                <span className="hero-side-label">Today&apos;s Goal</span>
                <strong>Complete 2 learning modes</strong>
                <p>Build one sentence and finish one quick check activity.</p>
              </div>
              <div className="hero-side-card muted">
                <span className="hero-side-label">Next Recommendation</span>
                <strong>Grammar Detective</strong>
                <p>Short focused practice on finding verbs and grammar clues.</p>
              </div>
            </aside>
          </section>

          <section className="dashboard-section" aria-labelledby="progress-overview-title">
            <div className="section-header-row">
              <h2 id="progress-overview-title">Progress Overview</h2>
              <span className="section-caption">Snapshot for the student view</span>
            </div>
            <div className="stats-grid">
              {progressCards.map((card) => (
                <article key={card.label} className="stat-card">
                  <p className="stat-label">{card.label}</p>
                  <p className="stat-value">{card.value}</p>
                  <p className="stat-note">{card.note}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="dashboard-section" id="learning-modes" aria-labelledby="learning-modes-title">
            <div className="section-header-row">
              <h2 id="learning-modes-title">Learning Modes</h2>
              <span className="section-caption">One click opens one focused page</span>
            </div>
            {isModesDirectory && (
              <div className="directory-banner" role="status">
                You are viewing the Learning Modes directory. Pick any mode to begin.
              </div>
            )}
            <div className="mode-grid">
              {STUDENT_MODES.map((mode) => (
                <Link key={mode.id} className="mode-card" to={mode.path} data-mode={mode.id}>
                  <span className="mode-icon" aria-hidden="true">{mode.icon}</span>
                  <span className="mode-copy">
                    <h3>{mode.title}</h3>
                    <p>{mode.description}</p>
                  </span>
                  <span className="mode-link-cta" aria-hidden="true">Open</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="dashboard-section" aria-labelledby="recent-activity-title">
            <div className="section-header-row">
              <h2 id="recent-activity-title">Recent Activity</h2>
              <Link className="text-link" to="/progress">See all activity</Link>
            </div>
            <div className="recent-activity-card">
              <div className="recent-activity-item">
                <div>
                  <p className="recent-label">Last completed</p>
                  <h3>Sentence Builder</h3>
                  <p className="recent-meta">Completed 1 task and earned 15 points.</p>
                </div>
                <Link className="student-btn tertiary" to="/modes/sentence-builder">Continue</Link>
              </div>
              <div className="recent-divider" />
              <div className="recent-activity-list">
                <div className="recent-chip">Grammar Detective: Ready</div>
                <div className="recent-chip">Vocabulary Unlock: 6 words practiced</div>
                <div className="recent-chip">Timed Practice: Not started today</div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
