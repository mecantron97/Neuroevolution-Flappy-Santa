//In acest fisier sunt create obstacolele

class Pipe {
  constructor() {

    // Cat de mare este spatiul liber dintre obstacole
    let spacing = 175;
    // Centrul spatiului liber
    let centery = random(spacing, height - spacing);

    // Obstacolul superior
    this.top = centery - spacing / 2;
    // Obstacolul inferior
    this.bottom = height - (centery + spacing / 2);
    // Coordonata x a obstacoleor
    this.x = width;
    // Latimea obstacolelor
    this.w = 60;
    // Viteza de deplasare
    this.speed = 6;


  }

  // Verifica daca s-a lovit vreun obiect
  hits(obj) {
    if ((obj.y - obj.r) < this.top || (obj.y + obj.r) > (height - this.bottom)) {
      if (obj.x > this.x && obj.x < this.x + this.w) {
        return true;
      }
    }
    return false;
  }

  // Deseneaza obstacolele
  show() {
    // Imaginea pentru obstacolul superior
    image(iconPipe, this.x, 0, this.w, this.top);
    image(pipeEnd, this.x, this.top-50);
    // Imaginea pentru obstacolul inferior
    image(iconPipe, this.x, height - this.bottom, this.w, height);
    image(pipeEnd, this.x, height - this.bottom);
  }

  // Coordonata x a bostacolelor scade cu viteza de deplasare a acestore
  update() {
    this.x -= this.speed;
  }

  // Verifica daca obstacolul a iesit la stanga ecranului
  offscreen() {
    if (this.x < -this.w) {
      return true;
    } else {
      return false;
    }
  }
}
