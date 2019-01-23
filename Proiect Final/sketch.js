// In 'sketch.js' se imbina toate elenentele si
// functiile scrise in celelalte fisiere pentru
// crearea aplicatiei propriu zise
// Fisiere atasate:
          //'obj.js'
          //'pipe.js'
          //'genetic_alg.js'
          //'index.html'
          //'libraries.dir'
          //'graphics.dir'





//Elemente legate de populatie
//cat de mare e populatia de obiecte
let totalPopulation = 50;
//populatia activa (care nu s-a ciocnit cu obstacolele)
let activeObj = [];
//toate obiectele dintr-o populatie
let allObj = [];
//obstacolele
let pipes = [];
//framecounter pentru a determina cand se adauga un nou set de obstacolele
let counter = 0;
//variabila folosita la deplasara background-ului
var bgX = 1000;


// Elementele din interfata
let speedSlider;
let speedSpan;
let highScoreSpan;
let allTimeHighScoreSpan;
let population;
let gen = 1;
let highScore = 0;
// Butonul de antrenament/arata cel mai bun
let runBest = false;
let runBestButton;

//Declaram variabile pentru stocarea
//imaginilor folosite pentru animatii ***OPTIONAL***
//var iconPipe;
//var pipeEnd;
//var objSprite;
//var bgImg;

//Functie folosita la incarcarea imaginilor
function preload() {
  iconPipe = loadImage('graphics/pipe.png');
  pipeEnd = loadImage('graphics/pipe_end.png');
  objSprite = loadImage('graphics/santa.png');
  bgImg = loadImage('graphics/background.png');
}

//Functie care se executa o singura data
function setup() {
  //Crearea spatiului de lucru
  let canvas = createCanvas(1000, 500);
  //Animatia apare deasupra butoanelor
  canvas.parent('canvascontainer');

  //Legatura cu elementele din interfata creata in .html
  speedSlider = select('#speedSlider');
  speedSpan = select('#speed');
  highScoreSpan = select('#hs');
  allTimeHighScoreSpan = select('#ahs');
  runBestButton = select('#best');
  runBestButton.mousePressed(toggleState);
  generation = select('#g');
  population = select('#p');

    // Cream populatia de obiecte
  for (let i = 0; i < totalPopulation; i++) {
    let obj = new Obj();
    activeObj[i] = obj;
    allObj[i] = obj;
  }
}

// Schimba intre antrenare si cel mai bun obiect
function toggleState() {
  runBest = !runBest;
  // Arata cel mai bun obiect
  if (runBest) {
    resetGame();
    runBestButton.html('continue training');
    // Antreneaza in continuare
  } else {
    nextGeneration();
    runBestButton.html('run best');
  }
}

// Functia care misca fundalul de la dreapta la stanga
function draw() {
  // Strat negru peste care afisam animatiile
  background(0);
  // Viteza cu care se misca fundalul
  bgX = bgX - 5;
  //bgX = 1000(=latime canvas si jumatate din imagine folosita ca fundal)
  if (bgX <= 0) {
    bgX = width;
  }
  image(bgImg, bgX - width, 0);

  // Marire viteza de antrenare
  let cycles = speedSlider.value();
  speedSpan.html(cycles);

  // De cate ori sa se avanseze in joc
  for (let n = 0; n < cycles; n++) {
    // Arata pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();
      // Sterge cate un pipe din memorie cand iese de pe ecren
      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
      }
    }
    // Ruleaza cel mai bun obiect
    if (runBest) {
      bestObj.think(pipes);
      bestObj.update();
      for (let j = 0; j < pipes.length; j++) {
        // Porneste de la inceput cand este lovit un pipe
        if (pipes[j].hits(bestObj)) {
          resetGame();
          break;
        }
      }
      //Cand se loveste de partea de sus sau jos, porneste de la inceput
      if (bestObj.bottomTop()) {
        resetGame();
      }
      // Sau ruleaza toate obiectele
    } else {
      for (let i = activeObj.length - 1; i >= 0; i--) {
        let obj = activeObj[i];
        // Obiectul gandeste
        obj.think(pipes);
        obj.update();

        // Varifica obstacolele
        for (let j = 0; j < pipes.length; j++) {
          // Daca este lovit vreo unul
          if (pipes[j].hits(activeObj[i])) {
            // Inlatura obiectul cu pricina
            activeObj.splice(i, 1);
            break;
          }
        }
        //Inlatura-l si daca loveste partea superioara sau inferioara
        if (obj.bottomTop()) {
          activeObj.splice(i, 1);
        }

      }
    }

    // Adauga o noua pereche de obstacole la fiecare ... frames
    if (counter % 75 == 0) {
      pipes.push(new Pipe());
    }
    counter++;
  }

  // HighScore temporar, al populatiei actuale
  let tempHighScore = 0;
  // Daca antrenam si nu rulam cel mai bun obiect
  if (!runBest) {
    // Cauta cel mai bun obiect
    let tempBestBird = null;
    for (let i = 0; i < activeObj.length; i++) {
      let s = activeObj[i].score;
      if (s > tempHighScore) {
        tempHighScore = s;
        tempBestObj = activeObj[i];
      }
    }

    // HighScore-ul temporar este cel mai mare de pana acum?
    if (tempHighScore > highScore) {
      highScore = tempHighScore;
      bestObj = tempBestObj;
    }
    //Daca se ruleaza cel mai bun obiect
  } else {
    // Doar un obiect, cel mai bun de pana acum
    // Din nou verifica si corecteaza scorul
    tempHighScore = bestObj.score;
    if (tempHighScore > highScore) {
      highScore = tempHighScore;
    }
  }

  // Rescrie valorile din interfata
  highScoreSpan.html(tempHighScore);
  allTimeHighScoreSpan.html(highScore);
  generation.html(gen);
  population.html(totalPopulation);


  // Desenam
  // Sunt folosie functii explicate in celelalte fisiere
  for (let i = 0; i < pipes.length; i++) {
    pipes[i].show();
  }

  if (runBest) {
    bestObj.show();
  } else {
    for (let i = 0; i < activeObj.length; i++) {
      activeObj[i].show();
    }
    // Se trece la urmatoarea generatie daca nu mai sunt obiecte
    if (activeObj.length == 0) {
      nextGeneration();
    }
  }
}
