/**
 * Mock / demo data for the Lingua ELI Teacher Dashboard.
 * Used when Firebase is not configured or as a live demo.
 */
import type { Teacher, Class, Student, Response, ClassWeeklyStats } from '../types/teacher'

export const MOCK_TEACHER: Teacher = {
  id: 'demo-teacher',
  name: 'Ms. Rodriguez',
  email: 'rodriguez@pvusd.net',
}

export const MOCK_CLASSES: Class[] = [
  { id: 'c1', teacherId: 'demo-teacher', name: '3rd Grade – Room 12', grade: 3 },
  { id: 'c2', teacherId: 'demo-teacher', name: '3rd Grade – Room 7', grade: 3 },
]

// ── Room 12 students ──────────────────────────────────────────────────────
export const ROOM_12_STUDENTS: Student[] = [
  { id: 's1',  classId: 'c1', name: 'Maria Garcia',      level: 'Expanding' },
  { id: 's2',  classId: 'c1', name: 'Carlos Reyes',      level: 'Emerging'  },
  { id: 's3',  classId: 'c1', name: 'Sofia Chen',        level: 'Bridging'  },
  { id: 's4',  classId: 'c1', name: 'James Wilson',      level: 'Expanding' },
  { id: 's5',  classId: 'c1', name: 'Amara Diallo',      level: 'Emerging'  },
  { id: 's6',  classId: 'c1', name: 'Lucas Silva',       level: 'Bridging'  },
  { id: 's7',  classId: 'c1', name: 'Isabella Torres',   level: 'Expanding' },
  { id: 's8',  classId: 'c1', name: 'Noah Kim',          level: 'Emerging'  },
  { id: 's9',  classId: 'c1', name: 'Camila Flores',     level: 'Expanding' },
  { id: 's10', classId: 'c1', name: 'Jaylen Brown',      level: 'Bridging'  },
]

// ── Room 7 students ───────────────────────────────────────────────────────
export const ROOM_7_STUDENTS: Student[] = [
  { id: 's11', classId: 'c2', name: 'Valentina Mora',    level: 'Bridging'  },
  { id: 's12', classId: 'c2', name: 'Ethan Park',        level: 'Expanding' },
  { id: 's13', classId: 'c2', name: 'Aisha Osei',        level: 'Emerging'  },
  { id: 's14', classId: 'c2', name: 'Diego Hernandez',   level: 'Expanding' },
  { id: 's15', classId: 'c2', name: 'Emma Nguyen',       level: 'Bridging'  },
  { id: 's16', classId: 'c2', name: 'Mateo Lopez',       level: 'Emerging'  },
  { id: 's17', classId: 'c2', name: 'Priya Patel',       level: 'Expanding' },
  { id: 's18', classId: 'c2', name: 'Samuel Okonkwo',    level: 'Emerging'  },
]

// ── Helper to make responses ──────────────────────────────────────────────
function daysAgo(n: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}

let _rid = 1
function resp(
  studentId: string,
  classId: string,
  skill: Response['skill'],
  lf: Response['languageFunction'],
  score: 1 | 2 | 3,
  daysBack = 0,
): Response {
  return {
    id: `r${_rid++}`,
    studentId,
    classId,
    activityId: 'demo-activity',
    skill,
    languageFunction: lf,
    score,
    createdAt: daysAgo(daysBack),
  }
}

