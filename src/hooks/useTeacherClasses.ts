import { useState, useEffect } from 'react'
import type { Teacher, ClassWeeklyStats } from '../types/teacher'
import {
  getTeacher,
  getTeacherClasses,
  getClassStudents,
  getClassWeeklyResponses,
  computeClassWeeklyStats,
} from '../utils/teacherFirebase'
import {
  MOCK_TEACHER,
  MOCK_CLASS_STATS,
} from '../data/mockDashboardData'
import { isFirebaseConfigured } from '../utils/firebase'

interface State {
  teacher: Teacher | null
  classes: ClassWeeklyStats[]
  loading: boolean
  error: string | null
}

export function useTeacherClasses(teacherUid: string | null) {
  const [state, setState] = useState<State>({
    teacher: null,
    classes: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    if (!teacherUid) {
      setState({ teacher: null, classes: [], loading: false, error: null })
      return
    }

    // Demo mode: return mock data immediately
    if (!isFirebaseConfigured() || teacherUid === 'demo-teacher') {
      setState({
        teacher: MOCK_TEACHER,
        classes: MOCK_CLASS_STATS,
        loading: false,
        error: null,
      })
      return
    }

    let cancelled = false

    async function fetchData() {
      try {
        const [teacher, classes] = await Promise.all([
          getTeacher(teacherUid!),
          getTeacherClasses(teacherUid!),
        ])

        const statsResults = await Promise.all(
          classes.map(async cls => {
            const [students, responses] = await Promise.all([
              getClassStudents(cls.id),
              getClassWeeklyResponses(cls.id),
            ])
            return computeClassWeeklyStats(cls, students, responses)
          }),
        )

        if (!cancelled) {
          setState({ teacher, classes: statsResults, loading: false, error: null })
        }
      } catch (err: any) {
        if (!cancelled) {
          setState(s => ({ ...s, loading: false, error: err.message }))
        }
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [teacherUid])

  return state
}
