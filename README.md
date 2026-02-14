# LinguaELi - Aprende Inglés

An interactive English learning application designed for grade 3 students to progress from zero English literacy to 5th-grade reading level. Features Spanish-to-English translations throughout.

## Features

- **Vocabulary Learning**: 75+ words organized across 5 levels from beginner to grade 5 level
- **Reading Comprehension**: 10 reading passages with multiple-choice questions
- **Spanish Translations**: All content includes Spanish translations
- **Text-to-Speech**: Listen to English words and passages with adjustable speed
- **Sandbox Journal**: Write 2-sentence journal entries with AI feedback
- **Cloud Sync**: Progress syncs across devices with Firebase (optional)
- **Progress Tracking**: Points system, levels, and achievements
- **Gamification**: Earn points, complete levels, unlock achievements

## Grade Progression

- **Level 1 (Beginner)**: Basic greetings, family, animals, colors
- **Level 2 (Grade 3 Level 1)**: Emotions, adjectives, verbs
- **Level 3 (Grade 3 Level 2)**: School, home, nature vocabulary
- **Level 4 (Grade 4 Level 1)**: Complex adjectives, academic vocabulary
- **Level 5 (Grade 5 Ready)**: Literature and science vocabulary

## Technology Stack

- React + TypeScript
- Vite build tool
- Tailwind CSS for styling
- Lucide React for icons
- Web Speech API for text-to-speech
- Firebase Firestore for cloud sync (optional)

## Setup Instructions (Any Platform)

### Prerequisites

- **Node.js 18+** installed on your system
- **npm** (comes with Node.js)

### Quick Start

1. **Navigate to the project**:

**Windows:**
```bash
cd C:\Users\thebe\CascadeProjects\english-learning-app
```

**macOS/Linux:**
```bash
cd ~/english-learning-app
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start the development server**:
```bash
npm run dev
```

4. **Open browser** and go to: `http://localhost:5173`

### Transferring to Another Computer (MacBook)

1. **Copy the entire folder** to your MacBook (USB, cloud, or git)
2. **Open Terminal** on Mac
3. **Navigate to the folder**:
```bash
cd ~/path/to/english-learning-app
```
4. **Run setup**:
```bash
npm install
npm run dev
```

**Important:** Always run `npm install` on the new computer!

### Optional: Enable Cloud Sync (Firebase)

To sync progress across devices:

1. Create a `.env` file in the project root (copy from `.env.example`)
2. Get free Firebase credentials from https://console.firebase.google.com
3. Add your Firebase config values to `.env`
4. Restart the dev server

### Optional: Enable AI Journal Feedback (OpenAI)

For smarter journal feedback:

1. Get API key from https://platform.openai.com
2. Add to `.env`: `VITE_OPENAI_API_KEY=sk-your-key`
3. Restart the dev server

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## Application Structure

```
english-learning-app/
├── src/
│   ├── components/
│   │   ├── WelcomeScreen.tsx      # Landing page
│   │   ├── VocabularyModule.tsx   # Vocabulary learning
│   │   ├── ReadingModule.tsx      # Reading comprehension
│   │   ├── SandboxJournal.tsx     # AI journal writing
│   │   ├── StudentLogin.tsx       # Student authentication
│   │   └── ProgressDashboard.tsx  # Main dashboard
│   ├── data/
│   │   ├── vocabulary.ts          # 75 vocabulary words
│   │   └── reading.ts             # 10 reading passages
│   ├── utils/
│   │   ├── soundEffects.ts        # Audio and TTS
│   │   └── firebase.ts            # Cloud sync (optional)
│   ├── App.tsx                    # Main app component
│   └── main.tsx                   # Entry point
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── index.html
```

## How It Works

1. **Login**: Students create a simple code (e.g., "JUAN2026001") or use existing code
2. **Dashboard**: Shows progress stats, learning modules, and achievements
3. **Vocabulary Module**: Learn words with pronunciation, Spanish translation, and examples
4. **Reading Module**: Read passages with comprehension questions in both English and Spanish
5. **Sandbox Journal**: Write 2 sentences daily and get AI feedback
6. **Points System**: Earn 10 points per vocabulary word, 20 per correct answer, 50 for level completion
7. **Cloud Sync**: Progress automatically syncs if Firebase is configured

## Customization

To add more vocabulary or reading passages:

- Edit `src/data/vocabulary.ts` to add new words
- Edit `src/data/reading.ts` to add new reading passages

## Browser Compatibility

- Chrome/Edge (recommended for best text-to-speech support)
- Firefox
- Safari (macOS - TTS works well on Safari)

## Troubleshooting

### "command not found: npm"
Install Node.js from https://nodejs.org (LTS version)

### Port already in use
Change port: `npm run dev -- --port 3000`

### Dependencies won't install
Delete `node_modules` folder and `package-lock.json`, then run `npm install` again

## License

MIT
"# lingua-eli" 
"# lingua-eli" 
