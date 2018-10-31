"use strict";

document.getElementById("startGame").addEventListener("click", function () {
  let game = new Game();
  game.startGame();
});

class Game {

  constructor(args = {}) {
    this.spaceship = new gameObject({
      player: "spaceship",
      w: 68,
      h: 80,
      num: 0,
      htmlDOM: '<div id="spaceship" class="spaceship"></div>'
    });
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
    this.setEvents();
    this.enemyCount = 0;
    this.volume = false; //True IF is being modified
    this.music = new Audio("audio/music.mp3");
    this.music.volume = 0.2;
    this.music.loop = true;
  }

  setEvents() {
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

    document.getElementById("volume").addEventListener("mousemove", function(event) {
      if (this.volume) {
        var value = event.target.value;
        thisClass.setVolume(value);
      }
    })

    document.getElementById("volume").addEventListener("mousedown", function(event) {
      this.volume = true;
    })

    document.getElementById("volume").addEventListener("mouseup", function(event) {
      this.volume = false;
    })
  }

  startGame() {
    this.clear();
    document.getElementById("game").classList.add("gameStarted");
    this.start = true;
    this.startPlayer();
    this.spawnEnemy();
    this.music.play();

    document.getElementById("spaceship").addEventListener("animationend", () => {
      let elem = document.getElementById("spaceship").classList;
      if (elem.contains("explosion")) {
        this.clear();
        let derrota = "<h1 id='gameOver' class='gameOver'>Perdiste</h1>";
        $("#game").append(derrota);
      }
    });
  }

  clear() {
    let gameOver = document.getElementById("gameOver");
    if (gameOver) {
      gameOver.remove();
    }
    this.start = false;
    this.keys = [];
    this.score = 0;
    this.enemyCount = 0;
    document.getElementById("score").innerHTML = 0;
    document.getElementById("game").classList.remove("gameStarted");

    $("#spaceship").remove();
    $(".enemy").remove();
    this.music.pause();
    this.music.currentTime = 0;

    this.spaceship = new gameObject({
      player: "spaceship",
      w: 60,
      h: 90,
      num: 0,
      htmlDOM: '<div id="spaceship" class="spaceship"></div>'
    });

    for (let i = 0; i < this.intervals.length; i++) {
      clearInterval(this.intervals[i]);
    }
    this.intervals = [];
  }

  setVolume(value) {
    this.music.volume = (value/100);
  }

  detectCollision(enemy) {
    let playerData = this.spaceship.calculatePos();
    let rect = enemy.getBoundingClientRect();

    let enemyData = {
      top: rect.top,
      bottom: rect.bottom,
      left: rect.left,
      right: rect.right
    }

    let cond1 = this.between(playerData.left, playerData.right, enemyData.left, enemyData.right);
    let cond2 = this.between(playerData.top, playerData.bottom, enemyData.top, enemyData.bottom);


    if (cond1 && cond2) {
      return true;
    }

    return false;
  }

  //Checks IF val1 OR val2 are between min and max
  between(val1, val2, min, max) {
    return (min <= val1 && val1 <= max) || (min <= val2 && val2 <= max);
  }

  gameOver() {
    this.start = false;
    this.spaceship.setAnimation("explosion");
    this.setHighScore();
    // this.explosion.play();
  }

  setHighScore() {
    let highScore = document.getElementById("highScore");
    if (highScore.innerHTML < this.score) {
      highScore.innerHTML = this.score;
    }
  }


  generateEnemy() {
    let id = this.enemyCount;
    this.enemyCount++;
    let enemy = new gameObject({
      player: "enemy",
      w: 54,
      h: 76,
      num: id,
      htmlDOM: '<div class="enemy" id="enemy' + id + '"></div>'
    });
    return enemy;
  }

  spawnEnemy() {
    if (this.start) {
      let thisClass = this;
      let interval1 = setInterval(function () {
        if (!thisClass.start) {
          clearInterval(interval1);
        }
        let enemy = thisClass.generateEnemy();
        $("#game").append(enemy.element);
        let posX = thisClass.randomBetween(0, 580);
        enemy.setPos(posX + "px", "400px");

        // let n = thisClass.randomBetween(1, 3);
        // let animation = "dropEnemy" + n;
        let animation = "dropEnemy1";
        enemy.setAnimationEnemy(animation, "enemy");

        let enemyId = "#enemy" + enemy.id;

        $(enemyId).on("animationstart", function () {
          let interval2 = setInterval(() => {
            if (!thisClass.start) {
              clearInterval(interval2);
            }
            if (thisClass.start) {
              let result = thisClass.detectCollision(this);
              if (result) {
                thisClass.gameOver();
              }
            }
          }, 20);

          thisClass.intervals.unshift(interval2);
        });

        $(enemyId).on("animationend", function () {
          enemy.animatedEnd = true;
          this.remove();
          if (thisClass.start) {
            thisClass.score += 100;
            document.getElementById("score").innerHTML = thisClass.score;
          }

        });

      }, 5000);
      // }, thisClass.randomBetween(1000, 3000));

      this.intervals.unshift(interval1);
    }
  }

  randomBetween(min, max) {
    return parseInt(Math.random() * (max - min) + min);
  }

  startPlayer() {
    if (this.start) {
      let elem = document.getElementById("game");
      elem.innerHTML += this.spaceship.element;
      this.spaceship.setPos("250px", "40px");
    }

    let thisClass = this;

    let interval3 = setInterval(function () {
      if (!thisClass.start) {
        clearInterval(interval3);
      }
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
    }, 20);

    this.intervals.unshift(interval3);
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
    if (posY > 8) {
      posY -= factorMovimiento;
      elem.bottom = posY + "px";
    }
  }

}
