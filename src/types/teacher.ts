import { Timestamp } from 'firebase/firestore'

export type Skill = 'vocabulary' | 'reading' | 'speaking' | 'writing'

export type LanguageFunction =
  | 'describe'
  | 'retell'
  | 'compare'
  | 'explain'
  | 'opinion'
  | 'sequence'
  | 'causeEffect'

export type ELDLevel = 'Emerging' | 'Expanding' | 'Bridging'

export type ContentArea = 'ELA' | 'Math' | 'Science' | 'Social Studies'

export interface Teacher {
  id: string
  name: string
  email: string
}

export interface Class {
  id: string
  teacherId: string
  name: string
  grade: number
}

export interface Student {
  id: string
  classId: string
  name: string
  level: ELDLevel
}

export interface Activity {
  id: string
  grade: number
  skill: Skill
  languageFunction: LanguageFunction
  sentenceFrame: string
  contentArea: ContentArea
  prompt: string
  difficulty: 1 | 2 | 3
}

export interface Response {
  id: string
  studentId: string
  classId: string       // denormalized from student for efficient class-level queries
  activityId: string
  skill: Skill
  languageFunction: LanguageFunction
  score: 1 | 2 | 3
  createdAt: Timestamp | Date
}

// ── Aggregated shapes used in the UI ────────────────────────────────────────

export interface StudentStats {
  student: Student
  activitiesCompleted: number
  averageScore: number | null
  scoreBySkill: Partial<Record<Skill, number>>
  languageFunctionCounts: Partial<Record<LanguageFunction, number>>
}

export interface ClassWeeklyStats {
  classData: Class
  studentCount: number
  activitiesCompleted: number
  averageScore: number | null
  topLanguageFunctions: { fn: LanguageFunction; count: number }[]
}

export const LANGUAGE_FUNCTION_LABELS: Record<LanguageFunction, string> = {
  describe: 'Describe',
  retell: 'Retell',
  compare: 'Compare',
  explain: 'Explain',
  opinion: 'Opinion',
  sequence: 'Sequence',
  causeEffect: 'Cause & Effect',
}

export const SKILL_LABELS: Record<Skill, string> = {
  vocabulary: 'Vocab',
  reading: 'Reading',
  speaking: 'Speaking',
  writing: 'Writing',
}

export const ALL_SKILLS: Skill[] = ['vocabulary', 'reading', 'speaking', 'writing']

export const ALL_LANGUAGE_FUNCTIONS: LanguageFunction[] = [
  'describe',
  'retell',
  'compare',
  'explain',
  'opinion',
  'sequence',
  'causeEffect',
]

/** Returns a Tailwind bg+text color pair based on a 1–3 average score. */
export function scoreColor(avg: number | null): string {
  if (avg === null) return 'bg-gray-100 text-gray-400'
  if (avg >= 2.5) return 'bg-green-100 text-green-700'
  if (avg >= 1.8) return 'bg-yellow-100 text-yellow-700'
  return 'bg-red-100 text-red-700'
}

/** Returns a dot-only color class (for small skill chips). */
export function scoreDotColor(avg: number | null): string {
  if (avg === null) return 'bg-gray-300'
  if (avg >= 2.5) return 'bg-green-500'
  if (avg >= 1.8) return 'bg-yellow-400'
  return 'bg-red-400'
}

export const ELD_LEVEL_COLORS: Record<ELDLevel, string> = {
  Emerging: 'bg-blue-100 text-blue-700',
  Expanding: 'bg-purple-100 text-purple-700',
  Bridging: 'bg-emerald-100 text-emerald-700',
}

/** Color per language function (for visual variety in bars/pills). */
export const LF_COLORS: Record<LanguageFunction, string> = {
  describe: 'bg-blue-500',
  retell: 'bg-purple-500',
  compare: 'bg-orange-500',
  explain: 'bg-teal-500',
  opinion: 'bg-pink-500',
  sequence: 'bg-amber-500',
  causeEffect: 'bg-red-500',
}
