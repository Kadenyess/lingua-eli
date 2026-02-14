import { useState, useEffect } from 'react'
import { ArrowLeft, Volume2, CheckCircle, Star, ChevronRight, RotateCcw, Sparkles, VolumeX } from 'lucide-react'
import { vocabularyLevels, VocabularyWord } from '../data/vocabulary'
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

  const currentLevel = vocabularyLevels.find(l => l.level === selectedLevel) || vocabularyLevels[0]
  const currentWord = currentLevel.words[currentWordIndex]
  const progress = ((currentWordIndex + 1) / currentLevel.words.length) * 100

  useEffect(() => {
    const saved = localStorage.getItem('learnedVocabulary')
    if (saved) {
      setLearnedWords(JSON.parse(saved))
    }
    const savedLevels = localStorage.getItem('completedVocabLevels')
    if (savedLevels) {
      setCompletedLevels(JSON.parse(savedLevels))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('learnedVocabulary', JSON.stringify(learnedWords))
  }, [learnedWords])

  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSpeakingSpanish, setIsSpeakingSpanish] = useState(false)

  const speakWord = async (text: string) => {
    soundEffects.playClick()
    
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
    soundEffects.playClick()
    
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
    soundEffects.playClick()
    
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
      }, 1000)
    }
  }

  const handlePrevious = () => {
    soundEffects.playClick()
    if (currentWordIndex > 0) {
      setCurrentWordIndex((prev: number) => prev - 1)
      setShowTranslation(false)
    }
  }

  const restartLevel = () => {
    soundEffects.playClick()
    setCurrentWordIndex(0)
    setShowTranslation(false)
  }

  const handleLevelSelect = (levelNum: number) => {
    soundEffects.playClick()
    setSelectedLevel(levelNum)
    setCurrentWordIndex(0)
    setShowTranslation(false)
  }

  return (
    <div className="vocabulary-module">
      <div className="vocab-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={24} />
          <span>Volver</span>
        </button>
        <h2>Vocabulario</h2>
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
          <h1 className="english-word">{currentWord.english}</h1>
          <p className="pronunciation">/{currentWord.pronunciation}/</p>
          
          <button className={`speak-btn ${isSpeaking ? 'speaking' : ''}`} onClick={() => speakWord(currentWord.english)}>
            {isSpeaking ? <VolumeX size={24} /> : <Volume2 size={24} />}
            <span>{isSpeaking ? 'Detener' : 'Escuchar'}</span>
          </button>

          <button 
            className="translate-btn"
            onClick={() => setShowTranslation(!showTranslation)}
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
        </div>
      </div>

      <div className="word-navigation">
        <button 
          className="nav-btn" 
          onClick={handlePrevious}
          disabled={currentWordIndex === 0}
        >
          Anterior
        </button>
        
        {currentWordIndex === currentLevel.words.length - 1 ? (
          <button className="nav-btn finish" onClick={restartLevel}>
            <RotateCcw size={16} />
            <span>Repetir nivel</span>
          </button>
        ) : (
          <button className="nav-btn next" onClick={handleNext}>
            <span>Siguiente</span>
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  )
}
