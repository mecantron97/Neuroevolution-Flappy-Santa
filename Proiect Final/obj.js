//In acest fisier este creata obiectul

// Functia de mutatie
// Ia cel mai bun obiect si ii modifica putin variabilele
function mutate(x) {
  if (random(1) < 0.1) {
    let offset = randomGaussian()* 0.5;
    let newx = x + offset;
    return newx;
  } else {
    return x;
  }
}


class Obj {
  constructor(brain) {
    // pozitia si marimea obiectului
    this.x = 64;
    this.y = height / 2;
    this.r = 30;

    // Atractia g. impulsul(saltul), viteza de pornire
    this.gravity = 0.9;
    this.lift = -12;
    this.velocity = 0;

    // Verifica daca este un obiect nou sau o copie
    // Neural Network e "creierul" obiectului
    if (brain instanceof NeuralNetwork) {
      this.brain = brain.copy();
      this.brain.mutate(mutate);
    } else {
      this.brain = new NeuralNetwork(5, 6, 1);
    }

    // Scorul este egal cu numarul de frames in care joaca obiectul
    this.score = 0;
    // Fitness e versiunea normalizata a scorului
    this.fitness = 0;
    //Dimensiunile imaginii obiectului
    this.width = 150;
    this.height = 75;



  }

  // Creaza o copie a obiectului
  copy() {
    return new Obj(this.brain);
  }

  // Arata obiectul
  show() {
    image(objSprite, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    //image(objSprite,100,250)

  }

  // functia cere decide daca ar trebui sa sara sau nu
  think(pipes) {
    // Prima data cauta cel mai apropiat obstacol
    let closest = null;
    let record = Infinity;
    for (let i = 0; i < pipes.length; i++) {
      let diff = pipes[i].x - this.x;
      if (diff > 0 && diff < record) {
        record = diff;
        closest = pipes[i];
      }
    }

    // In functie de cel mai apropiat obstacol creaza
    // inputurile retelei neuronale
    if (closest != null) {
      // Inputuri
      let inputs = [];
      // Coordonata x a celui mai apropiat obiect  //input 1
      inputs[0] = map(closest.x, this.x, width, 0, 1);
      // Coordonata y a deschiderii obstacolului superior //input 2
      inputs[1] = map(closest.top, 0, height, 0, 1);
      // Coordonata y a deschiderii obstacolului inferior //input 3
      inputs[2] = map(closest.bottom, 0, height, 0, 1);
      // Coordonata y a obiectului  //input 4
      inputs[3] = map(this.y, 0, height, 0, 1);
      // Viteza de avans a obiectului //input 5
      inputs[4] = map(this.velocity, -5, 5, 0, 1);

      // Outputurile Retelei Neuronale
      let action = this.brain.predict(inputs);
      // Decide sa sara sau nu
      if (action[0] > 0.5){ //action[1]) {
        this.up();
      }
    }
  }

  // Functia de a sarii
  up() {
    this.velocity += this.lift;
  }

  bottomTop() {
    // Loveste partea superioara sau inferioara
    return (this.y > height || this.y < 0);
  }

  // Update pozitia obiectului pe baza inputurilor
  update() {
    this.velocity += this.gravity;
    // this.velocity = 0.9;
    this.y += this.velocity;

    // Cu fiecare frame ce este jucat creste scorul
    this.score++;
  }
}
