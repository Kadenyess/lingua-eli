import type { AttemptRecord, ErrorTag, WordEntry } from '../types/engine'

const KEYS = {
  studentId: 'cse.studentId',
  levelProgress: 'cse.levelProgress',
  attempts: 'cse.attempts',
  errorFrequency: 'cse.errorFrequency',
  vocabMastery: 'cse.vocabMastery',
} as const

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeJSON<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getOrCreateStudentId() {
  const existing = localStorage.getItem(KEYS.studentId)
  if (existing) return existing
  const id = `student-${Math.random().toString(36).slice(2, 10)}`
  localStorage.setItem(KEYS.studentId, id)
  return id
}

export function recordAttempt(attempt: AttemptRecord) {
  const attempts = readJSON<AttemptRecord[]>(KEYS.attempts, [])
  attempts.push(attempt)
  writeJSON(KEYS.attempts, attempts.slice(-200))

  const levelProgress = readJSON<Record<string, { attempts: number; completed: boolean }>>(KEYS.levelProgress, {})
  const current = levelProgress[String(attempt.level)] || { attempts: 0, completed: false }
  current.attempts += 1
  if (attempt.isCorrect) current.completed = true
  levelProgress[String(attempt.level)] = current
  writeJSON(KEYS.levelProgress, levelProgress)

  if (attempt.errorType) {
    const errorFreq = readJSON<Record<ErrorTag, number>>(KEYS.errorFrequency, {
      subject_verb_agreement: 0,
      missing_component: 0,
      word_order: 0,
      logic_mismatch: 0,
    })
    errorFreq[attempt.errorType] += 1
    writeJSON(KEYS.errorFrequency, errorFreq)
  }
}

export function updateVocabMastery(words: WordEntry[], isCorrect: boolean) {
  const mastery = readJSON<Record<string, { usage: number; correct: number; unlocked: boolean }>>(KEYS.vocabMastery, {})
  for (const word of words) {
    const row = mastery[word.id] || { usage: 0, correct: 0, unlocked: false }
    row.usage += 1
    if (isCorrect) {
      row.correct += 1
      if (row.correct >= 1) row.unlocked = true
    }
    mastery[word.id] = row
  }
  writeJSON(KEYS.vocabMastery, mastery)
}

export function getVocabMastery() {
  return readJSON<Record<string, { usage: number; correct: number; unlocked: boolean }>>(KEYS.vocabMastery, {})
}
