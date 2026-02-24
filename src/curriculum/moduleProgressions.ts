import { getStandardizedLevel, standardized20LevelFramework } from './levelFramework'
import type {
  CurriculumErrorType,
  CurriculumLevelQuestion,
  CurriculumModuleId,
  CurriculumQuestionInteractionType,
  CurriculumQuestionRole,
  ModuleLevelDefinition,
  ModuleProgression,
  TeacherLevelPerformanceRecord,
  TeacherLevelQuestionResult,
  TeacherLevelSnapshot,
} from './types'

const moduleDisplayNames: Record<CurriculumModuleId, string> = {
  sentence_builder: 'Sentence Builder',
  grammar_detective: 'Grammar Detective',
  logic_check: 'Logic Check',
  sentence_expansion: 'Sentence Expansion',
  story_builder: 'Story Builder',
  vocabulary: 'Vocabulary',
  fluency_challenge: 'Fluency Challenge',
  peer_review: 'Peer Review',
}

const QUESTION_ROLE_SEQUENCE: CurriculumQuestionRole[] = [
  'core_skill',
  'core_skill',
  'reinforcement',
  'core_skill',
  'reinforcement',
  'application',
  'core_skill',
  'reinforcement',
  'application',
  'challenge',
]

const levelBands = {
  l1_4: [1, 2, 3, 4],
  l5_8: [5, 6, 7, 8],
  l9_12: [9, 10, 11, 12],
  l13_16: [13, 14, 15, 16],
  l17_20: [17, 18, 19, 20],
} as const

