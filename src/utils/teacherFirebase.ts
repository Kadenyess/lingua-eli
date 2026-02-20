/**
 * Firestore query helpers for the Lingua ELI teacher dashboard.
 * All functions use Firebase v9 modular imports.
 */
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import type {
  Teacher,
  Class,
  Student,
  Response,
  Skill,
  LanguageFunction,
  StudentStats,
  ClassWeeklyStats,
} from '../types/teacher'
import { ALL_SKILLS, ALL_LANGUAGE_FUNCTIONS } from '../types/teacher'

// ── Timestamp helpers ─────────────────────────────────────────────────────

/** Returns a Firestore Timestamp for 7 days ago (start of today). */
function getWeekStart(): Timestamp {
  const d = new Date()
  d.setDate(d.getDate() - 7)
  d.setHours(0, 0, 0, 0)
  return Timestamp.fromDate(d)
}

// ── Individual fetch helpers ──────────────────────────────────────────────

export async function getTeacher(uid: string): Promise<Teacher | null> {
  const snap = await getDoc(doc(db, 'teachers', uid))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Teacher
}

export async function getTeacherClasses(teacherId: string): Promise<Class[]> {
  const q = query(collection(db, 'classes'), where('teacherId', '==', teacherId))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Class))
}

export async function getClass(classId: string): Promise<Class | null> {
  const snap = await getDoc(doc(db, 'classes', classId))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Class
}

export async function getClassStudents(classId: string): Promise<Student[]> {
  const q = query(collection(db, 'students'), where('classId', '==', classId))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Student))
}

/**
 * Fetches all responses for a class in the last 7 days.
 * Requires a composite Firestore index on (classId, createdAt).
 */
export async function getClassWeeklyResponses(classId: string): Promise<Response[]> {
  const weekStart = getWeekStart()
  const q = query(
    collection(db, 'responses'),
    where('classId', '==', classId),
    where('createdAt', '>=', weekStart),
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Response))
}

// ── Aggregation helpers ───────────────────────────────────────────────────

export function computeClassWeeklyStats(
  classData: Class,
  students: Student[],
  responses: Response[],
): ClassWeeklyStats {
  const fnCounts: Partial<Record<LanguageFunction, number>> = {}
  let totalScore = 0

  for (const r of responses) {
    fnCounts[r.languageFunction] = (fnCounts[r.languageFunction] ?? 0) + 1
    totalScore += r.score
  }

  const topLanguageFunctions = (
    Object.entries(fnCounts) as [LanguageFunction, number][]
  )
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([fn, count]) => ({ fn, count }))

  return {
    classData,
    studentCount: students.length,
    activitiesCompleted: responses.length,
    averageScore: responses.length > 0 ? totalScore / responses.length : null,
    topLanguageFunctions,
  }
}

export function computeStudentStats(
  students: Student[],
  responses: Response[],
): StudentStats[] {
  return students.map(student => {
    const sr = responses.filter(r => r.studentId === student.id)

    const scoreBySkill: Partial<Record<Skill, number>> = {}
    for (const skill of ALL_SKILLS) {
      const skillResps = sr.filter(r => r.skill === skill)
      if (skillResps.length > 0) {
        scoreBySkill[skill] =
          skillResps.reduce((sum, r) => sum + r.score, 0) / skillResps.length
      }
    }

    const languageFunctionCounts: Partial<Record<LanguageFunction, number>> = {}
    for (const r of sr) {
      languageFunctionCounts[r.languageFunction] =
        (languageFunctionCounts[r.languageFunction] ?? 0) + 1
    }

    return {
      student,
      activitiesCompleted: sr.length,
      averageScore:
        sr.length > 0
          ? sr.reduce((sum, r) => sum + r.score, 0) / sr.length
          : null,
      scoreBySkill,
      languageFunctionCounts,
    }
  })
}

/**
 * Counts how many responses exist per language function for a class.
 * Returns all functions (with 0 for those not practiced).
 */
export function computeClassLFCounts(
  responses: Response[],
): { fn: LanguageFunction; count: number }[] {
  const counts: Partial<Record<LanguageFunction, number>> = {}
  for (const r of responses) {
    counts[r.languageFunction] = (counts[r.languageFunction] ?? 0) + 1
  }
  return ALL_LANGUAGE_FUNCTIONS.map(fn => ({ fn, count: counts[fn] ?? 0 })).sort(
    (a, b) => b.count - a.count,
  )
}
