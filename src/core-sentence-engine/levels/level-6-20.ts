import type { LevelDefinition, LevelTask, SlotType, WordEntry } from '../types/engine'

type LevelTemplate = {
  level: number
  title: string
  vocabularyFocus: string[]
  targetGrammarSkill: string
  prompt: string
  displayFrame: string
  slots: SlotType[]
  nouns: WordEntry[]
  verbs: WordEntry[]
  adjectives?: WordEntry[]
  articles?: WordEntry[]
  logic?: LevelTask['logic']
  correctExamples: string[]
}

const articleWords: WordEntry[] = [
  { id: 'the', text: 'The', category: 'article', role: 'article' },
  { id: 'a', text: 'A', category: 'article', role: 'article' },
  { id: 'an', text: 'An', category: 'article', role: 'article' },
]

const peopleSubjects: WordEntry[] = [
  { id: 'girl', text: 'girl', category: 'noun', role: 'subject', number: 'singular', semanticTags: ['person'] },
  { id: 'boy', text: 'boy', category: 'noun', role: 'subject', number: 'singular', semanticTags: ['person'] },
  { id: 'teacher', text: 'teacher', category: 'noun', role: 'subject', number: 'singular', semanticTags: ['person'] },
  { id: 'student', text: 'student', category: 'noun', role: 'subject', number: 'singular', semanticTags: ['person'] },
  { id: 'friend', text: 'friend', category: 'noun', role: 'subject', number: 'singular', semanticTags: ['person'] },
]

const pronounSubjects: WordEntry[] = [
  { id: 'he', text: 'he', category: 'noun', role: 'subject', number: 'singular', semanticTags: ['person'] },
  { id: 'she', text: 'she', category: 'noun', role: 'subject', number: 'singular', semanticTags: ['person'] },
  { id: 'they', text: 'they', category: 'noun', role: 'subject', number: 'plural', semanticTags: ['person'] },
]

const schoolObjects: WordEntry[] = [
  { id: 'book', text: 'book', category: 'noun', role: 'object', number: 'singular', semanticTags: ['school-object'] },
  { id: 'pencil', text: 'pencil', category: 'noun', role: 'object', number: 'singular', semanticTags: ['school-object'] },
  { id: 'notebook', text: 'notebook', category: 'noun', role: 'object', number: 'singular', semanticTags: ['school-object'] },
  { id: 'story', text: 'story', category: 'noun', role: 'object', number: 'singular', semanticTags: ['school-object'] },
  { id: 'map', text: 'map', category: 'noun', role: 'object', number: 'singular', semanticTags: ['school-object'] },
]

const placeObjects: WordEntry[] = [
  { id: 'library', text: 'library', category: 'noun', role: 'object', number: 'singular', semanticTags: ['place'] },
  { id: 'classroom', text: 'classroom', category: 'noun', role: 'object', number: 'singular', semanticTags: ['place'] },
  { id: 'park', text: 'park', category: 'noun', role: 'object', number: 'singular', semanticTags: ['place'] },
]

const personActionVerbs: WordEntry[] = [
  { id: 'reads', text: 'reads', category: 'verb', role: 'verb', agreement: 'singular', semanticTags: ['school-action'] },
  { id: 'writes', text: 'writes', category: 'verb', role: 'verb', agreement: 'singular', semanticTags: ['school-action'] },
  { id: 'uses', text: 'uses', category: 'verb', role: 'verb', agreement: 'singular', semanticTags: ['school-action'] },
  { id: 'shares', text: 'shares', category: 'verb', role: 'verb', agreement: 'singular', semanticTags: ['school-action'] },
  { id: 'carries', text: 'carries', category: 'verb', role: 'verb', agreement: 'singular', semanticTags: ['school-action'] },
]