// ── Room 12 responses (last 7 days) ──────────────────────────────────────
export const ROOM_12_RESPONSES: Response[] = [
  // Maria Garcia – Expanding, solid performer
  resp('s1', 'c1', 'vocabulary',  'describe',   3, 0),
  resp('s1', 'c1', 'reading',     'opinion',    3, 1),
  resp('s1', 'c1', 'writing',     'opinion',    2, 2),
  resp('s1', 'c1', 'speaking',    'explain',    3, 3),
  resp('s1', 'c1', 'vocabulary',  'describe',   3, 4),

  // Carlos Reyes – Emerging, needs support in reading
  resp('s2', 'c1', 'vocabulary',  'describe',   2, 0),
  resp('s2', 'c1', 'reading',     'retell',     1, 1),
  resp('s2', 'c1', 'writing',     'opinion',    2, 2),
  resp('s2', 'c1', 'speaking',    'describe',   1, 4),

  // Sofia Chen – Bridging, high performer
  resp('s3', 'c1', 'vocabulary',  'compare',    3, 0),
  resp('s3', 'c1', 'reading',     'causeEffect',3, 1),
  resp('s3', 'c1', 'writing',     'opinion',    3, 2),
  resp('s3', 'c1', 'speaking',    'explain',    3, 3),
  resp('s3', 'c1', 'reading',     'compare',    3, 5),
  resp('s3', 'c1', 'writing',     'causeEffect',3, 6),

  // James Wilson – Expanding, mixed
  resp('s4', 'c1', 'vocabulary',  'describe',   2, 0),
  resp('s4', 'c1', 'reading',     'opinion',    2, 2),
  resp('s4', 'c1', 'writing',     'explain',    2, 3),
  resp('s4', 'c1', 'speaking',    'sequence',   3, 5),

  // Amara Diallo – Emerging, very limited attempts, low reading
  resp('s5', 'c1', 'vocabulary',  'describe',   1, 1),
  resp('s5', 'c1', 'reading',     'retell',     1, 3),
  resp('s5', 'c1', 'writing',     'opinion',    2, 6),

  // Lucas Silva – Bridging
  resp('s6', 'c1', 'vocabulary',  'compare',    3, 0),
  resp('s6', 'c1', 'reading',     'explain',    3, 1),
  resp('s6', 'c1', 'speaking',    'opinion',    3, 2),
  resp('s6', 'c1', 'writing',     'sequence',   2, 4),

  // Isabella Torres – Expanding
  resp('s7', 'c1', 'vocabulary',  'describe',   2, 0),
  resp('s7', 'c1', 'reading',     'retell',     2, 2),
  resp('s7', 'c1', 'writing',     'opinion',    3, 3),
  resp('s7', 'c1', 'speaking',    'explain',    2, 5),

  // Noah Kim – Emerging, struggling in writing
  resp('s8', 'c1', 'vocabulary',  'describe',   2, 1),
  resp('s8', 'c1', 'reading',     'retell',     1, 3),
  resp('s8', 'c1', 'writing',     'opinion',    1, 5),
  resp('s8', 'c1', 'speaking',    'describe',   2, 6),

  // Camila Flores – Expanding
  resp('s9', 'c1', 'vocabulary',  'describe',   3, 0),
  resp('s9', 'c1', 'writing',     'opinion',    2, 1),
  resp('s9', 'c1', 'reading',     'causeEffect',2, 4),
  resp('s9', 'c1', 'speaking',    'sequence',   3, 6),

  // Jaylen Brown – Bridging
  resp('s10','c1', 'vocabulary',  'compare',    3, 0),
  resp('s10','c1', 'reading',     'opinion',    3, 2),
  resp('s10','c1', 'writing',     'explain',    3, 3),
  resp('s10','c1', 'speaking',    'causeEffect',2, 5),
]

