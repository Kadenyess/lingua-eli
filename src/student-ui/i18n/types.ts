export type StudentLang = 'en' | 'es'

export interface StudentDictionary {
  common: {
    dashboard: string
    learningModes: string
    progress: string
    settings: string
    studentLearning: string
    student: string
    profile: string
    backHome: string
    next: string
    open: string
    continue: string
    check: string
    tryAgain: string
    ready: string
    readPage: string
    stop: string
    pause: string
    resume: string
    english: string
    spanish: string
    language: string
  }
  dashboardPage: {
    welcomeEyebrow: string
    welcomeTitle: string
    welcomeShort: string
    startPractice: string
    viewProgress: string
    todayGoalLabel: string
    todayGoalValue: string
    todayGoalNote: string
    nextRecommendationLabel: string
    nextRecommendationValue: string
    nextRecommendationNote: string
    progressOverviewTitle: string
    progressOverviewCaption: string
    learningModesTitle: string
    learningModesCaption: string
    directoryBanner: string
    recentActivityTitle: string
    seeAllActivity: string
    lastCompletedLabel: string
    recentSentenceBuilderTitle: string
    recentSentenceBuilderNote: string
    statCurrentLevel: string
    statWordsUnlocked: string
    statStreak: string
    statCurrentLevelValue: string
    statWordsUnlockedValue: string
    statStreakValue: string
    statCurrentLevelNote: string
    statWordsUnlockedNote: string
    statStreakNote: string
    chipGrammar: string
    chipVocab: string
    chipTimed: string
  }
  shell: {
    dashboardBreadcrumb: string
    learningModeKicker: string
    modeStatusReady: string
    progressLabelDefault: string
    breadcrumbLabel: string
    progressAria: string
  }
  modes: Record<string, {
    title: string
    short: string
    instruction: string
  }>
  simpleMode: {
    activityTitle: string
    selectedAnswer: string
    tapChoicePlaceholder: string
    checkAnswer: string
  }
  modeContent: Record<string, {
    progressLabel: string
    choices: string[]
    feedbackCorrect: string
    feedbackTryAgain: string
  }>
  progressPage: {
    title: string
    short: string
    progressLabel: string
    summaryTitle: string
    modesPracticed: string
    wordsUnlocked: string
    streak: string
    nextLabel: string
  }
  settingsPage: {
    title: string
    short: string
    progressLabel: string
    panelTitle: string
    panelShort: string
    textSizeLarge: string
    languageHelp: string
    highContrastOn: string
    nextLabel: string
  }
  cse: {
    home: string
    sandboxMode: string
    levelOfFive: (level: number) => string
    buildSentencePrompt: string
    frameLabel: string
    sentenceSlotsAria: string
    tapToFill: string
    clearSlot: (slotLabel: string) => string
    tagLabel: string
    checkAnswer: string
    tryAgain: string
    unlockedWords: (count: number) => string
    checks: (count: number) => string
    wordsInOrderPreview: string
    wordBankTitles: {
      article: string
      noun: string
      verb: string
      adjective: string
    }
    slotLabels: Record<string, string>
    feedback: {
      successTitle: string
      successMessage: string
      successHint: string
      missing_component: { title: string; message: string; hint: string }
      word_order: { title: string; message: string; hint: string }
      subject_verb_agreement: { title: string; message: string; hint: string }
      logic_mismatch: { title: string; message: string; hint: string }
    }
  }
  tts: {
    readThis: string
    readCard: string
    readSection: string
    readTitle: string
    readButtons: string
    readFeedback: string
    readModeTile: string
    readStat: string
    readInstruction: string
    readPageAria: string
    stopAria: string
    pauseAria: string
    resumeAria: string
    languageToggle: string
  }
}
