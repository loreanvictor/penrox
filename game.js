class Piece {
  constructor(player, health, breath) {
      this.player = player;
      this.health = health;
      this.breath = breath;
  }
}

const boardSize = 5;
const board = document.querySelector(".board");
const tiles = [];
const pieces = [
  new Piece("player1", 100, 50),
  new Piece("player1", 100, 50),
  new Piece("player1", 100, 50),
  new Piece("player1", 100, 50),
  new Piece("player1", 100, 50),

  new Piece("player2", 100, 50),
  new Piece("player2", 100, 50),
  new Piece("player2", 100, 50),
  new Piece("player2", 100, 50),
  new Piece("player2", 100, 50),
];
const endTurnButton = document.getElementById("end-turn");

function createBoard() {
  for (let i = 0; i < boardSize * boardSize; i++) {
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.addEventListener("click", () => onTileClick(i));
      board.appendChild(tile);
      tiles.push(tile);
  }
}

function placePieces() {
  const E = boardSize * boardSize - 1
  const positions = [0, 1, 2, 3, 4
    , E - 4, E - 3, E - 2, E - 1, E];
  for (let i = 0; i < pieces.length; i++) {
      const pieceDiv = document.createElement("div");
      pieceDiv.className = `piece ${pieces[i].player}`;
      pieceDiv.textContent = `${pieces[i].health} | ${pieces[i].breath}`;
      pieceDiv.addEventListener("click", (event) => {
          event.stopPropagation();
          selectPiece(i);
      });
      tiles[positions[i]].appendChild(pieceDiv);
      pieces[i].div = pieceDiv;
  }
}

let selectedPiece = null;

function selectPiece(index) {
  if (pieces[index].player !== currentPlayer) {
      return;
  }

  if (selectedPiece !== null) {
      pieces[selectedPiece].div.classList.remove("selected");
  }

  if (selectedPiece === index) {
      selectedPiece = null;
  } else {
      selectedPiece = index;
      pieces[selectedPiece].div.classList.add("selected");
  }
}

function onTileClick(index) {
  if (selectedPiece !== null) {
      moveOrAttack(index);
  }
}

function moveOrAttack(targetPos) {
  const selectedTile = tiles.find((tile) => tile.contains(pieces[selectedPiece].div));
  const targetTile = tiles[targetPos];

  const targetPieceIndex = pieces.findIndex((piece) => piece.div === targetTile.firstChild);

  const selectedPos = Array.from(board.children).indexOf(selectedTile);

  const distance = Math.abs(selectedPos % boardSize - targetPos % boardSize) + Math.abs(Math.floor(selectedPos / boardSize) - Math.floor(targetPos / boardSize));

  if (targetPieceIndex !== -1 && distance <= 1 && pieces[selectedPiece].player !== pieces[targetPieceIndex].player) {
      attack(selectedPiece, targetPieceIndex);
  } else if (pieces[selectedPiece].breath >= distance) {
      move(selectedPiece, targetPos);
  }
}

function move(index, targetPos) {
  const piece = pieces[index];
  piece.breath -= Math.abs(tiles.indexOf(piece.div.parentNode) - targetPos);
  tiles[targetPos].appendChild(piece.div);
  piece.div.textContent = `${piece.health} | ${piece.breath}`;
}

function attack(attackerIndex, targetIndex) {
  const attacker = pieces[attackerIndex];
  const target = pieces[targetIndex];

  if (attacker.breath >= 10) {
      attacker.breath -= 10;
      target.health -= 30;

      if (target.health <= 0) {
          target.div.remove();
          pieces.splice(targetIndex, 1);
      } else {
          target.div.textContent = `${target.health} | ${target.breath}`;
      }

      attacker.div.textContent = `${attacker.health} | ${attacker.breath}`;
    }
}

let currentPlayer = "player1";

function switchPlayer() {
    currentPlayer = currentPlayer === "player1" ? "player2" : "player1";
    if (selectedPiece !== null) {
        pieces[selectedPiece].div.classList.remove("selected");
        selectedPiece = null;
    }
}

endTurnButton.addEventListener("click", switchPlayer);

createBoard();
placePieces();