const moduleObjectivesByBand: Record<CurriculumModuleId, Record<keyof typeof levelBands, string[]>> = {
  sentence_builder: {
    l1_4: [
      'Match a picture to one correct word block.',
      'Sort noun and action word blocks using icons.',
      'Drag one correct word into a single target slot.',
      'Pair a noun icon with one matching action block.',
    ],
    l5_8: [
      'Build a 2-word subject + verb sentence frame.',
      'Build 2-3 word simple present sentences with a tiny bank.',
      'Choose the correct subject and verb order for simple sentences.',
      'Complete short sentence frames using guided slots and word banks.',
    ],
    l9_12: [
      'Build 4-5 word sentences with article support.',
      'Use a/an/the correctly in short sentence frames.',
      'Add one adjective to a simple sentence without breaking meaning.',
      'Build 5-6 word sentences with logical word choices.',
    ],
    l13_16: [
      'Build a compound sentence using and with guided blocks.',
      'Replace repeated nouns with simple pronouns in sentence building.',
      'Build short past-tense sentences with guided sequencing.',
      'Build a 2-3 sentence mini paragraph with step-by-step scaffolds.',
    ],
    l17_20: [
      'Construct a short paragraph with clear sequence and varied sentences.',
      'Build beginning-middle-end story paragraphs with minimal support.',
      'Independently construct a paragraph and self-correct errors.',
      'Compose grade-appropriate paragraphs with strong structure and variation.',
    ],
  },
  grammar_detective: {
    l1_4: [
      'Identify a target word by matching icon and word card.',
      'Tap the picture word when asked for a noun.',
      'Tap the action word when shown simple motion pictures.',
      'Sort picture-supported words into noun or action categories.',
    ],
    l5_8: [
      'Find the verb in a 2-3 word sentence.',
      'Find the noun in a short simple-present sentence.',
      'Identify noun vs verb roles in guided sentence pairs.',
      'Detect missing word parts in short sentence frames.',
    ],
    l9_12: [
      'Detect article mistakes in 4-6 word sentences.',
      'Detect subject-verb agreement errors in short sentences.',
      'Identify adjective words in simple descriptive sentences.',
      'Check if a short sentence is grammatically complete.',
    ],
    l13_16: [
      'Detect errors in compound sentences using and.',
      'Identify pronoun reference mistakes in short multi-sentence tasks.',
      'Spot past-tense inconsistency in guided sentence sets.',
      'Detect paragraph-level sequence clues in 2-3 sentence paragraphs.',
    ],
    l17_20: [
      'Identify multiple error types in short paragraphs.',
      'Classify grammar vs logic errors in story paragraphs.',
      'Analyze sentence variation and agreement across a full paragraph.',
      'Independently detect and label multiple errors at third-grade level.',
    ],
  },
  logic_check: {
    l1_4: [
      'Choose the word that matches the picture meaning.',
      'Pick the action word that matches a shown icon.',
      'Reject obvious nonsense picture-word matches.',
      'Choose the only word pair that makes sense together.',
    ],
    l5_8: [
      'Choose the simple 2-3 word sentence that makes sense.',
      'Identify which short sentence matches a picture scene.',
      'Choose logical subject + verb combinations from small sets.',
      'Reject illogical short sentences using known vocabulary.',
    ],
    l9_12: [
      'Check article and noun combinations for logical correctness.',
      'Choose the grammatically correct and logical 4-6 word sentence.',
      'Identify adjective choices that fit the noun logically.',
      'Validate short sentence meaning and structure together.',
    ],
    l13_16: [
      'Choose the logical compound sentence joined with and.',
      'Check pronoun references so meaning stays clear.',
      'Choose past-tense sentences that keep a logical timeline.',
      'Validate multi-sentence mini paragraphs for sequence and meaning.',
    ],
    l17_20: [
      'Evaluate paragraph-level logical flow and sequencing.',
      'Choose the strongest paragraph with clear beginning-middle-end.',
      'Detect subtle logic breaks in grade-level writing samples.',
      'Independently evaluate paragraph coherence with minimal scaffolds.',
    ],
  },
  sentence_expansion: {
    l1_4: [
      'Add one matching word to a picture-supported word card.',
      'Choose one describing word that matches a pictured noun.',
      'Add one action word to complete a picture phrase.',
      'Expand a single word into a meaningful 2-word phrase.',
    ],
    l5_8: [
      'Expand a 2-word sentence with one guided word.',
      'Add a simple object to a short subject + verb sentence.',
      'Choose one extra word that keeps the sentence logical.',
      'Expand 2-3 word sentences while keeping simple present tense.',
    ],
    l9_12: [
      'Add articles and adjectives to build 4-6 word sentences.',
      'Expand a short sentence using one adjective and correct article.',
      'Strengthen sentence detail while keeping agreement correct.',
      'Choose the best expansion that keeps grammar and meaning clear.',
    ],
    l13_16: [
      'Expand a simple sentence into a compound sentence with and.',
      'Use pronouns to expand and connect ideas without repetition.',
      'Add past-tense details to a guided sentence sequence.',
      'Expand one sentence into a 2-3 sentence paragraph with supports.',
    ],
    l17_20: [
      'Expand paragraphs with varied sentence openings and details.',
      'Strengthen beginning-middle-end story paragraphs with precise details.',
      'Revise for sentence variety and clearer sequencing independently.',
      'Produce strong grade-level paragraph expansions with minimal scaffolds.',
    ],
  },
  story_builder: {
    l1_4: [
      'Pick a character word that matches a story picture.',
      'Choose a setting word for a pictured scene.',
      'Choose an action word that fits the story image.',
      'Order 2 picture-word story pieces in a sensible sequence.',
    ],
    l5_8: [
      'Build a 2-3 word story action sentence.',
      'Choose character + action combinations for a simple story moment.',
      'Complete short story frames with subject + verb patterns.',
      'Build short story sentences using a very small word bank.',
    ],
    l9_12: [
      'Build 4-6 word story sentences with articles and simple detail.',
      'Add adjective detail to a story sentence while keeping logic clear.',
      'Use agreement and article choices in story scene sentences.',
      'Sequence 2 guided story sentences into a mini event.',
    ],
    l13_16: [
      'Build story sentences joined with and.',
      'Use pronouns to connect repeated story characters.',
      'Use past tense in guided story events.',
      'Construct a 2-3 sentence story with beginning-middle-end supports.',
    ],
    l17_20: [
      'Write complete story paragraphs with clear beginning-middle-end.',
      'Sequence multiple events logically with varied sentences.',
      'Revise story paragraphs for grammar and coherence.',
      'Independently build grade-level story paragraphs with minimal scaffolds.',
    ],
  },
  vocabulary: {
    l1_4: [
      'Match pictures to high-frequency words using icons.',
      'Identify basic nouns with picture support.',
      'Identify action words with picture support.',
      'Sort word cards into simple meaning groups.',
    ],
    l5_8: [
      'Practice small sets of nouns and verbs used in short sentences.',
      'Match words to short 2-3 word sentence frames.',
      'Identify noun vs verb vocabulary roles in simple tasks.',
      'Use a limited word bank in early sentence awareness activities.',
    ],
    l9_12: [
      'Practice articles with noun vocabulary sets.',
      'Add simple adjectives to vocabulary families.',
      'Use vocabulary in 4-6 word sentence contexts.',
      'Choose vocabulary that supports logical short sentences.',
    ],
    l13_16: [
      'Practice pronouns and conjunction vocabulary in context.',
      'Introduce past-tense vocabulary forms with support.',
      'Apply vocabulary across multi-step sentence building tasks.',
      'Use vocabulary sets in short paragraph construction.',
    ],
    l17_20: [
      'Use expanded vocabulary in paragraph writing tasks.',
      'Select vocabulary for clear sequencing and story structure.',
      'Choose stronger vocabulary to vary sentence patterns.',
      'Apply end-of-third-grade vocabulary in independent composition.',
    ],
  },
  fluency_challenge: {
    l1_4: [
      'Rapidly match pictured words with single-word choices.',
      'Quick-tap noun pictures and action pictures accurately.',
      'Complete short icon-word matches with increasing speed.',
      'Build word pairs quickly with high visual support.',
    ],
    l5_8: [
      'Build 2-3 word sentences within gentle time limits.',
      'Quickly identify nouns and verbs in short sentences.',
      'Complete simple present sentence frames for speed + accuracy.',
      'Repeat short sentence tasks until accuracy is consistent under time.',
    ],
    l9_12: [
      'Solve article and agreement checks with timed practice.',
      'Build 4-6 word sentences while meeting accuracy + time targets.',
      'Use adjectives in timed sentence completion tasks.',
      'Complete logical sentence checks under moderate time limits.',
    ],
    l13_16: [
      'Timed compound sentence building with and.',
      'Timed pronoun and past-tense correction tasks.',
      'Timed multi-step sentence building with reduced scaffolds.',
      'Timed 2-3 sentence paragraph tasks with combined score rules.',
    ],
    l17_20: [
      'Timed paragraph sequencing with accuracy thresholds.',
      'Timed story paragraph construction with minimal support.',
      'Timed multi-error detection in grade-level writing samples.',
      'Timed independent paragraph construction at third-grade mastery level.',
    ],
  },
  peer_review: {
    l1_4: [
      'Choose kind icons to show whether a word matches a picture.',
      'Identify a helpful correction choice for a single word.',
      'Select a kind response to a simple word mismatch.',
      'Choose the correct supportive suggestion for a word pair.',
    ],
    l5_8: [
      'Choose a kind correction for short 2-3 word sentences.',
      'Identify if a friend needs a noun or verb fix.',
      'Select simple feedback for word order in short sentences.',
      'Practice kind review choices with sentence frames.',
    ],
    l9_12: [
      'Review short sentences for article and agreement errors.',
      'Choose feedback that names one grammar fix clearly.',
      'Review descriptive sentences for logic and adjective fit.',
      'Practice one-step peer feedback for complete short sentences.',
    ],
    l13_16: [
      'Give kind feedback on compound sentences with and.',
      'Identify pronoun or tense issues in peer examples.',
      'Choose the best feedback for multi-sentence drafts.',
      'Review 2-3 sentence paragraphs for sequence and grammar.',
    ],
    l17_20: [
      'Review paragraphs for multiple error types and sequencing.',
      'Choose feedback that improves clarity and sentence variety.',
      'Classify paragraph errors before giving a recommended fix.',
      'Provide structured peer review choices at third-grade mastery level.',
    ],
  },
}

