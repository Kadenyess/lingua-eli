import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
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
    <div className="student-shell">
      <header className="student-shell-header">
        <div className="student-breadcrumb">Home &gt; {breadcrumb}</div>
        <div className="student-title-card">
          <h1>{title}</h1>
          <p>{description}</p>
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
          <Link className="student-btn home" to="/">Back to Home</Link>
          {nextHref ? (
            <Link className="student-btn next" to={nextHref}>{nextLabel}</Link>
          ) : (
            <span className="student-btn next" aria-disabled="true" style={{ opacity: 0.65, pointerEvents: 'none' }}>Next</span>
          )}
        </div>
      </footer>
    </div>
  )
}
