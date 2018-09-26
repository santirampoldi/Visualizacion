class Player {
  constructor(args = {}) {
    this.id = args.id;
    this.name = args.name;
    this.tokens = [];
    this.onTurn = false;
    this.selectedToken;
  }

  getData() { return {'name':this.name, 'id':this.id} }

  getTokens() { return this.tokens; }

  getSelectedToken() { return this.selectedToken; }

  setName(name) {
    if (name != '') {
      this.name = name;
    }
  }

  addToken(token) { this.tokens.push(token); }

  switchOnTurn() { this.onTurn = !this.onTurn; }

  reset() {
    this.tokens = [];
    this.selectedToken = -1;
    this.onTurn = false;
  }

  getTokenClicked(x, y) {
    let token;
    for (var i = 0; i < this.tokens.length; i++) {
      if (this.tokens[i].clicked(x, y)) {
        token = this.tokens[i];
        this.tokens.splice(i,1);
        break;
      }
    }
    this.selectedToken = token;
    return token;
  }

  getPlayedPosition(event, token, board) {
    let mouseX = event.layerX - event.currentTarget.offsetLeft;
    let mouseY = event.layerY - event.currentTarget.offsetTop;
    let col = this.decideColumn(mouseX, mouseY, token, board);
    let row;
    if (col != -1) {
      row = this.decideRow(mouseX, mouseY, token, board, col);
    }
    return {x:col, y:row};
  }

  decideColumn(mouseX, mouseY, token, board) {
    let r = token.getData().radius;
    let row = board[0];

    for (var i = 0; i < row.length; i++) {
      let min = row[i].x - r;
      let max = row[i].x + r;
      if (this.between(mouseX, min, max)) {
        return i;
      }
    }
    return -1;
  }

  decideRow(mouseX, mouseY, token, board, col) {
    let r = token.getData().radius;
    let result = -1;

    for (var i = 0; i < board.length; i++) {
      if (board[i][col].token == 0) {
        result = i;
      }
      else {
        break;
      }
    }
    return result;
  }

  between(x, min, max) { return x >= min && x <= max; }
}