const moduleVocabDomainsByBand: Record<CurriculumModuleId, Record<keyof typeof levelBands, string[]>> = {
  sentence_builder: {
    l1_4: ['animals', 'classroom objects', 'actions'],
    l5_8: ['family', 'school actions', 'daily routines'],
    l9_12: ['describing words', 'school tools', 'foods'],
    l13_16: ['community', 'past events', 'connectors'],
    l17_20: ['narrative vocabulary', 'sequencing words', 'academic high-frequency words'],
  },
  grammar_detective: {
    l1_4: ['picture nouns', 'action icons'],
    l5_8: ['sentence parts', 'daily routine words'],
    l9_12: ['articles', 'adjectives', 'agreement forms'],
    l13_16: ['pronouns', 'conjunctions', 'past-tense verbs'],
    l17_20: ['paragraph editing vocabulary', 'error labels'],
  },
  logic_check: {
    l1_4: ['picture words', 'action choices'],
    l5_8: ['simple subject-action pairs'],
    l9_12: ['logical noun-verb-object sets', 'descriptors'],
    l13_16: ['compound sentence connectors', 'event sequence words'],
    l17_20: ['paragraph cohesion words', 'story sequence terms'],
  },
  sentence_expansion: {
    l1_4: ['describing words', 'action words'],
    l5_8: ['objects', 'simple descriptors'],
    l9_12: ['articles', 'adjectives', 'location words'],
    l13_16: ['conjunctions', 'pronouns', 'past-tense verbs'],
    l17_20: ['detail words', 'transition words', 'paragraph elaboration'],
  },
  story_builder: {
    l1_4: ['characters', 'places', 'actions'],
    l5_8: ['story moments', 'daily events'],
    l9_12: ['descriptions', 'settings', 'objects'],
    l13_16: ['sequence words', 'pronouns', 'past tense'],
    l17_20: ['narrative transitions', 'story structure vocabulary'],
  },
  vocabulary: {
    l1_4: ['core picture nouns', 'common actions'],
    l5_8: ['high-frequency nouns/verbs'],
    l9_12: ['articles', 'adjectives', 'sentence-use vocabulary'],
    l13_16: ['pronouns', 'conjunctions', 'past tense'],
    l17_20: ['expanded academic and narrative vocabulary'],
  },
  fluency_challenge: {
    l1_4: ['rapid recognition core words'],
    l5_8: ['short sentence bank words'],
    l9_12: ['agreement/article practice words'],
    l13_16: ['compound and paragraph bridge vocabulary'],
    l17_20: ['paragraph fluency vocabulary'],
  },
  peer_review: {
    l1_4: ['kind feedback icons', 'basic word labels'],
    l5_8: ['sentence part labels', 'helpful feedback stems'],
    l9_12: ['article/agreement feedback stems'],
    l13_16: ['pronoun/tense/conjunction feedback language'],
    l17_20: ['multi-error review stems', 'revision language'],
  },
}