// ── Room 7 responses (last 7 days) ───────────────────────────────────────
export const ROOM_7_RESPONSES: Response[] = [
  // Valentina Mora – Bridging
  resp('s11','c2', 'reading',     'retell',     3, 0),
  resp('s11','c2', 'writing',     'sequence',   3, 1),
  resp('s11','c2', 'speaking',    'retell',     3, 3),
  resp('s11','c2', 'vocabulary',  'describe',   3, 5),

  // Ethan Park – Expanding
  resp('s12','c2', 'vocabulary',  'describe',   2, 0),
  resp('s12','c2', 'reading',     'retell',     2, 2),
  resp('s12','c2', 'writing',     'explain',    1, 4),
  resp('s12','c2', 'speaking',    'sequence',   2, 6),

  // Aisha Osei – Emerging, needs reading support
  resp('s13','c2', 'vocabulary',  'describe',   2, 1),
  resp('s13','c2', 'reading',     'retell',     1, 3),
  resp('s13','c2', 'writing',     'sequence',   1, 5),

  // Diego Hernandez – Expanding
  resp('s14','c2', 'vocabulary',  'describe',   2, 0),
  resp('s14','c2', 'reading',     'retell',     2, 2),
  resp('s14','c2', 'speaking',    'explain',    2, 4),
  resp('s14','c2', 'writing',     'opinion',    2, 6),

  // Emma Nguyen – Bridging
  resp('s15','c2', 'vocabulary',  'compare',    3, 0),
  resp('s15','c2', 'reading',     'sequence',   3, 1),
  resp('s15','c2', 'writing',     'retell',     3, 3),
  resp('s15','c2', 'speaking',    'explain',    3, 5),

  // Mateo Lopez – Emerging
  resp('s16','c2', 'vocabulary',  'describe',   1, 1),
  resp('s16','c2', 'reading',     'retell',     1, 4),
  resp('s16','c2', 'writing',     'describe',   2, 6),

  // Priya Patel – Expanding
  resp('s17','c2', 'vocabulary',  'describe',   3, 0),
  resp('s17','c2', 'reading',     'retell',     2, 2),
  resp('s17','c2', 'writing',     'sequence',   3, 3),
  resp('s17','c2', 'speaking',    'explain',    2, 5),

  // Samuel Okonkwo – Emerging
  resp('s18','c2', 'vocabulary',  'describe',   2, 1),
  resp('s18','c2', 'reading',     'retell',     1, 4),
  resp('s18','c2', 'speaking',    'sequence',   2, 6),
]

// ── Pre-computed class-level stats ────────────────────────────────────────
export const MOCK_CLASS_STATS: ClassWeeklyStats[] = [
  {
    classData: MOCK_CLASSES[0],
    studentCount: ROOM_12_STUDENTS.length,
    activitiesCompleted: ROOM_12_RESPONSES.length,
    averageScore:
      parseFloat(
        (
          ROOM_12_RESPONSES.reduce((s, r) => s + r.score, 0) /
          ROOM_12_RESPONSES.length
        ).toFixed(2),
      ),
    topLanguageFunctions: [
      { fn: 'opinion',    count: ROOM_12_RESPONSES.filter(r => r.languageFunction === 'opinion').length },
      { fn: 'describe',   count: ROOM_12_RESPONSES.filter(r => r.languageFunction === 'describe').length },
      { fn: 'explain',    count: ROOM_12_RESPONSES.filter(r => r.languageFunction === 'explain').length },
    ],
  },
  {
    classData: MOCK_CLASSES[1],
    studentCount: ROOM_7_STUDENTS.length,
    activitiesCompleted: ROOM_7_RESPONSES.length,
    averageScore:
      parseFloat(
        (
          ROOM_7_RESPONSES.reduce((s, r) => s + r.score, 0) /
          ROOM_7_RESPONSES.length
        ).toFixed(2),
      ),
    topLanguageFunctions: [
      { fn: 'retell',     count: ROOM_7_RESPONSES.filter(r => r.languageFunction === 'retell').length },
      { fn: 'describe',   count: ROOM_7_RESPONSES.filter(r => r.languageFunction === 'describe').length },
      { fn: 'sequence',   count: ROOM_7_RESPONSES.filter(r => r.languageFunction === 'sequence').length },
    ],
  },
]

export const ALL_MOCK_STUDENTS: Record<string, Student[]> = {
  c1: ROOM_12_STUDENTS,
  c2: ROOM_7_STUDENTS,
}

export const ALL_MOCK_RESPONSES: Record<string, Response[]> = {
  c1: ROOM_12_RESPONSES,
  c2: ROOM_7_RESPONSES,
}
