import type { Response, Skill, StudentStats, ELDLevel } from '../types/teacher'

export type RiskTier = 'urgent' | 'watch' | 'stable'

export interface InterventionStudent {
  studentId: string
  studentName: string
  classId: string
  className: string
  eldLevel: ELDLevel
  activitiesCompleted: number
  averageScore: number | null
  daysSinceLastActivity: number | null
  weakestSkill: Skill | null
  weakestSkillScore: number | null
  riskScore: number
  riskTier: RiskTier
  recommendation: string
}

function toDate(input: Response['createdAt']): Date | null {
  if (!input) return null
  if (input instanceof Date) return input
  if (typeof (input as any)?.toDate === 'function') return (input as any).toDate()
  return null
}

function daysAgo(date: Date | null): number | null {
  if (!date) return null
  const now = new Date()
  const ms = now.getTime() - date.getTime()
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)))
}

function weakestSkillFromStats(scoreBySkill: StudentStats['scoreBySkill']): {
  skill: Skill | null
  score: number | null
} {
  const entries = Object.entries(scoreBySkill) as [Skill, number][]
  if (entries.length === 0) return { skill: null, score: null }
  entries.sort((a, b) => a[1] - b[1])
  return { skill: entries[0][0], score: entries[0][1] }
}

function recommendationFor(weakestSkill: Skill | null, averageScore: number | null): string {
  if (averageScore === null) return 'Start with guided practice and a teacher check-in.'
  if (weakestSkill === 'reading') return 'Small group: decoding + sentence comprehension.'
  if (weakestSkill === 'writing') return 'Sentence frames + short structured writing practice.'
  if (weakestSkill === 'speaking') return 'Oral rehearsal with stems before independent responses.'
  if (weakestSkill === 'vocabulary') return 'Target vocabulary cycle: preview, practice, retrieval.'
  if (averageScore < 2.0) return 'Focused intervention group with daily short practice.'
  return 'Continue current practice path and monitor weekly.'
}

function tierFromRisk(riskScore: number): RiskTier {
  if (riskScore >= 70) return 'urgent'
  if (riskScore >= 45) return 'watch'
  return 'stable'
}

function riskFromStats(args: {
  averageScore: number | null
  activitiesCompleted: number
  daysSinceLastActivity: number | null
  weakestSkillScore: number | null
  eldLevel: ELDLevel
}): number {
  const { averageScore, activitiesCompleted, daysSinceLastActivity, weakestSkillScore, eldLevel } = args

  const avgRisk =
    averageScore === null ? 42 : Math.round(Math.max(0, (3 - averageScore) / 2) * 52)
  const activityRisk =
    activitiesCompleted === 0 ? 24 : activitiesCompleted < 3 ? 16 : activitiesCompleted < 5 ? 8 : 0
  const inactivityRisk =
    daysSinceLastActivity === null
      ? 20
      : daysSinceLastActivity >= 7
        ? 20
        : daysSinceLastActivity >= 4
          ? 12
          : daysSinceLastActivity >= 2
            ? 6
            : 0
  const weakestSkillRisk =
    weakestSkillScore === null ? 0 : weakestSkillScore < 1.8 ? 10 : weakestSkillScore < 2.2 ? 5 : 0
  const eldRisk = eldLevel === 'Emerging' ? 8 : eldLevel === 'Expanding' ? 4 : 0

  return Math.min(100, avgRisk + activityRisk + inactivityRisk + weakestSkillRisk + eldRisk)
}

export function buildInterventionStudent(
  studentStat: StudentStats,
  allResponsesForClass: Response[],
  className: string,
): InterventionStudent {
  const studentResponses = allResponsesForClass.filter((r) => r.studentId === studentStat.student.id)
  const lastDate = studentResponses
    .map((r) => toDate(r.createdAt))
    .filter((d): d is Date => !!d)
    .sort((a, b) => b.getTime() - a.getTime())[0] ?? null

  const daysSinceLastActivity = daysAgo(lastDate)
  const weakest = weakestSkillFromStats(studentStat.scoreBySkill)
  const riskScore = riskFromStats({
    averageScore: studentStat.averageScore,
    activitiesCompleted: studentStat.activitiesCompleted,
    daysSinceLastActivity,
    weakestSkillScore: weakest.score,
    eldLevel: studentStat.student.level,
  })

  return {
    studentId: studentStat.student.id,
    studentName: studentStat.student.name,
    classId: studentStat.student.classId,
    className,
    eldLevel: studentStat.student.level,
    activitiesCompleted: studentStat.activitiesCompleted,
    averageScore: studentStat.averageScore,
    daysSinceLastActivity,
    weakestSkill: weakest.skill,
    weakestSkillScore: weakest.score,
    riskScore,
    riskTier: tierFromRisk(riskScore),
    recommendation: recommendationFor(weakest.skill, studentStat.averageScore),
  }
}

