import { NavLink } from 'react-router-dom'
import { Languages } from 'lucide-react'
import { useStudentI18n } from './i18n/useI18n'
import { SpeakerButton } from './tts/SpeakerButton'
import './student-ui.css'

export function StudentTopNav() {
  const { dict, lang, setLang, ttsLocale } = useStudentI18n()
  const links = [
    { to: '/', label: dict.common.dashboard, end: true },
    { to: '/modes', label: dict.common.learningModes },
    { to: '/progress', label: dict.common.progress },
    { to: '/settings', label: dict.common.settings },
  ]

  return (
    <header className="student-topbar-wrap">
      <div className="student-topbar">
        <NavLink to="/" end className="student-brand" aria-label={dict.common.dashboard}>
          <span className="student-brand-mark" aria-hidden="true">LE</span>
          <span className="student-brand-text">
            <strong>Lingua ELD</strong>
            <span>{dict.common.studentLearning}</span>
          </span>
        </NavLink>

        <nav className="student-main-nav" aria-label={dict.common.learningModes}>
          {links.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `student-nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="student-nav-link-main">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="student-topbar-tools">
          <div className="lang-toggle" role="group" aria-label={dict.tts.languageToggle}>
            <button type="button" className={`lang-pill ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
            <button type="button" className={`lang-pill ${lang === 'es' ? 'active' : ''}`} onClick={() => setLang('es')}>ES</button>
            <span className="lang-icon" aria-hidden="true"><Languages size={14} /></span>
          </div>
          <SpeakerButton
            text={`${dict.common.dashboard}. ${dict.common.learningModes}. ${dict.common.progress}. ${dict.common.settings}.`}
            lang={ttsLocale}
            label={dict.tts.readButtons}
            id="nav-tts"
          />
          <button type="button" className="student-profile-btn" aria-label={dict.common.profile}>
            <span className="student-profile-avatar" aria-hidden="true">KB</span>
            <span className="student-profile-meta">
              <strong>{dict.common.student}</strong>
              <span>{dict.common.profile}</span>
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
