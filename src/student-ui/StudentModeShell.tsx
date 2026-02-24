import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { StudentTopNav } from './StudentTopNav'
import './student-ui.css'

interface Props {
  title: string
  description: string
  breadcrumb: string
  progressLabel?: string
  progressCurrent?: number
  progressTotal?: number
  nextHref?: string
  nextLabel?: string
  children: ReactNode
}

export function StudentModeShell({
  title,
  description,
  breadcrumb,
  progressLabel,
  progressCurrent,
  progressTotal,
  nextHref,
  nextLabel = 'Next',
  children,
}: Props) {
  const percent = progressCurrent && progressTotal ? Math.min(100, Math.round((progressCurrent / progressTotal) * 100)) : 0

  return (
    <div className="student-app-bg">
      <StudentTopNav />
      <div className="student-page-container">
        <div className="student-shell">
          <header className="student-shell-header">
            <nav className="student-breadcrumb" aria-label="Breadcrumb">
              <Link to="/">Dashboard</Link>
              <span>/</span>
              <span aria-current="page">{breadcrumb}</span>
            </nav>
            <div className="student-title-card">
              <div>
                <p className="page-kicker">Learning Mode</p>
                <h1>{title}</h1>
                <p>{description}</p>
              </div>
              <div className="page-status-pill" aria-label="Mode status">
                <span className="status-dot" />
                Ready to practice
              </div>
            </div>
          </header>

          <main className="student-shell-main">
            <div className="student-mode-body">{children}</div>
          </main>

          <footer className="student-shell-footer">
            <div className="student-footer-card">
              <div className="student-progress-row">
                <span>{progressLabel ?? 'Practice'}</span>
                {progressCurrent && progressTotal ? <span>{progressCurrent} / {progressTotal}</span> : <span>Ready</span>}
              </div>
              <div className="student-progress-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-label="Progress">
                <span style={{ width: `${percent}%` }} />
              </div>
            </div>
            <div className="student-footer-actions">
              <Link className="student-btn secondary" to="/">Back to Home</Link>
              {nextHref ? (
                <Link className="student-btn primary" to={nextHref}>{nextLabel}</Link>
              ) : (
                <span className="student-btn primary is-disabled" aria-disabled="true">Next</span>
              )}
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}
