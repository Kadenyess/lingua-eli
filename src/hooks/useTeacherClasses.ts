import { useState, useEffect } from 'react'
import type { Teacher, ClassWeeklyStats } from '../types/teacher'
import {
  getTeacher,
  getTeacherClasses,
  getClassStudents,
  getClassWeeklyResponses,
  computeClassWeeklyStats,
  computeStudentStats,
} from '../utils/teacherFirebase'
import { buildInterventionStudent, type InterventionStudent } from '../utils/intervention'
import {
  MOCK_TEACHER,
  MOCK_CLASS_STATS,
  ALL_MOCK_RESPONSES,
  ALL_MOCK_STUDENTS,
  MOCK_CLASSES,
} from '../data/mockDashboardData'
import { isFirebaseConfigured } from '../utils/firebase'

interface State {
  teacher: Teacher | null
  classes: ClassWeeklyStats[]
  interventionStudents: InterventionStudent[]
  loading: boolean
  error: string | null
}

export function useTeacherClasses(teacherUid: string | null) {
  const [state, setState] = useState<State>({
    teacher: null,
    classes: [],
    interventionStudents: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    if (!teacherUid) {
      setState({ teacher: null, classes: [], interventionStudents: [], loading: false, error: null })
      return
    }

    // Demo mode: return mock data immediately
    if (!isFirebaseConfigured() || teacherUid === 'demo-teacher') {
      const interventionStudents = MOCK_CLASSES.flatMap((cls) => {
        const students = ALL_MOCK_STUDENTS[cls.id] ?? []
        const responses = ALL_MOCK_RESPONSES[cls.id] ?? []
        const studentStats = computeStudentStats(students, responses)
        return studentStats.map((stat) => buildInterventionStudent(stat, responses, cls.name))
      })
      setState({
        teacher: MOCK_TEACHER,
        classes: MOCK_CLASS_STATS,
        interventionStudents,
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
            return {
              classStats: computeClassWeeklyStats(cls, students, responses),
              interventionRows: computeStudentStats(students, responses).map((stat) =>
                buildInterventionStudent(stat, responses, cls.name),
              ),
            }
          }),
        )

        if (!cancelled) {
          setState({
            teacher,
            classes: statsResults.map((row) => row.classStats),
            interventionStudents: statsResults.flatMap((row) => row.interventionRows),
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
  }, [teacherUid])

  return state
}
