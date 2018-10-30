"use strict";

class gameObject {
  constructor(args = {}) {
    this.player = args.player;
    this.width = args.w;
    this.height = args.h;
    this.element = args.htmlDOM;
    this.id = args.num;
    this.top = 0;
    this.bottom = 0;
    this.left = 0;
    this.right = 0;
    this.animatedEnd = false;
    this.interval = [];
  }

  calculatePos() {
    let rect;
    if (this.player == "spaceship") {
      rect = document.getElementById("spaceship").getBoundingClientRect();
    }
    else if(this.player == "enemy") {
      let id = "enemy" + this.id;
      let elem = document.getElementById(id);
      if(elem) {
        rect = elem.getBoundingClientRect();
      }
    }

    if (rect) {
      this.top = rect.top;
      this.bottom = rect.bottom;
      this.left = rect.left;
      this.right = rect.right;
    }
  }

  setPos(x, y) {
    let css = document.getElementById(this.player).style;
    css.left = x;
    css.bottom = y;
  }

  setPosEnemy(x, y) {
    let id = this.player + this.id;
    let css = document.getElementById(id).style;
    css.left = x;
    css.bottom = y;
  }

  setAnimation(animation) {
    let elem = document.getElementById(this.player);
    elem.classList.add(animation);
  }

  setAnimationEnemy(animation) {
    let id = "enemy" + this.id;
    let elem = document.getElementById(id);
    elem.classList.add(animation);
  }
}
