import { literacyStageDefinitions, standardized20LevelFramework } from './levelFramework'
import { moduleProgressions } from './moduleProgressions'
import type { CurriculumModuleId, ModuleLevelDefinition, StandardizedLevelDefinition } from './types'

export interface CurriculumValidationReport {
  valid: boolean
  checks: {
    everyModuleHas20Levels: boolean
    everyLevelHasExactly10Questions: boolean
    totalQuestionCountMatches20x10: boolean
    withinLevelQuestionDifficultyProgression: boolean
    questionTypeDistributionBalanced: boolean
    questionComplexityAlignsWithLiteracyStage: boolean
    levelsAlignWithLiteracyProgression: boolean
    noDuplicateLevelObjectives: boolean
    increasingSentenceComplexity: boolean
    vocabularyScaling: boolean
    noLevelExceedsThirdGradeDifficulty: boolean
    identical20LevelScaffoldingAcrossModules: boolean
  }
  moduleCounts: Record<CurriculumModuleId, number>
  issues: string[]
}

function sameScaffold(a: ModuleLevelDefinition, b: StandardizedLevelDefinition) {
  return (
    a.level_number === b.level_number &&
    a.literacy_stage === b.literacy_stage &&
    a.max_sentence_length === b.max_sentence_length &&
    a.vocabulary_size === b.vocabulary_size &&
    a.scaffolding_level === b.scaffolding_level &&
    a.required_accuracy_to_pass === b.required_accuracy_to_pass &&
    a.total_questions_per_level === b.total_questions_per_level &&
    a.min_correct_to_pass === b.min_correct_to_pass &&
    a.reshuffle_enabled === b.reshuffle_enabled &&
    JSON.stringify(a.grammar_targets) === JSON.stringify(b.grammar_targets) &&
    JSON.stringify(a.allowed_sentence_types) === JSON.stringify(b.allowed_sentence_types) &&
    JSON.stringify(a.error_types_included) === JSON.stringify(b.error_types_included) &&
    JSON.stringify(a.repetition_requirement) === JSON.stringify(b.repetition_requirement) &&
    JSON.stringify(a.question_difficulty_progression) === JSON.stringify(b.question_difficulty_progression) &&
    JSON.stringify(a.question_types_distribution) === JSON.stringify(b.question_types_distribution)
  )
}

