import {
  buildTeacherGapCheckRecord,
  type ComprehensionDimension,
  type CurriculumModuleId,
} from '../curriculum'
import type { GapCheckEvent, Response, Skill, StudentStats, ELDLevel } from '../types/teacher'

export type RiskTier = 'urgent' | 'watch' | 'stable'
export type GapSupportTier = 'severe' | 'moderate' | 'mild' | 'cleared'

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
  estimatedCurriculumLevel: number
  primaryGapModule: CurriculumModuleId
  gapCheckId: string
  gapCheckCleared: boolean
  gapSupportTier: GapSupportTier
  gapDimensionsFlagged: number
  gapPrimaryDimensions: ComprehensionDimension[]
  gapRecommendedPaths: string[]
  gapScorePercent: number
  gapRiskPoints: number
  riskScore: number
  riskTier: RiskTier
  recommendation: string
}

const ALL_DIMENSIONS: ComprehensionDimension[] = [
  'literal_understanding',
  'inferencing',
  'vocabulary_in_context',
  'syntax_grammar_comprehension',
  'discourse_cohesion',
  'knowledge_integration',
]

const DIMENSION_LABELS: Record<ComprehensionDimension, string> = {
  literal_understanding: 'literal understanding',
  inferencing: 'inferencing',
  vocabulary_in_context: 'vocabulary in context',
  syntax_grammar_comprehension: 'syntax and grammar comprehension',
  discourse_cohesion: 'discourse cohesion',
  knowledge_integration: 'knowledge integration',
}

