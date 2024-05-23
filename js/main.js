
const urlapi = "https://api.github.com/emojis";
document.querySelector('#a-api').href = urlapi;
document.querySelector('#a-api').textContent = urlapi.replace("https://", "").replace("http://", "");

var emojis;

/*window.onload = () => {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            emojis = Object.entries(JSON.parse(this.response));
            loadEmojis(emojis);
        }
    };
    xhttp.onerror = e => console.error('Error in xhttpReq: ' + e);
    xhttp.open("GET", urlapi, true);
    xhttp.send();
}*/

window.onload = async function loadAsync() {
    /** Note on performance, fetch vs. AJAX showed similar speeds with
    * 820ms initial load times
    * 430ms cached load times
    * Fetch preferred as it is modern
    */
    try {
        const response = await fetch(urlapi);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        emojis = Object.entries(data);
        loadEmojis(emojis);
    } catch (error) {
        console.error('Error in fetch request:', error);
    }
}

function messageEmoji(id, source) {
    const divMsg = document.querySelector("#emojiselect");
    const divMsgBox = document.querySelector("#msgcontainer");
    const divMsgInner = document.querySelector("#emojiselected");

    divMsg.className = "show clickable";
    divMsgBox.className = "show clickable";
    divMsgInner.innerHTML = "";
    let code = id;
    let src = source;
    let item = document.createElement('img');
    item.id = id;
    item.src = source;
    item.title = ':' + id + ':';

    let text = document.createElement('p');
    text.textContent = ":" + code + ":";

    let btn = document.createElement('button');
    btn.textContent = "OK";
    btn.onclick = () => {
        unmessageEmojis();
    }

    divMsgInner.appendChild(item);
    divMsgInner.appendChild(text);
    divMsgInner.appendChild(btn);
}

function unmessageEmojis() {
    const divMsg = document.querySelector("#emojiselect");
    const divMsgBox = document.querySelector("#msgcontainer");
    const divMsgInner = document.querySelector("#emojiselected");
    divMsg.className = "hide unclickable";
    divMsgBox.className = "hide unclickable";
    divMsgInner.innerHTML = "";
}

/**
 * Function to load emojis into the page.
 * @param {Array} emojis - An array of emoji objects, where each object has a name and a URL.
 * @returns {void}
 */
function loadEmojis(emojis) {
    // let altColor = true;
    let emojisDiv = document.querySelector('#emojis');
    for (var property of emojis) {
        let card = document.createElement('div');
        card.id = "div-" + property[0].toString();
        card.className = "emoji";

        //if (altColor) { //  Checkerbox effect
        //    card.className += " dark";
        //    altColor = false;
        //} else { altColor = true; }

        let item = document.createElement('img');
        let code = property[0];
        item.id = code;
        item.src = property[1];
        item.title = ':' + code + ':';
        item.onclick = () => messageEmoji(item.id, item.src); // alert(':' + code + ':');
        card.appendChild(item);
        emojisDiv.appendChild(card);
    }
    unmessageEmojis();
}

function filterEmojis(filter) {
    let v = [];
    emojis.filter(e => e[0].includes(filter.toLowerCase())).forEach(e => v.push(e[0]));
    document.querySelectorAll('#emojis img').forEach(i => i.className = (v.indexOf(i.id) == -1) ? "hide" : "");
}