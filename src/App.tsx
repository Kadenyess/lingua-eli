import { useState, useEffect, useCallback } from 'react'
import { BookOpen, Trophy, Brain, Home, Sparkles, Star, Target, Volume2, VolumeX, Pencil, Volume } from 'lucide-react'
import { VocabularyModule } from './components/VocabularyModule'
import { ReadingModule } from './components/ReadingModule'
import { ProgressDashboard } from './components/ProgressDashboard'
import { WelcomeScreen } from './components/WelcomeScreen'
import { Mascot } from './components/Mascot'
import { Confetti } from './components/Confetti'
import { TTSSpeedSlider } from './components/TTSSpeedSlider'
import { SandboxJournal } from './components/SandboxJournal'
import { InitialAssessment } from './components/InitialAssessment'
import { soundEffects } from './utils/soundEffects'
import './App.css'

export interface UserProgress {
  vocabularyLearned: number
  readingCompleted: number
  totalPoints: number
  currentLevel: number
  streakDays: number
}

function App() {
  // Check if assessment is completed
  const [assessmentCompleted, setAssessmentCompleted] = useState<boolean>(() => {
    return localStorage.getItem('assessmentCompleted') === 'true'
  })
  
  const [currentView, setCurrentView] = useState<'welcome' | 'assessment' | 'dashboard' | 'vocabulary' | 'reading' | 'sandbox'>(() => {
    // If assessment not completed, show welcome first (will redirect to assessment)
    return 'welcome'
  })
  
  const [progress, setProgress] = useState<UserProgress>(() => {
    // Load saved progress or use defaults
    const saved = localStorage.getItem('userProgress')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        // Invalid saved data, use defaults
      }
    }
    return {
      vocabularyLearned: 0,
      readingCompleted: 0,
      totalPoints: 0,
      currentLevel: 1,
      streakDays: 1
    }
  })
  
  const [mascotMessage, setMascotMessage] = useState<string>()
  const [mascotEmotion, setMascotEmotion] = useState<'happy' | 'excited' | 'thinking' | 'celebrating'>('happy')
  const [showConfetti, setShowConfetti] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [clickSoundsEnabled, setClickSoundsEnabled] = useState(soundEffects.areClickSoundsEnabled())
  const [showHelp, setShowHelp] = useState(false)

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userProgress', JSON.stringify(progress))
  }, [progress])

  useEffect(() => {
    if (soundEnabled) {
      soundEffects.enable()
    } else {
      soundEffects.disable()
    }
  }, [soundEnabled])

  const startLearning = () => {
    soundEffects.playClickSafe()
    
    // Check if assessment is needed
    if (!assessmentCompleted) {
      setCurrentView('assessment')
      setMascotEmotion('thinking')
      setMascotMessage('¡Vamos a hacer una evaluación rápida para encontrar tu nivel perfecto! 🎯')
      return
    }
    
    // Assessment already completed, go to dashboard
    soundEffects.speakEncouragement('welcome')
    setMascotEmotion('excited')
    setMascotMessage('¡Empecemos esta aventura! 🎉')
    setCurrentView('dashboard')
    
    // Show Chrome audio tip once
    const isChrome = /Chrome/.test(navigator.userAgent)
    if (isChrome && !localStorage.getItem('chromeTipShown')) {
      setTimeout(() => {
        setMascotMessage('💡 Si usas Chrome y hay problemas de audio, activa los sonidos de clic en la configuración arriba.')
        localStorage.setItem('chromeTipShown', 'true')
      }, 3000)
    }
  }

  const handleAssessmentComplete = (startingLevel: number, score: number, total: number) => {
    localStorage.setItem('assessmentCompleted', 'true')
    setAssessmentCompleted(true)
    
    // Set starting level and calculate initial points
    // Points needed to reach starting level: (startingLevel - 1) * 200
    const initialPoints = (startingLevel - 1) * 200
    
    setProgress({
      vocabularyLearned: 0,
      readingCompleted: 0,
      totalPoints: initialPoints,
      currentLevel: startingLevel,
      streakDays: 1
    })
    
    // Show celebration
    soundEffects.playLevelComplete()
    triggerCelebration(`¡Excelente! Obtuviste ${score} de ${total}. Empezarás en el nivel ${startingLevel}. ¡Vamos a aprender! 🎉`)
    
    // Go to dashboard
    setTimeout(() => {
      setCurrentView('dashboard')
      setMascotEmotion('excited')
      setMascotMessage(`¡Bienvenido! Estás en el nivel ${startingLevel}. ¡Empecemos! 🌟`)
    }, 2000)
  }

  const triggerCelebration = useCallback((message: string) => {
    setShowConfetti(true)
    setMascotMessage(message)
    setMascotEmotion('celebrating')
    soundEffects.playSuccess()
    soundEffects.speakEncouragement('correct')
  }, [])

  const addPoints = (points: number, reason?: string) => {
    setProgress((prev: UserProgress) => {
      const newTotal = prev.totalPoints + points
      const newLevel = Math.min(40, Math.floor(newTotal / 200) + 1)
      
      if (newLevel > prev.currentLevel) {
        triggerCelebration(`¡Subiste al nivel ${newLevel}! 🎉`)
        soundEffects.playLevelComplete()
      } else if (reason) {
        triggerCelebration(`¡+${points} puntos! ${reason}`)
      }
      
      return {
        ...prev,
        totalPoints: newTotal,
        currentLevel: newLevel
      }
    })
  }

  const markVocabularyLearned = () => {
    setProgress((prev: UserProgress) => ({ ...prev, vocabularyLearned: prev.vocabularyLearned + 1 }))
  }

  const markReadingCompleted = () => {
    setProgress((prev: UserProgress) => ({ ...prev, readingCompleted: prev.readingCompleted + 1 }))
  }

  const handleNavigate = (view: 'vocabulary' | 'reading' | 'dashboard') => {
    soundEffects.playClickSafe()
    setCurrentView(view)
    setMascotEmotion('thinking')
    setMascotMessage(view === 'vocabulary' ? '¡Vamos a aprender palabras nuevas! 📚' : view === 'reading' ? '¡Hora de leer! 📖' : '¡Buen trabajo! 🌟')
  }

  if (currentView === 'welcome') {
    return <WelcomeScreen onStart={startLearning} />
  }

  if (currentView === 'assessment') {
    return (
      <div className="app-container assessment-mode">
        <InitialAssessment onComplete={handleAssessmentComplete} />
      </div>
    )
  }

  return (
    <div className="app-container">
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      <nav className="nav-bar">
        <div className="nav-brand">
          <Sparkles className="nav-icon" />
          <span>LinguaELI</span>
        </div>
        <div className="nav-controls">
          <button 
            className="sound-toggle"
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Apagar sonido' : 'Encender sonido'}
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          <button 
            className={`click-sound-toggle ${clickSoundsEnabled ? 'active' : ''}`}
            onClick={() => {
              const newState = !clickSoundsEnabled
              setClickSoundsEnabled(newState)
              soundEffects.setClickSoundsEnabled(newState)
            }}
            title={clickSoundsEnabled ? 'Apagar sonidos de clic' : 'Encender sonidos de clic'}
          >
            <Volume size={20} />
          </button>
                    <TTSSpeedSlider />
          <div className="nav-stats">
            <div className="stat-badge">
              <Star className="stat-icon" />
              <span>{progress.totalPoints} puntos</span>
            </div>
            <div className="stat-badge">
              <Target className="stat-icon" />
              <span>Nivel {progress.currentLevel}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="mascot-area">
        <Mascot message={mascotMessage} emotion={mascotEmotion} showTip={showHelp} />
        <button className="help-btn" onClick={() => setShowHelp(true)}>
          <span>¿Necesitas ayuda?</span>
        </button>
      </div>

      <main className="main-content">
        {currentView === 'dashboard' && (
          <ProgressDashboard 
            progress={progress} 
            onNavigate={(view) => handleNavigate(view as 'vocabulary' | 'reading' | 'dashboard')}
          />
        )}
        {currentView === 'vocabulary' && (
          <VocabularyModule 
            level={progress.currentLevel}
            onAddPoints={addPoints}
            onComplete={markVocabularyLearned}
            onBack={() => {
              setCurrentView('dashboard')
              setMascotMessage('¡Buen trabajo! 🌟')
              setMascotEmotion('happy')
            }}
            onCelebration={triggerCelebration}
          />
        )}
        {currentView === 'reading' && (
          <ReadingModule 
            level={progress.currentLevel}
            onAddPoints={addPoints}
            onComplete={markReadingCompleted}
            onBack={() => {
              setCurrentView('dashboard')
              setMascotMessage('¡Excelente lectura! 📚')
              setMascotEmotion('happy')
            }}
            onCelebration={triggerCelebration}
          />
        )}
        {currentView === 'sandbox' && (
          <SandboxJournal
            level={progress.currentLevel}
            onAddPoints={addPoints}
            onBack={() => {
              setCurrentView('dashboard')
              setMascotMessage('¡Buen trabajo escribiendo! ✏️')
              setMascotEmotion('happy')
            }}
          />
        )}
      </main>

      <footer className="bottom-nav">
        <button 
          className={`nav-btn ${currentView === 'dashboard' ? 'active' : ''}`}
          onClick={() => setCurrentView('dashboard')}
        >
          <Home size={24} />
          <span>Inicio</span>
        </button>
        <button 
          className={`nav-btn ${currentView === 'vocabulary' ? 'active' : ''}`}
          onClick={() => setCurrentView('vocabulary')}
        >
          <Brain size={24} />
          <span>Vocabulario</span>
        </button>
        <button 
          className={`nav-btn ${currentView === 'reading' ? 'active' : ''}`}
          onClick={() => setCurrentView('reading')}
        >
          <BookOpen size={24} />
          <span>Lectura</span>
        </button>
        <button 
          className={`nav-btn ${currentView === 'sandbox' ? 'active' : ''}`}
          onClick={() => setCurrentView('sandbox')}
        >
          <Pencil size={24} />
          <span>Diario</span>
        </button>
        <button className="nav-btn">
          <Trophy size={24} />
          <span>Logros</span>
        </button>
      </footer>
    </div>
  )
}

export default App
