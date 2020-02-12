
var nextFileIndex=0;
var nextElementId=0;
var file=[];
var selectedGame=undefined;

function jsonDownload() {
    /*var file = new File(["Hello, world!"], "hello world.txt", {type: "text/plain;charset=utf-8"});
    saveAs(file);
    /**/
    var text=JSON.stringify(file);
    var filename="games.json";
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
    console.log("Downloaded");
}
function jsonUpload() {
    const fileReader=new FileReader();
    fileReader.readAsText(document.getElementById("footer-button-upload").files[0]);
    fileReader.onload = function() {
            let err=false;
            try {
                var a=JSON.parse(fileReader.result);
                console.log(a);
            }
            catch(e) {
                err=true;
                //showError
                console.log("Non-valid JSON");
            }
            finally {
                if(!err) {
                    if (window.confirm("Tehtud muudatused eelnevale kaovad. Kas soovid uue faili laadida?")) {
                        /*removeGameButton(id);
                        removeGameSettings();
                        selectedGame=undefined;*/
                        file=JSON.parse(fileReader.result);
                        selectedGame=0;
                        document.getElementById("footer-button-upload").value=null;
                        redraw();
                    }
                    
                    
                    //reload()
                }
            }

    };
    

    

}
function redraw() {
    removeGameButtons();
    removeGameSettings();
    removeGameElements();
    for(let i=0; i<file.length; i++) {
        addGameButton(file[i]["id"]);
    }
}
function toggleCheckbox(property_id) {
    setCheckbox(property_id, saveData(property_id));
}
function setCheckbox(id, value, context) {
    context = (typeof context === 'undefined') ? document : context;
    if(value) {
        context.querySelector('#'+id).classList.add("checkbox-checked")
        context.querySelector('#'+id).classList.remove("checkbox-unchecked")
    }
    else {
        context.querySelector('#'+id).classList.add("checkbox-unchecked")
        context.querySelector('#'+id).classList.remove("checkbox-checked")
    }
}
function getIndexFromId(id) {
    for(let i=0; i<file.length; i++) {
        if(file[i]["id"]==id) {
            return i;
        }
    }
}
function getElementIndexFromEid(id, e_id) {
    for(let i=0; i<file[getIndexFromId(id)]["contentElements"].length; i++) {
        if(file[getIndexFromId(id)]["contentElements"][i]["id"]==e_id) {
            return i;
        }
    }
}
function saveData(property, id) {
    id = (typeof id === 'undefined') ? property : id;
    let game=file[getIndexFromId(selectedGame)];
    let val;
    switch(property) {
        case 'name':
            game["properties"]["name"]=document.getElementById(id).value;
            setGameButtonTitle(selectedGame, game["properties"]["name"]);
            return game["properties"]["name"];
        case 'description':
            return game["properties"]["description"]=document.getElementById(id).value;
        case 'min':
            val=document.getElementById(id).value
            if (val>=2) {
                if(val>game["properties"]["players"]["max"]) {
                    game["properties"]["players"]["max"]=val;
                    document.getElementById("settings-players-max").value=val;
                }
                return game["properties"]["players"]["min"]=val;
            }
            else {
                document.getElementById(id).value=2;
                return game["properties"]["players"]["min"]=2;
            }
        case 'max':
            val=document.getElementById(id).value
            if (val>=2) {
                if(val<game["properties"]["players"]["min"]) {
                    game["properties"]["players"]["min"]=val;
                    document.getElementById("settings-players-min").value=val;
                }
                return game["properties"]["players"]["max"]=val;
            }
            else {
                document.getElementById(id).value=2;
                return game["properties"]["players"]["max"]=2;
            }
        case 'c_random':
            return game["settings"]["random"]=!game["settings"]["random"];
        case 'c_mg1':
            return game["settings"]["minigames"]["mg1"]=!game["settings"]["minigames"]["mg1"];
        case 'c_mg2':
            return game["settings"]["minigames"]["mg2"]=!game["settings"]["minigames"]["mg2"];
        default:
            let type=property.match(/^e-(.*)_([0-9])$/);
            e_index=getElementIndexFromEid(selectedGame, Number(type[2]));
            console.log(type);
            console.log(e_index);
            switch(type[1]) {
                case "c-repeatable":
                    return game["contentElements"][e_index]["repeatable"]=!game["contentElements"][e_index]["repeatable"];
                case "str":
                    return game["contentElements"][e_index]["str"]=document.getElementById(id).value;
                case 'probability':
                    val=document.getElementById(id).value
                    if (val>=1 && val<=10) {
                        return game["contentElements"][e_index]["likelyRepeats"]=val;
                    }
                    else if(val<=10) {
                        document.getElementById(id).value=1;
                        return game["contentElements"][e_index]["likelyRepeats"]=1;
                    }
                    else if(val>=1) {
                        document.getElementById(id).value=10;
                        return game["contentElements"][e_index]["likelyRepeats"]=10;
                    }
                case 'type':
                    /*switch(document.getElementById(id).value) {
                        case 0:
                            val='question';
                            break;
                        case 1:
                            val='task';
                            break;
                        default:
                            val='question';
                            break;   
                    }*/
                    return game["contentElements"][e_index]["type"]=document.getElementById(id).value;
            }
    }
}
function ElementObject() {
    this.id=nextElementId;
    nextElementId++;
    this.type="question";
    this.str="";
    this.repeatable=false;
    this.likelyRepeats=2;
}
function GameObject() {
    let index=nextFileIndex;
    this.id=nextFileIndex;
    this.properties={
        name: "Mäng "+String(name),
        duration: 60,
        description: "",
        players: {
            min: 3,
            max: 7
        },
        volume: 5,
        condition: 2
    };
    this.settings={
        random: true,
        contentElementDuration: 180,
        minigames: {
            m1:true,
            m2:true,
            m3:true
        }
    };
    this.contentElements= [
        new ElementObject(),
    ];
}
function newGame() {
    file.push(new GameObject());
    addGameButton(nextFileIndex);
    nextFileIndex++;
}
function addElement(e_id) {
    let newElementId=nextElementId;
    file[getIndexFromId(selectedGame)]["contentElements"].splice(getElementIndexFromEid(getIndexFromId(selectedGame), e_id)+1, 0, new ElementObject());
    document.getElementById("e_"+String(e_id)).after(createElement(getElementIndexFromEid(getIndexFromId(selectedGame), newElementId)));
}
function selectGame(id) {
    selectedGame=id;
    removeGameElements();
    for(let i=0; i<file.length; i++) {
        document.getElementById("list-game-item-title_"+String(file[i]["id"])).classList.remove("list-game-item-title-active");
    }
    document.getElementById("list-game-item-title_"+String(id)).classList.add("list-game-item-title-active");
    createGameSettings(id);
    createGameElements(id);
}
function setGameButtonTitle(id, title) {
    document.getElementById("list-game-item-title-p_"+String(id)).innerHTML=title;
}
function createGameSettings(id) {
    document.getElementById("list-settings").innerHTML=`<h2>MÄNGU SEADED</h2>
    <p>Nimi</p>
    <textarea onchange="saveData('name', 'settings-name')" spellcheck="false" class="t-area-wide list-settings-name" id="settings-name"></textarea>
    <p>Kirjeldus</p>
    <textarea onchange="saveData('description', 'settings-desc')" spellcheck="false" class="t-area-wide list-settings-desc" id="settings-desc"></textarea>
    <p>Mängijate soovituslik arv<input onchange="saveData('min', 'settings-players-min')" class="input-digit" id="settings-players-min"></input>-<input onchange="saveData('max', 'settings-players-max')" class="input-digit"  id="settings-players-max"></input></p>
    <p><span id="c_random" class="checkbox checkbox-unchecked" onclick="toggleCheckbox('c_random')"></span>Suvaline elementide järjestus</p>
    <h3>Minimängud</h3>
    <p><span id="c_mg1" class="checkbox checkbox-unchecked" onclick="toggleCheckbox('c_mg1')"></span>Truth Dare</p>
    <p><span id="c_mg2" class="checkbox checkbox-unchecked" onclick="toggleCheckbox('c_mg2')"></span>Tähelepanu test</p>`;

    document.getElementById("settings-name").value=file[getIndexFromId(selectedGame)]["properties"]["name"];
    document.getElementById("settings-desc").value=file[getIndexFromId(selectedGame)]["properties"]["description"];
    document.getElementById("settings-players-min").value=file[getIndexFromId(selectedGame)]["properties"]["players"]["min"];
    document.getElementById("settings-players-max").value=file[getIndexFromId(selectedGame)]["properties"]["players"]["max"];
    document.getElementById("settings-desc").value=file[getIndexFromId(selectedGame)]["properties"]["description"];
    setCheckbox("c_random", file[getIndexFromId(selectedGame)]["settings"]["random"]);
    setCheckbox("c_mg1", file[getIndexFromId(selectedGame)]["settings"]["minigames"]["mg1"]);
    setCheckbox("c_mg2", file[getIndexFromId(selectedGame)]["settings"]["minigames"]["mg2"]);
    
}
function removeGameSettings() {
    document.getElementById("list-settings").innerHTML="";
}
function createGameElements() {
    for(let i=0; i<file[getIndexFromId(selectedGame)]["contentElements"].length; i++) {
        document.getElementById("list-elements").appendChild(createElement(i));
    }
}
function deleteElement(e_id) {
    e_index=getElementIndexFromEid(selectedGame, e_id);
    file[getIndexFromId(selectedGame)]["contentElements"].splice(e_index, 1);
    removeElement(e_id);
}
function removeElement(e_id) {
    document.getElementById("e_"+String(e_id)).remove();
}
function removeGameElements () {
    document.getElementById("list-elements").innerHTML="";
}
function createElement(e_index) {
    e_id=file[getIndexFromId(selectedGame)]["contentElements"][e_index]["id"];
    let element=document.createElement('div');
    element.id="e_"+String(e_id);
    element.innerHTML=`<div class="list-element-item">
    <div class="list-element-item-title">
        <select id="e-type_`+String(e_id)+`" onchange="saveData('e-type_`+String(e_id)+`', 'e-type_`+String(e_id)+`')">
            <option value="task">ÜLESANNE</option>
            <option value="question">KÜSIMUS</option>
        </select>
        <div class="list-element-item-interactable">
            <button onclick="deleteElement('`+String(e_id)+`')">
                <svg class="i">
                    <use xlink:href="#i-bin" />
                </svg>
            </button>
        </div>
        
        <div class="list-element-item-interactable">
            <button onclick="moveDown('`+String(e_id)+`')">
                <svg class="i">
                    <use xlink:href="#i-downarrow" />
                </svg>
            </button>
        </div>
        <div class="list-element-item-interactable-input">
            <input id="e-seq_`+String(e_id)+`">
        </div>
        <div class="list-element-item-interactable">
            <button onclick="moveUp('`+String(e_id)+`')">
                <svg class="i">
                    <use xlink:href="#i-uparrow" />
                </svg>
            </button>
        </div>
        <div class="list-element-item-interactable">
            <button onclick="addElement('`+String(e_id)+`')">
                <svg class="i">
                    <use xlink:href="#i-plus" />
                </svg>
            </button>
        </div>
        
    </div>
    
    <textarea onchange="saveData('e-str_`+String(e_id)+`')" spellcheck="false" class="t-area-wide list-element-content" id="e-str_`+String(e_id)+`"></textarea>
    <p><span id="e-c-repeatable_`+String(e_id)+`" class="checkbox checkbox-unchecked" onclick="toggleCheckbox('e-c-repeatable_`+String(e_id)+`')"></span>Korduv <span><input onchange="saveData('e-probability_`+String(e_id)+`')" class="input-digit" id="e-probability_`+String(e_id)+`"></input>Tõenäoliseim korduste arv</span></p>
</div>`;
    console.log(element);
    element.querySelector("#e-seq_"+String(e_id)).value=e_index;
    element.querySelector("#e-str_"+String(e_id)).value=file[getIndexFromId(selectedGame)]["contentElements"][e_index]["str"];
    element.querySelector("#e-probability_"+String(e_id)).value=file[getIndexFromId(selectedGame)]["contentElements"][e_index]["likelyRepeats"];
    element.querySelector("#e-type_"+String(e_id)).value=file[getIndexFromId(selectedGame)]["contentElements"][e_index]["type"];
    setCheckbox("e-c-repeatable_"+String(e_id), file[getIndexFromId(selectedGame)]["contentElements"][e_index]["repeatable"], element);
    return element;
    
}
function addGameButton(id) {
    document.getElementById("list-game-list").innerHTML+=`<div class="list-game-item list-game-button" id="list-game-item_`+String(id)+`">
    <div class="list-game-item-title" id="list-game-item-title_`+String(id)+`" onclick="selectGame(`+String(id)+`)">
        <p id="list-game-item-title-p_`+String(id)+`">`+file[getIndexFromId(id)]["properties"]["name"]+`</p>
    </div>
    <div class="list-game-item-interactable">
        <button onclick="deleteGame('`+String(id)+`')">
            <svg class="i">
                <use xlink:href="#i-bin" />
            </svg>
        </button>
    </div>
</div>`;
}
function removeGameButton(id) {
    document.getElementById("list-game-item_"+String(id)).remove();
}
function removeGameButtons() {
    document.getElementById("list-game-list").innerHTML="";
}
function deleteGame(id) {
    if (window.confirm("Kas soovid mängu kustutada?")) {
        for(let i=0; i<file.length; i++) {
            if(file[i]["id"]==id) {
                file.splice(id, 1);
                break;
            }
        }
        removeGameButton(id);
        removeGameSettings();
        selectedGame=undefined;
    }
}
