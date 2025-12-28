var names = [];
var bg = document.getElementById("bg");
var series = bg.dataset.series;
var mode = bg.dataset.mode;

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

async function addHintBox(parent, bgImg, bgColor, text) {
    const box = document.createElement("div");
    box.className = "hint";
    box.style.backgroundImage = bgImg;
    box.style.backgroundColor = bgColor;
    box.textContent = text;
    parent.appendChild(box);
    box.classList.add("animate");
    await wait(500);
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
    const characterData = await getDB();
    const guessedCharacter = characterData.find(item => item.name === userGuess);

    await addHintBox(history, `url("imgs/${guessedCharacter.series}/${userGuess}.png")`, "rgba(0,0,0,0)");

    let guessStats = [guessedCharacter.bust, guessedCharacter.height, guessedCharacter.weight];
    let todayStats = [bg.a.bust, bg.a.height, bg.a.weight];
    let phase = [{type: "Bust", unit: ""}, {type: "Height", unit: "cm"}, {type: "Weight", unit: "kg"}];
    if (series === "all") {
        guessStats.unshift(guessedCharacter.age);
        todayStats.unshift(bg.a.age);
        phase.unshift({type: "Age", unit: ""})
    }

    for (let i = 0; i < guessStats.length; i++) {
        const a = parseInt(guessStats[i]);
        const b = parseInt(todayStats[i]);
        const comparison = compare(a, b);
        let hintBgColor = "";
        let hintBgImg = "";
        
        switch (comparison) {
            case "equal":
                hintBgColor = correct;
                break;
            case "less":
                hintBgColor = wrong;
                hintBgImg = "url(imgs/elements/arrow-up.svg)";
                break;
            case "greater":
                hintBgColor = wrong;
                hintBgImg = "url(imgs/elements/arrow-down.svg)";
                break;
        }
        const hintText = phase[i].type + ":\n" + a + phase[i].unit;
        await addHintBox(history, hintBgImg, hintBgColor, hintText);
    }

    if (series !== "all") {
        let areEqual = "";
        if (guessedCharacter.hand === bg.a.hand) {
            areEqual = correct;
        } else {areEqual = wrong;}
        await addHintBox(history, "", areEqual, guessedCharacter.hand + "\nHanded")};
        
    if (userGuess == bg.a.name) {
        submitButton.hidden = true;
        input.hidden = true;
        let plural = "try";
        if (tries > 1) {
            plural = "tries";
        }
        const grats = `It took you ${tries} ${plural} to guess today's character.\n\nNew guess at 00:00 (JST)`;
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

async function getDB() {
    let path = "";
    switch (mode) {
        case "character":
            path = `database/characterData/${series}Data.json`;
            break;
        case "quote":
            path = `database/quoteData/${series}Data.json`
            break;
    }
    const response = await fetch(path);
    if (!response.ok) {
        console.log("Error fetching.");
        return;
    }
    const parsed = await response.json();
    return parsed;
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
    bg.style.backgroundImage = `url('imgs/bg/${series}.png')`
    submitButton.addEventListener("click", submit);
    inputButton.addEventListener("input", () => {
        clearList();
        searchNames(inputButton.value);
    });
    switch (mode) {
        case "character":
             await getTodaysCharacter();
             break;
        case "quote":
            await getTodaysQuote();
            break;
    };
    loadData();
}

function getJST() {
  const now = new Date();
  const jstString = now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" });
  const jstDate = new Date(jstString);

  const start = new Date(jstDate.getFullYear(), 0, 0);
  const diff = jstDate - start;
  return Math.floor(diff / 86400000);
}

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function shuffleDeterministic(arr, seed) {
  const rand = mulberry32(seed);
  const result = [...arr];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function saveData(msg, done) {
    localStorage.setItem(`${series}${mode}Done`, done);
    localStorage.setItem(`${series}${mode}Tries`, tries);
    localStorage.setItem(`${series}${mode}Day`, getJST());
    localStorage.setItem(`${series}${mode}Msg`, msg);
    localStorage.setItem(`${series}${mode}Names`, JSON.stringify(names))
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
    localStorage.setItem(`${series}${mode}Groups`, JSON.stringify(groups))
}

function loadData() {
    const current = localStorage.getItem(`${series}${mode}Day`);
    if (parseInt(current) === getJST()) {
        tries = parseInt(localStorage.getItem(`${series}${mode}Tries`));
        names = JSON.parse(localStorage.getItem(`${series}${mode}Names`));
        const status = localStorage.getItem(`${series}${mode}Done`);
        if (status === "true") {
            submitButton.disabled = true;
            inputButton.disabled = true;
            submitButton.hidden = true;
            inputButton.hidden = true;
            inputArea.textContent = localStorage.getItem(`${series}${mode}Msg`);
            inputArea.style.marginBottom = "72px";
        }
        const groups = localStorage.getItem(`${series}${mode}Groups`);
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
    localStorage.removeItem(`${series}${mode}Done`);
    localStorage.removeItem(`${series}${mode}Tries`);
    localStorage.removeItem(`${series}${mode}History`);
    localStorage.removeItem(`${series}${mode}Day`);
    localStorage.removeItem(`${series}${mode}Msg`);
    localStorage.removeItem(`${series}${mode}Names`);
    localStorage.removeItem(`${series}${mode}Groups`);
    location.reload();
}

async function getTodaysQuote() {
    const time = getJST();
    const list = await getDB();
    const todaysQuote = list[time % list.length];
    bg.a = todaysQuote.name;
    document.getElementById("jp").textContent = `「${todaysQuote.jp}」`;
    document.getElementById("en").textContent = `"${todaysQuote.en}"`;
    names = list.map(item => item.name)
}

async function getTodaysCharacter() {
    const list = await getDB();
    const day = getJST();
    const cycle = Math.floor(day/list.length) + 1;
    const position = day % list.length;
    const shuffled = shuffleDeterministic(list, cycle)
    bg.a = shuffled[position]
    names = list.map(item => item.name)
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
