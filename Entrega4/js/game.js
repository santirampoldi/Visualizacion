"use strict";

document.getElementById("startGame").addEventListener("click", function () {
  let game = new Game();
  game.startGame();
});

class Game {

  constructor(args = {}) {
    this.spaceship = new gameObject({
      player: "spaceship",
      w: 70,
      h: 90,
      num: 0,
      htmlDOM: '<div id="spaceship" class="spaceship"></div>'
    });
    this.enemiesQueue = [];
    this.spawnedEnemiesQueue = [];
    this.factorMovimiento = 8;
    this.keyCodes = {
      left: 37,
      up: 38,
      right: 39,
      down: 40
    }
    this.keys = [];
    this.start = false;
    this.intervals = [];
    this.score = 0;
    this.setControls();
    this.level = 0;
  }

  setControls() {
    let thisClass = this;

    document.addEventListener("keydown", function (e) {
      if (thisClass.start) {
        thisClass.keys[e.keyCode] = true;
      }
    });

    document.addEventListener("keyup", function (e) {
      if (thisClass.start) {
        thisClass.keys[e.keyCode] = false;
      }
    });
  }

  startGame() {
    this.clear();
    document.getElementById("game").classList.add("gameStarted");
    this.start = true;
    this.spawnPlayer();
    this.spawnEnemy();
    this.startFlight();

    document.getElementById("spaceship").addEventListener("animationend", () => {
      let elem = document.getElementById("spaceship").classList;
      if (elem.contains("explosion")) {
        this.cleanGame();
        let perdiste = "<h1 id='gameOver' class='gameOver'>Game Over!!</h1>";
        $("#game").append(perdiste);
      }
    });
  }

  spawnEnemy() {

  }

  clear() {
    let gameOver = document.getElementById("gameOver");
    if (gameOver) {
      gameOver.remove();
    }
    this.start = false;
    this.keys = [];
    this.score = 0;
    document.getElementById("score").innerHTML = 0;
    document.getElementById("game").classList.remove("gameStarted");

    $("#spaceship").remove();
    $(".enemy").remove();

    this.spaceship = new gameObject({
      player: "spaceship",
      w: 60,
      h: 90,
      num: 0,
      htmlDOM: '<div id="spaceship" class="spaceship"></div>'
    });

    for (let i = 0; i < this.enemiesQueue.length; i++) {
      let aux = this.enemiesQueue.remove();
      aux.animatedEnd = true;
      clearInterval(aux.interval[0]);
    }

    for (let i = 0; i < this.spawnedEnemiesQueue.length; i++) {
      let aux = this.spawnedEnemiesQueue.remove();
      aux.animatedEnd = true;
      clearInterval(aux.interval[0]);
    }

    this.enemiesQueue = [];
    this.spawnedEnemiesQueue = [];

    if (this.intervals.length > 0) {
      for (let i = 0; i < this.intervals.length; i++) {
        clearInterval(this.intervals[i]);
      }
    }
    this.intervals = [];
  }

  detectCollision() {

  }

  gameOver() {
    if (this.start) {
      let gameOver = false;;
      if (document.getElementById("spaceship") && !this.spawnedEnemiesQueue.length == 0) {
        gameOver = this.detectCollision();
      }

      if (gameOver) {
        this.spaceship.setAnimation("explosion");
        this.calculateHighScore();
      }
    }
  }

  spawnPlayer() {
    if (this.start) {
      let elem = document.getElementById("game");
      elem.innerHTML += this.spaceship.element;
      this.spaceship.setPos("250px", "40px");
    }
  }

  generateEnemy() {
    let enemy = new gameObject({
      player: "enemy",
      w: 98,
      h: 100,
      num: n,
      htmlDOM: '<div class="enemy" id="enemy' + n + '"></div>'
    });
    return enemy;
  }

  startFlight() {
    let thisClass = this;

    this.intervals[1] = setInterval(function () {
      let elem = document.getElementById("spaceship").style;
      let posX = parseInt(elem.left, 10);
      let posY = parseInt(elem.bottom, 10);

      if (thisClass.keys[thisClass.keyCodes.left]) {
        thisClass.moveLeft(elem, posX, thisClass.factorMovimiento);
      }
      else if (thisClass.keys[thisClass.keyCodes.right]) {
        thisClass.moveRight(elem, posX, thisClass.factorMovimiento);
      }

      if (thisClass.keys[thisClass.keyCodes.up]) {
        thisClass.moveUp(elem, posY, thisClass.factorMovimiento);
      }
      else if (thisClass.keys[thisClass.keyCodes.down]) {
        thisClass.moveDown(elem, posY, thisClass.factorMovimiento);
      }

      thisClass.gameOver();

      if (!thisClass.start) {
        clearInterval(this.intervals[1]);
      }
    }, 20);
  }

  moveLeft(elem, posX, factorMovimiento) {
    if (posX > 8) {
      posX -= factorMovimiento;
      elem.left = posX + "px";
    }
  }

  moveRight(elem, posX, factorMovimiento) {
    if (posX < 640 - this.spaceship.width - 16) {
      posX += factorMovimiento;
      elem.left = posX + "px";
    }
  }

  moveUp(elem, posY, factorMovimiento) {
    if (posY < 530 - this.spaceship.height - 8) {
      posY += factorMovimiento;
      elem.bottom = posY + "px";
    }
  }

  moveDown(elem, posY, factorMovimiento) {
    if (posY > 5) {
      posY -= factorMovimiento;
      elem.bottom = posY + "px";
    }
  }

}

// Update() {
// Ver input y actualizar posicion
// Actualizar obstaculos con animacion o con top+1
// Chequear en un bombing box
// player.class = playerExplotado
// if (game.isNotOver()) {
//  SetTimeOut(Update, 1000/25)
// }
// }
// Llamar al update de todos los gameObject