function bandKeyForLevel(levelNumber: number): keyof typeof levelBands {
  if (levelNumber <= 4) return 'l1_4'
  if (levelNumber <= 8) return 'l5_8'
  if (levelNumber <= 12) return 'l9_12'
  if (levelNumber <= 16) return 'l13_16'
  return 'l17_20'
}

function indexWithinBand(levelNumber: number): number {
  const key = bandKeyForLevel(levelNumber)
  return (levelBands[key] as readonly number[]).indexOf(levelNumber)
}

function fluencyTimeTargetSeconds(moduleId: CurriculumModuleId, levelNumber: number): number | undefined {
  if (moduleId !== 'fluency_challenge') return undefined
  // Gradually scales from quick recognition to paragraph-level timed performance.
  const targets = [12, 14, 16, 18, 24, 26, 30, 34, 40, 45, 50, 56, 68, 76, 88, 100, 110, 120, 130, 140]
  return targets[levelNumber - 1]
}

function interactionTypeForQuestion(
  moduleId: CurriculumModuleId,
  levelNumber: number,
  role: CurriculumQuestionRole,
): CurriculumQuestionInteractionType {
  if (levelNumber <= 4) {
    if (moduleId === 'grammar_detective') return 'word_select'
    return role === 'application' ? 'drag_drop' : 'icon_match'
  }
  if (levelNumber <= 8) {
    if (moduleId === 'grammar_detective') return 'error_detection'
    if (moduleId === 'logic_check') return 'logic_selection'
    return role === 'application' ? 'word_order' : 'sentence_build'
  }
  if (levelNumber <= 12) {
    if (moduleId === 'grammar_detective' || moduleId === 'peer_review') return 'error_detection'
    if (moduleId === 'logic_check') return 'logic_selection'
    return role === 'application' ? 'word_order' : 'sentence_build'
  }
  if (levelNumber <= 16) {
    if (moduleId === 'fluency_challenge') return role === 'challenge' ? 'paragraph_sequence' : 'sentence_build'
    if (moduleId === 'grammar_detective' || moduleId === 'peer_review') return 'error_detection'
    if (moduleId === 'story_builder') return role === 'challenge' ? 'paragraph_sequence' : 'sentence_build'
    return role === 'challenge' ? 'paragraph_construction' : 'sentence_build'
  }
  if (moduleId === 'grammar_detective' || moduleId === 'peer_review') return 'error_detection'
  if (moduleId === 'logic_check') return 'paragraph_sequence'
  return role === 'challenge' ? 'paragraph_construction' : 'paragraph_sequence'
}

