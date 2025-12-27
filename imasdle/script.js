var names = [];
var series = "gaku";
var answer
const modes = Object.freeze({CHARACTER: "character", QUOTE: "quote"})
var mode = modes.CHARACTER

const submitButton = document.getElementById("submit");
const inputButton = document.getElementById("input");
const inputArea = document.getElementById("inputArea");

const highlightColor = "rgb(222, 222, 222)";
var tries =  0;

function addSuggestion(text) {
    let box = document.createElement("div");
    box.className = "suggestion";
    box.textContent = text;
    box.addEventListener("mouseenter", () => {
        highlightSuggestion(box, true);
    });
    box.addEventListener("mouseleave", () => {
        highlightSuggestion(box, false);
    });
    box.addEventListener("click", (event) => {
        if (event.target == event.currentTarget) {
            inputButton.value = text;
            clearList()
        }
    })
    document.getElementById("list").appendChild(box);
}

function highlightSuggestion(box, highlight) {
    if (highlight) {
        box.style.backgroundColor = highlightColor;
        inputButton.value = box.textContent;
    } else {box.style.backgroundColor = "white";}
}

function navigate(direction) {
    let list = document.getElementById("list").children;
    let count = list.length;
    if (count == 0) return;
    let child = findChild();
    switch (direction) {
        case "up":
            if (child-1 < 0) {
                child = count
            }
            resetList();
            highlightSuggestion(list[child-1], true);
            break;   
        case "down":
            if (child+1 == count) {
                child = -1
            }
            resetList();
            highlightSuggestion(list[child+1], true);
            break;
    }

}

function submit() {
    if (submitButton.disabled) return;
    let text = inputButton.value;
    if (text.length < 2) {
        document.getElementById("error").textContent = "No match found.";
        return;
    }
    for (let i of names) {
        let name = i.toLowerCase()
        if (name.includes(text.toLowerCase())) {
            check(i);
            clearList()
            return;
        }
    }
    document.getElementById("error").textContent = "No match found."
}

function toggleSubmitButton(bool) {
    submitButton.disabled = bool
    if (bool) {
        submitButton.style.color = "rgb(155, 155, 155)";
        submitButton.style.backgroundColor = "rgb(95, 95, 95)";
        submitButton.style.border = "rgb(83, 83, 83) solid 2px";
        submitButton.style.cursor = "default";
    } else {
        submitButton.style.color = "rgb(142, 90, 224)";
        submitButton.style.backgroundColor = "rgb(255, 255, 255)";
        submitButton.style.border = "rgb(146, 111, 202) solid 2px";
        submitButton.style.cursor = "pointer";
    }
}

async function check(userGuess) {
    tries += 1
    const correct = "rgb(53, 218, 53)";
    const wrong = "rgba(159, 39, 39, 1)";

    toggleSubmitButton(true);

    inputButton.disabled = true;

    const history = document.createElement("div");
    history.className = "history";
    document.getElementById("historyGroup").appendChild(history);

    names = names.filter(nutsack => nutsack !== userGuess);
    const characterData = await characterDB();
    const guessedCharacter = characterData.find(item => item.name === userGuess)

    const charBox = document.createElement("div");
    charBox.className = "hint";
    charBox.style.backgroundImage = `url("imgs/${series}/${userGuess}.png")`;
    charBox.style.backgroundColor = "rgba(0,0,0,0)";
    history.appendChild(charBox);
    charBox.classList.add("animate");
    await wait(500);

    let guessStats = [guessedCharacter.bust, guessedCharacter.height, guessedCharacter.weight];
    let todayStats = [answer.bust, answer.height, answer.weight];
    let phase = [{type: "Bust", unit: ""}, {type: "Height", unit: "cm"}, {type: "Weight", unit: "kg"}]
    for (let i = 0; i < guessStats.length; i++) {
        const a = parseInt(guessStats[i])
        const b = parseInt(todayStats[i])
        const comparison = compare(a, b);
        const hintBox = document.createElement("div");
        hintBox.className = "hint";
        switch (comparison) {
            case "equal":
                hintBox.style.backgroundColor = correct;
                break;
            case "less":
                hintBox.style.backgroundColor = wrong;
                hintBox.style.backgroundImage = "url(imgs/elements/arrow-up.svg)";
                break;
            case "greater":
                hintBox.style.backgroundColor = wrong;
                hintBox.style.backgroundImage = "url(imgs/elements/arrow-down.svg)";
                break;
        }
        hintBox.textContent = phase[i].type + ":\n" + a + phase[i].unit;
        history.appendChild(hintBox);
        hintBox.classList.add("animate");
        await wait(500);
    }

    const handBox = document.createElement("div");
    handBox.className = "hint";

    if (guessedCharacter.hand === answer.hand) {
        handBox.style.backgroundColor = correct;
    } else {handBox.style.backgroundColor = wrong;}

    switch (guessedCharacter.hand) {
        case "Left":
            handBox.textContent = "Left\nHanded"
            break;
        case "Right":
            handBox.textContent = "Right\nHanded"
            break;
        case "Both":
            handBox.textContent = "Both\nHanded"
            break;
    }
    
    history.appendChild(handBox);
    handBox.classList.add("animate");
    await wait(500);

    if (userGuess == answer.name) {
        submitButton.hidden = true;
        input.hidden = true;
        let plural = "try";
        if (tries > 1) {
            plural = "tries";
        }
        const grats = `It took you ${tries} ${plural} to guess today's character.`;
        inputArea.textContent = grats;
        inputArea.style.marginBottom = "72px";
        saveData(grats, true)
    } else {
        inputButton.disabled = false;
        toggleSubmitButton(false);
        inputButton.value = "";
        saveData("", false)
    }

}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function compare(a, b) {
    if (a === b) {
        return "equal";
    } else if (a < b) {
        return "less";
    } else if (a > b) {
        return "greater";
    }
}