const personActionVerbsMixedAgreement: WordEntry[] = [
  ...personActionVerbs,
  { id: 'read', text: 'read', category: 'verb', role: 'verb', agreement: 'plural', semanticTags: ['school-action'] },
  { id: 'write', text: 'write', category: 'verb', role: 'verb', agreement: 'plural', semanticTags: ['school-action'] },
  { id: 'use', text: 'use', category: 'verb', role: 'verb', agreement: 'plural', semanticTags: ['school-action'] },
]

const linkingVerbs: WordEntry[] = [
  { id: 'is', text: 'is', category: 'verb', role: 'linkingVerb', agreement: 'singular', semanticTags: ['linking'] },
  { id: 'are', text: 'are', category: 'verb', role: 'linkingVerb', agreement: 'plural', semanticTags: ['linking'] },
]

const pastTenseVerbs: WordEntry[] = [
  { id: 'read-past', text: 'read', category: 'verb', role: 'verb', agreement: 'singular', semanticTags: ['school-action'] },
  { id: 'wrote', text: 'wrote', category: 'verb', role: 'verb', agreement: 'singular', semanticTags: ['school-action'] },
  { id: 'shared', text: 'shared', category: 'verb', role: 'verb', agreement: 'singular', semanticTags: ['school-action'] },
  { id: 'visited', text: 'visited', category: 'verb', role: 'verb', agreement: 'singular', semanticTags: ['travel-action'] },
]

const descriptorsBasic: WordEntry[] = [
  { id: 'happy', text: 'happy', category: 'adjective', role: 'descriptor', semanticTags: ['person-descriptor'] },
  { id: 'focused', text: 'focused', category: 'adjective', role: 'descriptor', semanticTags: ['person-descriptor'] },
  { id: 'careful', text: 'careful', category: 'adjective', role: 'descriptor', semanticTags: ['person-descriptor'] },
  { id: 'ready', text: 'ready', category: 'adjective', role: 'descriptor', semanticTags: ['person-descriptor'] },
]

const descriptorsCompound: WordEntry[] = [
  { id: 'during-practice', text: 'during practice', category: 'adjective', role: 'descriptor', semanticTags: ['compound-descriptor'] },
  { id: 'after-class', text: 'after class', category: 'adjective', role: 'descriptor', semanticTags: ['compound-descriptor'] },
  { id: 'with-a-friend', text: 'with a friend', category: 'adjective', role: 'descriptor', semanticTags: ['compound-descriptor'] },
  { id: 'in-the-classroom', text: 'in the classroom', category: 'adjective', role: 'descriptor', semanticTags: ['compound-descriptor'] },
]

const descriptorsSequence: WordEntry[] = [
  { id: 'first', text: 'first', category: 'adjective', role: 'descriptor', semanticTags: ['sequence-descriptor'] },
  { id: 'next', text: 'next', category: 'adjective', role: 'descriptor', semanticTags: ['sequence-descriptor'] },
  { id: 'then', text: 'then', category: 'adjective', role: 'descriptor', semanticTags: ['sequence-descriptor'] },
  { id: 'finally', text: 'finally', category: 'adjective', role: 'descriptor', semanticTags: ['sequence-descriptor'] },
]

const descriptorsParagraph: WordEntry[] = [
  { id: 'because-it-is-important', text: 'because it is important', category: 'adjective', role: 'descriptor', semanticTags: ['paragraph-descriptor'] },
  { id: 'to-finish-the-task', text: 'to finish the task', category: 'adjective', role: 'descriptor', semanticTags: ['paragraph-descriptor'] },
  { id: 'for-the-class-project', text: 'for the class project', category: 'adjective', role: 'descriptor', semanticTags: ['paragraph-descriptor'] },
  { id: 'with-clear-details', text: 'with clear details', category: 'adjective', role: 'descriptor', semanticTags: ['paragraph-descriptor'] },
]

const logicSchoolObject: LevelTask['logic'] = {
  verbToObject: { 'school-action': ['school-object'] },
}

