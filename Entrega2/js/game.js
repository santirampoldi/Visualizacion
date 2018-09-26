class Game {
  constructor(args = {}) {
    this.player1 = args.player1;
    this.player2 = args.player2;
    this.playerOnTurn = args.player1;
    this.board = this.generateBoard();
    this.gameOver = false;
    this.img = new Image();
  }

  setPlayers(name1, name2) {
    this.player1.setName(name1);
    this.player2.setName(name2);
    this.showPlayersNames();
  }

  gameOver() { return this.gameOver; }

  getPlayer(player) { return player == 1 ? this.player1 : this.player2; }

  getPlayerOnTurn() { return this.playerOnTurn; }

  showPlayersNames() {
    document.getElementById("player1").innerHTML = this.player1.getData().name;
    document.getElementById("player2").innerHTML = this.player2.getData().name;
  }

  start() {
    this.reset();
    this.player1.switchOnTurn();
  }

  reset() {
    let canvas = document.getElementById('canvas');
    canvas.style.cursor = 'url("images/cursor.png") 20 0, default';
    this.img.src = canvas.toDataURL();
    this.showPlayersNames();
    this.gameOver = false;
    this.drawBoard();
    this.board = this.generateBoard();
    this.player1.reset();
    this.player2.reset();
    this.prepareTokens(canvas, 1);
    this.prepareTokens(canvas, 2);
    this.player1.switchOnTurn();
    this.playerOnTurn = this.player1;
    this.showPlayerOnTurn();
  }

  generateBoard() {
    let matrix = [
      [{x:372, y:117, token:0},{x:431, y:117, token:0},{x:489, y:117, token:0},{x:548, y:117, token:0},{x:607, y:117, token:0},{x:665, y:117, token:0},{x:724, y:117, token:0}],
      [{x:372, y:176, token:0},{x:431, y:176, token:0},{x:489, y:176, token:0},{x:548, y:176, token:0},{x:607, y:176, token:0},{x:665, y:176, token:0},{x:724, y:176, token:0}],
      [{x:372, y:235, token:0},{x:431, y:235, token:0},{x:489, y:235, token:0},{x:548, y:235, token:0},{x:607, y:235, token:0},{x:665, y:235, token:0},{x:724, y:235, token:0}],
      [{x:372, y:294, token:0},{x:431, y:294, token:0},{x:489, y:294, token:0},{x:548, y:294, token:0},{x:607, y:294, token:0},{x:665, y:294, token:0},{x:724, y:294, token:0}],
      [{x:372, y:352, token:0},{x:431, y:352, token:0},{x:489, y:352, token:0},{x:548, y:352, token:0},{x:607, y:352, token:0},{x:665, y:352, token:0},{x:724, y:352, token:0}],
      [{x:372, y:411, token:0},{x:431, y:411, token:0},{x:489, y:411, token:0},{x:548, y:411, token:0},{x:607, y:411, token:0},{x:665, y:411, token:0},{x:724, y:411, token:0}],
    ];
    return matrix;
  }

  prepareTokens(canvas, player) {
    let width = canvas.width / 4;
    let x = player == 1 ? 0 : canvas.width - width;
    for (let i = 0; i < 7; i++) {
      let posY = this.calculateTokenPosY(canvas, i);

      for (let j = 0; j < 3; j++) {
        let posX = this.calculateTokenPosX(canvas, player, j);
        let token = this.createToken(posX, posY, player);
        this.giveToken(token, player);
        this.drawToken(token.getData());
      }
    }
  }

  calculateTokenPosX(canvas, player, axisX) {
    let x = axisX % 3;
    let result;
    for (var i = 0; i < 3; i++) {
      if (i == x) {
        result = 8 + 90 * i;
      }
    }
    let marginLeft = canvas.width / 4 * 3;

    return player == 1 ?  result : marginLeft + result;
  }

  calculateTokenPosY(canvas, axisY) {
    let y = axisY % 7;
    for (var i = 1; i <= 7; i++) {
      if (i-1 == y) {
        return canvas.height - 60 * i;
      }
    }
  }

  createToken(posX, posY, player) {
    let src = player == 1 ? "images/blueToken.png" : "images/redToken.png";
    let args = {
      'posX': posX,
      'posY': posY,
      'id': player,
      'src': src
    }

    return new Token(args);
  }

  giveToken(token, player) {
    player == 1 ? this.player1.addToken(token) : this.player2.addToken(token);
  }

  selectToken(event) {
    let mouseX = event.layerX - event.currentTarget.offsetLeft;
    let mouseY = event.layerY - event.currentTarget.offsetTop;
    let token = this.playerOnTurn.getTokenClicked(mouseX, mouseY);

    if(token) {
      token.dragging = true;
      let dato = token.getData();
      this.eraseToken(dato);
      this.playerOnTurn.selectedToken = token;
    }
  }

  playToken(event) {
    let token = this.playerOnTurn.getSelectedToken();

    if(token) {
      if(this.isValidPlay(event, token)) {
        let posToken = this.playerOnTurn.getPlayedPosition(event, token, this.board);
        this.putToken(token, posToken);
        token.play();
        this.switchPlayerOnTurn();
        this.showPlayerOnTurn();
        let result = this.checkMove(token, posToken);
        this.isGameOver(result);
      }
      else {
        token.undo();
        this.returnToken(token);
      }
      let canvas = document.getElementById('canvas');
      canvas.style.cursor = 'url("images/cursor.png") 20 0, default';
    }
  }

  returnToken(token) {
    token.dragging = false;
    this.playerOnTurn.addToken(token);
    this.reDrawToken(token.getData());
    this.playerOnTurn.selectedToken = -1;
  }

  putToken(token, pos) {
    let boardPos = this.board[pos.y][pos.x];
    let id = token.getData().id;
    let radius = token.getData().radius;
    let x = boardPos.x - radius;
    let y = boardPos.y - (radius + 1);
    boardPos.token = token;
    let auxToken = this.createToken(x-1, y-1, id);
    this.reDrawToken(auxToken.getData());
  }

  switchPlayerOnTurn() {
    this.playerOnTurn.switchOnTurn();
    this.playerOnTurn.getData().id == 1 ? this.playerOnTurn = this.player2 : this.playerOnTurn = this.player1;
    this.playerOnTurn.switchOnTurn();
  }

  showPlayerOnTurn() {
    let player1 = document.getElementById("player1");
    let player2 = document.getElementById("player2");
    if(this.playerOnTurn.getData().id == 1) {
      player2.classList.remove("onTurn");
      player1.classList.add("onTurn");
    }
    else {
      player1.classList.remove("onTurn");
      player2.classList.add("onTurn");
    }
  }

  isGameOver(result) {
    let emptyTokens = (this.player1.getTokens().length == 0 && this.player2.getTokens().length == 0);
    if(emptyTokens || result.gameOver) {
      if(emptyTokens) {
        document.getElementById("matchResult").innerHTML = "<h1>" + winnerPlayer + 'DRAW' + "</h1>";
      }
      else {
        let winnerPlayer = result.player == 1 ? this.player1.getData().name : this.player2.getData().name;
        document.getElementById("matchResult").innerHTML = "<h1>" + winnerPlayer + ' WINS' + "</h1>";
      }
      this.gameOver = true;
      let thisObj = this;
      setTimeout(function() {
        document.getElementById("matchResult").innerHTML = '';
        thisObj.start(); }, 5000);
      }
    }

    isValidPlay(event, token) {
      let mouseX = event.layerX - event.currentTarget.offsetLeft;
      let mouseY = event.layerY - event.currentTarget.offsetTop;

      let canvas = document.getElementById('canvas');
      let radius = token.getData().radius;
      let marginLeft = canvas.width / 4 + 4;
      let marginRight = canvas.width - marginLeft;
      let marginTop = 100;

      let posToken = this.playerOnTurn.getPlayedPosition(event, token, this.board);

      return (this.between(mouseX, marginLeft, marginRight) && this.between(mouseY, 0, marginTop) && (posToken.x != -1) && (posToken.y != -1));
    }

    checkMove(token, posToken) {
      let result = this.checkHorizontal(token, posToken);
      if(!result.gameOver) {
        result = this.checkVertical(token, posToken);
        if(!result.gameOver) {
          result = this.checkDiagonals(token, posToken);
        }
      }
      return result;
    }

    checkHorizontal(token, posToken) {
      let xAux = posToken.x;
      let count = 0;
      let row = this.board[posToken.y];
      for (var i = 0; i < row.length; i++) {
        if (row[i].token != 0 && row[i].token.id == token.id) {
          count++;
        }
        else {
          count = 0;
        }
        if (count == 4) {
          return {gameOver:true, player:token.id};
        }
      }
      return {gameOver:false};
    }

    checkVertical(token, posToken) {
      let yAux = posToken.y;
      let count = 0;
      let col = posToken.x;
      for (var i = 0; i < 6; i++) {
        if (this.board[i][col].token != 0 && this.board[i][col].token.id == token.id) {
          count++;
        }
        else {
          count = 0;
        }
        if (count == 4) {
          return {gameOver:true, player:token.id};
        }
      }
      return {gameOver:false};
    }

    checkDiagonals(token, posTokenPlayed){
      let result = this.checkMainDiagonal(token, posTokenPlayed);
      if(!result.gameOver){
        result = this.checkSecondaryDiagonal(token, posTokenPlayed);
      }
      return result;
    }

    checkMainDiagonal(token, posToken) {
      let count = 1;

      if((posToken.y <= 2 && posToken.x <= 3 + posToken.y) || (posToken.y >= 3 && posToken.x > 0 + posToken.y % 3)) {
        let auxX = posToken.x;
        let auxY = posToken.y;
        while(this.isOnBoard(auxX-1, auxY-1) && (this.board[auxY-1][auxX-1].token.id == token.id)) {
          count++;
          auxX--;
          auxY--;
        }
        auxX = posToken.x;
        auxY = posToken.y;
        while(this.isOnBoard(auxX+1, auxY+1) && (this.board[auxY+1][auxX+1].token.id == token.id)) {
          count++;
          auxX++;
          auxY++;
        }
      }
      return this.isFourInARow(count) ? {gameOver:true, player:token.id} : {gameOver:false};
    }

    checkSecondaryDiagonal(token, posToken) {
      let count = 1;

      if((posToken.y <= 2 && posToken.x >= (3 - posToken.y)) || (posToken.y >= 3 && posToken.x < ((this.board.length) - (posToken.y % 3)))) {
        let auxX = posToken.x;
        let auxY = posToken.y;
        while(this.isOnBoard(auxX+1, auxY-1) && (this.board[auxY-1][auxX+1].token.id == token.id)) {
          count++;
          auxX++;
          auxY--;
        }
        auxX = posToken.x;
        auxY = posToken.y;
        while(this.isOnBoard(auxX-1, auxY+1) && (this.board[auxY+1][auxX-1].token.id == token.id)) {
          count++;
          auxX--;
          auxY++;
        }
      }
      return this.isFourInARow(count) ? {gameOver:true, player:token.id} : {gameOver:false};
    }

    isFourInARow(c) {
      if(c >= 4) { return true; }
      else { return false; }
    }

    drawBoard() {
      let canvas = document.getElementById('canvas');
      let ctx = canvas.getContext('2d');
      let img = new Image();
      img.src = "images/board.png";
      img.onload = function() {
        let posX = (canvas.width / 3.23);
        let posY = canvas.height - img.height;
        ctx.clearRect(posX, posY, img.width, img.height);
        ctx.drawImage(this, posX, posY);
      }
    }

    drawToken(token) {
      let ctx = document.getElementById('canvas').getContext('2d');
      let img = new Image();
      img.src = token.src;
      img.onload = function() {
        ctx.drawImage(img, token.X, token.Y);
      }
    }

    reDrawToken(token) {
      let canvas = document.getElementById('canvas');
      let ctx = canvas.getContext('2d');
      let img = new Image();
      img.src = token.src;
      ctx.clearRect(0, 0, 1100, 440);
      ctx.drawImage(this.img, 0, 0);
      ctx.drawImage(img, token.X, token.Y);
    }

    eraseToken(token) {
      let canvas = document.getElementById('canvas');
      let ctx = canvas.getContext('2d');
      ctx.beginPath();
      ctx.globalCompositeOperation = "destination-out";
      ctx.arc(token.X + token.radius, token.Y + token.radius + 1, token.radius, 0, Math.PI * 2);
      ctx.fill();
      // ctx.closePath();
      ctx.globalCompositeOperation = "source-over";
      this.img.src = canvas.toDataURL();
    }

    drag(x, y) {
      let canvas = document.getElementById("canvas");
      let ctx = canvas.getContext("2d");
      let datos = this.playerOnTurn.getSelectedToken();
      let image = new Image();
      image.src = datos.getData().src;
      ctx.clearRect(0, 0, 1100, 440);
      ctx.drawImage(this.img, 0, 0);
      ctx.drawImage(image, x-35, y-22);
    }

    between(x, min, max) { return x >= min && x <= max; }

    isOnBoard(posX, posY) {
      return (posX >= 0 && posX < this.board[0].length) && (posY >= 0 && posY < this.board.length);
    }

  }
