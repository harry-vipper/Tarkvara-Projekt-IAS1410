
var nextFileIndex=0;
var nextElementId=0;
var jsonWrapper={   //this is the object in which the file object is put into, to factor for the spec requiring a "content" object at the root.
    content: undefined
};
var file=[];
var selectedGame=undefined;



/*
    Table of contents:


    encoding

    JSON download/upload/uploadToDevice

    Saving data to local object based on user input

    Data/draw combined operation functions (creating a new game etc)

    Pure draw functions

*/





//Encode to a safe representation/decode
function encodeInput(str) {
    return he.encode(str);
}
function decodeInput(str) {
    return he.decode(str);
}


//For each game, calculate approximately how long the game will be, and put the result in the game's properties
function calculateExpectedTimes() {
    for(let i=0; i<file.length; i++) {
        let elements=0;
        file[i]["contentElements"].forEach(function(element){
            if(element.repeatable==true) {
                elements+=Number(element.likelyRepeats);
            }
            else{
                elements++;
            }
        });
        console.log(elements);
        file[i]["properties"]["duration"]=elements*file[i]["settings"]["contentElementDuration"]/60;
    }
}


//File buttons

//Upload to game device
function jsonToDevice() {
    calculateExpectedTimes();
    jsonWrapper.content=file;
    var text=JSON.stringify(jsonWrapper);


    var formData = new FormData();

    formData.append("json", text);

    var blob = new Blob([''], { type: "text/xml"});

    formData.append("file", blob);

    var request = new XMLHttpRequest();
    request.open("POST", "/php/jsonStoreHandler.php");
    request.send(formData);
    request.onload = function() {
        if(this.responseText=="OK") {
            window.alert("Edukalt üles laetud");
        }
        else {
            window.alert("Üleslaadimine ei õnnestunud");
        }
        console.log(this.responseText);
    }

}

