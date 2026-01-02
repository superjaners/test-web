const mode = document.getElementById("area").dataset.mode;
const area = document.getElementById("area");
const entries = document.getElementById("entries");
const warning = document.getElementById("warning");
var storage = "";

document.addEventListener("DOMContentLoaded", () => {
    addUI();
    switch (mode) {
        case "character":
            characterDataEntry();
            break;
        case "quote":
            quoteDataEntry();
            break;
    }
})

function characterDataEntry() {
    document.getElementById("header").textContent = "Enter Character Data";

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
}

function quoteDataEntry() {
    document.getElementById("header").textContent = "Enter Character Data";

    addInputField("Name", "e.g. Kisaragi Chihaya", "Last name first");
    addInputField("Japanese", "Enter quote in Japanese");
    addInputField("English", "Enter quote in English");
}

function addUI() {
    const buttonArea = document.getElementById("buttons");

    const saveButton = document.createElement("button");
    saveButton.className = "save";
    saveButton.textContent = "Save";
    saveButton.addEventListener("click", save)
    document.getElementById("save").appendChild(saveButton);

    const displayButton = document.createElement("button");
    displayButton.className = "save";
    displayButton.id = "showList";
    displayButton.textContent = "List";
    displayButton.addEventListener("click", () => {
        switch (displayButton.textContent) {
            case "List":
                displayData();
                displayButton.textContent = "Hide";
                break;
            case "Hide":
                hideData();
                displayButton.textContent = "List";
                break;
        }
    })
    buttonArea.appendChild(displayButton);

    const downloadButton = document.createElement("button");
    downloadButton.className = "save";
    downloadButton.textContent = "Download";
    downloadButton.addEventListener("click", downloadJSON);
    buttonArea.appendChild(downloadButton);

    const fakeButton = document.createElement("input");
    fakeButton.type = "file";
    fakeButton.hidden = true;

    fakeButton.addEventListener("change", () => {
        loadJSON(fakeButton.files[0]);
    });

    const realButton = document.createElement("button");
    realButton.className = "save";
    realButton.textContent = "Load";
    

    realButton.addEventListener("click", () => {
        fakeButton.click();
    })

    buttonArea.appendChild(fakeButton);
    buttonArea.appendChild(realButton);
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

    switch (mode) {
        case "character":
            if (localStorage.getItem("charList")) {
                const storage = localStorage.getItem("charList");
                const charList = JSON.parse(storage);

                if (overwriteChar(charList, data.name)){
                    let target = charList.find(o => o.name === data.name);
                    if (target) {Object.assign(target, data)};
                    warning.textContent = `Overwritten ${data.name}.`;
                } else {
                    charList.push(data);
                    warning.textContent = "Entry saved.";
                };

                localStorage.setItem("charList", JSON.stringify(charList));
            } else {
                localStorage.setItem("charList", JSON.stringify([data]));
                warning.textContent = "Entry saved.";
            }
            break;
        
        case "quote":
            if (localStorage.getItem("quoteList")) {
                const storage = localStorage.getItem("quoteList");
                const quoteList = JSON.parse(storage);
                quoteList.push(data);
                warning.textContent = "Entry saved.";
                localStorage.setItem("quoteList", JSON.stringify(quoteList));
            } else {
                localStorage.setItem("quoteList", JSON.stringify([data]));
                warning.textContent = "Entry saved.";
            } 
    }
    
    await wait(2000)
    warning.textContent = ""
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function downloadJSON() {
    let raw = "";
    let filename = "";

    switch (mode) {
        case "character":
            raw = localStorage.getItem("charList");
            filename = "charList.JSON";
            break;
        case "quote":
            raw = localStorage.getItem("quoteList");
            filename = "quoteList.JSON";
            break;
    }

    if (!raw) {
        warning.textContent = "No data.";
        return;
    } else {warning.textContent = "";}

    const jsonData = JSON.stringify(JSON.parse(raw), null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function overwriteChar(data, name) {
    const exists = data.some(obj => obj.name === name);
    if (exists) {return true}
    else {return false};
}

function hideData() {
    while (entries.firstChild) {
        entries.removeChild(entries.firstChild);
    }
    document.getElementById("showList").textContent = "List";
}

function displayData() {
    hideData();

    let storage = "";

    switch (mode) {
        case "character":
            storage = localStorage.getItem("charList");
            break;
        case "quote":
            storage = localStorage.getItem("quoteList");
            break;
    }

    if (!storage) {
        warning.textContent = "No data.";
        return;
    } else {warning.textContent = "";}

    const data = JSON.parse(storage);
    
    for (let i of data) {
        const entry = document.createElement("div");
        entry.className = "entry"
        const keys = Object.keys(i);
        const values = Object.values(i);
        for (let node = 0; node < keys.length; node++) {
            const label = keys[node].charAt(0).toUpperCase() + keys[node].slice(1);
            entry.textContent += `${label}: ${values[node]}\n`;
        }

        if (mode === "character") {
            const modifyButton = document.createElement("button");
            modifyButton.className = "modify";
            modifyButton.textContent = "Modify";
            modifyButton.addEventListener("click", () => {
                fillFields(Object.values(i));
            });
            entry.appendChild(modifyButton);
            entries.appendChild(entry);
        }

        const deleteButton = document.createElement("button");
        deleteButton.className = "modify";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
            switch (mode) {
                case "character":
                    deleteCharacter(i.name);
                    break;
                case "quote":
                    deleteQuote(i);
                    break;
            }
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

function deleteCharacter(name) {
    const storage = localStorage.getItem("charList");
    const charList = JSON.parse(storage);

    if (overwrite(charList, name)){
        const newList = charList.filter(o => o.name !== name);

        if (newList.length === 0) {
            localStorage.removeItem("charList");
        }   else localStorage.setItem("charList", JSON.stringify(newList));
        
        warning.textContent = `Deleted ${name}.`;
    };

    displayData();
}

function deleteQuote(data) {
    const storage = localStorage.getItem("quoteList");
    const list = JSON.parse(storage);
    const newlist = removeObjectFromArray(list, data);

    if (newlist.length === 0) {
        localStorage.removeItem("quoteList");
    }   else localStorage.setItem("quoteList", JSON.stringify(newlist));

    displayData();
}

function isObjectEqual(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (let key of keys1) {
        if (obj1[key] !== obj2[key]) return false;
    }

    return true;
}

function removeObjectFromArray(array, target) {
    return array.filter(item => !isObjectEqual(item, target));
}

async function loadJSON(json) {
    const text = await json.text();

    switch (mode) {
        case "character":
            localStorage.setItem("charList", text);
            break;
        case "quote":
            localStorage.setItem("quoteList", text);
            break;
    }
    warning.textContent = "Entries loaded."

}
