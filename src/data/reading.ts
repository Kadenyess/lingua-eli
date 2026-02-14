export interface ReadingQuestion {
  id: string
  question: string
  questionEs: string
  options: string[]
  correctAnswer: number
}

export interface ReadingPassage {
  id: string
  title: string
  titleEs: string
  level: number
  content: string
  contentEs: string
  questions: ReadingQuestion[]
}

export const readingPassages: ReadingPassage[] = [
  {
    id: "1",
    title: "My Family",
    titleEs: "Mi Familia",
    level: 1,
    content: "I have a big family. My mother is kind. My father is strong. I have one brother and one sister. My brother likes to play soccer. My sister likes to read books. We eat dinner together every night. I love my family very much.",
    contentEs: "Tengo una familia grande. Mi madre es amable. Mi padre es fuerte. Tengo un hermano y una hermana. A mi hermano le gusta jugar fútbol. A mi hermana le gusta leer libros. Cenamos juntos todas las noches. Quiero mucho a mi familia.",
    questions: [
      {
        id: "1a",
        question: "What does the brother like to do?",
        questionEs: "¿Qué le gusta hacer al hermano?",
        options: ["Read books", "Play soccer", "Cook dinner", "Sleep"],
        correctAnswer: 1
      },
      {
        id: "1b",
        question: "How many siblings does the narrator have?",
        questionEs: "¿Cuántos hermanos tiene el narrador?",
        options: ["None", "One", "Two", "Three"],
        correctAnswer: 2
      },
      {
        id: "1c",
        question: "When does the family eat together?",
        questionEs: "¿Cuándo come la familia juntos?",
        options: ["Every morning", "Every afternoon", "Every night", "On weekends"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: "2",
    title: "My Pet Dog",
    titleEs: "Mi Perro Mascota",
    level: 1,
    content: "I have a pet dog. His name is Max. Max is brown and white. He has a long tail. Max likes to run in the park. He likes to chase balls. Every morning, I take Max for a walk. He is my best friend. I love Max very much.",
    contentEs: "Tengo un perro mascota. Su nombre es Max. Max es marrón y blanco. Tiene una cola larga. A Max le gusta correr en el parque. Le gusta perseguir pelotas. Cada mañana, saco a Max a pasear. Él es mi mejor amigo. Quiero mucho a Max.",
    questions: [
      {
        id: "2a",
        question: "What is the dog's name?",
        questionEs: "¿Cuál es el nombre del perro?",
        options: ["Rex", "Max", "Buddy", "Charlie"],
        correctAnswer: 1
      },
      {
        id: "2b",
        question: "What colors is Max?",
        questionEs: "¿De qué colores es Max?",
        options: ["Black and white", "Brown and white", "All brown", "All white"],
        correctAnswer: 1
      },
      {
        id: "2c",
        question: "When does the narrator take Max for a walk?",
        questionEs: "¿Cuándo saca el narrador a Max a pasear?",
        options: ["Every morning", "Every afternoon", "Every evening", "Every night"],
        correctAnswer: 0
      }
    ]
  },
  {
    id: "3",
    title: "At School",
    titleEs: "En la Escuela",
    level: 2,
    content: "I go to school every day. My school is big and clean. I have many friends at school. My favorite subject is math. My teacher explains everything clearly. We learn new things every day. At lunch, I eat in the cafeteria. After school, I play with my friends. School is fun and interesting.",
    contentEs: "Voy a la escuela todos los días. Mi escuela es grande y limpia. Tengo muchos amigos en la escuela. Mi materia favorita es matemáticas. Mi maestro explica todo claramente. Aprendemos cosas nuevas todos los días. En el almuerzo, como en la cafetería. Después de la escuela, juego con mis amigos. La escuela es divertida e interesante.",
    questions: [
      {
        id: "3a",
        question: "What is the narrator's favorite subject?",
        questionEs: "¿Cuál es la materia favorita del narrador?",
        options: ["Science", "English", "Math", "History"],
        correctAnswer: 2
      },
      {
        id: "3b",
        question: "Where does the narrator eat lunch?",
        questionEs: "¿Dónde almuerza el narrador?",
        options: ["At home", "In the classroom", "In the cafeteria", "Outside"],
        correctAnswer: 2
      },
      {
        id: "3c",
        question: "What does the teacher do?",
        questionEs: "¿Qué hace el maestro?",
        options: ["Plays games", "Explains clearly", "Cooks food", "Cleans the room"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "4",
    title: "A Day at the Park",
    titleEs: "Un Día en el Parque",
    level: 2,
    content: "Yesterday, I went to the park with my family. The sun was bright and warm. We brought a picnic basket with sandwiches and fruit. My sister flew a kite. It went very high in the sky. I played on the swings and slides. We saw many birds and squirrels. In the evening, we watched the sunset. It was a perfect day together.",
    contentEs: "Ayer, fui al parque con mi familia. El sol brillaba y hacía calor. Trajimos una canasta de picnic con sándwiches y fruta. Mi hermana voló una cometa. Subió muy alto en el cielo. Jugué en los columpios y los toboganes. Vimos muchos pájaros y ardillas. En la tarde, vimos la puesta de sol. Fue un día perfecto juntos.",
    questions: [
      {
        id: "4a",
        question: "What did the sister do at the park?",
        questionEs: "¿Qué hizo la hermana en el parque?",
        options: ["Played on swings", "Flew a kite", "Ate sandwiches", "Watched birds"],
        correctAnswer: 1
      },
      {
        id: "4b",
        question: "What was in the picnic basket?",
        questionEs: "¿Qué había en la canasta de picnic?",
        options: ["Pizza and soda", "Sandwiches and fruit", "Cake and cookies", "Chips and dip"],
        correctAnswer: 1
      },
      {
        id: "4c",
        question: "When did they watch the sunset?",
        questionEs: "¿Cuándo vieron la puesta de sol?",
        options: ["In the morning", "At noon", "In the afternoon", "In the evening"],
        correctAnswer: 3
      }
    ]
  },
  {
    id: "5",
    title: "My Favorite Season",
    titleEs: "Mi Estación Favorita",
    level: 3,
    content: "My favorite season is autumn. The weather becomes cool and comfortable. The leaves on the trees change colors. They turn red, orange, and yellow. I love to walk on the crunchy leaves. In autumn, we celebrate Halloween and Thanksgiving. My family goes apple picking. We make delicious apple pies. Autumn is beautiful and full of fun activities.",
    contentEs: "Mi estación favorita es el otoño. El clima se vuelve fresco y cómodo. Las hojas de los árboles cambian de color. Se vuelven rojas, naranjas y amarillas. Me encanta caminar sobre las hojas crujientes. En otoño, celebramos Halloween y el Día de Acción de Gracias. Mi familia va a recoger manzanas. Hacemos pasteles de manzana deliciosos. El otoño es hermoso y lleno de actividades divertidas.",
    questions: [
      {
        id: "5a",
        question: "What colors do the leaves turn in autumn?",
        questionEs: "¿A qué colores se vuelven las hojas en otoño?",
        options: ["Red, orange, and yellow", "Green and blue", "Pink and purple", "Brown and gray"],
        correctAnswer: 0
      },
      {
        id: "5b",
        question: "What does the family do in autumn?",
        questionEs: "¿Qué hace la familia en otoño?",
        options: ["Go swimming", "Go apple picking", "Build snowmen", "Plant flowers"],
        correctAnswer: 1
      },
      {
        id: "5c",
        question: "Why does the narrator like autumn?",
        questionEs: "¿Por qué le gusta el otoño al narrador?",
        options: ["It's very hot", "It's beautiful and fun", "There are no activities", "The leaves stay green"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "6",
    title: "Learning to Ride a Bike",
    titleEs: "Aprendiendo a Montar Bicicleta",
    level: 3,
    content: "Last summer, I learned to ride a bicycle. At first, I was scared. My father helped me. He held the back of the bike. I practiced every day. Sometimes I fell down, but I got up again. Slowly, I became more confident. Now I can ride without help. I ride to my friend's house. I feel proud of myself. Learning new things takes practice and patience.",
    contentEs: "El verano pasado, aprendí a montar bicicleta. Al principio, tenía miedo. Mi padre me ayudó. Sostenía la parte trasera de la bicicleta. Practiqué todos los días. A veces me caí, pero me levanté de nuevo. Lentamente, me volví más confiado. Ahora puedo montar sin ayuda. Voy a casa de mi amigo en bicicleta. Me siento orgulloso de mí mismo. Aprender cosas nuevas requiere práctica y paciencia.",
    questions: [
      {
        id: "6a",
        question: "Who helped the narrator learn to ride?",
        questionEs: "¿Quién ayudó al narrador a aprender a montar?",
        options: ["Mother", "Friend", "Father", "Teacher"],
        correctAnswer: 2
      },
      {
        id: "6b",
        question: "How did the narrator feel at first?",
        questionEs: "¿Cómo se sintió el narrador al principio?",
        options: ["Excited", "Confident", "Scared", "Happy"],
        correctAnswer: 2
      },
      {
        id: "6c",
        question: "What does learning new things take?",
        questionEs: "¿Qué se necesita para aprender cosas nuevas?",
        options: ["Money and time", "Practice and patience", "Help from friends", "Special equipment"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "7",
    title: "The Science Project",
    titleEs: "El Proyecto de Ciencias",
    level: 4,
    content: "For my science project, I decided to study plants. I wanted to find out what plants need to grow well. I set up an experiment with three plants. One plant got sunlight and water. Another got only sunlight. The third got only water. After two weeks, the plant with both sunlight and water grew the tallest. The others were small and weak. This taught me that plants need both sunlight and water to be healthy. I got an A on my project!",
    contentEs: "Para mi proyecto de ciencias, decidí estudiar plantas. Quería averiguar qué necesitan las plantas para crecer bien. Monté un experimento con tres plantas. Una planta recibió luz solar y agua. Otra recibió solo luz solar. La tercera recibió solo agua. Después de dos semanas, la planta con luz solar y agua creció más alta. Las otras eran pequeñas y débiles. Esto me enseñó que las plantas necesitan tanto luz solar como agua para estar saludables. ¡Saqué una A en mi proyecto!",
    questions: [
      {
        id: "7a",
        question: "How many plants were in the experiment?",
        questionEs: "¿Cuántas plantas había en el experimento?",
        options: ["Two", "Three", "Four", "Five"],
        correctAnswer: 1
      },
      {
        id: "7b",
        question: "Which plant grew the tallest?",
        questionEs: "¿Qué planta creció más alta?",
        options: ["The one with only water", "The one with only sunlight", "The one with both", "None of them grew"],
        correctAnswer: 2
      },
      {
        id: "7c",
        question: "What grade did the narrator get?",
        questionEs: "¿Qué calificación obtuvo el narrador?",
        options: ["B", "A", "C", "D"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "8",
    title: "A Trip to the Museum",
    titleEs: "Un Viaje al Museo",
    level: 4,
    content: "Our class visited the natural history museum. We saw dinosaur skeletons that were millions of years old. The guide explained how fossils are formed. We learned about different ecosystems around the world. My favorite exhibit was the rainforest section. It had real plants and recorded animal sounds. We also saw a planetarium show about the solar system. The trip helped me understand why it's important to protect our environment. I want to be a scientist when I grow up.",
    contentEs: "Nuestra clase visitó el museo de historia natural. Vimos esqueletos de dinosaurios que tenían millones de años. La guía explicó cómo se forman los fósiles. Aprendimos sobre diferentes ecosistemas alrededor del mundo. Mi exhibición favorita fue la sección de la selva tropical. Tenía plantas reales y sonidos grabados de animales. También vimos un show de planetario sobre el sistema solar. El viaje me ayudó a entender por qué es importante proteger nuestro medio ambiente. Quiero ser científico cuando crezca.",
    questions: [
      {
        id: "8a",
        question: "What kind of museum did they visit?",
        questionEs: "¿Qué tipo de museo visitaron?",
        options: ["Art museum", "Science museum", "Natural history museum", "Children's museum"],
        correctAnswer: 2
      },
      {
        id: "8b",
        question: "What was the narrator's favorite exhibit?",
        questionEs: "¿Cuál fue la exhibición favorita del narrador?",
        options: ["Dinosaur skeletons", "The rainforest section", "The planetarium", "Fossils display"],
        correctAnswer: 1
      },
      {
        id: "8c",
        question: "What does the narrator want to be?",
        questionEs: "¿Qué quiere ser el narrador?",
        options: ["A teacher", "A guide", "A scientist", "An artist"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: "9",
    title: "The Community Garden",
    titleEs: "El Jardín Comunitario",
    level: 5,
    content: "Our neighborhood started a community garden last spring. Different families adopted separate plots to grow vegetables and flowers. My family chose to grow tomatoes, peppers, and herbs. We learned about soil preparation, proper watering techniques, and natural pest control. Working together taught us about cooperation and responsibility. Every weekend, neighbors share gardening tips and extra produce. The garden has become a place where friendships grow alongside the plants. This experience shows how communities can work together to create something beautiful and useful.",
    contentEs: "Nuestro vecindario comenzó un jardín comunitario la primavera pasada. Diferentes familias adoptaron parcelas separadas para cultivar vegetales y flores. Mi familia eligió cultivar tomates, pimientos y hierbas. Aprendimos sobre preparación del suelo, técnicas adecuadas de riego y control natural de plagas. Trabajar juntos nos enseñó sobre cooperación y responsabilidad. Cada fin de semana, los vecinos comparten consejos de jardinería y productos extra. El jardín se ha convertido en un lugar donde las amistades crecen junto con las plantas. Esta experiencia muestra cómo las comunidades pueden trabajar juntas para crear algo hermoso y útil.",
    questions: [
      {
        id: "9a",
        question: "What did the families adopt in the garden?",
        questionEs: "¿Qué adoptaron las familias en el jardín?",
        options: ["Tools", "Separate plots", "Seeds", "Books"],
        correctAnswer: 1
      },
      {
        id: "9b",
        question: "What did the narrator's family choose to grow?",
        questionEs: "¿Qué eligió cultivar la familia del narrador?",
        options: ["Flowers only", "Tomatoes, peppers, and herbs", "Fruit trees", "Only vegetables"],
        correctAnswer: 1
      },
      {
        id: "9c",
        question: "What does the experience show?",
        questionEs: "¿Qué muestra la experiencia?",
        options: ["Gardening is easy", "Communities can work together", "Plants grow fast", "Farming is hard work"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "10",
    title: "The Importance of Reading",
    titleEs: "La Importancia de Leer",
    level: 5,
    content: "Reading is one of the most valuable skills a person can develop. When we read, we explore new worlds, learn about different cultures, and expand our vocabulary. Good readers become good writers because they understand how stories are structured. Reading also improves our ability to concentrate and think critically. Studies have shown that children who read regularly perform better in all subjects at school. Whether you prefer fiction, non-fiction, or poetry, the key is to read every day. Building a reading habit now will benefit you throughout your entire life. Libraries and bookstores are treasure troves waiting to be discovered.",
    contentEs: "Leer es una de las habilidades más valiosas que una persona puede desarrollar. Cuando leemos, exploramos nuevos mundos, aprendemos sobre diferentes culturas y expandimos nuestro vocabulario. Los buenos lectores se convierten en buenos escritores porque entienden cómo se estructuran las historias. Leer también mejora nuestra capacidad de concentrarnos y pensar críticamente. Estudios han demostrado que los niños que leen regularmente se desempeñan mejor en todas las materias en la escuela. Ya sea que prefieras ficción, no ficción o poesía, la clave es leer todos los días. Construir un hábito de lectura ahora te beneficiará durante toda tu vida. Las bibliotecas y librerías son tesoros esperando ser descubiertos.",
    questions: [
      {
        id: "10a",
        question: "What do good readers become?",
        questionEs: "¿En qué se convierten los buenos lectores?",
        options: ["Good speakers", "Good writers", "Good artists", "Good athletes"],
        correctAnswer: 1
      },
      {
        id: "10b",
        question: "What improves when we read regularly?",
        questionEs: "¿Qué mejora cuando leemos regularmente?",
        options: ["Only writing skills", "Only speaking skills", "Performance in all subjects", "Only math skills"],
        correctAnswer: 2
      },
      {
        id: "10c",
        question: "What are libraries and bookstores described as?",
        questionEs: "¿Cómo se describen las bibliotecas y librerías?",
        options: ["Boring places", "Expensive stores", "Treasure troves", "Difficult to find"],
        correctAnswer: 2
      }
    ]
  }
]
