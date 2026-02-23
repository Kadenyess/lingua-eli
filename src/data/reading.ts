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
  },
  // Levels 6-10: Pre-literacy / Basic Literacy
  {
    id: "11",
    title: "Colors All Around",
    titleEs: "Colores Por Todas Partes",
    level: 6,
    content: "I see colors everywhere. The sky is blue. The sun is yellow. The grass is green. The apple is red. The flower is purple. Colors make the world beautiful. I like to color with crayons. I draw a rainbow. Red, orange, yellow, green, blue, purple. Colors are fun!",
    contentEs: "Veo colores por todas partes. El cielo es azul. El sol es amarillo. El césped es verde. La manzana es roja. La flor es morada. Los colores hacen el mundo hermoso. Me gusta colorear con crayones. Dibujo un arcoíris. Rojo, naranja, amarillo, verde, azul, morado. ¡Los colores son divertidos!",
    questions: [
      {
        id: "11a",
        question: "What color is the sky?",
        questionEs: "¿De qué color es el cielo?",
        options: ["Red", "Blue", "Green", "Yellow"],
        correctAnswer: 1
      },
      {
        id: "11b",
        question: "What does the narrator like to do?",
        questionEs: "¿Qué le gusta hacer al narrador?",
        options: ["Play soccer", "Color with crayons", "Read books", "Eat apples"],
        correctAnswer: 1
      },
      {
        id: "11c",
        question: "What makes the world beautiful?",
        questionEs: "¿Qué hace el mundo hermoso?",
        options: ["Animals", "Colors", "Food", "Toys"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "12",
    title: "Counting Fun",
    titleEs: "Diversión Contando",
    level: 7,
    content: "I can count to ten. One, two, three, four, five. Six, seven, eight, nine, ten. I count my fingers. I have ten fingers. I count my toes. I have ten toes. I count my books. I have five books. Counting is fun! I practice every day.",
    contentEs: "Puedo contar hasta diez. Uno, dos, tres, cuatro, cinco. Seis, siete, ocho, nueve, diez. Cuento mis dedos. Tengo diez dedos. Cuento mis dedos de los pies. Tengo diez dedos de los pies. Cuento mis libros. Tengo cinco libros. ¡Contar es divertido! Practico todos los días.",
    questions: [
      {
        id: "12a",
        question: "How many fingers does the narrator have?",
        questionEs: "¿Cuántos dedos tiene el narrador?",
        options: ["Five", "Ten", "Eight", "Twelve"],
        correctAnswer: 1
      },
      {
        id: "12b",
        question: "How many books does the narrator have?",
        questionEs: "¿Cuántos libros tiene el narrador?",
        options: ["Three", "Five", "Seven", "Ten"],
        correctAnswer: 1
      },
      {
        id: "12c",
        question: "What does the narrator practice?",
        questionEs: "¿Qué practica el narrador?",
        options: ["Reading", "Writing", "Counting", "Drawing"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: "13",
    title: "Days of the Week",
    titleEs: "Días de la Semana",
    level: 8,
    content: "There are seven days in a week. Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday. Monday is the first day of school. Friday is the last day of school. Saturday and Sunday are the weekend. I like the weekend. I can play and rest. Every day is special.",
    contentEs: "Hay siete días en una semana. Lunes, martes, miércoles, jueves, viernes, sábado, domingo. Lunes es el primer día de escuela. Viernes es el último día de escuela. Sábado y domingo son el fin de semana. Me gusta el fin de semana. Puedo jugar y descansar. Cada día es especial.",
    questions: [
      {
        id: "13a",
        question: "How many days are in a week?",
        questionEs: "¿Cuántos días hay en una semana?",
        options: ["Five", "Six", "Seven", "Eight"],
        correctAnswer: 2
      },
      {
        id: "13b",
        question: "What is the first day of school?",
        questionEs: "¿Cuál es el primer día de escuela?",
        options: ["Friday", "Monday", "Wednesday", "Sunday"],
        correctAnswer: 1
      },
      {
        id: "13c",
        question: "What days are the weekend?",
        questionEs: "¿Qué días son el fin de semana?",
        options: ["Monday and Tuesday", "Wednesday and Thursday", "Friday and Saturday", "Saturday and Sunday"],
        correctAnswer: 3
      }
    ]
  },
  {
    id: "14",
    title: "My Body",
    titleEs: "Mi Cuerpo",
    level: 9,
    content: "I have a body. I have a head. I have two eyes. I can see with my eyes. I have a nose. I can smell with my nose. I have a mouth. I can eat and talk with my mouth. I have two hands. I can hold things with my hands. I have two feet. I can walk with my feet. My body helps me do many things.",
    contentEs: "Tengo un cuerpo. Tengo una cabeza. Tengo dos ojos. Puedo ver con mis ojos. Tengo una nariz. Puedo oler con mi nariz. Tengo una boca. Puedo comer y hablar con mi boca. Tengo dos manos. Puedo sostener cosas con mis manos. Tengo dos pies. Puedo caminar con mis pies. Mi cuerpo me ayuda a hacer muchas cosas.",
    questions: [
      {
        id: "14a",
        question: "What can the narrator do with eyes?",
        questionEs: "¿Qué puede hacer el narrador con los ojos?",
        options: ["Eat", "See", "Smell", "Walk"],
        correctAnswer: 1
      },
      {
        id: "14b",
        question: "How many hands does the narrator have?",
        questionEs: "¿Cuántas manos tiene el narrador?",
        options: ["One", "Two", "Three", "Four"],
        correctAnswer: 1
      },
      {
        id: "14c",
        question: "What helps the narrator do many things?",
        questionEs: "¿Qué ayuda al narrador a hacer muchas cosas?",
        options: ["Friends", "Toys", "Body", "Books"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: "15",
    title: "Simple Actions",
    titleEs: "Acciones Simples",
    level: 10,
    content: "I can do many things. I can go to school. I can see my friends. I can play games. I can sit in my chair. I can stand up. I can open the door. I can close the window. I can give my friend a pencil. I can take my backpack. I can put my book away. I learn new actions every day.",
    contentEs: "Puedo hacer muchas cosas. Puedo ir a la escuela. Puedo ver a mis amigos. Puedo jugar juegos. Puedo sentarme en mi silla. Puedo pararme. Puedo abrir la puerta. Puedo cerrar la ventana. Puedo darle un lápiz a mi amigo. Puedo tomar mi mochila. Puedo guardar mi libro. Aprendo nuevas acciones todos los días.",
    questions: [
      {
        id: "15a",
        question: "What can the narrator do with a door?",
        questionEs: "¿Qué puede hacer el narrador con una puerta?",
        options: ["Eat it", "Open it", "Color it", "Count it"],
        correctAnswer: 1
      },
      {
        id: "15b",
        question: "What can the narrator give to a friend?",
        questionEs: "¿Qué puede dar el narrador a un amigo?",
        options: ["A door", "A window", "A pencil", "A school"],
        correctAnswer: 2
      },
      {
        id: "15c",
        question: "What does the narrator learn every day?",
        questionEs: "¿Qué aprende el narrador todos los días?",
        options: ["New colors", "New numbers", "New actions", "New friends"],
        correctAnswer: 2
      }
    ]
  },
  // Levels 11-20: Grade 3 Early
  {
    id: "16",
    title: "Fun Activities",
    titleEs: "Actividades Divertidas",
    level: 11,
    content: "I like to do many activities. I read books every day. Reading is fun. I write stories. Writing helps me learn. I draw pictures. Drawing is creative. I color with crayons. I cut paper. I paste pictures. I like to make things. Creating makes me happy. I practice these activities at school and home.",
    contentEs: "Me gusta hacer muchas actividades. Leo libros todos los días. Leer es divertido. Escribo historias. Escribir me ayuda a aprender. Dibujo imágenes. Dibujar es creativo. Coloreo con crayones. Corto papel. Pego imágenes. Me gusta hacer cosas. Crear me hace feliz. Practico estas actividades en la escuela y en casa.",
    questions: [
      {
        id: "16a",
        question: "What does the narrator do every day?",
        questionEs: "¿Qué hace el narrador todos los días?",
        options: ["Draw pictures", "Read books", "Cut paper", "Paste pictures"],
        correctAnswer: 1
      },
      {
        id: "16b",
        question: "What helps the narrator learn?",
        questionEs: "¿Qué ayuda al narrador a aprender?",
        options: ["Drawing", "Writing", "Cutting", "Pasting"],
        correctAnswer: 1
      },
      {
        id: "16c",
        question: "What makes the narrator happy?",
        questionEs: "¿Qué hace feliz al narrador?",
        options: ["Reading", "Writing", "Creating", "Cutting"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: "17",
    title: "How I Feel",
    titleEs: "Cómo Me Siento",
    level: 12,
    content: "I have many feelings. Sometimes I am happy. I smile when I am happy. Sometimes I am sad. I cry when I am sad. Sometimes I am excited. I jump when I am excited. Sometimes I am scared. I hide when I am scared. Sometimes I am tired. I rest when I am tired. Feelings are normal. It is okay to feel different ways.",
    contentEs: "Tengo muchos sentimientos. A veces estoy feliz. Sonrío cuando estoy feliz. A veces estoy triste. Lloro cuando estoy triste. A veces estoy emocionado. Salto cuando estoy emocionado. A veces tengo miedo. Me escondo cuando tengo miedo. A veces estoy cansado. Descanso cuando estoy cansado. Los sentimientos son normales. Está bien sentir de diferentes maneras.",
    questions: [
      {
        id: "17a",
        question: "What does the narrator do when happy?",
        questionEs: "¿Qué hace el narrador cuando está feliz?",
        options: ["Cries", "Smiles", "Hides", "Rests"],
        correctAnswer: 1
      },
      {
        id: "17b",
        question: "What does the narrator do when scared?",
        questionEs: "¿Qué hace el narrador cuando tiene miedo?",
        options: ["Jumps", "Smiles", "Hides", "Cries"],
        correctAnswer: 2
      },
      {
        id: "17c",
        question: "What are feelings?",
        questionEs: "¿Qué son los sentimientos?",
        options: ["Bad", "Normal", "Strange", "Rare"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "18",
    title: "Describing Things",
    titleEs: "Describiendo Cosas",
    level: 13,
    content: "I can describe things. Some things are clean. Some things are dirty. Some things are wet. Some things are dry. Some things are full. Some things are empty. Some things are heavy. Some things are light. Some things are loud. Some things are quiet. I use words to describe what I see. Describing helps me understand the world.",
    contentEs: "Puedo describir cosas. Algunas cosas están limpias. Algunas cosas están sucias. Algunas cosas están mojadas. Algunas cosas están secas. Algunas cosas están llenas. Algunas cosas están vacías. Algunas cosas son pesadas. Algunas cosas son ligeras. Algunas cosas son ruidosas. Algunas cosas son tranquilas. Uso palabras para describir lo que veo. Describir me ayuda a entender el mundo.",
    questions: [
      {
        id: "18a",
        question: "What is the opposite of clean?",
        questionEs: "¿Cuál es el opuesto de limpio?",
        options: ["Wet", "Dry", "Dirty", "Full"],
        correctAnswer: 2
      },
      {
        id: "18b",
        question: "What is the opposite of heavy?",
        questionEs: "¿Cuál es el opuesto de pesado?",
        options: ["Light", "Full", "Loud", "Quiet"],
        correctAnswer: 0
      },
      {
        id: "18c",
        question: "What helps the narrator understand the world?",
        questionEs: "¿Qué ayuda al narrador a entender el mundo?",
        options: ["Reading", "Writing", "Describing", "Playing"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: "19",
    title: "Places at School",
    titleEs: "Lugares en la Escuela",
    level: 14,
    content: "My school has many places. I learn in the classroom. I read books in the library. I eat lunch in the cafeteria. I play on the playground. I exercise in the gym. I visit the office when I need help. I see the nurse when I am sick. I like all the places at school. Each place has a purpose. School is a great place to learn and grow.",
    contentEs: "Mi escuela tiene muchos lugares. Aprendo en el salón de clases. Leo libros en la biblioteca. Como el almuerzo en la cafetería. Juego en el patio de recreo. Hago ejercicio en el gimnasio. Visito la oficina cuando necesito ayuda. Veo a la enfermera cuando estoy enfermo. Me gustan todos los lugares en la escuela. Cada lugar tiene un propósito. La escuela es un gran lugar para aprender y crecer.",
    questions: [
      {
        id: "19a",
        question: "Where does the narrator read books?",
        questionEs: "¿Dónde lee libros el narrador?",
        options: ["Cafeteria", "Library", "Gym", "Office"],
        correctAnswer: 1
      },
      {
        id: "19b",
        question: "Where does the narrator go when sick?",
        questionEs: "¿A dónde va el narrador cuando está enfermo?",
        options: ["Office", "Nurse", "Gym", "Playground"],
        correctAnswer: 1
      },
      {
        id: "19c",
        question: "What does the narrator say about school?",
        questionEs: "¿Qué dice el narrador sobre la escuela?",
        options: ["It is boring", "It is a great place", "It is too big", "It is scary"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "20",
    title: "Weather and Nature",
    titleEs: "Clima y Naturaleza",
    level: 15,
    content: "I observe weather and nature. I see clouds in the sky. When it rains, I see puddles. When it snows, I play outside. The wind blows my hair. After a storm, I see a rainbow. I see grass growing. I see leaves on trees. I see birds flying. I see butterflies. Nature is all around me. I love to observe the world outside.",
    contentEs: "Observo el clima y la naturaleza. Veo nubes en el cielo. Cuando llueve, veo charcos. Cuando nieva, juego afuera. El viento sopla mi cabello. Después de una tormenta, veo un arcoíris. Veo césped creciendo. Veo hojas en los árboles. Veo pájaros volando. Veo mariposas. La naturaleza está a mi alrededor. Me encanta observar el mundo exterior.",
    questions: [
      {
        id: "20a",
        question: "What does the narrator see when it rains?",
        questionEs: "¿Qué ve el narrador cuando llueve?",
        options: ["Snow", "Puddles", "Rainbow", "Butterflies"],
        correctAnswer: 1
      },
      {
        id: "20b",
        question: "What does the narrator see after a storm?",
        questionEs: "¿Qué ve el narrador después de una tormenta?",
        options: ["Clouds", "Rain", "Rainbow", "Wind"],
        correctAnswer: 2
      },
      {
        id: "20c",
        question: "What does the narrator love to do?",
        questionEs: "¿Qué le encanta hacer al narrador?",
        options: ["Play inside", "Observe the world outside", "Stay home", "Watch TV"],
        correctAnswer: 1
      }
    ]
  }
]
