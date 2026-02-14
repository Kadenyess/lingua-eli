import { useState } from 'react'
import { User, LogIn, KeyRound, Sparkles } from 'lucide-react'
import { soundEffects } from '../utils/soundEffects'
import { isFirebaseConfigured, loadProgressFromFirebase, saveProgressToFirebase, generateStudentCode } from '../utils/firebase'
import './StudentLogin.css'

interface StudentLoginProps {
  onLogin: (studentCode: string, studentName: string) => void
}

export function StudentLogin({ onLogin }: StudentLoginProps) {
  const [mode, setMode] = useState<'select' | 'new' | 'existing'>('select')
  const [studentName, setStudentName] = useState('')
  const [studentCode, setStudentCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCreateNew = async () => {
    if (!studentName.trim()) {
      setError('Escribe tu nombre')
      return
    }

    soundEffects.playClick()
    setIsLoading(true)
    setError('')

    // Generate a simple code like "JUAN2026001"
    const code = generateStudentCode(studentName)
    
    // Save empty progress to Firebase
    await saveProgressToFirebase(code, {
      studentName: studentName.trim(),
      vocabularyLearned: 0,
      readingCompleted: 0,
      totalPoints: 0,
      currentLevel: 1,
      streakDays: 1,
      createdAt: new Date().toISOString()
    })

    setIsLoading(false)
    onLogin(code, studentName.trim())
  }

  const handleLoginExisting = async () => {
    if (!studentCode.trim()) {
      setError('Escribe tu código')
      return
    }

    soundEffects.playClick()
    setIsLoading(true)
    setError('')

    // Try to load from Firebase
    const data = await loadProgressFromFirebase(studentCode.trim().toUpperCase())
    
    if (data && data.studentName) {
      setIsLoading(false)
      onLogin(studentCode.trim().toUpperCase(), data.studentName)
    } else {
      setIsLoading(false)
      setError('Código no encontrado. Verifica tu código.')
    }
  }

  if (mode === 'select') {
    return (
      <div className="student-login">
        <div className="login-header">
          <Sparkles size={40} className="sparkle-icon" />
          <h1>¡Bienvenido a LinguaELi!</h1>
          <p>¿Cómo quieres entrar?</p>
        </div>

        <div className="login-options">
          <button 
            className="login-option-card new"
            onClick={() => { soundEffects.playClick(); setMode('new'); }}
          >
            <User size={32} />
            <span>Soy estudiante nuevo</span>
            <small>Crear mi cuenta</small>
          </button>

          <button 
            className="login-option-card existing"
            onClick={() => { soundEffects.playClick(); setMode('existing'); }}
          >
            <KeyRound size={32} />
            <span>Ya tengo código</span>
            <small>Usar mi código</small>
          </button>
        </div>

        {!isFirebaseConfigured() && (
          <div className="demo-notice">
            <p>⚠️ Modo demo: Tu progreso se guardará en este dispositivo solamente.</p>
          </div>
        )}
      </div>
    )
  }

  if (mode === 'new') {
    return (
      <div className="student-login">
        <div className="login-form">
          <h2>¿Cómo te llamas?</h2>
          <p>Escribe tu nombre para crear tu código</p>
          
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Tu nombre"
            maxLength={20}
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleCreateNew()}
          />

          {error && <div className="login-error">{error}</div>}

          <div className="login-buttons">
            <button 
              className="back-btn"
              onClick={() => { soundEffects.playClick(); setMode('select'); setError(''); }}
            >
              Atrás
            </button>
            <button 
              className="continue-btn"
              onClick={handleCreateNew}
              disabled={isLoading || !studentName.trim()}
            >
              {isLoading ? 'Creando...' : 'Continuar'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // mode === 'existing'
  return (
    <div className="student-login">
      <div className="login-form">
        <h2>¿Cuál es tu código?</h2>
        <p>Escribe el código que te dieron</p>
        
        <input
          type="text"
          value={studentCode}
          onChange={(e) => setStudentCode(e.target.value.toUpperCase())}
          placeholder="Ej: JUAN2026001"
          maxLength={15}
          autoFocus
          onKeyDown={(e) => e.key === 'Enter' && handleLoginExisting()}
        />

        {error && <div className="login-error">{error}</div>}

        <div className="login-buttons">
          <button 
            className="back-btn"
            onClick={() => { soundEffects.playClick(); setMode('select'); setError(''); }}
          >
            Atrás
          </button>
          <button 
            className="continue-btn"
            onClick={handleLoginExisting}
            disabled={isLoading || !studentCode.trim()}
          >
            {isLoading ? <><LogIn size={18} /> Entrando...</> : 'Entrar'}
          </button>
        </div>
      </div>
    </div>
  )
}
