import { Brain, BookOpen, Star, Target, Award, Zap, TrendingUp, Pencil } from 'lucide-react'
import { UserProgress } from '../App'
import { vocabularyLevels } from '../data/vocabulary'
import { readingPassages } from '../data/reading'
import './ProgressDashboard.css'

interface ProgressDashboardProps {
  progress: UserProgress
  onNavigate: (view: 'vocabulary' | 'reading' | 'sandbox') => void
}

export function ProgressDashboard({ progress, onNavigate }: ProgressDashboardProps) {
  const totalVocabWords = vocabularyLevels.reduce((sum, level) => sum + level.words.length, 0)
  const vocabPercentage = Math.round((progress.vocabularyLearned / totalVocabWords) * 100)
  const readingPercentage = Math.round((progress.readingCompleted / readingPassages.length) * 100)
  
  const nextLevelPoints = progress.currentLevel * 500
  const pointsInCurrentLevel = progress.totalPoints % 500
  const levelProgress = (pointsInCurrentLevel / 500) * 100

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>¡Bienvenido de vuelta!</h1>
        <p className="motivation">Sigue aprendiendo y ganando puntos</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon-wrapper">
            <Star size={32} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{progress.totalPoints}</span>
            <span className="stat-label">Puntos totales</span>
          </div>
        </div>

        <div className="stat-card secondary">
          <div className="stat-icon-wrapper">
            <Target size={32} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{progress.currentLevel}</span>
            <span className="stat-label">Nivel actual</span>
          </div>
        </div>

        <div className="stat-card accent">
          <div className="stat-icon-wrapper">
            <Zap size={32} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{progress.streakDays}</span>
            <span className="stat-label">Días seguidos</span>
          </div>
        </div>
      </div>

      <div className="level-progress-card">
        <div className="level-progress-header">
          <h3>Progreso al Nivel {progress.currentLevel + 1}</h3>
          <span className="points-needed">{500 - pointsInCurrentLevel} puntos más</span>
        </div>
        <div className="level-progress-bar">
          <div className="level-progress-fill" style={{ width: `${levelProgress}%` }} />
        </div>
        <p className="level-progress-text">
          {pointsInCurrentLevel} / 500 puntos en este nivel
        </p>
      </div>

      <div className="learning-modules">
        <h2>Módulos de Aprendizaje</h2>
        
        <div className="module-card" onClick={() => onNavigate('vocabulary')}>
          <div className="module-icon vocabulary">
            <Brain size={32} />
          </div>
          <div className="module-content">
            <h3>Vocabulario</h3>
            <p>Aprende {totalVocabWords} palabras en inglés</p>
            <div className="module-progress">
              <div className="module-progress-bar">
                <div className="module-progress-fill" style={{ width: `${vocabPercentage}%` }} />
              </div>
              <span className="module-progress-text">{vocabPercentage}%</span>
            </div>
          </div>
          <TrendingUp size={24} className="module-arrow" />
        </div>

        <div className="module-card" onClick={() => onNavigate('reading')}>
          <div className="module-icon reading">
            <BookOpen size={32} />
          </div>
          <div className="module-content">
            <h3>Lectura</h3>
            <p>Lee {readingPassages.length} historias con comprensión</p>
            <div className="module-progress">
              <div className="module-progress-bar">
                <div className="module-progress-fill" style={{ width: `${readingPercentage}%` }} />
              </div>
              <span className="module-progress-text">{readingPercentage}%</span>
            </div>
          </div>
          <TrendingUp size={24} className="module-arrow" />
        </div>

        <div className="module-card sandbox" onClick={() => onNavigate('sandbox')}>
          <div className="module-icon sandbox-icon">
            <Pencil size={32} />
          </div>
          <div className="module-content">
            <h3>Diario de Inglés</h3>
            <p>Escribe 2 oraciones y recibe ayuda de la IA</p>
            <div className="module-badge">¡Nuevo!</div>
          </div>
          <TrendingUp size={24} className="module-arrow" />
        </div>
      </div>

      <div className="achievements-section">
        <h2>Logros</h2>
        <div className="achievements-grid">
          <div className={`achievement-card ${progress.vocabularyLearned >= 10 ? 'unlocked' : ''}`}>
            <div className="achievement-icon">
              <Award size={24} />
            </div>
            <span className="achievement-name">Primeras Palabras</span>
            <span className="achievement-desc">Aprende 10 palabras</span>
          </div>
          
          <div className={`achievement-card ${progress.readingCompleted >= 1 ? 'unlocked' : ''}`}>
            <div className="achievement-icon">
              <BookOpen size={24} />
            </div>
            <span className="achievement-name">Lector Principiante</span>
            <span className="achievement-desc">Completa tu primera lectura</span>
          </div>
          
          <div className={`achievement-card ${progress.totalPoints >= 100 ? 'unlocked' : ''}`}>
            <div className="achievement-icon">
              <Star size={24} />
            </div>
            <span className="achievement-name">Cien Puntos</span>
            <span className="achievement-desc">Gana 100 puntos</span>
          </div>
          
          <div className={`achievement-card ${progress.currentLevel >= 2 ? 'unlocked' : ''}`}>
            <div className="achievement-icon">
              <Target size={24} />
            </div>
            <span className="achievement-name">Sube de Nivel</span>
            <span className="achievement-desc">Alcanza el nivel 2</span>
          </div>
        </div>
      </div>
    </div>
  )
}
