export interface VocabularyWord {
  id: string
  english: string
  spanish: string
  pronunciation: string
  example: string
  category: string
  image?: string
}

export interface VocabularyLevel {
  level: number
  name: string
  nameEs: string
  words: VocabularyWord[]
}

export const vocabularyLevels: VocabularyLevel[] = [
  {
    level: 1,
    name: "Beginner",
    nameEs: "Principiante",
    words: [
      { id: "1", english: "hello", spanish: "hola", pronunciation: "he-LOH", example: "Hello! How are you?", category: "greetings" },
      { id: "2", english: "goodbye", spanish: "adiós", pronunciation: "gud-BAI", example: "Goodbye, see you tomorrow!", category: "greetings" },
      { id: "3", english: "please", spanish: "por favor", pronunciation: "PLIZ", example: "Please, pass the water.", category: "manners" },
      { id: "4", english: "thank you", spanish: "gracias", pronunciation: "THANK yu", example: "Thank you very much!", category: "manners" },
      { id: "5", english: "yes", spanish: "sí", pronunciation: "YES", example: "Yes, I like it.", category: "basics" },
      { id: "6", english: "no", spanish: "no", pronunciation: "NOH", example: "No, thank you.", category: "basics" },
      { id: "7", english: "cat", spanish: "gato", pronunciation: "KAT", example: "The cat is sleeping.", category: "animals" },
      { id: "8", english: "dog", spanish: "perro", pronunciation: "DOG", example: "My dog is friendly.", category: "animals" },
      { id: "9", english: "house", spanish: "casa", pronunciation: "HAWS", example: "This is my house.", category: "home" },
      { id: "10", english: "book", spanish: "libro", pronunciation: "BUK", example: "I read a book every day.", category: "school" },
      { id: "11", english: "school", spanish: "escuela", pronunciation: "SKOOL", example: "I go to school at 8 AM.", category: "school" },
      { id: "12", english: "friend", spanish: "amigo", pronunciation: "FREND", example: "She is my best friend.", category: "people" },
      { id: "13", english: "water", spanish: "agua", pronunciation: "WAH-ter", example: "I drink water every day.", category: "food" },
      { id: "14", english: "food", spanish: "comida", pronunciation: "FOOD", example: "I like healthy food.", category: "food" },
      { id: "15", english: "family", spanish: "familia", pronunciation: "FA-mi-ly", example: "My family is big.", category: "people" },
    ]
  },
  {
    level: 2,
    name: "Grade 3 Level 1",
    nameEs: "3er Grado Nivel 1",
    words: [
      { id: "16", english: "happy", spanish: "feliz", pronunciation: "HA-pi", example: "I am very happy today!", category: "emotions" },
      { id: "17", english: "sad", spanish: "triste", pronunciation: "SAD", example: "The movie made me sad.", category: "emotions" },
      { id: "18", english: "big", spanish: "grande", pronunciation: "BIG", example: "That is a big elephant.", category: "adjectives" },
      { id: "19", english: "small", spanish: "pequeño", pronunciation: "SMOL", example: "The mouse is small.", category: "adjectives" },
      { id: "20", english: "run", spanish: "correr", pronunciation: "RUN", example: "I like to run in the park.", category: "verbs" },
      { id: "21", english: "walk", spanish: "caminar", pronunciation: "WOK", example: "We walk to school.", category: "verbs" },
      { id: "22", english: "eat", spanish: "comer", pronunciation: "EET", example: "I eat breakfast at 7 AM.", category: "verbs" },
      { id: "23", english: "drink", spanish: "beber", pronunciation: "DRINK", example: "Please drink your milk.", category: "verbs" },
      { id: "24", english: "mother", spanish: "madre", pronunciation: "MUH-ther", example: "My mother cooks dinner.", category: "family" },
      { id: "25", english: "father", spanish: "padre", pronunciation: "FA-ther", example: "My father works hard.", category: "family" },
      { id: "26", english: "brother", spanish: "hermano", pronunciation: "BRU-ther", example: "My brother plays soccer.", category: "family" },
      { id: "27", english: "sister", spanish: "hermana", pronunciation: "SIS-ter", example: "My sister reads books.", category: "family" },
      { id: "28", english: "red", spanish: "rojo", pronunciation: "RED", example: "The apple is red.", category: "colors" },
      { id: "29", english: "blue", spanish: "azul", pronunciation: "BLU", example: "The sky is blue.", category: "colors" },
      { id: "30", english: "green", spanish: "verde", pronunciation: "GREEN", example: "The grass is green.", category: "colors" },
    ]
  },
  {
    level: 3,
    name: "Grade 3 Level 2",
    nameEs: "3er Grado Nivel 2",
    words: [
      { id: "31", english: "teacher", spanish: "maestro", pronunciation: "TEE-cher", example: "My teacher is kind.", category: "school" },
      { id: "32", english: "student", spanish: "estudiante", pronunciation: "STU-dent", example: "I am a good student.", category: "school" },
      { id: "33", english: "classroom", spanish: "salón de clase", pronunciation: "KLAS-rum", example: "The classroom is clean.", category: "school" },
      { id: "34", english: "pencil", spanish: "lápiz", pronunciation: "PEN-sil", example: "I need a pencil.", category: "school" },
      { id: "35", english: "paper", spanish: "papel", pronunciation: "PAY-per", example: "Write on the paper.", category: "school" },
      { id: "36", english: "table", spanish: "mesa", pronunciation: "TAY-bul", example: "Put the book on the table.", category: "home" },
      { id: "37", english: "chair", spanish: "silla", pronunciation: "CHAIR", example: "Sit on the chair.", category: "home" },
      { id: "38", english: "bed", spanish: "cama", pronunciation: "BED", example: "I sleep in my bed.", category: "home" },
      { id: "39", english: "window", spanish: "ventana", pronunciation: "WIN-doh", example: "Open the window.", category: "home" },
      { id: "40", english: "door", spanish: "puerta", pronunciation: "DOR", example: "Close the door.", category: "home" },
      { id: "41", english: "sun", spanish: "sol", pronunciation: "SUN", example: "The sun is bright.", category: "nature" },
      { id: "42", english: "moon", spanish: "luna", pronunciation: "MOON", example: "The moon is full tonight.", category: "nature" },
      { id: "43", english: "star", spanish: "estrella", pronunciation: "STAR", example: "Look at the bright star.", category: "nature" },
      { id: "44", english: "tree", spanish: "árbol", pronunciation: "TREE", example: "Climb the tree.", category: "nature" },
      { id: "45", english: "flower", spanish: "flor", pronunciation: "FLOW-er", example: "The flower is beautiful.", category: "nature" },
    ]
  },
  {
    level: 4,
    name: "Grade 4 Level 1",
    nameEs: "4to Grado Nivel 1",
    words: [
      { id: "46", english: "beautiful", spanish: "hermoso", pronunciation: "BYOO-ti-ful", example: "What a beautiful day!", category: "adjectives" },
      { id: "47", english: "interesting", spanish: "interesante", pronunciation: "IN-tres-ting", example: "This book is interesting.", category: "adjectives" },
      { id: "48", english: "difficult", spanish: "difícil", pronunciation: "DI-fi-cult", example: "The test was difficult.", category: "adjectives" },
      { id: "49", english: "important", spanish: "importante", pronunciation: "im-POR-tant", example: "This is very important.", category: "adjectives" },
      { id: "50", english: "different", spanish: "diferente", pronunciation: "DI-fer-ent", example: "We are all different.", category: "adjectives" },
      { id: "51", english: "discover", spanish: "descubrir", pronunciation: "dis-KUH-ver", example: "I want to discover new things.", category: "verbs" },
      { id: "52", english: "imagine", spanish: "imaginar", pronunciation: "i-MA-jin", example: "Imagine you can fly!", category: "verbs" },
      { id: "53", english: "remember", spanish: "recordar", pronunciation: "ri-MEM-ber", example: "Do you remember me?", category: "verbs" },
      { id: "54", english: "practice", spanish: "practicar", pronunciation: "PRAK-tis", example: "Practice makes perfect.", category: "verbs" },
      { id: "55", english: "question", spanish: "pregunta", pronunciation: "KWES-chun", example: "I have a question.", category: "school" },
      { id: "56", english: "answer", spanish: "respuesta", pronunciation: "AN-ser", example: "What is your answer?", category: "school" },
      { id: "57", english: "homework", spanish: "tarea", pronunciation: "HOME-wurk", example: "I finished my homework.", category: "school" },
      { id: "58", english: "subject", spanish: "materia", pronunciation: "SUB-jikt", example: "Math is my favorite subject.", category: "school" },
      { id: "59", english: "science", spanish: "ciencias", pronunciation: "SY-ents", example: "I love learning science.", category: "school" },
      { id: "60", english: "history", spanish: "historia", pronunciation: "HIS-tuh-ree", example: "History is interesting.", category: "school" },
    ]
  },
  {
    level: 5,
    name: "Grade 5 Ready",
    nameEs: "Listo para 5to Grado",
    words: [
      { id: "61", english: "adventure", spanish: "aventura", pronunciation: "ad-VEN-cher", example: "We went on an adventure.", category: "literature" },
      { id: "62", english: "character", spanish: "personaje", pronunciation: "KAR-ik-ter", example: "The main character is brave.", category: "literature" },
      { id: "63", english: "describe", spanish: "describir", pronunciation: "di-SCRIBE", example: "Describe your favorite place.", category: "literature" },
      { id: "64", english: "compare", spanish: "comparar", pronunciation: "kum-PAIR", example: "Compare the two stories.", category: "literature" },
      { id: "65", english: "conclusion", spanish: "conclusión", pronunciation: "kun-KLOO-zhun", example: "What is your conclusion?", category: "literature" },
      { id: "66", english: "evidence", spanish: "evidencia", pronunciation: "EV-i-dens", example: "Show me the evidence.", category: "academic" },
      { id: "67", english: "opinion", spanish: "opinión", pronunciation: "uh-PIN-yun", example: "In my opinion...", category: "academic" },
      { id: "68", english: "paragraph", spanish: "párrafo", pronunciation: "PAR-uh-graf", example: "Write a paragraph.", category: "academic" },
      { id: "69", english: "sentence", spanish: "oración", pronunciation: "SEN-tens", example: "This is a complete sentence.", category: "academic" },
      { id: "70", english: "punctuation", spanish: "puntuación", pronunciation: "punk-choo-AY-shun", example: "Use proper punctuation.", category: "academic" },
      { id: "71", english: "environment", spanish: "medio ambiente", pronunciation: "en-VY-run-ment", example: "Protect the environment.", category: "science" },
      { id: "72", english: "pollution", spanish: "contaminación", pronunciation: "puh-LOO-shun", example: "We must reduce pollution.", category: "science" },
      { id: "73", english: "experiment", spanish: "experimento", pronunciation: "ik-SPER-i-ment", example: "Let's do an experiment.", category: "science" },
      { id: "74", english: "hypothesis", spanish: "hipótesis", pronunciation: "hy-POTH-uh-sis", example: "What is your hypothesis?", category: "science" },
      { id: "75", english: "consequence", spanish: "consecuencia", pronunciation: "KON-si-kwens", example: "Every action has a consequence.", category: "academic" },
    ]
  }
]
