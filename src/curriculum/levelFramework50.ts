import type {
  ComprehensionDimension,
  CurriculumErrorType,
  LiteracyStageDefinition,
  LiteracyStageId,
  ScaffoldingLevel,
  SentenceType,
  StandardizedLevelDefinition,
} from './types'

export const STANDARD_LEVEL_COUNT = 50

export const STANDARD_QUESTION_DIFFICULTY_PROGRESSION = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const
export const STANDARD_QUESTION_TYPES_DISTRIBUTION = {
  core_skill: 4,
  reinforcement: 3,
  application: 2,
  challenge: 1,
} as const

const ADVANCED_LEVEL_START = 21

export const literacyStageDefinitions: LiteracyStageDefinition[] = [
  {
    id: 'pre_literacy_early_exposure',
    display_name: 'Pre-Literacy / Early Exposure',
    level_range: { start: 1, end: 4 },
    summary: 'Icon-based and picture-supported language exposure with no full sentence requirement.',
    instructional_focus: [
      'Word recognition through icons and pictures',
      'Basic noun and action awareness',
      'Single-word selection and matching',
    ],
    cognitive_load_notes: ['Single-step interactions only', 'Minimal text decoding demand'],
  },
  {
    id: 'early_sentence_awareness',
    display_name: 'Early Sentence Awareness',
    level_range: { start: 5, end: 8 },
    summary: '2-3 word sentence awareness with simple subject-verb patterns and small word banks.',
    instructional_focus: ['2-3 word sentence building', 'Noun and verb identification', 'Simple present tense only'],
    cognitive_load_notes: ['Short sentences only', 'Limited vocabulary options and high scaffolding'],
  },
  {
    id: 'emerging_reader',
    display_name: 'Emerging Reader',
    level_range: { start: 9, end: 12 },
    summary: '4-6 word sentence control with articles, adjectives, agreement, and basic logic checks.',
    instructional_focus: ['Subject-verb agreement', 'Articles a/an/the', 'Simple adjectives and logical consistency'],
    cognitive_load_notes: ['Moderate word bank expansion', 'Multi-part sentence checks with support'],
  },
  {
    id: 'developing_fluency',
    display_name: 'Developing Fluency',
    level_range: { start: 13, end: 16 },
    summary: 'Compound structures with and, pronouns, past tense introduction, and short multi-sentence output.',
    instructional_focus: ['Compound sentences with and', 'Pronouns and past tense introduction', '2-3 sentence paragraph building'],
    cognitive_load_notes: ['Multi-step construction', 'Reduced scaffolding with guided supports'],
  },
  {
    id: 'third_grade_mastery',
    display_name: 'Third Grade Mastery',
    level_range: { start: 17, end: 20 },
    summary: 'Paragraph-level construction, sequencing, varied sentences, and multi-error detection with minimal scaffolding.',
    instructional_focus: [
      'Complete paragraphs with beginning-middle-end',
      'Sentence variation and sequencing',
      'Independent construction and multi-error analysis',
    ],
    cognitive_load_notes: ['Higher language complexity within end-of-third-grade bounds', 'Minimal scaffolds and stronger accuracy expectations'],
  },
  {
    id: 'advanced_comprehension_bridge',
    display_name: 'Advanced Comprehension Bridge',
    level_range: { start: 21, end: 35 },
    summary: 'Accelerated comprehension growth with precision gap checks between levels.',
    instructional_focus: [
      'Multi-sentence inference and evidence use',
      'Advanced syntax and vocabulary-in-context',
      'Consistent transfer across text types',
    ],
    cognitive_load_notes: ['Higher response complexity', 'Frequent comprehension gap diagnostics'],
  },
  {
    id: 'accelerated_mastery_extension',
    display_name: 'Accelerated Mastery Extension',
    level_range: { start: 36, end: 50 },
    summary: 'Extension pathway for students who excel with deeper comprehension and precision diagnostics.',
    instructional_focus: [
      'Dense text integration and multi-step reasoning',
      'Advanced discourse coherence and revision',
      'Independent comprehension transfer and metacognitive monitoring',
    ],
    cognitive_load_notes: ['Minimal scaffolding with targeted remediation when gaps appear', 'High precision checks across dimensions'],
  },
]

function stageForLevel(level: number): LiteracyStageId {
  if (level <= 4) return 'pre_literacy_early_exposure'
  if (level <= 8) return 'early_sentence_awareness'
  if (level <= 12) return 'emerging_reader'
  if (level <= 16) return 'developing_fluency'
  if (level <= 20) return 'third_grade_mastery'
  if (level <= 35) return 'advanced_comprehension_bridge'
  return 'accelerated_mastery_extension'
}