//Save to local machine
function jsonDownload() {
    calculateExpectedTimes();

    jsonWrapper.content=file;
    var text=JSON.stringify(jsonWrapper);
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

//Load from local machine
function jsonUpload() {
    const fileReader=new FileReader();
    fileReader.readAsText(document.getElementById("footer-button-upload").files[0]);
    fileReader.onload = function() {
            let err=false;
            try {
                var a=JSON.parse(fileReader.result);
                if(!checkStructure(a)) {
                    throw "Broken file";
                }
                console.log(a);
            }
            catch(e) {
                err=true;
                //showError
                console.log("Non-valid JSON");
                window.alert("Selle faili sisu polnud korrektne");
            }
            finally {
                if(!err) {
                    if (window.confirm("Tehtud muudatused eelnevale kaovad. Kas soovid uue faili laadida?")) {
                        /*removeGameButton(id);
                        removeGameSettings();
                        selectedGame=undefined;*/
                        file=JSON.parse(decodeHTML(fileReader.result)).content;
                        let i=0;
                        
                        file.forEach(function(gameObject){
                            gameObject.id=i;
                            i++;
                            let j=0;
                            gameObject.contentElements.forEach(function(element) {
                                element.id=j;
                                j++;
                            })
                        })
                        nextFileIndex=reIdFile();
                        //file=decodeURIComponent(file);
                        selectedGame=0;
                        document.getElementById("footer-button-upload").value=null;
                        redraw();
                    }
                    
                    
                    //reload()
                }
            }

    };
}

//Utility function to cast object property values to a certain type, if for some reason they have been converted to strings for example. Throws an error if the conversion isn't possible
function castToType(type, input) {
    switch(type) {
        case "number":
            let val=Number(input);
            if (isNaN(val) || val==undefined) {throw "Broken file: "+input;}
            return val;
        case "boolean":
            if (input==undefined) {throw "Broken file: "+input;}
            return !!input;
        case "string":
            if (input==undefined) {throw "Broken file: "+input;}
            return input;
        case "contentElementType":
            if (input==undefined || (input!="task" && input!="question")) {throw "Broken file: "+input;}
            return input;
        default:
            throw "Incorrect type conversion type";
    }
}

//Utility function to make sure the uploaded file is of the correct structure
function checkStructure(object) {
    try {
        object.content.forEach(function(game){
            game.properties.condition=castToType("number", game.properties.condition);
            game.properties.description=castToType("string", game.properties.description);
            game.properties.duration=castToType("number", game.properties.duration);
            game.properties.players.min=castToType("number", game.properties.players.min);
            game.properties.players.max=castToType("number", game.properties.players.max);
            game.properties.title=castToType("string", game.properties.title);
            game.properties.volume=castToType("number", game.properties.volume);


            game.settings.contentElementDuration=castToType("number", game.settings.contentElementDuration);

            game.settings.minigames.mg1=castToType("boolean", game.settings.minigames.mg1);
            game.settings.minigames.mg2=castToType("boolean", game.settings.minigames.mg2);
            game.settings.random=castToType("boolean", game.settings.random);

            game.contentElements.forEach(function(contentElement){
                contentElement.likelyRepeats=castToType("number", contentElement.likelyRepeats);
                contentElement.repeatable=castToType("boolean", contentElement.repeatable);
                contentElement.str=castToType("string", contentElement.str);
                contentElement.type=castToType("contentElementType", contentElement.type);
            });
        });
    }
    catch(error) {
        console.log(error);
        return false;
    }
    return true;
}

//Hack function to decode HTML entities
var decodeHTML = function (html) {
	var txt = document.createElement('textarea');
	txt.innerHTML = html;
	return txt.value;
};

//Redraw the entire screen, don't select a game
function redraw() {
    removeGameButtons();
    removeGameSettings();
    removeGameElements();
    for(let i=0; i<file.length; i++) {
        addGameButton(file[i]["id"]);
    }
}






//Toggle a checkbox (function called by clicking on the checkbox)
function toggleCheckbox(property_id) {
    setCheckbox(property_id, saveData(property_id));
}

//Visually force the checkbox to either be ON or OFF
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


//Visually force an element to be inaccessible or accessible again
function setEnableState(context, id, state) {
    if (state) {
        context.querySelector("#"+id).classList.remove("setting-disabled");
    }
    else {
        context.querySelector("#"+id).classList.add("setting-disabled");
    }
}







//IDs

//Get the game's index inside the game array, based on its ID
function getIndexFromId(id) {
    for(let i=0; i<file.length; i++) {
        if(file[i]["id"]==id) {
            return i;
        }
    }
}

//Get the elements's index inside a game's (defined by id) array, based on its E-ID (element ID)
function getElementIndexFromEid(id, e_id) {
    for(let i=0; i<file[getIndexFromId(id)]["contentElements"].length; i++) {
        if(file[getIndexFromId(id)]["contentElements"][i]["id"]==e_id) {
            return i;
        }
    }
}

//Assign new, sequential IDs to each game
function reIdFile() {
    let i=0;
    for(i=0; i<file.length; i++) {
        file["id"]=i;
    }
    return i;   //the largest e_id, to set the nextElementId variable
}

//Assign new, sequential IDs to each element in the selected game
function reId(index) {
    let i=0;
    for(i=0; i<file[getIndexFromId(selectedGame)]["contentElements"].length; i++) {
        file[getIndexFromId(selectedGame)]["contentElements"][i]["id"]=i;
    }
    return i;   //the largest e_id, to set the nextElementId variable
}


//Utility function to swap the positions of two elements in an array
function swap(arr, x, y) {
    var b = arr[x];
    arr[x] = arr[y];
    arr[y] = b;
    return arr;
}


//Saves a property to the file object. This is called by functions called by updates on elements (This means user interaction). 
function saveData(property, id) {
    id = (typeof id === 'undefined') ? property : id;
    let game=file[getIndexFromId(selectedGame)];
    let val, minVal, maxVal;
    switch(property) {
        case 'name':
            game["properties"]["title"]=encodeInput(document.getElementById(id).value);
            setGameButtonTitle(selectedGame, game["properties"]["title"]);
            return game["properties"]["title"];
        case 'description':
            return game["properties"]["description"]=encodeInput(document.getElementById(id).value);
        case 'min':
            val=encodeInput(document.getElementById(id).value);
            if (!isNaN(val)) {
                if (val>=1) {
                    if(val>game["properties"]["players"]["max"]) {
                        game["properties"]["players"]["max"]=val;
                        document.getElementById("settings-players-max").value=val;
                    }
                    return game["properties"]["players"]["min"]=val;
                }
                else {
                    document.getElementById(id).value=1;
                    return game["properties"]["players"]["min"]=1;
                }
            }
            else {
                document.getElementById(id).value=1;
                return game["properties"]["players"]["min"]=1;
            }
            
        case 'max':
            val=encodeInput(document.getElementById(id).value);
            if (!isNaN(val)) {
                if (val>=1) {
                    if(val<game["properties"]["players"]["min"]) {
                        game["properties"]["players"]["min"]=val;
                        document.getElementById("settings-players-min").value=val;
                    }
                    return game["properties"]["players"]["max"]=val;
                }
                else {
                    document.getElementById(id).value=1;
                    return game["properties"]["players"]["max"]=1;
                }
            }
            else {
                document.getElementById(id).value=1;
                return game["properties"]["players"]["max"]=1;
            }
        case 'volume':
            maxVal=100;
            minVal=0;
            val=encodeInput(document.getElementById(id).value);
            if (!isNaN(val)) {
                if (val>=minVal && val<=maxVal) {
                    return game["properties"]["volume"]=val;
                }
                else {
                    if (val<minVal) {
                        document.getElementById(id).value=minVal;
                        return game["properties"]["volume"]=minVal;
                    }
                    if (val>maxVal) {
                        document.getElementById(id).value=maxVal;
                        return game["properties"]["volume"]=maxVal;
                    }
                    
                }
            }
            else {
                document.getElementById(id).value=maxVal;
                return game["properties"]["volume"]=maxVal;
            }
        case 'contentElementDuration':
            maxVal=599;
            minVal=60;
            val=encodeInput(document.getElementById(id).value);
            if (!isNaN(val)) {
                if (val>=minVal && val<=maxVal) {
                    return game["settings"]["contentElementDuration"]=val;
                }
                else {
                    if (val<minVal) {
                        document.getElementById(id).value=minVal;
                        return game["settings"]["contentElementDuration"]=minVal;
                    }
                    if (val>maxVal) {
                        document.getElementById(id).value=maxVal;
                        return game["settings"]["contentElementDuration"]=maxVal;
                    }
                    
                }
            }
            else {
                document.getElementById(id).value=maxVal;
                return game["settings"]["contentElementDuration"]=maxVal;
            }
        case 'condition':
            return game["properties"]["condition"]=encodeInput(document.getElementById(id).value);;
        case 'c_random':
            return game["settings"]["random"]=!game["settings"]["random"];
        case 'c_mg1':
            return game["settings"]["minigames"]["mg1"]=!game["settings"]["minigames"]["mg1"];
        case 'c_mg2':
            return game["settings"]["minigames"]["mg2"]=!game["settings"]["minigames"]["mg2"];
        case 'c_mg3':
            return game["settings"]["minigames"]["mg3"]=!game["settings"]["minigames"]["mg3"];
            
        default: 
            //Elements
            let type=property.match(/^e-(.*)_([0-9])$/);
            e_index=getElementIndexFromEid(selectedGame, Number(type[2]));
            console.log(type);
            console.log(e_index);
            switch(type[1]) {
                case "c-repeatable":
                    setEnableState(document, "e-box-probability_"+String(type[2]), !game["contentElements"][e_index]["repeatable"]);
                    return game["contentElements"][e_index]["repeatable"]=!game["contentElements"][e_index]["repeatable"];
                case "str":
                    return game["contentElements"][e_index]["str"]=document.getElementById(id).value;
                case 'probability':
                    maxVal=10;
                    minVal=1;
                    val=encodeInput(document.getElementById(id).value);
                    if (!isNaN(val)) {
                        if (val>=minVal && val<=maxVal) {
                            return game["contentElements"][e_index]["likelyRepeats"]=val;
                        }
                        else if(val<=maxVal) {
                            document.getElementById(id).value=minVal;
                            return game["contentElements"][e_index]["likelyRepeats"]=minVal;
                        }
                        else if(val>=minVal) {
                            document.getElementById(id).value=maxVal;
                            return game["contentElements"][e_index]["likelyRepeats"]=maxVal;
                        }
                    }
                    else {
                        document.getElementById(id).value=minVal;
                        return game["contentElements"][e_index]["likelyRepeats"]=minVal;
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
                    return game["contentElements"][e_index]["type"]=encodeInput(document.getElementById(id).value);
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
        title: "Uus mäng",
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
            mg1:true,
            mg2:true,
            mg3:true
        }
    };
    this.contentElements= [
        new ElementObject(),
    ];
}

//Create a new game: both its data and visuals
function newGame() {
    file.push(new GameObject());
    addGameButton(nextFileIndex);
    nextFileIndex++;
}
//Create a new element: both its data and visuals
function addElement(e_id) {
    let newElementId=nextElementId;
    file[getIndexFromId(selectedGame)]["contentElements"].splice(getElementIndexFromEid(selectedGame, e_id)+1, 0, new ElementObject());
    document.getElementById("e_"+String(e_id)).after(createElement(getElementIndexFromEid(selectedGame, newElementId)));
    reOrderElements();
    
}

//Make the game defined by its ID active, both its data and visuals
function selectGame(id) {
    selectedGame=id;
    removeGameElements();
    for(let i=0; i<file.length; i++) {
        document.getElementById("list-game-item-title_"+String(file[i]["id"])).classList.remove("list-game-item-title-active");
    }
    document.getElementById("list-game-item-title_"+String(id)).classList.add("list-game-item-title-active");
    nextElementId=reId();
    createGameSettings(id);
    createGameElements(id);
}
//Remove an element: both its data and visuals
function deleteElement(e_id) {
    if(file[getIndexFromId(selectedGame)]["contentElements"].length>1) {
        e_index=getElementIndexFromEid(selectedGame, e_id);
        file[getIndexFromId(selectedGame)]["contentElements"].splice(e_index, 1);
        removeElement(e_id);
    }
}
//Move an element: both its data and visuals
function sendToOrder(e_id) {
    let init_e_index=getElementIndexFromEid(selectedGame, e_id);
    let target_e_index=document.getElementById("e-seq_"+String(file[getIndexFromId(selectedGame)]["contentElements"][init_e_index]["id"])).value;
    if (target_e_index>=0 && target_e_index<file[getIndexFromId(selectedGame)]["contentElements"].length) {
        let arr=file[getIndexFromId(selectedGame)]["contentElements"];
        let tmp=arr.splice(init_e_index, 1);
        arr.splice(target_e_index, 0, tmp[0]);
        reOrderElements();
        let target=document.getElementById("e-bg_"+String(file[getIndexFromId(selectedGame)]["contentElements"][target_e_index]["id"]))
        target.scrollIntoView();
        triggerAnimation(target, "t-subtle-highlight");
    }
    else {
        document.getElementById("e-seq_"+String(file[getIndexFromId(selectedGame)]["contentElements"][init_e_index]["id"])).value=getIndexFromId(selectedGame, e_id);
        reOrderElements();
    }   
}
function moveUp(e_id) {
    let e_index=getElementIndexFromEid(selectedGame, e_id);
    if(e_index>0) {
        swap(file[getIndexFromId(selectedGame)]["contentElements"], e_index, e_index-1);
    }
    reOrderElements();
    triggerAnimation(document.getElementById("e-bg_"+String(e_id)), "t-subtle-highlight");
}
function moveDown(e_id) {
    let e_index=getElementIndexFromEid(selectedGame, e_id);
    if(e_index<file[getIndexFromId(selectedGame)]["contentElements"].length-1) {
        swap(file[getIndexFromId(selectedGame)]["contentElements"], e_index+1, e_index);
    }
    reOrderElements();
    triggerAnimation(document.getElementById("e-bg_"+String(e_id)), "t-subtle-highlight");
}

//Delete a game based on its ID
function deleteGame(id) {
    if (window.confirm("Kas soovid mängu kustutada?")) {
        for(let i=0; i<file.length; i++) {
            if(file[i]["id"]==id) {
                file.splice(i, 1);
                break;
            }
        }
        removeGameButton(id);
        removeGameSettings();
        removeGameElements();
        selectedGame=undefined;
    }
}












//Pure draw functions
function setGameButtonTitle(id, title) {
    document.getElementById("list-game-item-title-p_"+String(id)).innerHTML=title;
}
function createGameSettings(id) {
    document.getElementById("list-settings").innerHTML=`<h2>MÄNGU SEADED</h2>
    <h3 class="input-heading">Nimi</h3>
    <textarea onchange="saveData('name', 'settings-name')" spellcheck="false" class="t-area-wide list-settings-name" id="settings-name"></textarea>
    <h3 class="input-heading">Kirjeldus</h3>
    <textarea onchange="saveData('description', 'settings-desc')" spellcheck="false" class="t-area-wide list-settings-desc" id="settings-desc"></textarea>
    <h3>Sätted</h3>
    <p>Mängijate soovituslik arv<span class="input-bg"><input onchange="saveData('min', 'settings-players-min')" class="input-digit" id="settings-players-min"></input>kuni <input onchange="saveData('max', 'settings-players-max')" class="input-digit"  id="settings-players-max"></input></span></p>
    <p>Soovituslik vol<span class="input-bg"><input onchange="saveData('volume', 'settings-volume')" class="input-digit" id="settings-volume"></input>%</span></p>
    <p>Konditsioon
        <select onchange="saveData('condition', 'settings-condition')" class="select-str" id="settings-condition">
            <option value="0">Kaine</option>
            <option value="1">Juba timm</option>
            <option value="2">Lappes</option>
        </select>
    </p>

    <p>Küsimuse kestus<span class="input-bg"><input onchange="saveData('contentElementDuration', 'settings-contentElementDuration')" class="input-digit" id="settings-contentElementDuration"></input>sec</span></p>
    <p><span id="c_random" class="checkbox checkbox-unchecked" onclick="toggleCheckbox('c_random')"></span>Suvaline küsimuste järjestus</p>
    <h3>Minimängud</h3>

    <p><span id="c_mg1" class="checkbox checkbox-unchecked" onclick="toggleCheckbox('c_mg1')"></span>Truth Dare</p>
    <p><span id="c_mg2" class="checkbox checkbox-unchecked" onclick="toggleCheckbox('c_mg2')"></span>Tähelepanu test</p>
    <!--<p><span id="c_mg3" class="checkbox checkbox-unchecked" onclick="toggleCheckbox('c_mg3')"></span>Ayy lmao</p>-->`;

    document.getElementById("settings-name").value=decodeInput(file[getIndexFromId(selectedGame)]["properties"]["title"]);
    document.getElementById("settings-desc").value=decodeInput(file[getIndexFromId(selectedGame)]["properties"]["description"]);
    
    document.getElementById("settings-players-min").value=file[getIndexFromId(selectedGame)]["properties"]["players"]["min"];
    document.getElementById("settings-players-max").value=file[getIndexFromId(selectedGame)]["properties"]["players"]["max"];
    document.getElementById("settings-volume").value=file[getIndexFromId(selectedGame)]["properties"]["volume"];
    document.getElementById("settings-condition").value=file[getIndexFromId(selectedGame)]["properties"]["condition"];
    document.getElementById("settings-contentElementDuration").value=file[getIndexFromId(selectedGame)]["settings"]["contentElementDuration"];
    setCheckbox("c_random", file[getIndexFromId(selectedGame)]["settings"]["random"]);
    setCheckbox("c_mg1", file[getIndexFromId(selectedGame)]["settings"]["minigames"]["mg1"]);
    setCheckbox("c_mg2", file[getIndexFromId(selectedGame)]["settings"]["minigames"]["mg2"]);
    //setCheckbox("c_mg3", file[getIndexFromId(selectedGame)]["settings"]["minigames"]["mg3"]);
    
}
function removeElement(e_id) {
    document.getElementById("e_"+String(e_id)).remove();
    reOrderElements();
    
}
function removeGameSettings() {
    document.getElementById("list-settings").innerHTML="";
}
function createGameElements() {
    for(let i=0; i<file[getIndexFromId(selectedGame)]["contentElements"].length; i++) {
        document.getElementById("list-elements").appendChild(createElement(i));
    }
    reOrderElements();
}
function removeGameElements () {
    document.getElementById("list-elements").innerHTML="";
}
function createElement(e_index) {
    e_id=file[getIndexFromId(selectedGame)]["contentElements"][e_index]["id"];
    let element=document.createElement('div');
    element.id="e_"+String(e_id);
    element.style="order:"+String(e_index)+";";
    element.innerHTML=`<div id="e-bg_`+String(e_id)+`" class="list-element-item">
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
            <input id="e-seq_`+String(e_id)+`" onchange="sendToOrder('`+String(e_id)+`')">
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
    <p><span id="e-c-repeatable_`+String(e_id)+`" class="checkbox checkbox-unchecked" onclick="toggleCheckbox('e-c-repeatable_`+String(e_id)+`')"></span>Korduv <span id="e-box-probability_`+String(e_id)+`"><span class="input-bg"><input onchange="saveData('e-probability_`+String(e_id)+`')" class="input-digit" id="e-probability_`+String(e_id)+`"></input></span>Tõenäoliseim korduste arv</span></p>
</div>`;
    element.querySelector("#e-seq_"+String(e_id)).value=e_index;
    element.querySelector("#e-str_"+String(e_id)).value=decodeInput(file[getIndexFromId(selectedGame)]["contentElements"][e_index]["str"]);
    element.querySelector("#e-probability_"+String(e_id)).value=file[getIndexFromId(selectedGame)]["contentElements"][e_index]["likelyRepeats"];
    element.querySelector("#e-type_"+String(e_id)).value=file[getIndexFromId(selectedGame)]["contentElements"][e_index]["type"];
    setCheckbox("e-c-repeatable_"+String(e_id), file[getIndexFromId(selectedGame)]["contentElements"][e_index]["repeatable"], element);
    setEnableState(element, "e-box-probability_"+String(e_id), file[getIndexFromId(selectedGame)]["contentElements"][e_index]["repeatable"]);
    return element;
    
}
function reOrderElements() {
    for(let e_index=0; e_index<file[getIndexFromId(selectedGame)]["contentElements"].length; e_index++) {
        document.getElementById("e_"+String(file[getIndexFromId(selectedGame)]["contentElements"][e_index]["id"])).style="order: "+String(e_index)+";";
        document.getElementById("e-seq_"+String(file[getIndexFromId(selectedGame)]["contentElements"][e_index]["id"])).value=e_index;
    }
}

//Hack to trigger a transition, since it doesn't do this by itself if the class is changed immidiately after creation
function triggerAnimation(target, className) {
    target.classList.remove(className);
    target.offsetWidth;
    target.classList.add(className);
}

function addGameButton(id) {
    document.getElementById("list-game-list").innerHTML+=`<div class="list-game-item list-game-button" id="list-game-item_`+String(id)+`">
    <div class="list-game-item-title" id="list-game-item-title_`+String(id)+`" onclick="selectGame(`+String(id)+`)">
        <p id="list-game-item-title-p_`+String(id)+`">`+file[getIndexFromId(id)]["properties"]["title"]+`</p>
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

