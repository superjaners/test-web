const mode = document.getElementById("area").dataset.mode;
const area = document.getElementById("area");
const warning = document.getElementById("warning")
const buttonArea = document.getElementById("buttons");

document.addEventListener("DOMContentLoaded", characterDataEntry)

function characterDataEntry() {

    document.getElementById("header").textContent = "Enter Character Data"

    const options = [
        {value: "765", text: "765"},
        {value: "cg", text: "Cinderella Girls"},
        {value: "shiny", text: "Shiny Colors"},
        {value: "sidem", text: "SideM"},
        {value: "gaku", text: "Gakuen"}
    ];

    addOptionField("Series", options);
    addInputField("Name", "e.g. Kisaragi Chihaya", "Last name first");
    addInputField("Age", "e.g. 16");
    addInputField("Height", "e.g. 162", "Do not include units");
    addInputField("Weight", "e.g. 41", "Do not include units");
    addInputField("Bust", "e.g. 72", "Do not include units");

    const hands = [
        {value: "Right", text: "Right"},
        {value: "Left", text: "Left"},
        {value: "Both", text: "Both"}
    ];

    addOptionField("Hand", hands);

    const downloadButton = document.createElement("button");
    downloadButton.className = "save";
    downloadButton.textContent = "Download\nData";
    downloadButton.addEventListener("click", downloadJSON);
    buttonArea.appendChild(downloadButton);

    const saveButton = document.createElement("button");
    saveButton.className = "save";
    saveButton.textContent = "Save\nEntry";
    saveButton.addEventListener("click", save)
    buttonArea.appendChild(saveButton);

    const displayButton = document.createElement("button");
    displayButton.className = "save";
    displayButton.textContent = "List\nEntries";
    displayButton.addEventListener("click", displayData)
    buttonArea.appendChild(displayButton);
}

function addInputField(label, placeholder, extrainfo) {
    const field = document.createElement("div");
    field.dataset.label = label.toLowerCase();
    field.className = "inputField";
    field.textContent = label;

    const input = document.createElement("input");
    input.placeholder = placeholder;
    field.appendChild(input);

    if (extrainfo) {
        const subtext = document.createElement("div");
        subtext.className = "subtext";
        subtext.textContent = `(${extrainfo})`;
        field.appendChild(subtext);
    }

    area.appendChild(field);
}

function addOptionField(label, array) {
    const field = document.createElement("div");
    field.dataset.label = label.toLowerCase();
    field.className = "inputField";
    field.textContent = label;
    const selector = document.createElement("select");
    field.appendChild(selector);

    for (let option of array) {
        const item = document.createElement("option");
        item.value = option.value;
        item.textContent = option.text;
        selector.appendChild(item);
    }

    area.appendChild(field);
}

async function save() {
    if (warning.textContent !== "") {warning.textContent = ""}

    const nodes = document.getElementById("area");
    const children = Array.from(nodes.children);
    const texts = children.map(el => el.dataset.label)
    const values = children.map(el => el.firstElementChild.value);

    const data = {}

    for (let i = 0; i < values.length; i++) {
        if (values[i] === "") {
            warning.textContent = "All fields require input.";
            return;
        }
        if (!isNaN(values[i]) && values[i].trim() !== "") {
        data[texts[i]] = Number(values[i]);
        } else {data[texts[i]] = values[i]};
    }

    if (localStorage.getItem("charList") !== null) {
        const storage = localStorage.getItem("charList");
        const charList = JSON.parse(storage);

        if (overwrite(charList, data.name)){
            let target = charList.find(o => o.name === data.name);
            if (target) {Object.assign(target, data)}
            warning.textContent = `Overwritten ${data.name}.`
        } else {
            charList.push(data);
            warning.textContent = "Entry saved."
        };

        localStorage.setItem("charList", JSON.stringify(charList));
    } else {
        localStorage.setItem("charList", JSON.stringify([data]));
        warning.textContent = "Entry saved."
    }
    
    await wait(2000)
    warning.textContent = ""
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function downloadJSON() {
    const raw = localStorage.getItem("charList");

    if (!raw) {
        warning.textContent = "No data.";
        return;
    } else {warning.textContent = "";}

    const jsonData = JSON.stringify(JSON.parse(raw), null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "charList.JSON";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function overwrite(data, name) {
    const exists = data.some(obj => obj.name === name);
    if (exists) {return true}
    else {return false};
}

function displayData() {
    const entries = document.getElementById("entries");

    while (entries.firstChild) {
        entries.removeChild(entries.firstChild);
    }

    const storage = localStorage.getItem("charList");

    if (!storage) {
        warning.textContent = "No data.";
        return;
    } else {warning.textContent = "";}

    const data = JSON.parse(storage);
    
    for (let i of data) {
        const entry = document.createElement("div");
        entry.className = "entry"
        const info = `Series: ${i.series}\nName: ${i.name}\nAge: ${i.age}\nHeight: ${i.height}\nWeight: ${i.weight}\nBust: ${i.bust}\nHand: ${i.hand}`
        entry.textContent = info;

        const modifyButton = document.createElement("button");
        modifyButton.className = "modify";
        modifyButton.textContent = "Modify";
        modifyButton.addEventListener("click", () => {
            fillFields([i.series, i.name, i.age, i.height, i.weight, i.bust, i.hand]);
        });
        entry.appendChild(modifyButton);
        entries.appendChild(entry);

        const deleteButton = document.createElement("button");
        deleteButton.className = "modify";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
            deleteEntry(i.name);
        });
        entry.appendChild(deleteButton);
        entries.appendChild(entry);

    };
}

function fillFields(data) {
    const nodes = document.getElementById("area");
    const children = Array.from(nodes.children);
    const values = children.map(el => el.firstElementChild);
    for (let i = 0; i < values.length; i++) {
        values[i].value = data[i];
    }
    window.scrollTo({
    top: 0,
    behavior: 'smooth'
    });
}

function deleteEntry(name) {
    const storage = localStorage.getItem("charList");
    const charList = JSON.parse(storage);

    if (overwrite(charList, name)){
        const newList = charList.filter(o => o.name !== name);
        if (newList.length === 0) {localStorage.removeItem("charList")}
        else {localStorage.setItem("charList", JSON.stringify(newList))};
        warning.textContent = `Deleted ${name}.`;
    };

    displayData();
}