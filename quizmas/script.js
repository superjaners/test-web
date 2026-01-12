const main = document.getElementById("main");
const question = document.getElementById("question");
const choices = document.getElementById("choices");
var correct = 0;
var turn = 0;
var list = [];
var listSize = 0;

document.addEventListener("DOMContentLoaded", setUp);

async function setUp() {
    const response = await fetch('data/quiz_entries.json');

    if (!response.ok) {
        console.log("Error fetching.");
        return;
    }

    const parsed = await response.json();
    list = shuffle(parsed);
    listSize = list.length;
    nextQuestion();
}

function nextQuestion() {
    question.textContent = list[turn].question;
    const answers = shuffle(list[turn].answers);
    for (const i of answers) {
        const choice = document.createElement("button");
        choice.className = "choice";
        choice.textContent = i;
        choice.addEventListener("click", () => {checkAnswer(i)});
        choices.appendChild(choice);
    }
}

function checkAnswer(answer) {
    const correctAnswer = list[turn].answers[0];

    if (answer === correctAnswer) {correct += 1;}
    turn += 1;
    clearChoices();

    if (turn === listSize) {
        gameOver();
        return;
    }

    nextQuestion();
}

function gameOver() {
    question.textContent = `${correct} out of ${listSize}.`
    const button = document.createElement("button");
    button.className = "choice";
    button.textContent = "Retry";
    button.addEventListener("click", () => {
        turn = 0;
        correct = 0;
        clearChoices();
        setUp();
    })
    choices.appendChild(button);
}

function clearChoices() {
    while (choices.firstChild) {
        choices.removeChild(choices.firstChild);
    }
}

function shuffle(array) {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}