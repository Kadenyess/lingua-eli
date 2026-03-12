import { useState, useEffect } from 'react'
import type { Teacher, ClassWeeklyStats } from '../types/teacher'
import {
  getTeacher,
  getTeacherClasses,
  getClassStudents,
  getClassWeeklyGapChecks,
  getClassWeeklyResponses,
  computeClassWeeklyStats,
  computeStudentStats,
} from '../utils/teacherFirebase'
import {
  buildInterventionStudent,
  buildInterventionStudentFromGapEvent,
  type InterventionStudent,
} from '../utils/intervention'
import {
  MOCK_TEACHER,
  MOCK_CLASS_STATS,
  ALL_MOCK_GAP_CHECKS,
  ALL_MOCK_RESPONSES,
  ALL_MOCK_STUDENTS,
  MOCK_CLASSES,
} from '../data/mockDashboardData'
import { isFirebaseConfigured } from '../utils/firebase'
import { getStoredGapCheckEvents } from '../student-ui/storage/levelSessionStorage'
import type { GapCheckEvent } from '../types/teacher'

interface State {
  teacher: Teacher | null
  classes: ClassWeeklyStats[]
  interventionStudents: InterventionStudent[]
  loading: boolean
  error: string | null
}

function gapEventTime(event: GapCheckEvent): number {
  const raw = event.createdAt
  if (raw instanceof Date) return raw.getTime()
  if (typeof raw === 'string') {
    const parsed = new Date(raw).getTime()
    return Number.isNaN(parsed) ? 0 : parsed
  }
  if (typeof (raw as any)?.toDate === 'function') {
    return (raw as any).toDate().getTime()
  }
  return 0
}

function dedupeLatestGapEvents(events: GapCheckEvent[]): GapCheckEvent[] {
  const latestByStudent = new Map<string, GapCheckEvent>()
  for (const event of events) {
    const current = latestByStudent.get(event.studentId)
    if (!current || gapEventTime(event) > gapEventTime(current)) {
      latestByStudent.set(event.studentId, event)
    }
  }
  return Array.from(latestByStudent.values()).sort((a, b) => gapEventTime(b) - gapEventTime(a))
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
      const localGapChecks = getStoredGapCheckEvents()
      const interventionStudents = MOCK_CLASSES.flatMap((cls) => {
        const students = ALL_MOCK_STUDENTS[cls.id] ?? []
        const responses = ALL_MOCK_RESPONSES[cls.id] ?? []
        const mergedGapChecks = [
          ...(ALL_MOCK_GAP_CHECKS[cls.id] ?? []),
          ...localGapChecks.filter((event) => event.classId === cls.id),
        ]
        const studentStats = computeStudentStats(students, responses)
        const studentRows = studentStats.map((stat) =>
          buildInterventionStudent(
            stat,
            responses,
            cls.name,
            mergedGapChecks.filter((event) => event.studentId === stat.student.id),
          ),
        )
        const knownStudentIds = new Set(students.map((student) => student.id))
        const fallbackRows = dedupeLatestGapEvents(
          mergedGapChecks.filter((event) => !knownStudentIds.has(event.studentId)),
        ).map((event) => buildInterventionStudentFromGapEvent(event, cls.name))
        return [...studentRows, ...fallbackRows]
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
        const localGapChecks = getStoredGapCheckEvents()

        const statsResults = await Promise.all(
          classes.map(async cls => {
            const [students, responses, gapChecks] = await Promise.all([
              getClassStudents(cls.id),
              getClassWeeklyResponses(cls.id),
              getClassWeeklyGapChecks(cls.id),
            ])
            const localGapChecksForClass = localGapChecks.filter((event) => event.classId === cls.id)
            const mergedGapChecks = [...gapChecks, ...localGapChecksForClass]
            const studentStats = computeStudentStats(students, responses)
            const studentRows = studentStats.map((stat) =>
              buildInterventionStudent(
                stat,
                responses,
                cls.name,
                mergedGapChecks.filter((event) => event.studentId === stat.student.id),
              ),
            )
            const knownStudentIds = new Set(students.map((student) => student.id))
            const fallbackRows = dedupeLatestGapEvents(
              mergedGapChecks.filter((event) => !knownStudentIds.has(event.studentId)),
            ).map((event) => buildInterventionStudentFromGapEvent(event, cls.name))
            return {
              classStats: computeClassWeeklyStats(cls, students, responses),
              interventionRows: [...studentRows, ...fallbackRows],
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