function toDate(input: Response['createdAt'] | string): Date | null {
  if (!input) return null
  if (input instanceof Date) return input
  if (typeof input === 'string') {
    const parsed = new Date(input)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }
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

function primaryModuleForWeakestSkill(weakestSkill: Skill | null): CurriculumModuleId {
  if (weakestSkill === 'reading') return 'logic_check'
  if (weakestSkill === 'writing') return 'sentence_expansion'
  if (weakestSkill === 'speaking') return 'peer_review'
  if (weakestSkill === 'vocabulary') return 'vocabulary'
  return 'sentence_builder'
}

function estimateCurriculumLevel(args: {
  averageScore: number | null
  activitiesCompleted: number
  eldLevel: ELDLevel
}): number {
  const { averageScore, activitiesCompleted, eldLevel } = args

  let levelBase = eldLevel === 'Emerging' ? 11 : eldLevel === 'Expanding' ? 24 : 36

  if (averageScore === null) levelBase -= 4
  else if (averageScore < 1.5) levelBase -= 8
  else if (averageScore < 1.8) levelBase -= 6
  else if (averageScore < 2.2) levelBase -= 3
  else if (averageScore >= 2.8) levelBase += 6
  else if (averageScore >= 2.5) levelBase += 3

  if (activitiesCompleted === 0) levelBase -= 3
  else if (activitiesCompleted < 3) levelBase -= 2
  else if (activitiesCompleted >= 8) levelBase += 2

  return Math.min(50, Math.max(1, Math.round(levelBase)))
}

function buildDimensionScores(args: {
  averageScore: number | null
  activitiesCompleted: number
  daysSinceLastActivity: number | null
  weakestSkill: Skill | null
  eldLevel: ELDLevel
}): Partial<Record<ComprehensionDimension, number>> {
  const { averageScore, activitiesCompleted, daysSinceLastActivity, weakestSkill, eldLevel } = args
  const scores: Partial<Record<ComprehensionDimension, number>> = {}

  const baseScore = averageScore === null ? 0 : averageScore >= 2.6 ? 2 : averageScore >= 1.9 ? 1 : 0
  for (const dimension of ALL_DIMENSIONS) {
    scores[dimension] = baseScore
  }

  const reduce = (dimensions: ComprehensionDimension[], amount = 1) => {
    for (const dimension of dimensions) {
      const current = scores[dimension] ?? 0
      scores[dimension] = Math.max(0, current - amount)
    }
  }

  if (weakestSkill === 'reading') reduce(['literal_understanding', 'inferencing', 'discourse_cohesion'])
  if (weakestSkill === 'writing') reduce(['syntax_grammar_comprehension', 'discourse_cohesion'])
  if (weakestSkill === 'vocabulary') reduce(['vocabulary_in_context', 'knowledge_integration'])
  if (weakestSkill === 'speaking') reduce(['knowledge_integration', 'discourse_cohesion'])

  if (activitiesCompleted < 3) reduce(['inferencing', 'knowledge_integration'])
  if (daysSinceLastActivity !== null && daysSinceLastActivity >= 7) reduce(ALL_DIMENSIONS)
  else if (daysSinceLastActivity !== null && daysSinceLastActivity >= 4) reduce(['literal_understanding', 'vocabulary_in_context'])

  if (eldLevel === 'Emerging') reduce(['syntax_grammar_comprehension'])

  if ((averageScore ?? 0) >= 2.8 && activitiesCompleted >= 5) {
    for (const dimension of ALL_DIMENSIONS) {
      scores[dimension] = Math.min(2, (scores[dimension] ?? 0) + 1)
    }
  }

  return scores
}

function gapTierFromCounts(args: {
  cleared: boolean
  severeCount: number
  moderateCount: number
}): GapSupportTier {
  const { cleared, severeCount, moderateCount } = args
  if (cleared) return 'cleared'
  if (severeCount > 0) return 'severe'
  if (moderateCount > 0) return 'moderate'
  return 'mild'
}

function gapRiskFromTier(tier: GapSupportTier, flaggedDimensions: number): number {
  if (tier === 'cleared') return 0
  if (tier === 'severe') return Math.min(28, 18 + flaggedDimensions * 2)
  if (tier === 'moderate') return Math.min(20, 10 + flaggedDimensions * 2)
  return Math.min(12, 5 + flaggedDimensions)
}

function latestGapCheck(gapChecks: GapCheckEvent[]): GapCheckEvent | null {
  if (gapChecks.length === 0) return null
  return [...gapChecks].sort((a, b) => {
    const aDate = toDate(a.createdAt)?.getTime() ?? 0
    const bDate = toDate(b.createdAt)?.getTime() ?? 0
    return bDate - aDate
  })[0] ?? null
}

function recommendationFor(
  weakestSkill: Skill | null,
  averageScore: number | null,
  gapTier: GapSupportTier,
  flaggedDimensions: ComprehensionDimension[],
): string {
  const primaryDimension = flaggedDimensions[0]
  const gapPhrase = primaryDimension ? `Focus on ${DIMENSION_LABELS[primaryDimension]}.` : ''

  if (gapTier === 'severe') {
    return `Urgent gap intervention needed. ${gapPhrase}`.trim()
  }
  if (gapTier === 'moderate') {
    return `Targeted gap practice recommended. ${gapPhrase}`.trim()
  }

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

function skillFromPrimaryGapDimension(dimension: ComprehensionDimension | undefined): Skill | null {
  if (!dimension) return null
  if (dimension === 'vocabulary_in_context') return 'vocabulary'
  if (dimension === 'literal_understanding' || dimension === 'inferencing') return 'reading'
  if (dimension === 'syntax_grammar_comprehension') return 'writing'
  if (dimension === 'discourse_cohesion') return 'writing'
  if (dimension === 'knowledge_integration') return 'speaking'
  return null
}

function riskFromStats(args: {
  averageScore: number | null
  activitiesCompleted: number
  daysSinceLastActivity: number | null
  weakestSkillScore: number | null
  eldLevel: ELDLevel
  gapRiskPoints: number
}): number {
  const { averageScore, activitiesCompleted, daysSinceLastActivity, weakestSkillScore, eldLevel, gapRiskPoints } = args

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

  return Math.min(100, avgRisk + activityRisk + inactivityRisk + weakestSkillRisk + eldRisk + gapRiskPoints)
}

export function buildInterventionStudent(
  studentStat: StudentStats,
  allResponsesForClass: Response[],
  className: string,
  studentGapChecks: GapCheckEvent[] = [],
): InterventionStudent {
  const studentResponses = allResponsesForClass.filter((r) => r.studentId === studentStat.student.id)
  const lastDate = studentResponses
    .map((r) => toDate(r.createdAt))
    .filter((d): d is Date => !!d)
    .sort((a, b) => b.getTime() - a.getTime())[0] ?? null

  const daysSinceLastActivity = daysAgo(lastDate)
  const weakest = weakestSkillFromStats(studentStat.scoreBySkill)
  const estimatedCurriculumLevel = estimateCurriculumLevel({
    averageScore: studentStat.averageScore,
    activitiesCompleted: studentStat.activitiesCompleted,
    eldLevel: studentStat.student.level,
  })
  const inferredPrimaryGapModule = primaryModuleForWeakestSkill(weakest.skill)
  const inferredGapRecord = buildTeacherGapCheckRecord(
    inferredPrimaryGapModule,
    estimatedCurriculumLevel,
    buildDimensionScores({
      averageScore: studentStat.averageScore,
      activitiesCompleted: studentStat.activitiesCompleted,
      daysSinceLastActivity,
      weakestSkill: weakest.skill,
      eldLevel: studentStat.student.level,
    }),
  )

  const persistedGap = latestGapCheck(studentGapChecks)
  const primaryGapModule = persistedGap?.moduleId ?? inferredPrimaryGapModule
  const gapCheckId = persistedGap?.gapCheckId ?? inferredGapRecord.gap_check_id
  const gapCleared = persistedGap?.cleared ?? inferredGapRecord.cleared
  const gapTotalScore = persistedGap?.totalScore ?? inferredGapRecord.total_score
  const gapMaxTotalScore = persistedGap?.maxTotalScore ?? inferredGapRecord.max_total_score
  const gapDimensions = persistedGap
    ? persistedGap.dimensions.map((dimension) => ({
        dimension: dimension.dimension,
        severity: dimension.severity,
      }))
    : inferredGapRecord.dimensions

  const severeCount = gapDimensions.filter((dimension) => dimension.severity === 'severe').length
  const moderateCount = gapDimensions.filter((dimension) => dimension.severity === 'moderate').length
  const flaggedDimensions = gapDimensions
    .filter((dimension) => dimension.severity !== 'mild')
    .map((dimension) => dimension.dimension)
  const gapSupportTier = gapTierFromCounts({
    cleared: gapCleared,
    severeCount,
    moderateCount,
  })
  const gapRiskPoints = gapRiskFromTier(gapSupportTier, flaggedDimensions.length)
  const riskScore = riskFromStats({
    averageScore: studentStat.averageScore,
    activitiesCompleted: studentStat.activitiesCompleted,
    daysSinceLastActivity,
    weakestSkillScore: weakest.score,
    eldLevel: studentStat.student.level,
    gapRiskPoints,
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
    estimatedCurriculumLevel,
    primaryGapModule,
    gapCheckId,
    gapCheckCleared: gapCleared,
    gapSupportTier,
    gapDimensionsFlagged: flaggedDimensions.length,
    gapPrimaryDimensions: flaggedDimensions.slice(0, 2),
    gapRecommendedPaths: (persistedGap?.recommendedPaths ?? inferredGapRecord.recommended_paths).slice(0, 3),
    gapScorePercent: gapMaxTotalScore > 0 ? Math.round((gapTotalScore / gapMaxTotalScore) * 100) : 0,
    gapRiskPoints,
    riskScore,
    riskTier: tierFromRisk(riskScore),
    recommendation: recommendationFor(weakest.skill, studentStat.averageScore, gapSupportTier, flaggedDimensions),
  }
}

export function buildInterventionStudentFromGapEvent(
  gapEvent: GapCheckEvent,
  className: string,
): InterventionStudent {
  const severeCount = gapEvent.dimensions.filter((dimension) => dimension.severity === 'severe').length
  const moderateCount = gapEvent.dimensions.filter((dimension) => dimension.severity === 'moderate').length
  const flaggedDimensions = gapEvent.dimensions
    .filter((dimension) => dimension.severity !== 'mild')
    .map((dimension) => dimension.dimension)
  const gapSupportTier = gapTierFromCounts({
    cleared: gapEvent.cleared,
    severeCount,
    moderateCount,
  })
  const gapRiskPoints = gapRiskFromTier(gapSupportTier, flaggedDimensions.length)
  const primaryWeakness = skillFromPrimaryGapDimension(flaggedDimensions[0])
  const daysSinceLastActivity = daysAgo(toDate(gapEvent.createdAt))
  const riskScore = riskFromStats({
    averageScore: null,
    activitiesCompleted: 0,
    daysSinceLastActivity,
    weakestSkillScore: null,
    eldLevel: 'Emerging',
    gapRiskPoints,
  })
  const safePercent = gapEvent.maxTotalScore > 0 ? Math.round((gapEvent.totalScore / gapEvent.maxTotalScore) * 100) : 0
  const studentName = `Sandbox Student (${gapEvent.studentId.slice(-4)})`

  return {
    studentId: gapEvent.studentId,
    studentName,
    classId: gapEvent.classId,
    className,
    eldLevel: 'Emerging',
    activitiesCompleted: 0,
    averageScore: null,
    daysSinceLastActivity,
    weakestSkill: primaryWeakness,
    weakestSkillScore: null,
    estimatedCurriculumLevel: gapEvent.levelNumber,
    primaryGapModule: gapEvent.moduleId,
    gapCheckId: gapEvent.gapCheckId,
    gapCheckCleared: gapEvent.cleared,
    gapSupportTier,
    gapDimensionsFlagged: flaggedDimensions.length,
    gapPrimaryDimensions: flaggedDimensions.slice(0, 2),
    gapRecommendedPaths: gapEvent.recommendedPaths.slice(0, 3),
    gapScorePercent: safePercent,
    gapRiskPoints,
    riskScore,
    riskTier: tierFromRisk(riskScore),
    recommendation: recommendationFor(primaryWeakness, null, gapSupportTier, flaggedDimensions),
  }
}
