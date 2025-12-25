const names = [
    "Hanami Saki",
    "Tsukimura Temari",
    "Fujita Kotone",
    "Amaya Tsubame",
    "Arimura Mao",
    "Katsuragi Lilja",
    "Kuramoto China",
    "Shiun Sumika",
    "Shinosawa Hiro",
    "Himesaki Rinami",
    "Hanami Ume",
    "Hataya Misuzu",
    "Juo Sena",
    "Asari"
]
const highlightColor = "rgb(222, 222, 222)"

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
    document.getElementById("list").appendChild(box);
}

function highlightSuggestion(box, highlight) {
    if (highlight) {
        box.style.backgroundColor = highlightColor;
        document.getElementById("input").value = box.textContent;
    } else {box.style.backgroundColor = "white";}
}

function navigateList(direction) {
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
    let text = document.getElementById("input").value;
    if (text.length < 2) {
        document.getElementById("list").textContent = "No match found.";
        return;
    }
    for (i of names) {
        let name = i.toLowerCase()
        if (name.includes(text.toLowerCase())) {
            getResponse(i);
            clearList()
            return;
        }
    }
    document.getElementById("list").textContent = "No match found."
}

function getResponse(answer) {
    console.log(answer)
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

function resetList() {
    let list = document.getElementById("list").children;
    for (i of list) {
        highlightSuggestion(i, false);
    }
}

function searchNames(text) {
    if (text.length < 2) return;
    for (i of names) {
        let name = i.toLowerCase()
        if (name.includes(text.toLowerCase())) {
            addSuggestion(i);
        }
    }
}

function clearList() {
    let list = document.getElementById("list");
    list.textContent = ""
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
}

async function fujitaCockers() {
    let ass = await fetch("quotes.json");
    if (!ass.ok) {
        console.log("shit fucked up");
        return;
    }
    let cock = JSON.parse(cock.text());
    if (!cock.ok) {
        console.log("shit reaaally fucked bro");
        return;
    }
    console.log(cock)
}

document.addEventListener("DOMContentLoaded", () => {
    fujitaCockers()
    let input = document.getElementById("input");
    input.addEventListener("input", () => {
        clearList();
        searchNames(input.value);
    })
})

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp":
            navigateList("up");
            break;
        case "ArrowDown":
            navigateList("down");
            break;
        case "Enter":
            submit()
    }
})