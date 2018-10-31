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
    let data = {};

    let elem = document.getElementById(this.player);
    if(elem) {
      rect = elem.getBoundingClientRect();

      data.top = rect.top;
      data.bottom = rect.bottom;
      data.left = rect.left;
      data.right = rect.right;
    }

    return data;
  }

  setPos(x, y) {
    let id = this.player;
    if (this.player == "enemy") {
      id += this.id;
    }
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
