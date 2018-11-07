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
    this.keyCodes = {
      left: 37,
      up: 38,
      right: 39,
      down: 40
    }
    this.usedEnemies = [];
    this.usableEnemies = [];
    this.powerUpList = [];
    this.keys = [];
    this.factorMovimiento = 8;
    this.start = false;
    this.deleteIntervals();
    this.intervals = [];
    this.enemy = "";
    this.score = 0;
    this.enemyCount = 0;
    this.powerUpCount = 0;
    this.powerUp = "";
    this.volume = false; //True IF is being modified
    this.music = new Audio("audio/music.mp3");
    this.music.volume = 0;
    this.music.loop = true;
  }

  setEvents() {
    let thisClass = this;

    $(document).on("keydown", function(e) {
      e.preventDefault();
      if (thisClass.start) {
        thisClass.keys[e.keyCode] = true;

        let el = document.getElementById("spaceship");
        if (el) {
          let elem = el.classList;
          if (thisClass.keys[thisClass.keyCodes.left]) {
            if (elem.contains("right")) {

              elem.remove("right");
            }
            if (elem.contains("left")) {
              elem.remove("left");
            }
            elem.add("left");
          }
          else if (thisClass.keys[thisClass.keyCodes.right]) {
            if (elem.contains("right")) {
              elem.remove("right");
            }
            if (elem.contains("left")) {
              elem.remove("left");
            }
            elem.add("right");
          }
        }
      }
    });

    document.addEventListener("keyup", function (e) {
      if (thisClass.start) {
        thisClass.keys[e.keyCode] = false;

        let el = document.getElementById("spaceship");
        if (el) {
          let elem = el.classList;
          if (thisClass.start) {
            if (elem.contains("right")) {
              elem.remove("right");
            }
            if (elem.contains("left")) {
              elem.remove("left");
            }
          }
        }
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

  deleteEvents() {
    $(document).unbind("keydown");
    $(document).unbind("keyup");
    $("#volume").unbind();
  }

  startGame() {
    this.clear();
    document.getElementById("game").classList.add("gameStarted");
    this.start = true;
    this.update();
    this.music.play();
    let thisClass = this;

    document.getElementById("spaceship").addEventListener("animationend", () => {
      let elem = document.getElementById("spaceship").classList;
      if (elem.contains("explosion")) {
        setTimeout(function () {
          thisClass.clear();
          let derrota = "<h1 id='gameOver' class='gameOver'>Perdiste</h1>";
          $("#game").append(derrota);
        }, 100);
      }
    });
  }

  clear() {
    let gameOver = document.getElementById("gameOver");
    if (gameOver) {
      gameOver.remove();
    }
    this.start = false;
    this.usedEnemies = [];
    this.usableEnemies = [];
    this.powerUpList = [];
    this.keys = [];
    this.enemy = "";
    this.score = 0;
    this.enemyCount = 0;
    this.powerUpCount = 0;
    this.powerUp = "";
    document.getElementById("score").innerHTML = 0;
    document.getElementById("game").classList.remove("gameStarted");
    this.deleteEvents();
    this.setEvents();
    this.deleteIntervals();

    $("#spaceship").remove();
    $("div").remove(".enemy");
    $("div").remove(".powerUp");
    this.music.pause();
    this.music.currentTime = 0;

    this.spaceship = new gameObject({
      player: "spaceship",
      w: 60,
      h: 90,
      num: 0,
      htmlDOM: '<div id="spaceship" class="spaceship"></div>'
    });
    this.intervals = [];

  }

  deleteIntervals() {
    if (this.intervals) {
      for (let i = 0; i < this.intervals.length; i++) {
        clearInterval(this.intervals[i]);
      }
    }
  }

  setVolume(value) {
    this.music.volume = (value/100);
  }

  detectCollision(object) {
    let playerData = this.spaceship.calculatePos();
    let lista = ""

    if (object == "enemy") {
      lista = this.usedEnemies;
    }
    else {
      lista = this.powerUpList;
    }

    let gameObject = "";
    let objectId = "";

    for (var i = 0; i < lista.length; i++) {
      objectId = lista[i].id;
      gameObject = document.getElementById(object + objectId);
      if (gameObject) {
        let rect = gameObject.getBoundingClientRect();

        let gameObjectData = {
          top: rect.top,
          bottom: rect.bottom,
          left: rect.left,
          right: rect.right
        }

        let cond1 = this.between(playerData.left, playerData.right, gameObjectData.left, gameObjectData.right);
        let cond2 = this.between(playerData.top, playerData.bottom, gameObjectData.top, gameObjectData.bottom);
        let middle = this.calculateMiddle(playerData.left, playerData.right);
        let cond3 = this.between(middle, middle, gameObjectData.left, gameObjectData.right);

        if ((cond1 && cond2) || (cond2 && cond3)) {
          if (object == "powerUp") {
            this.powerUp = object + objectId;
          }
          else {
            this.enemy = object + objectId;
          }
          return true;
        }
      }
    }

    return false;
  }

  //Checks IF val1 OR val2 are between min and max
  between(val1, val2, min, max) {
    return (min <= val1 && val1 <= max) || (min <= val2 && val2 <= max);
  }

  calculateMiddle(left, right) {
    return left + (right - left) / 2;
  }

  gameOver() {
    this.deleteIntervals();
    this.start = false;
    this.setHighScore();
    this.deleteEvents();
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

  generatePowerUp() {
    let id = this.powerUpCount;
    this.powerUpCount++;
    let powerUp = new gameObject({
      player: "powerUp",
      w: 54,
      h: 76,
      num: id,
      htmlDOM: '<div class="powerUp" id="powerUp' + id + '"></div>'
    });
    return powerUp;
  }

  update() {
    let thisClass = this;
    let elem = document.getElementById("game");
    elem.innerHTML += this.spaceship.element;
    this.spaceship.setPos("250px", "40px");

    let interval1 = setInterval(function () {
      if (!thisClass.start) {
        clearInterval(interval1);
      }
      let elem = document.getElementById("spaceship").style;
      let posX = parseInt(elem.left, 10);
      let posY = parseInt(elem.bottom, 10);

      if (thisClass.powerUp != "") {
        let elemDiv = document.getElementById(thisClass.powerUp);
        if (elemDiv) {
          let rect = elemDiv.getBoundingClientRect();
          let elemPU = elemDiv.style;
          let posYPU = parseInt(rect.bottom, 10);
          elemPU.bottom = posYPU + "px";
        }
      }

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

      let result = thisClass.detectCollision("enemy");
      if (result) {
        thisClass.spaceship.setAnimation("explosion");
        let animationPause = "animationPause";
        document.getElementById(thisClass.enemy).classList.add(animationPause);
        thisClass.deleteEvents();
        thisClass.deleteIntervals();
        $(spaceship).on("animationend", function () {
          thisClass.gameOver();
        });
      }


      if (thisClass.randomBetween(0, 100) <= 1) {     //Spawn rate
        let enemy = "";

        if (thisClass.usableEnemies.length == 0) {
          enemy = thisClass.generateEnemy();
        }
        else {
          enemy = thisClass.usableEnemies.shift();
        }

        $("#game").append(enemy.element);
        let posX = thisClass.randomBetween(0, 580);
        enemy.setPos(posX + "px", "400px");
        thisClass.usedEnemies.unshift(enemy);

        let enemyId = "#enemy" + enemy.id;

        $(enemyId).on("animationend", function () {
          enemy.animatedEnd = true;
          let index = thisClass.usedEnemies.indexOf(enemy);
          if (index > -1) {
            let e = thisClass.usedEnemies.splice(index, 1)[0];
            thisClass.usableEnemies.unshift(e);
          }
          this.remove();
          if (thisClass.start) {
            thisClass.score += 100;
            document.getElementById("score").innerHTML = thisClass.score;
          }
        });

        let animation = "dropObject1";
        enemy.setAnimationObject(animation, "enemy");
        if (thisClass.usedEnemies.includes(enemy)) {
          document.getElementById("enemy"+enemy.id).classList.add(animation);
        }

      }

      if (thisClass.randomBetween(0, 1000) <= 1) {     //Spawn rate
        let powerUp = "";
        powerUp = thisClass.generatePowerUp();

        $("#game").append(powerUp.element);
        let posX = thisClass.randomBetween(0, 580);
        powerUp.setPos(posX + "px", "400px");

        let powerUpId = "#powerUp" + powerUp.id;

        thisClass.powerUpList.unshift(powerUp);

        let animation = "dropObject1";
        powerUp.setAnimationObject(animation, "powerUp");
        document.getElementById("powerUp"+powerUp.id).classList.add(animation);


        $(powerUpId).on("animationend", function () {
          powerUp.animatedEnd = true;
          this.remove();
          thisClass.powerUp = "";
        });
      }

      if (thisClass.detectCollision("powerUp")) {
        let powerUp = thisClass.powerUp;
        let powerUpObject = "";
        for (var i = 0; i < thisClass.powerUpList.length; i++) {
          if (("powerUp" + thisClass.powerUpList[i].id) == powerUp) {
            powerUpObject = thisClass.powerUpList[i];
            break;
          }
        }
        if (!powerUpObject.powerUp) {
          thisClass.score += 500;
          document.getElementById("score").innerHTML = thisClass.score;
          thisClass.setVelocidad(10);
          setTimeout(function() {
            thisClass.setVelocidad(8);
          }, 3000);
          setTimeout(function() {
            let animation = "reward";
            powerUpObject.setAnimationObject(animation, "powerUp");
            document.getElementById("powerUp"+powerUpObject.id).classList.add(animation);
            setTimeout(function() {
              thisClass.powerUp = "";
            }, 20);
          }, 100);
          powerUpObject.powerUp = true;
        }
      }
    }, 20);

    this.intervals.unshift(interval1);
  }

  remove(objectId) {
    var element = document.getElementById(objectId);
    element.parentNode.removeChild(element);
  }

  setVelocidad(num) {
    this.factorMovimiento = num;
  }

  randomBetween(min, max) {
    return parseInt(Math.random() * (max - min) + min);
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
