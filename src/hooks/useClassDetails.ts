import { useState, useEffect } from 'react'
import type { Class, StudentStats, Response, LanguageFunction } from '../types/teacher'
import {
  getClass,
  getClassStudents,
  getClassWeeklyResponses,
  computeStudentStats,
  computeClassLFCounts,
} from '../utils/teacherFirebase'
import {
  ALL_MOCK_STUDENTS,
  ALL_MOCK_RESPONSES,
  MOCK_CLASSES,
} from '../data/mockDashboardData'
import { isFirebaseConfigured } from '../utils/firebase'

interface State {
  classData: Class | null
  studentStats: StudentStats[]
  lfCounts: { fn: LanguageFunction; count: number }[]
  allResponses: Response[]
  loading: boolean
  error: string | null
}

export function useClassDetails(classId: string | undefined) {
  const [state, setState] = useState<State>({
    classData: null,
    studentStats: [],
    lfCounts: [],
    allResponses: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    if (!classId) return

    // Demo mode
    if (!isFirebaseConfigured() || classId === 'c1' || classId === 'c2') {
      const students = ALL_MOCK_STUDENTS[classId] ?? []
      const responses = ALL_MOCK_RESPONSES[classId] ?? []
      const classData = MOCK_CLASSES.find(c => c.id === classId) ?? null
      setState({
        classData,
        studentStats: computeStudentStats(students, responses),
        lfCounts: computeClassLFCounts(responses),
        allResponses: responses,
        loading: false,
        error: null,
      })
      return
    }

    let cancelled = false

    async function fetchData() {
      try {
        const [classData, students, responses] = await Promise.all([
          getClass(classId!),
          getClassStudents(classId!),
          getClassWeeklyResponses(classId!),
        ])

        if (!classData) throw new Error('Class not found')

        if (!cancelled) {
          setState({
            classData,
            studentStats: computeStudentStats(students, responses),
            lfCounts: computeClassLFCounts(responses),
            allResponses: responses,
            loading: false,
            error: null,
          })
        }
      } catch (err: any) {
        if (!cancelled) {
          setState(s => ({ ...s, loading: false, error: err.message }))
        }
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [classId])

  return state
}