function scaffoldingForLevel(level: number): ScaffoldingLevel {
  if (level <= 3) return 'maximum_visual'
  if (level <= 7) return 'high'
  if (level <= 11) return 'guided'
  if (level <= 14) return 'moderate'
  if (level <= 17) return 'light'
  return 'minimal'
}

function maxSentenceLength(level: number): number {
  const fixed: Record<number, number> = {
    1: 1, 2: 1, 3: 2, 4: 2,
    5: 3, 6: 3, 7: 4, 8: 4,
    9: 5, 10: 5, 11: 6, 12: 6,
    13: 8, 14: 8, 15: 10, 16: 14,
    17: 16, 18: 18, 19: 20, 20: 24,
  }
  if (fixed[level]) return fixed[level]
  if (level <= 35) {
    const offset = level - 21
    return 25 + Math.floor((offset * 10) / 14)
  }
  const offset = level - 36
  return 36 + Math.floor((offset * 14) / 14)
}

function vocabularySize(level: number): number {
  const fixed: Record<number, number> = {
    1: 4, 2: 5, 3: 6, 4: 8,
    5: 8, 6: 10, 7: 12, 8: 14,
    9: 16, 10: 18, 11: 20, 12: 22,
    13: 24, 14: 26, 15: 28, 16: 30,
    17: 32, 18: 34, 19: 36, 20: 40,
  }
  if (fixed[level]) return fixed[level]
  if (level <= 35) {
    const offset = level - ADVANCED_LEVEL_START
    return 42 + Math.floor((offset * 20) / 14)
  }
  const offset = level - 36
  return 64 + Math.floor((offset * 26) / 14)
}

function accuracyToPass(level: number): number {
  if (level <= 4) return 0.8 + (level - 1) * 0.01
  if (level <= 8) return 0.84 + (level - 5) * 0.01
  if (level <= 12) return 0.88 + (level - 9) * 0.007
  if (level <= 16) return 0.9 + (level - 13) * 0.006
  if (level <= 20) return 0.92 + (level - 17) * 0.006
  if (level <= 35) return 0.94 + (level - 21) * 0.0014
  return 0.96 + (level - 36) * 0.001
}

function grammarTargets(stage: LiteracyStageId): string[] {
  switch (stage) {
    case 'pre_literacy_early_exposure':
      return ['icon-to-word recognition', 'basic noun/verb awareness']
    case 'early_sentence_awareness':
      return ['subject + verb', 'simple present tense', 'word order']
    case 'emerging_reader':
      return ['subject-verb agreement', 'articles', 'simple adjectives']
    case 'developing_fluency':
      return ['compound with and', 'pronouns', 'past tense introduction']
    case 'third_grade_mastery':
      return ['paragraph sequencing', 'sentence variation', 'multi-error detection']
    case 'advanced_comprehension_bridge':
      return ['inference language', 'evidence linking', 'complex cohesion']
    case 'accelerated_mastery_extension':
      return ['advanced discourse coherence', 'precision revision', 'cross-text synthesis']
  }
}

function allowedSentenceTypes(stage: LiteracyStageId): SentenceType[] {
  switch (stage) {
    case 'pre_literacy_early_exposure':
      return ['single_word', 'word_pair']
    case 'early_sentence_awareness':
      return ['simple_sv', 'simple_svo']
    case 'emerging_reader':
      return ['simple_sv', 'simple_svo', 'linking_sentence']
    case 'developing_fluency':
      return ['simple_svo', 'compound_with_and', 'short_paragraph']
    case 'third_grade_mastery':
      return ['short_paragraph', 'multi_sentence_paragraph', 'independent_composition']
    case 'advanced_comprehension_bridge':
    case 'accelerated_mastery_extension':
      return ['multi_sentence_paragraph', 'independent_composition']
  }
}

