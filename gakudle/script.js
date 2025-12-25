var names = [
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
]
const highlightColor = "rgb(222, 222, 222)"
var tries =  0

function addSuggestion(text) {
    //As you can see, Nel is gay
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
            document.getElementById("input").value = text;
            clearList()
        }
    })
    document.getElementById("list").appendChild(box);
}

function highlightSuggestion(box, highlight) {
    //As you can see, Nel is REALLY REALLY gay
    if (highlight) {
        box.style.backgroundColor = highlightColor;
        document.getElementById("input").value = box.textContent;
    } else {box.style.backgroundColor = "white";}
}

function tsubamass(nut) {
    //As you can hella see, Nel is HELLA gay
    let list = document.getElementById("list").children;
    let kotoballs = list.length;
    if (kotoballs == 0) return;
    let maobussy = largerinamicock();
    switch (nut) {
        case "up":
            if (maobussy-1 < 0) {
                maobussy = kotoballs
            }
            resetList();
            highlightSuggestion(list[maobussy-1], true);
            break;   
        case "down":
            if (maobussy+1 == kotoballs) {
                maobussy = -1
            }
            resetList();
            highlightSuggestion(list[maobussy+1], true);
            break;
    }

}

function dorosawa() {
    //As you can see, Nel is 7x gay
    if (document.getElementById("kuramototaiwan").disabled) return;
    let text = document.getElementById("input").value;
    if (text.length < 2) {
        document.getElementById("error").textContent = "No match found.";
        return;
    }
    for (let i of names) {
        let name = i.toLowerCase()
        if (name.includes(text.toLowerCase())) {
            kpopidol(i);
            clearList()
            return;
        }
    }
    document.getElementById("error").textContent = "No match found."
}

function jonGay(yayornay) {
    const salad = document.getElementById("kuramototaiwan");
    if (yayornay) {
        salad.style.color = "rgb(155, 155, 155)";
        salad.style.backgroundColor = "rgb(95, 95, 95)";
        salad.style.border = "rgb(83, 83, 83) solid 2px";
        salad.style.cursor = "default";
    } else {
        salad.style.color = "rgb(142, 90, 224)";
        salad.style.backgroundColor = "rgb(255, 255, 255)";
        salad.style.border = "rgb(146, 111, 202) solid 2px";
        salad.style.cursor = "pointer";
    }
}

async function kpopidol(seandoujins) {
    //Freaky salad gif
    tries += 1
    const fr = "rgb(53, 218, 53)";
    const cap = "rgba(159, 39, 39, 1)";
    const lowkey = "rgb(218, 163, 53)";
    const hanamiass = document.getElementById("kuramototaiwan")
    hanamiass.disabled = true;
    jonGay(true);
    const coombrain = document.getElementById("input")
    coombrain.disabled = true;
    const mizugoon = document.createElement("div");
    mizugoon.className = "history";
    document.getElementById("historyGroup").appendChild(mizugoon);
    const katsuragiLilcock = await fujitaCockers();
    const umeballs = whyIcameBackToNelBeingGay();
    const senacock = katsuragiLilcock[umeballs % katsuragiLilcock.length];
    names = names.filter(nutsack => nutsack !== seandoujins);
    const liljass = await kotoAssers();
    const senass = liljass.find(fuck => fuck.name === seandoujins)
    const lilcock = liljass.find(fuck => fuck.name === senacock.name);
    const nellers = document.createElement("div");
    nellers.className = "hint";
    nellers.style.backgroundImage = `url("imgs/${seandoujins}.png")`;
    nellers.style.backgroundColor = "rgba(0,0,0,0)";
    mizugoon.appendChild(nellers);
    nellers.classList.add("animate");
    await wait(500);
    let cock1 = [senass.bust, senass.height, senass.weight];
    let cock2 = [lilcock.bust, lilcock.height, lilcock.weight];
    let faze = [{type: "Bust", unit: ""}, {type: "Height", unit: "cm"}, {type: "Weight", unit: "kg"}]
    for (let i = 0; i < cock1.length; i++) {
        const one = parseInt(cock1[i])
        const two = parseInt(cock2[i])
        const nel = dickmeasuring(one, two);
        const jon = document.createElement("div");
        jon.className = "hint";
        switch (nel) {
            case "samesame":
                jon.style.backgroundColor = fr;
                break;
            case "nah":
                jon.style.backgroundColor = cap
                jon.style.backgroundImage = "url(imgs/arrow-up.svg)";
                break;
            case "woah":
                jon.style.backgroundColor = cap;
                jon.style.backgroundImage = "url(imgs/arrow-down.svg)";
                break;
        }
        jon.textContent = faze[i].type + ":\n" + one + faze[i].unit;
        mizugoon.appendChild(jon);
        jon.classList.add("animate");
        await wait(500);
    }
    const jonners = document.createElement("div");
    jonners.className = "hint";
    if (senass.hand === lilcock.hand) {
        jonners.style.backgroundColor = fr;
    } else if (senass.hand === "Both") {
        jonners.style.backgroundColor = lowkey;
    } else {jonners.style.backgroundColor = cap;}
    switch (senass.hand) {
        case "Left":
            jonners.textContent = "Left\nHanded"
            break;
        case "Right":
            jonners.textContent = "Right\nHanded"
            break;
        case "Both":
            jonners.textContent = "Both\nHanded"
            break;
    }
    mizugoon.appendChild(jonners);
    jonners.classList.add("animate");
    await wait(500);

    if (seandoujins == senacock.name) {
        hanamiass.hidden = true;
        coombrain.hidden = true;
        let valxsal = "try";
        if (tries > 1) {
            valxsal = "tries";
        }
        const grats = `Congratulations! It took you ${tries} ${valxsal} to guess today's character.`;
        document.getElementById("inputArea").textContent = grats;
        document.getElementById("inputArea").style.marginBottom = "72px";
        saveData(grats, true)
    } else {
        hanamiass.disabled = false;
        coombrain.disabled = false;
        jonGay(false);
        coombrain.value = "";
        saveData("", false)
    }

}