function questionMaxResponseLength(levelMax: number, levelNumber: number, difficultyStep: number): number {
  const stageCap = levelNumber <= 4 ? 2 : levelNumber <= 8 ? 3 : levelNumber <= 12 ? 6 : levelNumber <= 16 ? 14 : 24
  const minBase = levelNumber <= 4 ? 1 : levelNumber <= 8 ? 2 : levelNumber <= 12 ? 4 : levelNumber <= 16 ? 6 : 10
  const span = Math.max(0, Math.min(levelMax, stageCap) - minBase)
  const scaled = minBase + Math.round((span * (difficultyStep - 1)) / 9)
  return Math.max(1, Math.min(levelMax, stageCap, scaled))
}

function expectedErrorTypesForRole(baseErrors: CurriculumErrorType[], role: CurriculumQuestionRole): CurriculumErrorType[] {
  if (role === 'core_skill') return baseErrors.slice(0, Math.min(2, baseErrors.length))
  if (role === 'reinforcement') return baseErrors.slice(0, Math.min(3, baseErrors.length))
  if (role === 'application') return baseErrors.slice(0, Math.min(4, baseErrors.length))
  return [...baseErrors]
}

function buildLevelQuestions(
  moduleId: CurriculumModuleId,
  moduleDisplayName: string,
  levelTitle: string,
  levelObjective: string,
  level: ReturnType<typeof getStandardizedLevel>,
): CurriculumLevelQuestion[] {
  return level.question_difficulty_progression.map((difficultyStep, index) => {
    const questionNumber = index + 1
    const questionRole = QUESTION_ROLE_SEQUENCE[index]
    const interactionType = interactionTypeForQuestion(moduleId, level.level_number, questionRole)
    const maxResponseLength = questionMaxResponseLength(level.max_sentence_length, level.level_number, difficultyStep)
    const iconSupport = level.level_number <= 4
    const independentResponse = level.level_number >= 17 && questionRole !== 'core_skill'
    const grammarFocus =
      questionRole === 'challenge'
        ? [...level.grammar_targets]
        : level.grammar_targets.slice(0, Math.min(level.grammar_targets.length, questionRole === 'application' ? 3 : 2))

    return {
      question_id: `${moduleId}-l${level.level_number}-q${questionNumber}`,
      question_number: questionNumber,
      difficulty_step: difficultyStep,
      question_role: questionRole,
      interaction_type: interactionType,
      prompt_focus: `${moduleDisplayName} ${levelTitle} Question ${questionNumber}: ${levelObjective}`,
      grammar_focus: grammarFocus,
      max_response_length: maxResponseLength,
      icon_support: iconSupport,
      independent_response: independentResponse,
      expected_error_types: expectedErrorTypesForRole(level.error_types_included, questionRole),
    }
  })
}