const logicPeopleDescriptors: LevelTask['logic'] = {
  subjectToDescriptor: {
    person: ['person-descriptor', 'compound-descriptor', 'sequence-descriptor', 'paragraph-descriptor'],
  },
}

function buildTask(template: LevelTemplate): LevelTask {
  return {
    id: `l${template.level}-t1`,
    prompt: template.prompt,
    targetGrammarSkill: template.targetGrammarSkill,
    displayFrame: template.displayFrame,
    slots: template.slots,
    wordBanks: {
      noun: template.nouns,
      verb: template.verbs,
      adjective: template.adjectives || [],
      article: template.articles || [],
    },
    slotOptions: {},
    logic: template.logic || {},
    correctExamples: template.correctExamples,
  }
}

function levelDef(template: LevelTemplate): LevelDefinition {
  return {
    level: template.level,
    title: template.title,
    vocabularyFocus: template.vocabularyFocus,
    targetGrammarSkill: template.targetGrammarSkill,
    tasks: [buildTask(template)],
  }
}

export const levels6To20: LevelDefinition[] = [
  levelDef({
    level: 6,
    title: 'Level 6: Guided Subject + Verb',
    vocabularyFocus: ['people', 'school verbs'],
    targetGrammarSkill: 'Article + Subject + Verb',
    prompt: 'Build a simple sentence.',
    displayFrame: '___ ___ ___ .',
    slots: ['article', 'subject', 'verb'],
    nouns: peopleSubjects,
    verbs: personActionVerbs,
    articles: [{ id: 'the', text: 'The', category: 'article', role: 'article' }],
    correctExamples: [
      'The girl reads.',
      'The boy writes.',
      'The teacher uses.',
      'The student shares.',
      'The friend carries.',
      'The girl writes.',
      'The boy reads.',
      'The teacher shares.',
      'The student carries.',
      'The friend reads.',
    ],
  }),
  levelDef({
    level: 7,
    title: 'Level 7: Subject + Verb + Object',
    vocabularyFocus: ['school objects', 'actions'],
    targetGrammarSkill: 'Subject + Verb + Object',
    prompt: 'Build a sentence with an object.',
    displayFrame: '___ ___ ___ .',
    slots: ['subject', 'verb', 'object'],
    nouns: [...peopleSubjects, ...schoolObjects],
    verbs: personActionVerbs,
    logic: logicSchoolObject,
    correctExamples: [
      'girl reads book.',
      'boy writes notebook.',
      'teacher uses map.',
      'student carries pencil.',
      'friend shares story.',
      'girl reads story.',
      'boy uses book.',
      'teacher writes notebook.',
      'student reads map.',
      'friend carries book.',
    ],
  }),
  levelDef({
    level: 8,
    title: 'Level 8: Guided Word Order',
    vocabularyFocus: ['subjects', 'verbs', 'objects'],
    targetGrammarSkill: 'Article + Subject + Verb + Object',
    prompt: 'Put the words in order.',
    displayFrame: '___ ___ ___ ___ .',
    slots: ['article', 'subject', 'verb', 'object'],
    nouns: [...peopleSubjects, ...schoolObjects],
    verbs: personActionVerbs,
    articles: [{ id: 'the', text: 'The', category: 'article', role: 'article' }],
    logic: logicSchoolObject,
    correctExamples: [
      'The girl reads book.',
      'The boy writes notebook.',
      'The teacher uses map.',
      'The student carries pencil.',
      'The friend shares story.',
      'The girl writes map.',
      'The boy reads story.',
      'The teacher carries book.',
      'The student uses notebook.',
      'The friend reads pencil.',
    ],
  }),
  levelDef({
    level: 9,
    title: 'Level 9: Articles and Agreement',
    vocabularyFocus: ['articles', 'school objects'],
    targetGrammarSkill: 'Article + Subject + Verb + Object',
    prompt: 'Build a complete sentence.',
    displayFrame: '___ ___ ___ ___ .',
    slots: ['article', 'subject', 'verb', 'object'],
    nouns: [...peopleSubjects, ...schoolObjects],
    verbs: personActionVerbs,
    articles: articleWords,
    logic: logicSchoolObject,
    correctExamples: [
      'The girl reads book.',
      'A boy writes notebook.',
      'The teacher uses map.',
      'A student carries pencil.',
      'The friend shares story.',
      'A teacher reads book.',
      'A girl writes map.',
      'The boy reads story.',
      'A teacher carries notebook.',
      'The student uses pencil.',
    ],
  }),
  levelDef({
    level: 10,
    title: 'Level 10: Linking Verb Descriptions',
    vocabularyFocus: ['descriptors', 'linking verbs'],
    targetGrammarSkill: 'Article + Subject + Linking Verb + Descriptor',
    prompt: 'Describe the subject.',
    displayFrame: '___ ___ ___ ___ .',
    slots: ['article', 'subject', 'linkingVerb', 'descriptor'],
    nouns: peopleSubjects,
    verbs: linkingVerbs,
    adjectives: descriptorsBasic,
    articles: articleWords,
    logic: logicPeopleDescriptors,
    correctExamples: [
      'The girl is happy.',
      'A boy is focused.',
      'The teacher is ready.',
      'A student is careful.',
      'The friend is happy.',
      'The girl is ready.',
      'A teacher is focused.',
      'The student is ready.',
      'A teacher is careful.',
      'The student is focused.',
    ],
  }),
  levelDef({
    level: 11,
    title: 'Level 11: Add Clear Detail',
    vocabularyFocus: ['objects', 'descriptors'],
    targetGrammarSkill: 'Subject + Verb + Object + Descriptor',
    prompt: 'Build a detailed sentence.',
    displayFrame: '___ ___ ___ ___ .',
    slots: ['subject', 'verb', 'object', 'descriptor'],
    nouns: [...peopleSubjects, ...schoolObjects],
    verbs: personActionVerbs,
    adjectives: descriptorsBasic,
    logic: {
      ...logicSchoolObject,
      ...logicPeopleDescriptors,
    },
    correctExamples: [
      'girl reads book happy.',
      'boy writes notebook focused.',
      'teacher uses map careful.',
      'student carries pencil ready.',
      'friend shares story happy.',
      'girl writes map careful.',
      'boy reads story ready.',
      'teacher carries book focused.',
      'student uses notebook happy.',
      'friend reads pencil careful.',
    ],
  }),
  levelDef({
    level: 12,
    title: 'Level 12: Grammar and Meaning Check',
    vocabularyFocus: ['agreement', 'logical detail'],
    targetGrammarSkill: 'Article + Subject + Verb + Descriptor',
    prompt: 'Build a sentence that is grammatical and logical.',
    displayFrame: '___ ___ ___ ___ .',
    slots: ['article', 'subject', 'verb', 'descriptor'],
    nouns: peopleSubjects,
    verbs: personActionVerbs,
    adjectives: descriptorsBasic,
    articles: [{ id: 'the', text: 'The', category: 'article', role: 'article' }],
    logic: logicPeopleDescriptors,
    correctExamples: [
      'The girl reads focused.',
      'The boy writes careful.',
      'The teacher shares ready.',
      'The student carries happy.',
      'The friend uses focused.',
      'The girl writes ready.',
      'The boy reads happy.',
      'The teacher carries focused.',
      'The student uses careful.',
      'The friend reads ready.',
    ],
  }),
  levelDef({
    level: 13,
    title: 'Level 13: Compound Idea with and',
    vocabularyFocus: ['compound connectors', 'school actions'],
    targetGrammarSkill: 'Subject + Verb + Object + Connector Detail',
    prompt: 'Build a sentence with one added compound detail.',
    displayFrame: '___ ___ ___ ___ .',
    slots: ['subject', 'verb', 'object', 'descriptor'],
    nouns: [...peopleSubjects, ...schoolObjects],
    verbs: personActionVerbs,
    adjectives: descriptorsCompound,
    logic: {
      ...logicSchoolObject,
      ...logicPeopleDescriptors,
    },
    correctExamples: [
      'girl reads book with a friend.',
      'boy writes notebook after class.',
      'teacher uses map with a friend.',
      'student carries pencil in the classroom.',
      'friend shares story during practice.',
      'girl writes map after class.',
      'boy reads story with a friend.',
      'teacher carries book in the classroom.',
      'student uses notebook during practice.',
      'friend reads pencil after class.',
    ],
  }),
  levelDef({
    level: 14,
    title: 'Level 14: Pronouns and Agreement',
    vocabularyFocus: ['pronouns', 'agreement'],
    targetGrammarSkill: 'Subject Pronoun + Verb + Descriptor',
    prompt: 'Build a sentence using the correct verb form.',
    displayFrame: '___ ___ ___ .',
    slots: ['subject', 'verb', 'descriptor'],
    nouns: pronounSubjects,
    verbs: personActionVerbsMixedAgreement,
    adjectives: descriptorsCompound,
    logic: logicPeopleDescriptors,
    correctExamples: [
      'he reads with a friend.',
      'she writes with a friend.',
      'they read in the classroom.',
      'he shares during practice.',
      'she carries in the classroom.',
      'they write with a friend.',
      'he uses after class.',
      'she reads in the classroom.',
      'they use during practice.',
      'he writes after class.',
    ],
  }),
  levelDef({
    level: 15,
    title: 'Level 15: Past Tense Introduction',
    vocabularyFocus: ['past tense verbs', 'sequencing'],
    targetGrammarSkill: 'Subject + Past Verb + Object + Sequence Word',
    prompt: 'Build a past-tense sentence.',
    displayFrame: '___ ___ ___ ___ .',
    slots: ['subject', 'verb', 'object', 'descriptor'],
    nouns: [...peopleSubjects, ...schoolObjects],
    verbs: pastTenseVerbs,
    adjectives: descriptorsSequence,
    logic: logicSchoolObject,
    correctExamples: [
      'girl read book first.',
      'boy wrote notebook next.',
      'teacher shared map then.',
      'student read story finally.',
      'friend wrote pencil first.',
      'girl shared book next.',
      'boy read story then.',
      'teacher wrote notebook finally.',
      'student read map first.',
      'friend shared story next.',
    ],
  }),
  levelDef({
    level: 16,
    title: 'Level 16: Mini Paragraph Sentence',
    vocabularyFocus: ['sequence words', 'multi-step detail'],
    targetGrammarSkill: 'Article + Subject + Verb + Object + Sequence Detail',
    prompt: 'Build a sentence that can fit in a short paragraph.',
    displayFrame: '___ ___ ___ ___ ___ .',
    slots: ['article', 'subject', 'verb', 'object', 'descriptor'],
    nouns: [...peopleSubjects, ...schoolObjects],
    verbs: personActionVerbs,
    adjectives: descriptorsSequence,
    articles: [{ id: 'the', text: 'The', category: 'article', role: 'article' }],
    logic: logicSchoolObject,
    correctExamples: [
      'The girl reads book first.',
      'The boy writes notebook next.',
      'The teacher shares map then.',
      'The student carries pencil finally.',
      'The friend reads story first.',
      'The girl writes map next.',
      'The boy reads story then.',
      'The teacher carries book finally.',
      'The student uses notebook first.',
      'The friend shares story next.',
    ],
  }),
  levelDef({
    level: 17,
    title: 'Level 17: Paragraph Sequencing',
    vocabularyFocus: ['sequencing', 'clear order'],
    targetGrammarSkill: 'Subject + Verb + Object + Sequence',
    prompt: 'Build a sentence with strong sequence language.',
    displayFrame: '___ ___ ___ ___ .',
    slots: ['subject', 'verb', 'object', 'descriptor'],
    nouns: [...peopleSubjects, ...schoolObjects],
    verbs: personActionVerbs,
    adjectives: descriptorsSequence,
    logic: logicSchoolObject,
    correctExamples: [
      'girl reads book first.',
      'boy writes notebook next.',
      'teacher shares map then.',
      'student carries pencil finally.',
      'friend uses story first.',
      'girl writes map next.',
      'boy reads story then.',
      'teacher carries book finally.',
      'student uses notebook first.',
      'friend shares story next.',
    ],
  }),
  levelDef({
    level: 18,
    title: 'Level 18: Strong Detail Sentences',
    vocabularyFocus: ['detail language', 'coherence'],
    targetGrammarSkill: 'Subject + Verb + Descriptor (reason/detail)',
    prompt: 'Build a sentence with clear supporting detail.',
    displayFrame: '___ ___ ___ .',
    slots: ['subject', 'verb', 'descriptor'],
    nouns: peopleSubjects,
    verbs: personActionVerbs,
    adjectives: descriptorsParagraph,
    logic: logicPeopleDescriptors,
    correctExamples: [
      'girl reads because it is important.',
      'boy writes to finish the task.',
      'teacher shares for the class project.',
      'student carries with clear details.',
      'friend uses because it is important.',
      'girl writes for the class project.',
      'boy reads with clear details.',
      'teacher carries to finish the task.',
      'student uses because it is important.',
      'friend shares for the class project.',
    ],
  }),
  levelDef({
    level: 19,
    title: 'Level 19: Independent Construction',
    vocabularyFocus: ['sentence variation', 'independent control'],
    targetGrammarSkill: 'Subject + Verb + Object + Rich Detail',
    prompt: 'Build an independent grade-level sentence.',
    displayFrame: '___ ___ ___ ___ .',
    slots: ['subject', 'verb', 'object', 'descriptor'],
    nouns: [...peopleSubjects, ...schoolObjects, ...placeObjects],
    verbs: [...personActionVerbs, ...pastTenseVerbs],
    adjectives: [...descriptorsSequence, ...descriptorsParagraph],
    logic: {
      verbToObject: {
        'school-action': ['school-object', 'place'],
        'travel-action': ['place'],
      },
      ...logicPeopleDescriptors,
    },
    correctExamples: [
      'girl reads library first.',
      'boy writes notebook with clear details.',
      'teacher shared classroom for the class project.',
      'student carries pencil to finish the task.',
      'friend reads story because it is important.',
      'girl wrote map first.',
      'boy reads park next.',
      'teacher carries book with clear details.',
      'student uses classroom for the class project.',
      'friend shared library finally.',
    ],
  }),
  levelDef({
    level: 20,
    title: 'Level 20: Third-Grade Mastery Sentence',
    vocabularyFocus: ['paragraph-ready language', 'independent writing control'],
    targetGrammarSkill: 'Independent sentence construction with sequence + detail',
    prompt: 'Build your strongest sentence.',
    displayFrame: '___ ___ ___ ___ .',
    slots: ['subject', 'verb', 'object', 'descriptor'],
    nouns: [...peopleSubjects, ...schoolObjects, ...placeObjects],
    verbs: [...personActionVerbs, ...pastTenseVerbs],
    adjectives: [...descriptorsCompound, ...descriptorsSequence, ...descriptorsParagraph],
    logic: {
      verbToObject: {
        'school-action': ['school-object', 'place'],
        'travel-action': ['place'],
      },
      ...logicPeopleDescriptors,
    },
    correctExamples: [
      'girl reads library with a friend.',
      'boy writes notebook first.',
      'teacher shared classroom for the class project.',
      'student carries pencil with clear details.',
      'friend reads story because it is important.',
      'girl wrote map then.',
      'boy reads park finally.',
      'teacher carries book in the classroom.',
      'student uses classroom to finish the task.',
      'friend shared library with a friend.',
    ],
  }),
]
