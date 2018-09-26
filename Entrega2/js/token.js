class Token {

  constructor(args = {}) {
    this.radius = 30;
    this.X = args.posX + this.radius;
    this.Y = args.posY + this.radius;
    this.id = args.id;
    this.src = args.src;
    this.played = false;
    this.dragging = false;
  }

  getData() {
    return {'X':this.X - this.radius, 'Y':this.Y - this.radius, 'radius':this.radius, 'id':this.id, 'src':this.src, 'played':this.played, 'dragging':this.dragging};
  }

  play() {
    this.played = true;
    this.dragging = false;
  }

  undo() { this.played = false; }

  clicked(mouseX, mouseY) {
    let x = (mouseX - this.X);
    let y = (mouseY - this.Y);
    return Math.sqrt(x*x + y*y) < this.radius;
  }
}
