import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { StudentTopNav } from './StudentTopNav'
import { useStudentI18n } from './i18n/useI18n'
import { SpeakerButton } from './tts/SpeakerButton'
import { ReadPageControls } from './tts/ReadPageControls'
import './student-ui.css'

interface Props {
  title: string
  titleEs?: string
  description: string
  descriptionEs?: string
  breadcrumb: string
  breadcrumbEs?: string
  progressLabel?: string
  progressLabelEs?: string
  progressCurrent?: number
  progressTotal?: number
  nextHref?: string
  onNextClick?: () => void
  nextDisabled?: boolean
  nextLabel?: string
  nextLabelEs?: string
  readPageItems?: string[]
  children: ReactNode
}

export function StudentModeShell({
  title,
  titleEs,
  description,
  descriptionEs,
  breadcrumb,
  breadcrumbEs,
  progressLabel,
  progressLabelEs,
  progressCurrent,
  progressTotal,
  nextHref,
  onNextClick,
  nextDisabled = false,
  nextLabel,
  nextLabelEs,
  readPageItems,
  children,
}: Props) {
  const { dict, lang, ttsLocale } = useStudentI18n()
  const percent = progressCurrent && progressTotal ? Math.min(100, Math.round((progressCurrent / progressTotal) * 100)) : 0

  const viewTitle = lang === 'es' ? (titleEs ?? title) : title
  const viewDescription = lang === 'es' ? (descriptionEs ?? description) : description
  const viewBreadcrumb = lang === 'es' ? (breadcrumbEs ?? breadcrumb) : breadcrumb
  const viewProgressLabel = lang === 'es' ? (progressLabelEs ?? progressLabel ?? dict.shell.progressLabelDefault) : (progressLabel ?? dict.shell.progressLabelDefault)
  const viewNextLabel = lang === 'es' ? (nextLabelEs ?? nextLabel ?? dict.common.next) : (nextLabel ?? dict.common.next)
  const pageReadItems = readPageItems ?? [viewTitle, viewDescription, viewProgressLabel]

  return (
    <div className="student-app-bg">
      <StudentTopNav />
      <div className="student-page-container">
        <div className="student-shell">
          <header className="student-shell-header">
            <nav className="student-breadcrumb" aria-label={dict.shell.breadcrumbLabel}>
              <Link to="/">{dict.shell.dashboardBreadcrumb}</Link>
              <span>/</span>
              <span aria-current="page">{viewBreadcrumb}</span>
              <SpeakerButton text={`${dict.shell.dashboardBreadcrumb}. ${viewBreadcrumb}`} lang={ttsLocale} label={dict.tts.readTitle} id={`crumb-${viewBreadcrumb}`} />
            </nav>
            <div className="student-title-card">
              <div>
                <p className="page-kicker">{dict.shell.learningModeKicker}</p>
                <div className="title-row">
                  <h1>{viewTitle}</h1>
                  <SpeakerButton text={viewTitle} lang={ttsLocale} label={dict.tts.readTitle} id={`title-${viewBreadcrumb}`} />
                </div>
                <div className="title-row compact">
                  <p>{viewDescription}</p>
                  <SpeakerButton text={viewDescription} lang={ttsLocale} label={dict.tts.readInstruction} id={`desc-${viewBreadcrumb}`} />
                </div>
              </div>
              <div className="page-status-pill" aria-label={dict.shell.modeStatusReady}>
                <span className="status-dot" />
                {dict.shell.modeStatusReady}
              </div>
            </div>
          </header>

          <main className="student-shell-main">
            <div className="student-mode-body">{children}</div>
          </main>

          <footer className="student-shell-footer">
            <div className="student-footer-card">
              <div className="student-progress-row">
                <span>{viewProgressLabel}</span>
                {progressCurrent && progressTotal ? <span>{progressCurrent} / {progressTotal}</span> : <span>{dict.common.ready}</span>}
              </div>
              <div className="student-progress-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-label={dict.shell.progressAria}>
                <span style={{ width: `${percent}%` }} />
              </div>
            </div>
            <div className="student-footer-actions">
              <Link className="student-btn secondary" to="/">{dict.common.backHome}</Link>
              {onNextClick ? (
                <button
                  type="button"
                  className="student-btn primary"
                  onClick={onNextClick}
                  disabled={nextDisabled}
                  aria-disabled={nextDisabled}
                  style={nextDisabled ? { opacity: 0.55, cursor: 'not-allowed' } : undefined}
                >
                  {viewNextLabel}
                </button>
              ) : nextHref ? (
                <Link className="student-btn primary" to={nextHref}>{viewNextLabel}</Link>
              ) : (
                <span className="student-btn primary is-disabled" aria-disabled="true">{dict.common.next}</span>
              )}
              <SpeakerButton
                text={`${dict.common.backHome}. ${(onNextClick || nextHref) ? viewNextLabel : dict.common.next}.`}
                lang={ttsLocale}
                label={dict.tts.readButtons}
                id={`footer-buttons-${viewBreadcrumb}`}
                size="md"
              />
            </div>
            <ReadPageControls items={pageReadItems} pageId={`page-${viewBreadcrumb}`} />
          </footer>
        </div>
      </div>
    </div>
  )
}
