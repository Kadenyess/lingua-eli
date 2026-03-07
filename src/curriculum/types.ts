export type CurriculumModuleId =
  | 'sentence_builder'
  | 'grammar_detective'
  | 'logic_check'
  | 'sentence_expansion'
  | 'story_builder'
  | 'vocabulary'
  | 'fluency_challenge'
  | 'peer_review'

export type LiteracyStageId =
  | 'pre_literacy_early_exposure'
  | 'early_sentence_awareness'
  | 'emerging_reader'
  | 'developing_fluency'
  | 'third_grade_mastery'
  | 'advanced_comprehension_bridge'
  | 'accelerated_mastery_extension'

export type SentenceType =
  | 'single_word'
  | 'word_pair'
  | 'simple_sv'
  | 'simple_svo'
  | 'linking_sentence'
  | 'compound_with_and'
  | 'short_paragraph'
  | 'multi_sentence_paragraph'
  | 'independent_composition'

export type ScaffoldingLevel =
  | 'maximum_visual'
  | 'high'
  | 'guided'
  | 'moderate'
  | 'light'
  | 'minimal'

export type CurriculumErrorType =
  | 'missing_component'
  | 'word_order'
  | 'noun_identification'
  | 'verb_identification'
  | 'article_usage'
  | 'subject_verb_agreement'
  | 'logic_mismatch'
  | 'pronoun_reference'
  | 'tense_consistency'
  | 'conjunction_usage'
  | 'paragraph_sequence'
  | 'multi_error_detection'

export type CurriculumQuestionRole =
  | 'core_skill'
  | 'reinforcement'
  | 'application'
  | 'challenge'

export type CurriculumQuestionInteractionType =
  | 'icon_match'
  | 'word_select'
  | 'drag_drop'
  | 'word_order'
  | 'sentence_build'
  | 'error_detection'
  | 'logic_selection'
  | 'paragraph_sequence'
  | 'paragraph_construction'

export type ELPACDomain = 'listening' | 'speaking' | 'reading' | 'writing'

export type ComprehensionDimension =
  | 'literal_understanding'
  | 'inferencing'
  | 'vocabulary_in_context'
  | 'syntax_grammar_comprehension'
  | 'discourse_cohesion'
  | 'knowledge_integration'

export type GapSeverity = 'mild' | 'moderate' | 'severe'

export interface CurriculumLocalizedText {
  en: string
  es: string
}

export interface CurriculumQuestionChoice {
  choice_id: string
  text: CurriculumLocalizedText
  is_correct: boolean
  error_type: CurriculumErrorType | null
}

export interface GapCheckProbe {
  probe_id: string
  dimension: ComprehensionDimension
  prompt: CurriculumLocalizedText
  max_score: number
}

export interface GapCheckDefinition {
  gap_check_id: string
  checkpoint_order: number
  required_score_to_clear: number
  dimensions: ComprehensionDimension[]
  probes: GapCheckProbe[]
  remediation_paths: Partial<Record<ComprehensionDimension, string>>
}

export interface QuestionTypesDistribution {
  core_skill: number
  reinforcement: number
  application: number
  challenge: number
}

export interface CurriculumLevelQuestion {
  question_id: string
  question_number: number
  difficulty_step: number
  question_role: CurriculumQuestionRole
  interaction_type: CurriculumQuestionInteractionType
  prompt_focus: string
  prompt: CurriculumLocalizedText
  domain: ELPACDomain
  choices: CurriculumQuestionChoice[]
  rationale: CurriculumLocalizedText
  grammar_focus: string[]
  max_response_length: number
  icon_support: boolean
  independent_response: boolean
  expected_error_types: CurriculumErrorType[]
}

export interface LiteracyStageDefinition {
  id: LiteracyStageId
  display_name: string
  level_range: { start: number; end: number }
  summary: string
  instructional_focus: string[]
  cognitive_load_notes: string[]
}

export interface RepetitionRequirement {
  minimum_attempts: number
  consecutive_successes_required: number
  consistency_window: number
  fluency_gate?: {
    max_seconds: number
    min_accuracy: number
  }
}

export interface StandardizedLevelDefinition {
  level_number: number
  literacy_stage: LiteracyStageId
  max_sentence_length: number
  grammar_targets: string[]
  vocabulary_size: number
  allowed_sentence_types: SentenceType[]
  error_types_included: CurriculumErrorType[]
  scaffolding_level: ScaffoldingLevel
  required_accuracy_to_pass: number
  repetition_requirement: RepetitionRequirement
  total_questions_per_level: 10
  min_correct_to_pass: 8
  question_difficulty_progression: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  question_types_distribution: QuestionTypesDistribution
  reshuffle_enabled: boolean
  comprehension_dimensions: ComprehensionDimension[]
  gap_check_enabled: boolean
}

export interface ModuleLevelDefinition extends StandardizedLevelDefinition {
  module_id: CurriculumModuleId
  module_display_name: string
  level_title: string
  level_objective: string
  recommended_vocab_domains: string[]
  fluency_time_target_seconds?: number
  questions: CurriculumLevelQuestion[]
  post_level_gap_check: GapCheckDefinition
}

export interface ModuleProgression {
  module_id: CurriculumModuleId
  module_display_name: string
  levels: ModuleLevelDefinition[]
}

export interface TeacherLevelSnapshot {
  module_id: CurriculumModuleId
  current_level: number
  literacy_stage: LiteracyStageId
  error_types_for_level: CurriculumErrorType[]
  recommended_intervention_level: number
}

export interface TeacherLevelQuestionResult {
  question_id: string
  question_number: number
  correct: boolean
  error_types: CurriculumErrorType[]
  question_role: CurriculumQuestionRole
}

export interface TeacherLevelPerformanceRecord {
  module_id: CurriculumModuleId
  level_number: number
  score_out_of_10: number
  literacy_stage: LiteracyStageId
  error_breakdown_per_question: TeacherLevelQuestionResult[]
  question_types_missed: CurriculumQuestionRole[]
  reattempt_count: number
}

export interface TeacherGapCheckDimensionResult {
  dimension: ComprehensionDimension
  score: number
  max_score: number
  severity: GapSeverity
}

export interface TeacherGapCheckRecord {
  module_id: CurriculumModuleId
  level_number: number
  gap_check_id: string
  cleared: boolean
  total_score: number
  max_total_score: number
  dimensions: TeacherGapCheckDimensionResult[]
  recommended_paths: string[]
}
