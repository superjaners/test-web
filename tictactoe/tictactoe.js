var turn = 0;
const data = [{"tile": "x", "path": "imgs/x.png"}, {"tile": "o", "path": "imgs/circle.png"}]

function addButtons() {
    for (let i = 0; i < 9; i++) {
        let button = document.createElement("button");
        button.className = "tttbutton";
        button.tile = ""
        button.addEventListener("click", () => {
            playerPicked(button);
        })
        document.getElementById("board").appendChild(button);
    }
}

function changeTile(button) {
    let image = document.createElement("img");
    image.height = 48;
    image.width = 48;
    image.src = data[turn%2].path;
    button.tile = data[turn%2].tile;
    button.disabled = true;
    button.style.cursor = "default";
    button.appendChild(image);
}

function getGrid() {
    return document.getElementById("board").children;
}

function gameOver(index) {
    const messages = ["Player wins.", "CPU wins.", "Tie."];
    const grid = getGrid();
    for (const button of grid) {
        button.disabled = true;
        button.style.cursor = "default";
    }
    let message = document.createElement("p");
    message.textContent = messages[index];
    document.getElementById("message").appendChild(message);
    let reset = document.createElement("button");
    reset.style.width = "64px";
    reset.style.height = "24px";
    reset.textContent = "Reset"
    reset.addEventListener("click", () => {
        for (const button of grid) {
            button.style.cursor = "pointer";
            button.tile = "";
            button.disabled = false;
            let img = button.querySelector("img");
            if (img) {
                img.remove();
            }
            let p = document.getElementById("message").querySelector("p");
            if (p) {
                p.remove();
            }
            let r = document.getElementById("message").querySelector("button");
            if (r) {
                r.remove();
            }
            turn = 0
        }
    })
    document.getElementById("message").appendChild(reset);
}

function thereIsAWinner(player) {
    var startingTile = 0;
    const grid = getGrid();
    for (let i = 0; i < 3; i++) {
        if (grid[startingTile].tile + grid[startingTile + 1].tile + grid[startingTile + 2].tile === player + player + player) {
            return true;
        }
        startingTile += 3;
    }

    startingTile = 0;
    for (let i = 0; i < 3; i++) {
        if (grid[startingTile].tile + grid[startingTile + 3].tile + grid[startingTile + 6].tile === player + player + player) {
            return true;
        }
        startingTile += 1;
    }

    var gap = 4;
    startingTile = 0;
    for (let i = 0; i < 2; i++) {
        if (grid[startingTile].tile + grid[startingTile + gap].tile + grid[startingTile + (gap * 2)].tile === player + player + player) {
            return true;
        }
        startingTile = 2;
        gap = 2;
    }

    return false
}

function AIchanceToBlockOrWin(player) {
    var startingTile = 0;
    const grid = getGrid();
    for (let i = 0; i < 3; i++) {
        if (grid[startingTile].tile + grid[startingTile + 1].tile + grid[startingTile + 2].tile === player + player) {
            for (let index = 0; index < 3; index++) {
                let currentTile = grid[startingTile + index];
                if (currentTile.tile === "") {
                    changeTile(currentTile);
                    return true;
                }
            }
        }
        startingTile += 3;
    }

    startingTile = 0;
    for (let i = 0; i < 3; i++) {
        if (grid[startingTile].tile + grid[startingTile + 3].tile + grid[startingTile + 6].tile === player + player) {
            for (let index = 0; index < 3; index++) {
                let currentTile = grid[startingTile + (index * 3)];
                if (currentTile.tile === "") {
                    changeTile(currentTile);
                    return true;
                }
            }
        }
        startingTile += 1;
    }

    var gap = 4;
    startingTile = 0;
    for (let i = 0; i < 2; i++) {
        if (grid[startingTile].tile + grid[startingTile + gap].tile + grid[startingTile + (gap * 2)].tile === player + player) {
            for (let index = 0; index < 3; index++) {
                let currentTile = grid[startingTile + (gap * index)];
                if (currentTile.tile === "") {
                    changeTile(currentTile);
                    return true;
                }
            }
        }
        startingTile = 2;
        gap = 2;
    }

    return false
}

function AIrandomPick() {
    const grid = getGrid();
    var options = [];
    for (let i = 0; i < grid.length; i++) {
        if (grid[i].tile === "") {
            options.push(grid[i]);
        }
    }
    if (options.length !== 0) {
        let randomNumber = Math.floor(Math.random() * options.length);
        let result = options[randomNumber]
        changeTile(result);
        return true;
    } else {
        return false;
    }
}

function playerPicked(button) {
    changeTile(button);
    if (thereIsAWinner("x")) {
        gameOver(0);
        return;
    } else if (thereIsAWinner("o")) {
        gameOver(1);
        return;
    } else {
        turn += 1;
        aiTurn();
    }
}

function aiTurn() {
  if (AIchanceToBlockOrWin("o")) return gameOver(1);

  if (AIchanceToBlockOrWin("x")) {
    turn += 1;
    return;
  }

  if (AIrandomPick()) {
    if (thereIsAWinner("x")) return gameOver(0);
    if (thereIsAWinner("o")) return gameOver(1);
    turn += 1;
    return;
  }

  gameOver(2);
}

document.addEventListener("DOMContentLoaded", addButtons);