function bogosbinted(text, img, color) {
    const bogo = document.createElement("div");
    bogo.className = "hint";
    bogo.style.backgroundColor = color;
    bogo.style.backgroundImage = img;
    bogo.textContent = text;
    return bogo
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function dickmeasuring(cock1, cock2) {
    if (cock1 === cock2) {
        return "samesame";
    } else if (cock1 < cock2) {
        return "nah";
    } else if (cock1 > cock2) {
        return "woah";
    }
}

function largerinamicock() {
    //Pull up Nel
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

async function kotoAssers() {
    //jon chokes nel here
    const neltypea = atob('aHR0cHM6Ly9wcmlzbWFqYW5lLmNvbS9jaGFyYWN0ZXJEYXRhLmpzb24=')
    const tits = await fetch(neltypea);
    if (!tits.ok) {
        console.log("why i came back to nel be gay");
        return;
    }
    const sumigoon = await tits.json();
    return sumigoon;
}

function resetList() {
    //Nel gets choked at this part
    let list = document.getElementById("list").children;
    for (i of list) {
        highlightSuggestion(i, false);
    }
}

function searchNames(ballsack) {
    //Jon where is my chocomint role
    if (ballsack.length < 2) return;
    for (i of names) {
        let gooner = i.toLowerCase()
        if (gooner.includes(ballsack.toLowerCase())) {
            addSuggestion(i);
        }
    }
}

function clearList() {
    //please give me my chocomint role back pls
    let list = document.getElementById("list");
    document.getElementById("error").textContent = ""
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
}

async function fujitaCockers() {
    //nel posting that one mano gif
    const maounderarm = atob('aHR0cHM6Ly9wcmlzbWFqYW5lLmNvbS90aW1lem9uZXMudHh0')
    const ass = await fetch(maounderarm);
    if (!ass.ok) {
        console.log("shit fucked up");
        return;
    }
    const ballz = await ass.text();
    const kotonedick = new TextDecoder().decode(
        Uint8Array.from(atob(ballz), c => c.charCodeAt(0))
    );
    const cock = JSON.parse(kotonedick);
    return cock;
}

async function temariFatass() {
    //jon and nel kiss here
    const sakiAbs = whyIcameBackToNelBeingGay();
    const temanuithighs = await fujitaCockers();
    const tartAbandonedTart = temanuithighs[sakiAbs % temanuithighs.length];
    document.getElementById("jp").textContent = `「${tartAbandonedTart.jp}」`;
    document.getElementById("en").textContent = `"${tartAbandonedTart.en}"`;
    const current = localStorage.getItem("day");
    if (parseInt(current) === sakiAbs) {
        tries = parseInt(localStorage.getItem("tries"));
        names = JSON.parse(localStorage.getItem("names"));
        const status = localStorage.getItem("done");
        if (status === "true") {
            document.getElementById("kuramototaiwan").disabled = true;
            document.getElementById("input").disabled = true;
            document.getElementById("kuramototaiwan").hidden = true;
            document.getElementById("input").hidden = true;
            document.getElementById("inputArea").textContent = localStorage.getItem("msg");
            document.getElementById("inputArea").style.marginBottom = "72px";
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

function whyIcameBackToNelBeingGay(d = new Date()) {
    //if youre still reading this its too late :pray:
    const apolloTypeA = 9 * 60 * 60 * 1000
    const taipei = new Date(d.getTime() + apolloTypeA)
    const start = Date.UTC(taipei.getUTCFullYear(), 0, 0);
    const diff = taipei - start;
    return Math.floor(diff / 86400000);
}

document.addEventListener("DOMContentLoaded", () => {
    //that was a drake reference
    temariFatass();
    document.getElementById("kuramototaiwan").addEventListener("click", dorosawa)
    let input = document.getElementById("input");
    input.addEventListener("input", () => {
        clearList();
        searchNames(input.value);
    })
})

function saveData(msg, done) {
    localStorage.setItem("done", done);
    localStorage.setItem("tries", tries);
    localStorage.setItem("day", whyIcameBackToNelBeingGay());
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

function clearData() {
    localStorage.removeItem("done");
    localStorage.removeItem("tries");
    localStorage.removeItem("history");
    localStorage.removeItem("day");
}

document.addEventListener("keydown", (e) => {
    //bro did not start from the bottom and is not here
    switch (e.key) {
        case "ArrowUp":
            tsubamass("up");
            break;
        case "ArrowDown":
            tsubamass("down");
            break;
        case "Enter":
            dorosawa()
    }
})