function createModuleLevelDefinition(moduleId: CurriculumModuleId, levelNumber: number): ModuleLevelDefinition {
  const base = getStandardizedLevel(levelNumber)
  const bandKey = bandKeyForLevel(levelNumber)
  const offset = indexWithinBand(levelNumber)
  const objective = moduleObjectivesByBand[moduleId][bandKey][offset]
  const recommended_vocab_domains = moduleVocabDomainsByBand[moduleId][bandKey]
  const level_title = `Level ${levelNumber}`
  const module_display_name = moduleDisplayNames[moduleId]

  return {
    ...base,
    module_id: moduleId,
    module_display_name,
    level_title,
    level_objective: objective,
    recommended_vocab_domains,
    fluency_time_target_seconds: fluencyTimeTargetSeconds(moduleId, levelNumber),
    questions: buildLevelQuestions(moduleId, module_display_name, level_title, objective, base),
  }
}

export const moduleProgressions: Record<CurriculumModuleId, ModuleProgression> = {
  sentence_builder: {
    module_id: 'sentence_builder',
    module_display_name: moduleDisplayNames.sentence_builder,
    levels: standardized20LevelFramework.map((level) => createModuleLevelDefinition('sentence_builder', level.level_number)),
  },
  grammar_detective: {
    module_id: 'grammar_detective',
    module_display_name: moduleDisplayNames.grammar_detective,
    levels: standardized20LevelFramework.map((level) => createModuleLevelDefinition('grammar_detective', level.level_number)),
  },
  logic_check: {
    module_id: 'logic_check',
    module_display_name: moduleDisplayNames.logic_check,
    levels: standardized20LevelFramework.map((level) => createModuleLevelDefinition('logic_check', level.level_number)),
  },
  sentence_expansion: {
    module_id: 'sentence_expansion',
    module_display_name: moduleDisplayNames.sentence_expansion,
    levels: standardized20LevelFramework.map((level) => createModuleLevelDefinition('sentence_expansion', level.level_number)),
  },
  story_builder: {
    module_id: 'story_builder',
    module_display_name: moduleDisplayNames.story_builder,
    levels: standardized20LevelFramework.map((level) => createModuleLevelDefinition('story_builder', level.level_number)),
  },
  vocabulary: {
    module_id: 'vocabulary',
    module_display_name: moduleDisplayNames.vocabulary,
    levels: standardized20LevelFramework.map((level) => createModuleLevelDefinition('vocabulary', level.level_number)),
  },
  fluency_challenge: {
    module_id: 'fluency_challenge',
    module_display_name: moduleDisplayNames.fluency_challenge,
    levels: standardized20LevelFramework.map((level) => createModuleLevelDefinition('fluency_challenge', level.level_number)),
  },
  peer_review: {
    module_id: 'peer_review',
    module_display_name: moduleDisplayNames.peer_review,
    levels: standardized20LevelFramework.map((level) => createModuleLevelDefinition('peer_review', level.level_number)),
  },
}

