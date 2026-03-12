import type { CurriculumModuleId, TeacherLevelPerformanceRecord, TeacherLevelQuestionResult } from '../../curriculum'
import type { GapCheckEvent } from '../../types/teacher'

const KEYS = {
  session: 'student.levelSession.current',
  history: 'student.levelSession.history',
  moduleLevels: 'student.levelSession.moduleLevels',
  gapChecks: 'student.levelSession.gapChecks',
} as const

export interface StoredLevelSessionState {
  moduleId: CurriculumModuleId
  levelNumber: number
  questionIndex: number
  reattemptCount: number
  seed: number
  resultsByQuestionNumber: Record<number, TeacherLevelQuestionResult>
  updatedAt: string
}

export type StoredGapCheckEvent = GapCheckEvent

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

export function getStoredLevelSessionState(
  moduleId: CurriculumModuleId,
  levelNumber: number,
): StoredLevelSessionState | null {
  const state = readJSON<StoredLevelSessionState | null>(KEYS.session, null)
  if (!state) return null
  if (state.moduleId !== moduleId || state.levelNumber !== levelNumber) return null
  return state
}

export function saveStoredLevelSessionState(state: StoredLevelSessionState) {
  writeJSON(KEYS.session, state)
}

export function clearStoredLevelSessionState(moduleId: CurriculumModuleId, levelNumber: number) {
  const current = getStoredLevelSessionState(moduleId, levelNumber)
  if (!current) return
  localStorage.removeItem(KEYS.session)
}

export function appendLevelPerformanceRecord(record: TeacherLevelPerformanceRecord) {
  const history = readJSON<TeacherLevelPerformanceRecord[]>(KEYS.history, [])
  history.push(record)
  writeJSON(KEYS.history, history.slice(-300))
}

export function getLevelPerformanceHistory(moduleId: CurriculumModuleId, levelNumber: number): TeacherLevelPerformanceRecord[] {
  const history = readJSON<TeacherLevelPerformanceRecord[]>(KEYS.history, [])
  return history.filter((item) => item.module_id === moduleId && item.level_number === levelNumber)
}

export function getReattemptCountForLevel(moduleId: CurriculumModuleId, levelNumber: number): number {
  return getLevelPerformanceHistory(moduleId, levelNumber).length
}

type ModuleLevelMap = Partial<Record<CurriculumModuleId, number>>

export function getStoredModuleCurrentLevel(moduleId: CurriculumModuleId): number | null {
  const levels = readJSON<ModuleLevelMap>(KEYS.moduleLevels, {})
  const value = levels[moduleId]
  if (typeof value !== 'number' || Number.isNaN(value)) return null
  return Math.max(1, Math.floor(value))
}

export function setStoredModuleCurrentLevel(moduleId: CurriculumModuleId, levelNumber: number) {
  const levels = readJSON<ModuleLevelMap>(KEYS.moduleLevels, {})
  levels[moduleId] = Math.max(1, Math.floor(levelNumber))
  writeJSON(KEYS.moduleLevels, levels)
}

export function appendStoredGapCheckEvent(event: StoredGapCheckEvent) {
  const events = readJSON<StoredGapCheckEvent[]>(KEYS.gapChecks, [])
  events.push(event)
  events.sort((a, b) => {
    const aTs = new Date(a.createdAt as Date).getTime()
    const bTs = new Date(b.createdAt as Date).getTime()
    return bTs - aTs
  })
  writeJSON(KEYS.gapChecks, events.slice(0, 500))
}

export function getStoredGapCheckEvents(): StoredGapCheckEvent[] {
  return readJSON<StoredGapCheckEvent[]>(KEYS.gapChecks, [])
}
