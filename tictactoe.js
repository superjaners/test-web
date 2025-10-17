var turn = 0
const players = ["x.png", "circle.png"]

function setButton(button) {
    let player = players[turn]
    let image = document.createElement("img")
    image.height = 48
    image.width = 48
    image.src = player
    button.appendChild(image)
    button.disabled = true
    button.style.cursor = "default"

    turn = (turn + 1)%2

    if (turn == 1) {
        aiTurn()
    }
}

function addButtons() {
    for (let i = 0; i < 9; i++) {
        let button = document.createElement("button")
        button.className = "tttbutton"
		button.style.width = "64px"
		button.style.height = "64px"
        button.addEventListener("click", () => {
            setButton(button)
        })
        document.getElementsByClassName("grid")[0].appendChild(button)

    }
}

function reset() {
    var grid = document.getElementsByClassName("grid")[0]
    for (const button of grid.children) {
        const img = button.querySelector("img")
        if (img) {
            button.removeChild(img)
        }
        button.disabled = false
        button.style.cursor = "pointer"
    }
    const p = document.querySelector("main").querySelector("p")
    if (p) {
        document.querySelector("main").removeChild(p)
    }
    if (document.getElementById("reset")) {
        document.querySelector("main").removeChild(document.getElementById("reset"))
    }
}

function winner(player) {
    var win = ""
    const X = new URL("x.png", window.location.href).href
    if (player === X) {
        win = "Player"
    } else {
        win = "CPU"
    }
    let grid = document.getElementsByClassName("grid")[0]
    for (let i = 0; i < grid.children.length; i++) {
        grid.children[i].disabled = true
    }
    let p = document.createElement("p")
    p.textContent = win + " wins."
    document.querySelector("main").appendChild(p)
    let button = document.createElement("button")
    button.id = "reset"
    button.textContent = "Reset"
    button.style.width = "64px"
    button.style.margin = "auto"
    button.addEventListener("click", () => {
        reset()
    })
    document.querySelector("main").appendChild(button)
}

function getGridImageSrcs() {
    const buttons = document.querySelectorAll(".grid .tttbutton")

    return Array.from(buttons).map(button => {
        const img = button.querySelector("img")
        return img ? img.src : null
    });
}

function checkRows(player) {
    var startingNumber = 0
    const boxes = getGridImageSrcs()
	for (let i = 0; i < 3; i++) {
		var first = boxes[startingNumber]
		var second = boxes[startingNumber + 1]
		var third = boxes[startingNumber + 2]
		
        let word = String(first) + String(second) + String(third)
        let result = word.replace("null", "")
		if (result == player + player) {
            for (let index = 0; index < 3; index++) {
                let grid = document.getElementsByClassName("grid")[0]
                let currentBox = grid.children[startingNumber + index]
                if (currentBox.querySelector("img") == null){
                    setButton(currentBox)
                    return true
                }
            }
        }
		startingNumber += 3
    }
	
	return false
}

function checkRowsWin(player) {
    var startingNumber = 0
    const boxes = getGridImageSrcs()
	for (let i = 0; i < 3; i++) {
		var first = boxes[startingNumber]
		var second = boxes[startingNumber + 1]
		var third = boxes[startingNumber + 2]
		
        let result = String(first) + String(second) + String(third)
		if (result == player + player + player) {
            winner(player)
            return true
        }
		startingNumber += 3
    }
	
	return false
}

function checkColumns(player) {
    var startingNumber = 0
    const boxes = getGridImageSrcs()
	for (let i = 0; i < 3; i++) {
		var first = boxes[startingNumber]
		var second = boxes[startingNumber + 3]
		var third = boxes[startingNumber + 6]

        let word = String(first) + String(second) + String(third)
        let result = word.replace("null", "")
		if (result == player + player) {
            for (let index = 0; index < 3; index++) {
                let grid = document.getElementsByClassName("grid")[0]
				let currentBox = grid.children[startingNumber + (index * 3)]
				if (currentBox.querySelector("img") == null){
					setButton(currentBox)
					return true
                }
            }
        }
        startingNumber += 1
    }
	
	return false
}

