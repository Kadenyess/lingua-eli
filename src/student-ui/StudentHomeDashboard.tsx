import { Link } from 'react-router-dom'
import { STUDENT_MODES } from './modes/modeCatalog'
import './student-ui.css'

export default function StudentHomeDashboard() {
  return (
    <div className="student-home-page">
      <div className="student-home-wrap">
        <header className="student-home-hero">
          <h1>Lingua ELD Learning Modes</h1>
          <p>Pick one activity. One page. One clear job to do.</p>
        </header>

        <main className="mode-grid" aria-label="Learning modes">
          {STUDENT_MODES.map((mode) => (
            <Link key={mode.id} className="mode-card" to={mode.path}>
              <span className="mode-icon" aria-hidden="true">{mode.icon}</span>
              <span>
                <h2>{mode.title}</h2>
                <p>{mode.description}</p>
              </span>
            </Link>
          ))}
        </main>

        <footer className="student-home-footer">
          <Link className="utility-card" to="/progress">My Progress</Link>
          <Link className="utility-card" to="/settings">Settings</Link>
        </footer>
      </div>
    </div>
  )
}
