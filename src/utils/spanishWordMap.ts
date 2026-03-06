const phraseMap: Record<string, string> = {
  'Build a sentence.': 'Construye una oración.',
  'Complete the frame.': 'Completa el marco.',
  'Put the words in order.': 'Pon las palabras en orden.',
  'Build a simple sentence.': 'Construye una oración simple.',
  'Build a sentence with an object.': 'Construye una oración con un objeto.',
  'Describe the subject.': 'Describe el sujeto.',
  'Build a detailed sentence.': 'Construye una oración con detalle.',
  'Build a sentence that is grammatical and logical.': 'Construye una oración gramatical y lógica.',
  'Build a sentence with one added compound detail.': 'Construye una oración con un detalle compuesto.',
  'Build a sentence using the correct verb form.': 'Construye una oración con la forma verbal correcta.',
  'Build a past-tense sentence.': 'Construye una oración en pasado.',
  'Build a sentence that can fit in a short paragraph.': 'Construye una oración que encaje en un párrafo corto.',
  'Build a sentence with strong sequence language.': 'Construye una oración con lenguaje de secuencia.',
  'Build a sentence with clear supporting detail.': 'Construye una oración con detalle de apoyo claro.',
  'Build an independent grade-level sentence.': 'Construye una oración independiente de nivel de grado.',
  'Build your strongest sentence.': 'Construye tu mejor oración.',
}

const tokenMap: Record<string, string> = {
  the: 'el',
  a: 'un',
  an: 'un',
  dog: 'perro',
  cat: 'gato',
  bird: 'pájaro',
  fish: 'pez',
  frog: 'rana',
  girl: 'niña',
  boy: 'niño',
  teacher: 'maestra',
  student: 'estudiante',
  friend: 'amigo',
  students: 'estudiantes',
  he: 'él',
  she: 'ella',
  they: 'ellos',
  book: 'libro',
  pencil: 'lápiz',
  notebook: 'cuaderno',
  story: 'cuento',
  map: 'mapa',
  library: 'biblioteca',
  classroom: 'salón',
  park: 'parque',
  paper: 'papel',
  marker: 'marcador',
  apple: 'manzana',
  orange: 'naranja',
  reads: 'lee',
  read: 'leen',
  writes: 'escribe',
  write: 'escriben',
  uses: 'usa',
  use: 'usan',
  shares: 'comparte',
  carries: 'lleva',
  runs: 'corre',
  jumps: 'salta',
  swims: 'nada',
  walks: 'camina',
  is: 'es',
  are: 'son',
  wrote: 'escribió',
  shared: 'compartió',
  visited: 'visitó',
  happy: 'feliz',
  focused: 'enfocado',
  careful: 'cuidadoso',
  ready: 'listo',
  small: 'pequeño',
  fast: 'rápido',
  big: 'grande',
  cute: 'tierno',
  red: 'rojo',
  first: 'primero',
  next: 'luego',
  then: 'después',
  finally: 'finalmente',
}

function translateWordToken(token: string): string {
  const clean = token.replace(/[.,!?]/g, '')
  const lower = clean.toLowerCase()
  const mapped = tokenMap[lower]
  if (!mapped) return token
  const punct = token.slice(clean.length)
  const withCase = clean[0] === clean[0]?.toUpperCase()
    ? mapped.charAt(0).toUpperCase() + mapped.slice(1)
    : mapped
  return `${withCase}${punct}`
}

export function translateToSpanish(text: string): string {
  if (!text.trim()) return text
  const direct = phraseMap[text.trim()]
  if (direct) return direct
  return text.split(/\s+/).map(translateWordToken).join(' ')
}