export function validate20LevelCurriculumFramework(): CurriculumValidationReport {
  const issues: string[] = []
  const moduleEntries = Object.entries(moduleProgressions) as [CurriculumModuleId, (typeof moduleProgressions)[CurriculumModuleId]][]
  const moduleCounts = Object.fromEntries(moduleEntries.map(([id, progression]) => [id, progression.levels.length])) as Record<CurriculumModuleId, number>

  const everyModuleHas20Levels = moduleEntries.every(([, progression]) => progression.levels.length === 20)
  if (!everyModuleHas20Levels) {
    moduleEntries.forEach(([id, progression]) => {
      if (progression.levels.length !== 20) issues.push(`${id} has ${progression.levels.length} levels (expected 20)`)
    })
  }

  let everyLevelHasExactly10Questions = true
  moduleEntries.forEach(([id, progression]) => {
    progression.levels.forEach((level) => {
      if (level.questions.length !== 10) {
        everyLevelHasExactly10Questions = false
        issues.push(`${id} level ${level.level_number} has ${level.questions.length} questions (expected 10)`)
      }
      if (level.total_questions_per_level !== 10) {
        everyLevelHasExactly10Questions = false
        issues.push(`${id} level ${level.level_number} total_questions_per_level=${level.total_questions_per_level} (expected 10)`)
      }
      if (level.min_correct_to_pass !== 8) {
        everyLevelHasExactly10Questions = false
        issues.push(`${id} level ${level.level_number} min_correct_to_pass=${level.min_correct_to_pass} (expected 8)`)
      }
    })
  })

  const totalQuestionCountMatches20x10 = moduleEntries.every(([, progression]) => {
    const totalQuestions = progression.levels.reduce((sum, level) => sum + level.questions.length, 0)
    return totalQuestions === 200
  })
  if (!totalQuestionCountMatches20x10) {
    moduleEntries.forEach(([id, progression]) => {
      const totalQuestions = progression.levels.reduce((sum, level) => sum + level.questions.length, 0)
      if (totalQuestions !== 200) issues.push(`${id} has ${totalQuestions} total questions (expected 200)`)
    })
  }

  let withinLevelQuestionDifficultyProgression = true
  moduleEntries.forEach(([id, progression]) => {
    progression.levels.forEach((level) => {
      const expected = JSON.stringify([1,2,3,4,5,6,7,8,9,10])
      const actualSteps = JSON.stringify(level.questions.map((q) => q.difficulty_step))
      const actualNumbers = JSON.stringify(level.questions.map((q) => q.question_number))
      if (actualSteps !== expected) {
        withinLevelQuestionDifficultyProgression = false
        issues.push(`${id} level ${level.level_number} question difficulty progression is not 1-10.`)
      }
      if (actualNumbers !== expected) {
        withinLevelQuestionDifficultyProgression = false
        issues.push(`${id} level ${level.level_number} question numbers are not 1-10.`)
      }
    })
  })

  let questionTypeDistributionBalanced = true
  moduleEntries.forEach(([id, progression]) => {
    progression.levels.forEach((level) => {
      const counts = level.questions.reduce(
        (acc, q) => {
          acc[q.question_role] += 1
          return acc
        },
        { core_skill: 0, reinforcement: 0, application: 0, challenge: 0 },
      )
      const balanced =
        counts.core_skill >= 3 &&
        counts.core_skill <= 4 &&
        counts.reinforcement >= 2 &&
        counts.reinforcement <= 3 &&
        counts.application === 2 &&
        counts.challenge === 1
      if (!balanced) {
        questionTypeDistributionBalanced = false
        issues.push(`${id} level ${level.level_number} has invalid question type distribution ${JSON.stringify(counts)}`)
      }
    })
  })

  let questionComplexityAlignsWithLiteracyStage = true
  moduleEntries.forEach(([id, progression]) => {
    progression.levels.forEach((level) => {
      level.questions.forEach((q) => {
        const stageChecks =
          (level.level_number <= 4 && q.icon_support && q.max_response_length <= 2 && !q.independent_response) ||
          (level.level_number >= 5 && level.level_number <= 8 && q.max_response_length <= 3) ||
          (level.level_number >= 9 && level.level_number <= 12 && q.max_response_length <= 6) ||
          (level.level_number >= 13 && level.level_number <= 16 && q.max_response_length <= 14) ||
          (level.level_number >= 17 && q.max_response_length <= 24)
        if (!stageChecks) {
          questionComplexityAlignsWithLiteracyStage = false
          issues.push(`${id} level ${level.level_number} question ${q.question_number} exceeds stage complexity constraints`)
        }
      })
    })
  })

  const stageMap = new Map(literacyStageDefinitions.map((stage) => [stage.id, stage.level_range]))
  const levelsAlignWithLiteracyProgression = standardized20LevelFramework.every((level) => {
    const range = stageMap.get(level.literacy_stage)
    return !!range && level.level_number >= range.start && level.level_number <= range.end
  })
  if (!levelsAlignWithLiteracyProgression) issues.push('One or more standardized levels do not match their literacy stage range.')

  let noDuplicateLevelObjectives = true
  moduleEntries.forEach(([id, progression]) => {
    const seen = new Set<string>()
    progression.levels.forEach((level) => {
      const key = level.level_objective.trim().toLowerCase()
      if (seen.has(key)) {
        noDuplicateLevelObjectives = false
        issues.push(`${id} has duplicate level objective: ${level.level_objective}`)
      }
      seen.add(key)
    })
  })

  const increasingSentenceComplexity = standardized20LevelFramework.every((level, index, arr) => index === 0 || level.max_sentence_length >= arr[index - 1].max_sentence_length)
  if (!increasingSentenceComplexity) issues.push('max_sentence_length is not non-decreasing across levels 1-20.')

  const vocabularyScaling = standardized20LevelFramework.every((level, index, arr) => index === 0 || level.vocabulary_size >= arr[index - 1].vocabulary_size)
  if (!vocabularyScaling) issues.push('vocabulary_size is not non-decreasing across levels 1-20.')

  const noLevelExceedsThirdGradeDifficulty = standardized20LevelFramework.every((level) => {
    return level.max_sentence_length <= 24 && level.vocabulary_size <= 40 && level.level_number <= 20
  })
  if (!noLevelExceedsThirdGradeDifficulty) issues.push('One or more levels exceed configured third-grade difficulty caps.')

  let identical20LevelScaffoldingAcrossModules = true
  moduleEntries.forEach(([id, progression]) => {
    progression.levels.forEach((level, idx) => {
      const standard = standardized20LevelFramework[idx]
      if (!sameScaffold(level, standard)) {
        identical20LevelScaffoldingAcrossModules = false
        issues.push(`${id} level ${level.level_number} does not match standardized scaffold.`)
      }
    })
  })

  return {
    valid:
      everyModuleHas20Levels &&
      everyLevelHasExactly10Questions &&
      totalQuestionCountMatches20x10 &&
      withinLevelQuestionDifficultyProgression &&
      questionTypeDistributionBalanced &&
      questionComplexityAlignsWithLiteracyStage &&
      levelsAlignWithLiteracyProgression &&
      noDuplicateLevelObjectives &&
      increasingSentenceComplexity &&
      vocabularyScaling &&
      noLevelExceedsThirdGradeDifficulty &&
      identical20LevelScaffoldingAcrossModules,
    checks: {
      everyModuleHas20Levels,
      everyLevelHasExactly10Questions,
      totalQuestionCountMatches20x10,
      withinLevelQuestionDifficultyProgression,
      questionTypeDistributionBalanced,
      questionComplexityAlignsWithLiteracyStage,
      levelsAlignWithLiteracyProgression,
      noDuplicateLevelObjectives,
      increasingSentenceComplexity,
      vocabularyScaling,
      noLevelExceedsThirdGradeDifficulty,
      identical20LevelScaffoldingAcrossModules,
    },
    moduleCounts,
    issues,
  }
}

export const curriculumValidationReport = validate20LevelCurriculumFramework()
