import { NavLink } from 'react-router-dom'
import './student-ui.css'

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/modes', label: 'Learning Modes' },
  { to: '/progress', label: 'Progress' },
  { to: '/settings', label: 'Settings' },
]

export function StudentTopNav() {
  return (
    <header className="student-topbar-wrap">
      <div className="student-topbar">
        <NavLink to="/" end className="student-brand" aria-label="Lingua ELD dashboard">
          <span className="student-brand-mark" aria-hidden="true">LE</span>
          <span className="student-brand-text">
            <strong>Lingua ELD</strong>
            <span>Student Learning</span>
          </span>
        </NavLink>

        <nav className="student-main-nav" aria-label="Primary navigation">
          {links.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `student-nav-link ${isActive ? 'active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button type="button" className="student-profile-btn" aria-label="Open profile menu">
          <span className="student-profile-avatar" aria-hidden="true">KB</span>
          <span className="student-profile-meta">
            <strong>Student</strong>
            <span>Profile</span>
          </span>
        </button>
      </div>
    </header>
  )
}
