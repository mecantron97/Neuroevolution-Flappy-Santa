// In acest fisier se creaza noua generatie de obiecte

// Functia care porneste jocul din nou
// de fiecare data cand nu mai sunt obiecte
function resetGame() {
  counter = 0;
  // Reseteaza scorul propriu al obiectului la 0
  if (bestObj) {
    bestObj.score = 0;
  }
  pipes = [];
  // La fiecare reset de joc, generatia se incrementeaza cu 1
  gen = gen+1;
}

// Creaza urmatoarea generatie
function nextGeneration() {
  // Reseteaza jocul
  resetGame();
  // Normalizeaza importanta obiectelor
  normalizeFitness(allObj);
  // Genereaza un nou set de obiecte
  activeObj = generate(allObj);
  // Copiaza obiectele generate intr-un nou array, cel activ
  allObj = activeObj.slice();
}

// Genereaza noua populatie de obiecte
function generate(oldObj) {
  let newObj = [];
  for (let i = 0; i < oldObj.length; i++) {
    // Selecteaza un obiect, din ultima populatie trecuta, pe baza importantei
    let obj = poolSelection(oldObj);
    newObj[i] = obj;
  }
  return newObj;
}

// Functia de normalizare a importantei
function normalizeFitness(obj) {
  // Ridicam toate scorurile la puterea 2
  for (let i = 0; i < obj.length; i++) {
    obj[i].score = pow(obj[i].score, 2);
  }

  // Aduna toate scorurile
  let sum = 0;
  for (let i = 0; i < obj.length; i++) {
    sum += obj[i].score;
  }
  // Imparte
  for (let i = 0; i < obj.length; i++) {
    obj[i].fitness = obj[i].score / sum;
  }
}


// Functie pentru alegerea unui obiect din array pe baza importantei
function poolSelection(obj) {
  // Incepe la 0
  let index = 0;

  // Alege un numar aleator intre 0 si 1
  let r = random(1);

  // Se tot extrage din numarul aleator generat pana se obtine mai putin de 0
  while (r > 0) {
    r -= obj[index].fitness;
    // Si mergi la urmatorul
    index += 1;
  }

  // Mergi inapoi cu 1
  index -= 1;
  // Este o copie
  // (include mutatia)
  return obj[index].copy();
}
