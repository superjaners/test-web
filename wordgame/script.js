const hint = document.getElementById("hint");
const question = document.getElementById("question");
const synonym = document.getElementById("synonym");
const answer = document.getElementById("answer");
const submit = document.getElementById("submit");

var list = [];
var correct = [];

document.addEventListener("DOMContentLoaded", loadPage);

async function loadPage() {
    list = await getDB();
    setUp();
    answer.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            next();
        }
    })
    submit.addEventListener("click", () => {
        next();
    })
}

function setUp() {
    const currentAnswer = list[0].answer;
    if (currentAnswer.startsWith("to ")){
        hint.textContent = currentAnswer.slice(0, 4).padEnd(currentAnswer.length, '_');
    }
    else {
        hint.textContent = currentAnswer.slice(0, 1).padEnd(currentAnswer.length, '_');
    }
    question.textContent = list[0].question;
    synonym.textContent = `Synonym: ${list[0].synonym}`;
    answer.value = "";
    answer.focus();
}

async function getDB() {
    let path = `../data/spanish-easy.json`;
    const response = await fetch(path);
    if (!response.ok) {
        console.log("Error fetching.");
        return;
    }
    const parsed = await response.json();
    return parsed;
}

function next() {
    correct.push({"question": list[0].question, "answer": list[0].answer, "user": answer.value});
    list.splice(0, 1);
    if (list.length != 0) {
        setUp();
    }
    else {
        answer.hidden = true;
        synonym.hidden = true;
        question.hidden = true;
        submit.hidden = true;
        hint.textContent = "";
        for (let i = 0; i < correct.length; i++) {
            let checkmark = "";
            if (correct[i].user === correct[i].answer) {
                checkmark = "\u2705";
            }
            else {checkmark = "\u274C"}
            hint.textContent += `${checkmark} [${correct[i].question}] [${correct[i].answer}] your answer: ${correct[i].user}\n`;
        }
    }
}