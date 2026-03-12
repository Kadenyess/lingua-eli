import { getOrCreateStudentId } from '../../core-sentence-engine/storage/localTracking'

const STORAGE_KEYS = {
  classId: 'student.activeClassId',
  classIdLegacy: 'activeClassId',
  studentId: 'student.activeStudentId',
  studentIdCore: 'cse.studentId',
} as const

const CLASS_QUERY_KEYS = ['classId', 'sectionId', 'class_id', 'section_id', 'cid', 'classroomId'] as const
const STUDENT_QUERY_KEYS = ['studentId', 'userId', 'student_id', 'user_id', 'sid', 'learnerId'] as const

function sanitizeId(value: string | null): string | null {
  if (!value) return null
  const trimmed = value.trim()
  if (!trimmed) return null
  if (!/^[A-Za-z0-9._:-]{1,120}$/.test(trimmed)) return null
  return trimmed
}

function firstQueryValue(params: URLSearchParams, keys: readonly string[]) {
  for (const key of keys) {
    const candidate = sanitizeId(params.get(key))
    if (candidate) return candidate
  }
  return null
}

export interface StudentLaunchIdentity {
  classId: string
  studentId: string
}

export function resolveStudentLaunchIdentity(search = window.location.search): StudentLaunchIdentity {
  const params = new URLSearchParams(search)

  const queryClassId = firstQueryValue(params, CLASS_QUERY_KEYS)
  const queryStudentId = firstQueryValue(params, STUDENT_QUERY_KEYS)

  const storedClassId =
    sanitizeId(localStorage.getItem(STORAGE_KEYS.classId)) ??
    sanitizeId(localStorage.getItem(STORAGE_KEYS.classIdLegacy))
  const storedStudentId =
    sanitizeId(localStorage.getItem(STORAGE_KEYS.studentId)) ??
    sanitizeId(localStorage.getItem(STORAGE_KEYS.studentIdCore))

  const classId = queryClassId ?? storedClassId ?? 'c1'
  const studentId = queryStudentId ?? storedStudentId ?? getOrCreateStudentId()

  localStorage.setItem(STORAGE_KEYS.classId, classId)
  localStorage.setItem(STORAGE_KEYS.classIdLegacy, classId)
  localStorage.setItem(STORAGE_KEYS.studentId, studentId)
  localStorage.setItem(STORAGE_KEYS.studentIdCore, studentId)

  return { classId, studentId }
}