function checkColumnsWin(player) {
    var startingNumber = 0
    const boxes = getGridImageSrcs()
	for (let i = 0; i < 3; i++) {
		var first = boxes[startingNumber]
		var second = boxes[startingNumber + 3]
		var third = boxes[startingNumber + 6]

        let result = String(first) + String(second) + String(third)
		if (result == player + player + player) {
            winner(player)
            return true
        }
        startingNumber += 1
    }
	
	return false
}


function checkDiag(player) {
    const boxes = getGridImageSrcs()
    const gap = [4, 2]
    var element = 0
    var startingNumber = 0

    for (let i = 0; i < 2; i++) {
		var first = boxes[startingNumber]
		var second = boxes[startingNumber + gap[element]]
		var third = boxes[startingNumber + (gap[element] * 2)]


        let word = String(first) + String(second) + String(third)
        let result = word.replace("null", "")
		if (result == player + player) {
            for (let index = 0; index < 3; index++) {
                let grid = document.getElementsByClassName("grid")[0]
                let currentBox = grid.children[startingNumber + (gap[element] * index)]
                if (currentBox.querySelector("img") == null){
					setButton(currentBox)
					return true
                }
            }
        }
        element = 1
        startingNumber = 2
    }
    return false
}

function checkDiagWin(player) {
    const boxes = getGridImageSrcs()
    const gap = [4, 2]
    var element = 0
    var startingNumber = 0

    for (let i = 0; i < 2; i++) {
		var first = boxes[startingNumber]
		var second = boxes[startingNumber + gap[element]]
		var third = boxes[startingNumber + (gap[element] * 2)]


        let result = String(first) + String(second) + String(third)
		if (result == player + player + player) {
            winner(player)
            return true
        }
        element = 1
        startingNumber = 2
    }
    return false
}

function randomPick() {
    var localBoxes = []
    const boxes = getGridImageSrcs()

    for (let i = 0; i < boxes.length; i++) {
        if (boxes[i] == null) {
            let grid = document.getElementsByClassName("grid")[0]
            localBoxes.push(grid.children[i])
        }
    }

    if (localBoxes.length == 0) {
        let p = document.createElement("p")
        p.textContent = "Tie."
        document.querySelector("main").appendChild(p)
        let button = document.createElement("button")
        button.id = "reset"
        button.textContent = "Reset"
        button.addEventListener("click", () => {
            reset()
        })
        document.querySelector("main").appendChild(button)
        return false
    }

    const randomIndex = Math.floor(Math.random() * localBoxes.length)
    const randomButton = localBoxes[randomIndex]
    setButton(randomButton)
    return true

}

function checkWin() {
    const X = new URL("x.png", window.location.href).href
    const O = new URL("circle.png", window.location.href).href
    if (checkRowsWin(X) == true) {
        return true
    } else if (checkRowsWin(O) == true) {
        return true
    } else if (checkColumnsWin(X) == true) {
        return true
    } else if (checkColumnsWin(O) == true) {
        return true
    } else if (checkDiagWin(X) == true) {
        return true
    } else if (checkDiagWin(O) == true) {
        return true
    } else {
        return false
    }
}

function aiTurn() {
    const X = new URL("x.png", window.location.href).href
    const O = new URL("circle.png", window.location.href).href

    if (checkWin()) {
        return
    }

    if (checkRows(O) == true) {
        checkWin()
        return
    }
    if (checkColumns(O) == true) {
        checkWin()
        return
    }
    if (checkDiag(O) == true) {
        checkWin()
        return
    } else if (checkRows(X) == true) {
        turn = 0
    } else if (checkColumns(X) == true) {
        turn = 0
    } else if (checkDiag(X) == true) {
        turn = 0
    } else if (randomPick() == true) {
        turn = 0
    }
}


document.addEventListener("DOMContentLoaded", addButtons);