function errorTypes(stage: LiteracyStageId): CurriculumErrorType[] {
  switch (stage) {
    case 'pre_literacy_early_exposure':
      return ['noun_identification', 'verb_identification', 'logic_mismatch']
    case 'early_sentence_awareness':
      return ['missing_component', 'word_order', 'noun_identification', 'verb_identification', 'logic_mismatch']
    case 'emerging_reader':
      return ['missing_component', 'word_order', 'subject_verb_agreement', 'article_usage', 'logic_mismatch']
    case 'developing_fluency':
      return ['word_order', 'subject_verb_agreement', 'pronoun_reference', 'tense_consistency', 'conjunction_usage', 'logic_mismatch']
    case 'third_grade_mastery':
      return ['subject_verb_agreement', 'article_usage', 'pronoun_reference', 'tense_consistency', 'conjunction_usage', 'paragraph_sequence', 'multi_error_detection']
    case 'advanced_comprehension_bridge':
    case 'accelerated_mastery_extension':
      return ['subject_verb_agreement', 'article_usage', 'pronoun_reference', 'tense_consistency', 'conjunction_usage', 'paragraph_sequence', 'multi_error_detection', 'logic_mismatch']
  }
}

function comprehensionDimensions(stage: LiteracyStageId): ComprehensionDimension[] {
  if (stage === 'pre_literacy_early_exposure') return ['literal_understanding', 'vocabulary_in_context']
  if (stage === 'early_sentence_awareness') return ['literal_understanding', 'vocabulary_in_context', 'syntax_grammar_comprehension']
  if (stage === 'emerging_reader') return ['literal_understanding', 'vocabulary_in_context', 'syntax_grammar_comprehension', 'inferencing']
  return [
    'literal_understanding',
    'inferencing',
    'vocabulary_in_context',
    'syntax_grammar_comprehension',
    'discourse_cohesion',
    'knowledge_integration',
  ]
}

function repetitionRequirement(level: number): StandardizedLevelDefinition['repetition_requirement'] {
  const minimum_attempts = level <= 4 ? 3 : level <= 12 ? 5 : level <= 20 ? 7 : level <= 35 ? 8 : 9
  const consecutive_successes_required = level <= 18 ? 2 : 3
  const consistency_window = level <= 8 ? 4 : level <= 20 ? 7 : 8

  if (level < 17) {
    return { minimum_attempts, consecutive_successes_required, consistency_window }
  }

  const maxSeconds = level <= 20 ? 150 - (level - 17) * 10 : level <= 35 ? 120 - (level - 21) * 2 : 90 - (level - 36)
  const minAccuracy = level <= 20 ? 0.85 + (level - 17) * 0.01 : level <= 35 ? 0.89 + (level - 21) * 0.002 : 0.92 + (level - 36) * 0.001

  return {
    minimum_attempts,
    consecutive_successes_required,
    consistency_window,
    fluency_gate: {
      max_seconds: Math.max(60, maxSeconds),
      min_accuracy: Number(Math.min(0.98, minAccuracy).toFixed(3)),
    },
  }
}

function buildStandardizedLevel(level_number: number): StandardizedLevelDefinition {
  const literacy_stage = stageForLevel(level_number)
  return {
    level_number,
    literacy_stage,
    max_sentence_length: maxSentenceLength(level_number),
    grammar_targets: grammarTargets(literacy_stage),
    vocabulary_size: vocabularySize(level_number),
    allowed_sentence_types: allowedSentenceTypes(literacy_stage),
    error_types_included: errorTypes(literacy_stage),
    scaffolding_level: scaffoldingForLevel(level_number),
    required_accuracy_to_pass: Number(accuracyToPass(level_number).toFixed(3)),
    repetition_requirement: repetitionRequirement(level_number),
    total_questions_per_level: 10,
    min_correct_to_pass: 8,
    question_difficulty_progression: [...STANDARD_QUESTION_DIFFICULTY_PROGRESSION] as [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    question_types_distribution: { ...STANDARD_QUESTION_TYPES_DISTRIBUTION },
    reshuffle_enabled: true,
    comprehension_dimensions: comprehensionDimensions(literacy_stage),
    gap_check_enabled: true,
  }
}

export const standardized50LevelFramework: StandardizedLevelDefinition[] = Array.from(
  { length: STANDARD_LEVEL_COUNT },
  (_, idx) => buildStandardizedLevel(idx + 1),
)

// Backward compatibility exports
export const standardized20LevelFramework: StandardizedLevelDefinition[] = standardized50LevelFramework.slice(0, 20)

export function getStandardizedLevel(levelNumber: number): StandardizedLevelDefinition {
  const found = standardized50LevelFramework.find((level) => level.level_number === levelNumber)
  if (!found) {
    throw new Error(`Invalid curriculum level: ${levelNumber}. Expected 1-${STANDARD_LEVEL_COUNT}.`)
  }
  return found
}

