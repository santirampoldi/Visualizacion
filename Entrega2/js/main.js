let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let p1 = new Player({name:'Player 1', id:1});
let p2 = new Player({name:'Player 2', id:2});
let game = new Game({player1: p1, player2: p2});

game.start();

canvas.addEventListener("mousedown", function(event) {
  if (!game.gameOver) {
    game.selectToken(event);
  }
});

canvas.addEventListener("mouseup", function(event) {
  let token = game.getPlayerOnTurn().getSelectedToken();
  if (token && token != -1 && !game.gameOver) {
    game.playToken(event);
  }
});

canvas.addEventListener("mousemove", function(event) {
  let token = game.getPlayerOnTurn().getSelectedToken();
  if (token && token != -1 && token.getData().dragging) {
    let mouseX = event.layerX - event.currentTarget.offsetLeft;
    let mouseY = event.layerY - event.currentTarget.offsetTop;
    game.drag(mouseX, mouseY);
  }
});

canvas.addEventListener("mouseleave", function(event) {
  let token = game.getPlayerOnTurn().getSelectedToken();
  if (token && token != -1 && !token.getData().played) {
    game.returnToken(token);
  }
});

// document.getElementById("start").addEventListener("click", function(){
//   let name1 = document.getElementById("nameP1").value;
//   let name2 = document.getElementById("nameP2").value;
//   game.setPlayers(name1, name2);
// });