export function getModuleProgression(moduleId: CurriculumModuleId): ModuleProgression {
  return moduleProgressions[moduleId]
}

export function getModuleLevel(moduleId: CurriculumModuleId, levelNumber: number): ModuleLevelDefinition {
  const level = moduleProgressions[moduleId].levels.find((l) => l.level_number === levelNumber)
  if (!level) {
    throw new Error(`Module ${moduleId} is missing level ${levelNumber}`)
  }
  return level
}

export function buildTeacherLevelSnapshot(
  moduleId: CurriculumModuleId,
  currentLevel: number,
  errorCountsForCurrentLevel: Partial<Record<CurriculumErrorType, number>> = {},
): TeacherLevelSnapshot {
  const clampedLevel = Math.min(20, Math.max(1, currentLevel))
  const level = getModuleLevel(moduleId, clampedLevel)
  const highErrorLoad = Object.values(errorCountsForCurrentLevel).reduce((sum, count) => sum + (count ?? 0), 0) >= 6
  const repeatedAgreementOrLogic = (errorCountsForCurrentLevel.subject_verb_agreement ?? 0) >= 2 || (errorCountsForCurrentLevel.logic_mismatch ?? 0) >= 2

  let recommendedInterventionLevel = clampedLevel
  if (highErrorLoad) recommendedInterventionLevel = Math.max(1, clampedLevel - 2)
  else if (repeatedAgreementOrLogic) recommendedInterventionLevel = Math.max(1, clampedLevel - 1)

  return {
    module_id: moduleId,
    current_level: clampedLevel,
    literacy_stage: level.literacy_stage,
    error_types_for_level: level.error_types_included,
    recommended_intervention_level: recommendedInterventionLevel,
  }
}

export function didPassLevelSession(moduleId: CurriculumModuleId, levelNumber: number, correctAnswers: number): boolean {
  const level = getModuleLevel(moduleId, levelNumber)
  const total = level.total_questions_per_level
  const accuracy = correctAnswers / total
  return correctAnswers >= level.min_correct_to_pass && accuracy >= level.required_accuracy_to_pass
}

export function getShuffledLevelQuestions(moduleId: CurriculumModuleId, levelNumber: number, seed = Date.now()): CurriculumLevelQuestion[] {
  const level = getModuleLevel(moduleId, levelNumber)
  if (!level.reshuffle_enabled) return [...level.questions]

  // Deterministic-enough local shuffle for retry sessions without external deps.
  const items = [...level.questions]
  let state = (seed % 2147483647) || 1
  const nextRand = () => {
    state = (state * 48271) % 2147483647
    return state / 2147483647
  }

  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(nextRand() * (i + 1))
    ;[items[i], items[j]] = [items[j], items[i]]
  }
  return items
}

export function buildTeacherLevelPerformanceRecord(
  moduleId: CurriculumModuleId,
  levelNumber: number,
  questionResults: TeacherLevelQuestionResult[],
  reattemptCount: number,
): TeacherLevelPerformanceRecord {
  const level = getModuleLevel(moduleId, levelNumber)
  const normalizedResults = questionResults.slice(0, level.total_questions_per_level)
  const score = normalizedResults.filter((r) => r.correct).length
  const missedRoles = Array.from(new Set(normalizedResults.filter((r) => !r.correct).map((r) => r.question_role)))

  return {
    module_id: moduleId,
    level_number: level.level_number,
    score_out_of_10: Math.min(level.total_questions_per_level, score),
    literacy_stage: level.literacy_stage,
    error_breakdown_per_question: normalizedResults,
    question_types_missed: missedRoles,
    reattempt_count: Math.max(0, reattemptCount),
  }
}
