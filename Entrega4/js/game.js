"use strict";

document.getElementById("startGame").addEventListener("click", function () {
  let game = new Game();
  game.startGame();
});

class Game {

  constructor(args = {}) {
    this.spaceship = new gameObject({
      player: "spaceship",
      w: 55,
      h: 95,
      num: 0,
      htmlDOM: '<div id="spaceship" class="spaceship"></div>'
    });
    this.enemyQueue = [];
    this.spawnedEnemiesQueue = [];
    // this.music = new Audio("audio/bgMusic.mp3");
    // this.music.volume = 0.5;
    // this.music.loop = true;
    // this.width = 640;
    // this.height = 530;
    this.keyCodes = {
      left: 37,
      up: 38,
      right: 39,
      down: 40
    }
    this.keys = [];
    this.start = false;
    this.enemyCount = 0;
    this.intervals = [];
    this.score = 0;
    this.setControlsEvents();
    this.level = 0;
  }

  setControlsEvents() {
    let thisClass = this;

    document.addEventListener("keydown", function (e) {
      console.log(e.keyCode);
      if (thisClass.start) {
        thisClass.keys[e.keyCode] = true;
      }
    });

    document.addEventListener("keyup", function (e) {
      console.log(e.keyCode);
      if (thisClass.start) {
        thisClass.keys[e.keyCode] = false;
      }
    });

    // document.getElementById("down").addEventListener("click", () => {
    //   this.setVolume("down");
    // });
    //
    // document.getElementById("up").addEventListener("click", () => {
    //   this.setVolume("up");
    // });
  }
}

// SetTimeOut(Update, 1000/25);
// var id = SetInterval(Update, 1000/25);
// Update() {
// Ver input y actualizar posicion
// Actualizar obstaculos con animacion o con top+1
// Chequear en un bombing box
// player.class = playerExplotado
// if (game.isNotOver()) {
//  SetTimeOut(Update, 1000/25)
// }
// }
// gameOver() {
//  clearInterval(id);
// }
//
// Llamar al update de todos los gameObject
// Objetos de clase gameObject
//
