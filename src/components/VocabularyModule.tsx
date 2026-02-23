import { useState, useEffect } from 'react'
import { ArrowLeft, Volume2, CheckCircle, Star, ChevronRight, RotateCcw, VolumeX, HelpCircle } from 'lucide-react'
import { vocabularyLevels } from '../data/vocabulary'
import { soundEffects } from '../utils/soundEffects'
import './VocabularyModule.css'

interface VocabularyModuleProps {
  level: number
  onAddPoints: (points: number, reason?: string) => void
  onComplete: () => void
  onBack: () => void
  onCelebration?: (message: string) => void
}

export function VocabularyModule({ level, onAddPoints, onComplete, onBack, onCelebration }: VocabularyModuleProps) {
  const [selectedLevel, setSelectedLevel] = useState(Math.min(level, vocabularyLevels.length))
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [showTranslation, setShowTranslation] = useState(false)
  const [learnedWords, setLearnedWords] = useState<string[]>([])
  const [completedLevels, setCompletedLevels] = useState<number[]>([])
  const [justLearned, setJustLearned] = useState(false)
  const [typedWord, setTypedWord] = useState('')
  const [typingError, setTypingError] = useState('')
  const [showHelpGuide, setShowHelpGuide] = useState(false)

  const currentLevel = vocabularyLevels.find(l => l.level === selectedLevel) || vocabularyLevels[0]
  const currentWord = currentLevel.words[currentWordIndex]
  const progress = ((currentWordIndex + 1) / currentLevel.words.length) * 100
  const numbersInLevel = currentLevel.words.filter(word => word.category === 'numbers')
  const nonNumbersInLevel = currentLevel.words.filter(word => word.category !== 'numbers')
  const canAdvanceCurrentWord = typedWord.trim().toLowerCase() === currentWord.english.trim().toLowerCase()

  useEffect(() => {
    const saved = localStorage.getItem('learnedVocabulary')
    if (saved) {
      try {
        setLearnedWords(JSON.parse(saved))
      } catch {
        localStorage.removeItem('learnedVocabulary')
      }
    }
    const savedLevels = localStorage.getItem('completedVocabLevels')
    if (savedLevels) {
      try {
        setCompletedLevels(JSON.parse(savedLevels))
      } catch {
        localStorage.removeItem('completedVocabLevels')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('learnedVocabulary', JSON.stringify(learnedWords))
  }, [learnedWords])

  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSpeakingSpanish, setIsSpeakingSpanish] = useState(false)

  const speakWord = async (text: string) => {
    // If already speaking, stop it
    if (isSpeaking) {
      soundEffects.stopSpeaking()
      setIsSpeaking(false)
      return
    }
    
    setIsSpeaking(true)
    soundEffects.speakEnglish(text)
    // Reset after a short delay (browser TTS doesn't give us exact end time)
    setTimeout(() => setIsSpeaking(false), 1000)
  }

  const speakSpanish = async (text: string) => {
    // If already speaking Spanish, stop it
    if (isSpeakingSpanish) {
      soundEffects.stopSpeaking()
      setIsSpeakingSpanish(false)
      return
    }
    
    setIsSpeakingSpanish(true)
    soundEffects.speakSpanish(text)
    // Reset after a short delay
    setTimeout(() => setIsSpeakingSpanish(false), 1000)
  }

  const handleNext = () => {
    soundEffects.playClickSafe()
    if (!canAdvanceCurrentWord) {
      setTypingError(`Escribe la palabra exactamente: "${currentWord.english}"`)
      return
    }
    setTypingError('')
    if (!learnedWords.includes(currentWord.id)) {
      const newLearned = [...learnedWords, currentWord.id]
      setLearnedWords(newLearned)
      setJustLearned(true)
      onAddPoints(10, `¡Aprendiste "${currentWord.english}"!`)
      onComplete()
      soundEffects.playSuccess()
      
      setTimeout(() => setJustLearned(false), 2000)
    }
    
    if (currentWordIndex < currentLevel.words.length - 1) {
      setTimeout(() => {
        setCurrentWordIndex((prev: number) => prev + 1)
        setShowTranslation(false)
        setTypedWord('')
      }, 300)
    } else {
      if (!completedLevels.includes(selectedLevel)) {
        setCompletedLevels((prev: number[]) => [...prev, selectedLevel])
        localStorage.setItem('completedVocabLevels', JSON.stringify([...completedLevels, selectedLevel]))
        onAddPoints(50, '¡Nivel completado!')
        onCelebration?.(`¡Completaste el nivel ${selectedLevel}! 🎉`)
        soundEffects.playLevelComplete()
      }
      setTimeout(() => {
        setCurrentWordIndex(0)
        setShowTranslation(false)
        setTypedWord('')
      }, 1000)
    }
  }

  const handlePrevious = () => {
    soundEffects.playClickSafe()
    if (currentWordIndex > 0) {
      setCurrentWordIndex((prev: number) => prev - 1)
      setShowTranslation(false)
      setTypedWord('')
      setTypingError('')
    }
  }

  const restartLevel = () => {
    soundEffects.playClickSafe()
    setCurrentWordIndex(0)
    setShowTranslation(false)
    setTypedWord('')
    setTypingError('')
  }

  const handleLevelSelect = (levelNum: number) => {
    soundEffects.playClickSafe()
    setSelectedLevel(levelNum)
    setCurrentWordIndex(0)
    setShowTranslation(false)
    setTypedWord('')
    setTypingError('')
  }

  const getGradeBandLabel = (levelNum: number) => {
    if (levelNum <= 10) return 'Foundations / Pre-Literacy'
    if (levelNum <= 20) return 'Grade 3'
    if (levelNum <= 30) return 'Grade 4'
    return 'Grade 5'
  }

  const getWordImage = (word: string, category: string) => {
    const token = word.toLowerCase()
    const emojiMap: Record<string, string> = {
      hello: '👋', goodbye: '👋', please: '🙏', 'thank you': '💛', yes: '✅', no: '🚫',
      cat: '🐱', dog: '🐶', house: '🏠', book: '📘', school: '🏫', friend: '🧒',
      water: '💧', food: '🍎', family: '👨‍👩‍👧', happy: '😊', sad: '😢', run: '🏃',
      walk: '🚶', eat: '🍽️', drink: '🥛', mother: '👩', father: '👨', brother: '👦', sister: '👧',
      red: '🔴', blue: '🔵', green: '🟢', one: '1️⃣', two: '2️⃣', three: '3️⃣', four: '4️⃣', five: '5️⃣',
      six: '6️⃣', seven: '7️⃣', eight: '8️⃣', nine: '9️⃣', ten: '🔟'
    }
    const emoji = emojiMap[token] || (category === 'numbers' ? '🔢' : '📚')
    const hue = category === 'numbers' ? 210 : 35
    const safe = word.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="160" height="120" viewBox="0 0 160 120">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="hsl(${hue} 90% 95%)"/>
            <stop offset="100%" stop-color="hsl(${(hue + 32) % 360} 85% 88%)"/>
          </linearGradient>
        </defs>
        <rect width="160" height="120" rx="14" fill="url(#g)"/>
        <rect x="8" y="8" width="144" height="104" rx="10" fill="rgba(255,255,255,0.55)"/>
        <text x="80" y="58" text-anchor="middle" dominant-baseline="central" font-size="38">${emoji}</text>
        <text x="80" y="98" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#1f2937">${safe.slice(0, 14)}</text>
      </svg>`
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
  }

  return (
    <div className="vocabulary-module">
      <div className="vocab-header">
        <button className="back-btn" onClick={() => {
          soundEffects.playClickSafe()
          onBack()
        }}>
          <ArrowLeft size={24} />
          <span>Volver</span>
        </button>
        <h2>Vocabulario</h2>
        <button
          type="button"
          className="vocab-help-btn"
          onClick={() => {
            soundEffects.playClickSafe()
            setShowHelpGuide((prev) => !prev)
          }}
        >
          <HelpCircle size={18} />
          <span>{showHelpGuide ? 'Cerrar guía' : 'Guía'}</span>
        </button>
      </div>

      {showHelpGuide && (
        <div className="vocab-help-card">
          <p><strong>Cómo usar:</strong> escucha la palabra, mírala, y escríbela exactamente para continuar.</p>
          <p>Los números del nivel aparecen en una sección separada del banco visual.</p>
        </div>
      )}

      <div className="level-dropdown-wrap">
        <label htmlFor="level-select">Nivel asignado / Grade level</label>
        <select
          id="level-select"
          className="level-dropdown"
          value={selectedLevel}
          onChange={(e) => handleLevelSelect(Number(e.target.value))}
        >
          {vocabularyLevels.map(lvl => (
            <option key={lvl.level} value={lvl.level}>
              Nivel {lvl.level} • {getGradeBandLabel(lvl.level)} • {lvl.nameEs}
            </option>
          ))}
        </select>
      </div>

      <div className="level-selector">
        {vocabularyLevels.map(lvl => (
          <button
            key={lvl.level}
            className={`level-btn ${selectedLevel === lvl.level ? 'active' : ''} ${completedLevels.includes(lvl.level) ? 'completed' : ''}`}
            onClick={() => handleLevelSelect(lvl.level)}
          >
            <span className="level-num">{lvl.level}</span>
            <span className="level-name">{lvl.nameEs}</span>
            {completedLevels.includes(lvl.level) && <CheckCircle size={16} className="completed-icon" />}
          </button>
        ))}
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
        <span className="progress-text">{currentWordIndex + 1} / {currentLevel.words.length}</span>
      </div>

      <div className={`word-card ${justLearned ? 'just-learned' : ''}`}>
        <div className="word-header">
          <span className="category-tag">{currentWord.category}</span>
          <div className="stars">
            {learnedWords.includes(currentWord.id) && <Star className="star-filled" size={20} />}
          </div>
        </div>

        <div className="word-content">
          <div className="word-visual-frame">
            <img
              className="word-visual-image"
              src={getWordImage(currentWord.english, currentWord.category)}
              alt={`Imagen para ${currentWord.english}`}
            />
          </div>
          <h1 className="english-word">{currentWord.english}</h1>
          <p className="pronunciation">/{currentWord.pronunciation}/</p>
          
          <button className={`speak-btn ${isSpeaking ? 'speaking' : ''}`} onClick={() => speakWord(currentWord.english)}>
            {isSpeaking ? <VolumeX size={24} /> : <Volume2 size={24} />}
            <span>{isSpeaking ? 'Detener' : 'Escuchar'}</span>
          </button>

          <button 
            className="translate-btn"
            onClick={() => {
              soundEffects.playClickSafe()
              setShowTranslation(!showTranslation)
            }}
          >
            {showTranslation ? 'Ocultar traducción' : 'Ver traducción'}
          </button>

          {showTranslation && (
            <div className="translation">
              <div className="spanish-audio-row">
                <p className="spanish-word">{currentWord.spanish}</p>
                <button 
                  className={`speak-btn spanish ${isSpeakingSpanish ? 'speaking' : ''}`} 
                  onClick={() => speakSpanish(currentWord.spanish)}
                  title="Escuchar en español"
                >
                  {isSpeakingSpanish ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
              </div>
              <p className="example">
                <strong>Ejemplo:</strong> {currentWord.example}
              </p>
              <div className="audio-buttons-row">
                <button className={`speak-btn small ${isSpeaking ? 'speaking' : ''}`} onClick={() => speakWord(currentWord.example)}>
                  {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  <span>{isSpeaking ? 'Detener' : 'Escuchar ejemplo'}</span>
                </button>
              </div>
            </div>
          )}

          <div className="typing-check">
            <label htmlFor="type-word-input">Escribe la palabra para continuar:</label>
            <input
              id="type-word-input"
              type="text"
              value={typedWord}
              onChange={(e) => {
                setTypedWord(e.target.value)
                if (typingError) setTypingError('')
              }}
              placeholder={`Escribe: ${currentWord.english}`}
              autoComplete="off"
              spellCheck={false}
            />
            <div className={`typing-status ${canAdvanceCurrentWord ? 'ready' : ''}`}>
              {canAdvanceCurrentWord ? '✅ Correcto, ya puedes continuar.' : 'Debes escribir la palabra exacta.'}
            </div>
            {typingError && <div className="typing-error">{typingError}</div>}

            <div className="typing-action-row">
              {currentWordIndex === currentLevel.words.length - 1 ? (
                <button className="nav-btn finish inline-next" onClick={restartLevel} type="button">
                  <RotateCcw size={16} />
                  <span>Repetir nivel</span>
                </button>
              ) : (
                <button className="nav-btn next inline-next" onClick={handleNext} type="button">
                  <span>Siguiente</span>
                  <ChevronRight size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="word-bank-preview">
        <div className="preview-header">
          <h3>Banco de vocabulario del nivel</h3>
          <span>{currentLevel.nameEs}</span>
        </div>

        <div className="preview-section">
          <h4>Palabras</h4>
          <div className="preview-grid">
            {nonNumbersInLevel.map((word) => (
              <div key={word.id} className={`preview-tile ${word.id === currentWord.id ? 'active' : ''}`}>
                <img src={getWordImage(word.english, word.category)} alt="" aria-hidden="true" />
                <span>{word.english}</span>
              </div>
            ))}
          </div>
        </div>

        {numbersInLevel.length > 0 && (
          <div className="preview-section">
            <h4>Números (sección separada)</h4>
            <div className="preview-grid numbers">
              {numbersInLevel.map((word) => (
                <div key={word.id} className={`preview-tile ${word.id === currentWord.id ? 'active' : ''}`}>
                  <img src={getWordImage(word.english, word.category)} alt="" aria-hidden="true" />
                  <span>{word.english}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="word-navigation">
        <button 
          className="nav-btn" 
          onClick={handlePrevious}
          disabled={currentWordIndex === 0}
        >
          Anterior
        </button>
      </div>
    </div>
  )
}