function findChild() {
    let list = document.getElementById("list").children;
    let index = 0;
    for (i of list) {
        if (i.style.backgroundColor == highlightColor) {
            return index;
        }
        index += 1;
    }
    return -1
}

async function characterDB() {
    const response = await fetch(`database/characterData/${series}Data.json`);
    if (!response.ok) {
        console.log("Error fetching.");
        return;
    }
    const parsed = await response.json();
    return parsed;
}

async function quoteDB() {
    const response = await fetch(`database/quoteData/${series}Quotes.json`);
    if (!response.ok) {
        console.log("Error fetching.");
        return;
    }
    const text = await response.text();
    const decoded = new TextDecoder().decode(
        Uint8Array.from(atob(text), c => c.charCodeAt(0))
    );
    return JSON.parse(decoded);
}

function resetList() {
    let list = document.getElementById("list").children;
    for (i of list) {
        highlightSuggestion(i, false);
    }
}

function searchNames(name) {
    if (name.length < 2) return;
    for (i of names) {
        let lower = i.toLowerCase()
        if (lower.includes(name.toLowerCase())) {
            addSuggestion(i);
        }
    }
}

function clearList() {
    let list = document.getElementById("list");
    document.getElementById("error").textContent = ""
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
}

async function ready() {
    submitButton.addEventListener("click", submit);
    inputButton.addEventListener("input", () => {
        clearList();
        searchNames(inputButton.value);
    });
    switch (mode) {
        case modes.CHARACTER:
             await getTodaysCharacter();
             break;
        case modes.QUOTE:
            await getTodaysQuote();
            break;
    };
    loadData();
}

function getJST(d = new Date()) {
    const offset = 9 * 60 * 60 * 1000
    const JST = new Date(d.getTime() + offset)
    const start = Date.UTC(JST.getUTCFullYear(), 0, 0);
    const diff = JST - start;
    return Math.floor(diff / 86400000);
}

function saveData(msg, done) {
    localStorage.setItem("done", done);
    localStorage.setItem("tries", tries);
    localStorage.setItem("day", getJST());
    localStorage.setItem("msg", msg);
    localStorage.setItem("names", JSON.stringify(names))
    var groups = []
    const children = Array.from(document.getElementById("historyGroup").children)
    for (let i of children) {
        const group = Array.from(i.children)
        let saveGroup = []
        for (let nel of group) {
            const content = {style: nel.style.cssText, textContent: nel.textContent}
            saveGroup.push(content)
        }
        groups.push(saveGroup)
    }
    localStorage.setItem("groups", JSON.stringify(groups))
}

function loadData() {
    const current = localStorage.getItem("day");
    if (parseInt(current) === getJST()) {
        tries = parseInt(localStorage.getItem("tries"));
        names = JSON.parse(localStorage.getItem("names"));
        const status = localStorage.getItem("done");
        if (status === "true") {
            submitButton.disabled = true;
            inputButton.disabled = true;
            submitButton.hidden = true;
            inputButton.hidden = true;
            inputArea.textContent = localStorage.getItem("msg");
            inputArea.style.marginBottom = "72px";
        }
        const groups = localStorage.getItem("groups");
        const newgroups = JSON.parse(groups);
        for (let i of newgroups) {
            const window = document.createElement("div");
            window.className = "history";
            for (let hint of i) {
                const sean = document.createElement("div");
                sean.className = "hint";
                sean.style = hint.style;
                sean.textContent = hint.textContent;
                window.appendChild(sean);
            }
            document.getElementById("historyGroup").appendChild(window);
        }
    }  
}

function clearData() {
    localStorage.removeItem("done");
    localStorage.removeItem("tries");
    localStorage.removeItem("history");
    localStorage.removeItem("day");
    localStorage.removeItem("msg");
    localStorage.removeItem("names");
    localStorage.removeItem("groups");
    location.reload();
}

async function getTodaysQuote() {
    const time = getJST();
    const quotes = await quoteDB();
    const todaysQuote = quotes[time % quotes.length];
    answer = todaysQuote.name;
    document.getElementById("jp").textContent = `「${todaysQuote.jp}」`;
    document.getElementById("en").textContent = `"${todaysQuote.en}"`;
    names = quotes.map(list => list.name)
}

async function getTodaysCharacter() {
    const time = getJST();
    const characters = await characterDB();
    const todaysCharacter = characters[time % characters.length];
    answer = todaysCharacter;
    names = characters.map(list => list.name)
}

document.addEventListener("DOMContentLoaded", () => {
    ready();
})

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp":
            navigate("up");
            break;
        case "ArrowDown":
            navigate("down");
            break;
        case "Enter":
            submit()
    }
})