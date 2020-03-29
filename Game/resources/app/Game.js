const DEBUG=true;
const fs = require("fs");
const path = require("path");

var color=new function() {
    this.tones={
        min: 0,
        max: 255,
        constrain: function(number) {
            if (number>this.max || number<this.min) {
                notify("Tone color value out of bounds", "function");
            }
            return Math.min(this.max, Math.max(this.min, number));
        }
    };
    this.bases={ 
        min: 30,
        max: 225,
        constrain:function(number) {
            if (number>this.max || number<this.min) {
                notify("Base color value out of bounds", "function");
            }
            return Math.min(this.max, Math.max(this.min, number));
        },
    };
    this.normalizeHSL_SL=function(value) {
        const i_min=0;
        const i_max=255;
        const o_min=0;
        const o_max=100;
        return this.normalize(value, i_min, i_max, o_min, o_max);
    };
    this.normalize100_255=function(value) {
        const i_min=0;
        const i_max=100;
        const o_min=0;
        const o_max=255;
        return this.normalize(value, i_min, i_max, o_min, o_max);
    };
    this.normalizeHSL_H=function(value) {
        const i_min=0;
        const i_max=255;
        const o_min=0;
        const o_max=360;
        return this.normalize(value, i_min, i_max, o_min, o_max);
    };
    this.normalize=function(value, i_min, i_max, o_min, o_max) {
        let part=value/(i_max-i_min);
        return (part*(o_max-o_min)).toFixed(0);
    };
    this.Color=function(H, S, L) {
        this.H=H;
        this.S=S;
        this.L=L;
    };
    this.Color100;
    this.css=function(values) {
        return "hsl("+this.normalizeHSL_H(values.H)+","+this.normalizeHSL_SL(values.S)+"%,"+this.normalizeHSL_SL(values.L)+"%)";
    };
    this.getTones=function(color) {
        return {
            dull: new this.Color(this.tones.constrain(color.H), this.tones.constrain(color.S-100), this.tones.constrain(color.L)),
            darkest: new this.Color(this.tones.constrain(color.H), this.tones.constrain(color.S), this.tones.constrain(color.L-70)),
            dark: new this.Color(this.tones.constrain(color.H), this.tones.constrain(color.S), this.tones.constrain(color.L-40)),
            normal: new this.Color(this.tones.constrain(color.H), this.tones.constrain(color.S), this.tones.constrain(color.L)),
            bright: new this.Color(this.tones.constrain(color.H), this.tones.constrain(color.S*1.3), this.tones.constrain(color.L+20)),
            brightest: new this.Color(this.tones.constrain(color.H), this.tones.constrain(color.S*1.6), this.tones.constrain(color.L+100)),
            bloom: new this.Color(this.tones.constrain(color.H), this.tones.constrain(color.S*0.4-10), this.tones.constrain(color.L+100))
        }
    };
    this.getPalette=function(fgColor, bgColor) {
        return {
            bg: this.getTones(bgColor),
            fg: this.getTones(fgColor)
        }
    };
    this.palette= undefined;
}
color.Color100=function(H, S, L) {
    this.H=color.normalize100_255(H);
    this.S=color.normalize100_255(S);
    this.L=color.normalize100_255(L);
};



var screens = [
    {
        screenObject: {
            type: "task",
            initialiser: task_handler, //(divObject,)
            contentElementObject:{
                str:"Task1 sisu mida iganes"
            },//Jupp JSONist ainult mis vaja on kuidas see siia saada veel vaatab
            settings: {//tühi, need täidab mingi funktsioon startupil
                colors: color,
                duration: 180,
                jne:0

            }
        }

    },
    {   
        screenObject: {
            type: "question",
            initialiser: question_handler, 
            contentElementObject:{
                str:"Question1 sisu mida iganes"
            },
            settings: {
                colors: color,
                duration: 180,
                jne:0

            }
        }
    },
    {
        screenObject:{
            type: "minigame",
            initialiser: minigame_handler,
            contentElementObject:{
            
            },
            settings: {
                colors: color,

            }
        }
    },
    {
        screenObject: {
            type: "gameMenu",
            initialiser: gameMenu_handler, 
            prototypeElementObject:{   
                "title": "",
                "duration": 0,
                "description": "",
                "players":
                {
                    "min": 0,
                    "max": 0
                },           
                "volume": 0,
                "condition": 0
            },
            contentElementObject:[
            ],
            settings: {
                colors: color,

            }
        }
    },
    {
        screenObject:{
            type: "settingsMenu",
            initialiser: settingsMenu_handler,
            contentElementObject:{
                str:"Mdea"
            },
            settings: {
                colors: color,
                duration: 180,
                jne:0

            }
        }
    },
    {
        screenObject:{
            type: "splash",
            initialiser: splash_handler,
            contentElementObject:{
                topBox:"Mdea",
                bottomBox:"Mdea"
            },
            settings: {
                colors: color,
                jne:0

            }
        }
    },
    {
        screenObject:{
            type: "save",
            initialiser: save_handler,
            contentElementObject:{
            },
            settings: {
                colors: color,
            }
        }
    }
]
var game;

var localTimerIds=[];

var i,j,k,l;

var savefile;

function notify(str, typestr) {
	var typeColors={
		"draw": {
			"c":"#fff",
			"b":"#00dc72"
		},
		"update": {
			"c":"#fff",
			"b":"#8300dc"
		},
		"function": {
			"c":"#fff",
			"b":"#b1034b"
		}
	};
	if(DEBUG==true) {
		if(typeColors[typestr]!=undefined) {
			console.log('%c '+typestr+" %c  "+str, 'background:'+typeColors[typestr]["b"]+'; color:'+typeColors[typestr]["c"]+";", "" );
		}
		else {
			console.log(str);
		}
		
	}
}

function gameOrderer(){
    var nrOfContentElements=game.content[savefile.gameData.selectedGame].contentElements.length;  
    var nrOfType=nrOfContentElements;
    for(i=0;i<nrOfContentElements;i++){
        if(game.content[savefile.gameData.selectedGame].contentElements[i].repeatable){
            nrOfType=nrOfType + game.content[savefile.gameData.selectedGame].contentElements[i].likelyRepeats-1;
            }
    }
    var gameOrder=new Array(nrOfType);
    var currentTypeNr=0;
    var j;
    for(i=0;i<nrOfType;i++){
        if(game.content[savefile.gameData.selectedGame].contentElements[currentTypeNr].repeatable){
            for(j=0;j<game.content[savefile.gameData.selectedGame].contentElements[currentTypeNr].likelyRepeats;j++){
                gameOrder[i+j]=currentTypeNr
            }
            i=i+j-1;
        }
        else if(!(game.content[savefile.gameData.selectedGame].contentElements[currentTypeNr].repeatable)){
            gameOrder[i]=currentTypeNr;
        }
        currentTypeNr++;
    }

    for(i=0;i<((gameOrder.length)/5);i++){
        if(savefile.settings.toggle[0]===1){
            gameOrder.push(-1);
        }
        if(savefile.settings.toggle[1]===1){
            gameOrder.push(-2);
        }
    }
    if(game.content[savefile.gameData.selectedGame].settings.random){shuffle(gameOrder);}
    console.log(gameOrder);
    return gameOrder;
    
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {                   
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;                   
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function startTimer(duration,timerLocationId,onTimeout,whatNext,localTimerIds) {

    let timer = duration;
    let minutes=1;
    let seconds=1;
 
    localTimerIds.push(setInterval(function timerInterval() {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        
        seconds = seconds < 10 ? "0" + seconds : seconds;
        document.getElementById(timerLocationId).innerHTML = minutes + ":" + seconds;
        if(timer===0){notify("TIMER 0", "function");;onTimeout(whatNext);}
        if(i===100){i=0;timer--;}
        i++;
        }, 10));
}

function UIDgenerator(){
    let UID="id"
    var char='abcdefghijklmnopqrstuvwxyz0123456789';
   for (i = 0; i < 7; i++) {
      UID += char.charAt(Math.floor(Math.random() * 36));
   }
    return UID;
}

function startup(){
    savefileLoader(); 
    gamefileLoader();
    footerColors();
    if(savefile.gameData.state===2){
        nextScreen("save");
    }
    else exitScreen("gameMenu");
}

function savefileSaver(){
    let strFile=JSON.stringify(savefile,null,1);
    let savepath = path.join(__dirname, 'savefile.JSON');
    console.log(savepath);
    fs.writeFileSync(savepath, strFile, function (err){if(DEBUG)notify("Save ERROR","function")});
}

function savefileLoader(){
    let savepath = path.join(__dirname, 'savefile.JSON');
    console.log(savepath);
    let loadFile = fs.readFileSync(savepath);
    savefile=JSON.parse(loadFile);
}

function gamefileLoader(){
    let gamepath = path.join(__dirname, 'gamefile.JSON');
    console.log(gamepath);
    let loadFile = fs.readFileSync(gamepath);
    game=JSON.parse(loadFile);
}

function footerColors(){
    let screenSettings={colors:color};
    screenSettings["colors"].bgcolor=new screenSettings["colors"].Color100(savefile.settings.color.background[0],savefile.settings.color.background[1],savefile.settings.color.background[2]);
    screenSettings["colors"].fgcolor=new screenSettings["colors"].Color100(savefile.settings.color.foreground[0],savefile.settings.color.foreground[1],savefile.settings.color.foreground[2]);
    let palette=screenSettings["colors"].palette;
    palette=screenSettings["colors"].getPalette(screenSettings["colors"].fgcolor, screenSettings["colors"].bgcolor);
    document.documentElement.style.setProperty("--primaryColor",screenSettings.colors.css(palette.fg.normal));
    document.documentElement.style.setProperty("--backgroundColor",screenSettings.colors.css(palette.bg.normal));
    document.documentElement.style.setProperty("--dullColor",screenSettings.colors.css(palette.bg.dull));
    document.documentElement.style.setProperty("--secondaryColor",screenSettings.colors.css(palette.bg.darkest));
}

function nextScreen(nextType) {
    var UID=UIDgenerator();
    var screen=getScreenObjectFromType(nextType); 
    screenObjectFiller(nextType,UID);
    notify("Next:"+nextType,"update");
    screen["initialiser"](document.getElementById("bodyId"),document.getElementById("styleId"),controls, screen.contentElementObject,localTimerIds,screen.settings,savefile.gameData,savefile.settings,UID);//paneb kokku handleri ja kutsub välja 
}

function getScreenObjectFromType(nextType){

    for(i=0;i<(screens.length);i++){
        if(screens[i].screenObject.type===nextType){
            if(DEBUG) console.log(screens[i].screenObject);
            return screens[i].screenObject;}  
    }
    
    return console.error("Screens on katki!");
    ;
}

function screenObjectFiller(nextType,UID){
    if(DEBUG){
        console.log(nextType);
        console.log(savefile.gameData.state);
    }
    if(savefile.gameData.state===1){
        for(i=0;i<game.content.length;i++){
            screens[3].screenObject.contentElementObject[i]=JSON.parse(JSON.stringify(screens[3].screenObject.prototypeElementObject));
            selectedObject=screens[3].screenObject.contentElementObject[i];
            selectedObject.title=game.content[i].properties.title;
            selectedObject.duration=game.content[i].properties.duration;
            selectedObject.description=game.content[i].properties.description;
            selectedObject.players.min=game.content[i].properties.players.min;
            selectedObject.players.max=game.content[i].properties.players.max;
            selectedObject.volume=game.content[i].properties.volume;
            selectedObject.condition=game.content[i].properties.condition;
        }
    }
    else if(savefile.gameData.state===2){
        if(nextType==="task"){
            screens[0].screenObject.contentElementObject.str=game.content[savefile.gameData.selectedGame].contentElements[savefile.gameData.gameOrder[savefile.gameData.currentQuestion]].str;
            screens[0].screenObject.settings.duration=game.content[savefile.gameData.selectedGame].settings.contentElementDuration;
        }
        else if(nextType==="question"){
            screens[1].screenObject.contentElementObject.str=game.content[savefile.gameData.selectedGame].contentElements[savefile.gameData.gameOrder[savefile.gameData.currentQuestion]].str;
            screens[1].screenObject.settings.duration=game.content[savefile.gameData.selectedGame].settings.contentElementDuration;
        }
        else if(nextType==="splash"){
            if(savefile.gameData.currentQuestion===0 || savefile.gameData.currentQuestion>=savefile.gameData.gameOrder.length){
                screens[5].screenObject.contentElementObject.topBox=`<div class='`+UID+`topBox'>`+(savefile.gameData.selectedGame+1)+`</div>`;
                screens[5].screenObject.contentElementObject.bottomBox=`<div class='`+UID+`bottomBox'>`+game.content[savefile.gameData.selectedGame].properties.title+`</div>`;  
            }
            else if(savefile.gameData.gameOrder[savefile.gameData.currentQuestion]===-1){
                screens[5].screenObject.contentElementObject.topBox=`<svg class="`+UID+`trisign" version="1.1" viewBox="0 0 50.8 50.8" preserveAspectRatio="xMinYMin meet" xmlns="http://www.w3.org/2000/svg">
                    <g transform="translate(0,-246.2)">
                        <path d="m25.524 250.97a2.6461 2.6461 0 0 0-0.26405 0 2.6461 2.6461 0 0 0-2.1508 1.3183l-20.164 34.927a2.6461 2.6461 0 0 0 2.2913 3.9688h40.328a2.6461 2.6461 0 0 0 2.2908-3.9688l-20.164-34.926a2.6461 2.6461 0 0 0-2.1673-1.3193zm-6.4849 16.284 13.17 13.172v-9.3224h3.3357v15.018h-15.015v-3.3378h9.3183l-13.168-13.17z" style="fill:var(--svg-fgcolor)"/>
                    </g>
                </svg>`;
                screens[5].screenObject.contentElementObject.bottomBox=`<div class='`+UID+`bottomBox'>TRUTH OR<br>DARE</div>`;
            }
            else if(savefile.gameData.gameOrder[savefile.gameData.currentQuestion]===-2){
                screens[5].screenObject.contentElementObject.topBox=`<svg class="`+UID+`trisign" version="1.1" viewBox="0 0 50.8 50.8" preserveAspectRatio="xMinYMin meet" xmlns="http://www.w3.org/2000/svg">
                    <g transform="translate(0,-246.2)">
                        <path d="m25.525 250.97a2.6461 2.6461 0 0 0-0.26511 0 2.6461 2.6461 0 0 0-2.1502 1.3204l-20.164 34.924a2.6461 2.6461 0 0 0 2.2908 3.9688h40.328a2.6461 2.6461 0 0 0 2.2908-3.9688l-20.164-34.924a2.6461 2.6461 0 0 0-2.1663-1.3208zm-0.16536 8.4264a2.6461 2.6461 0 0 1 2.6851 2.6836v12.699a2.6461 2.6461 0 1 1-5.2906 0v-12.699a2.6461 2.6461 0 0 1 2.6055-2.6836zm0 21.168a2.6461 2.6461 0 0 1 2.6851 2.682v0.26564a2.6461 2.6461 0 1 1-5.2906 0v-0.26564a2.6461 2.6461 0 0 1 2.6055-2.682z" style="fill:var(--svg-fgcolor)"/>
                    </g>
                </svg>`;
                
                screens[5].screenObject.contentElementObject.bottomBox=`<div class='`+UID+`bottomBox'>REACTION<br>TEST</div>`;
            }
        }
    }

}

function nextTypeFinder(){
    if(savefile.gameData.state===1){type="gameMenu"}
    if(savefile.gameData.state===2){
        if(savefile.gameData.currentQuestion>=savefile.gameData.gameOrder.length) return "splash";
        if(0<=(savefile.gameData.gameOrder[savefile.gameData.currentQuestion])){
            type=game.content[savefile.gameData.selectedGame].contentElements[savefile.gameData.gameOrder[savefile.gameData.currentQuestion]].type;
        }
        else if(0>=(savefile.gameData.gameOrder[savefile.gameData.currentQuestion])){
            type="minigame"
        }
    }
    if(savefile.gameData.state===3){type="settingsMenu"}

    return type;
}

function MenuSetState(elementId,state,selected,notSelected) {
    var element = document.getElementById(elementId);
    if (state=="selected") {
        element.classList.remove(notSelected);
        element.classList.add(selected);
    }
    else if (state=="not selected") {
        element.classList.remove(selected);
        element.classList.add(notSelected);
    }
}

function save_handler(context, style, controls, contentElementObject, localTimerIds ,screenSettings,gameData,settings,UID){
    screenSettings["colors"].bgcolor=new screenSettings["colors"].Color100(settings.color.background[0],settings.color.background[1],settings.color.background[2]);
    screenSettings["colors"].fgcolor=new screenSettings["colors"].Color100(settings.color.foreground[0],settings.color.foreground[1],settings.color.foreground[2]);
    let palette=screenSettings["colors"].palette;
    palette=screenSettings["colors"].getPalette(screenSettings["colors"].fgcolor, screenSettings["colors"].bgcolor);
    
    style.innerHTML=`:root {
     
        --`+UID+`_fgColorDull: `+screenSettings.colors.css(palette.fg.dull)+`;
        --`+UID+`_fgColorDarkest: `+screenSettings.colors.css(palette.fg.darkest)+`;
        --`+UID+`_fgColorDark: `+screenSettings.colors.css(palette.fg.dark)+`;

        --`+UID+`_fgColor: `+screenSettings.colors.css(palette.fg.normal)+`;
        
        --`+UID+`_fgColorBright: `+screenSettings.colors.css(palette.fg.bright)+`;
        --`+UID+`_fgColorBrightest: `+screenSettings.colors.css(palette.fg.brightest)+`;
        --`+UID+`_fgColorBloom: `+screenSettings.colors.css(palette.fg.bloom)+`;


        --`+UID+`_bgColorDull: `+screenSettings.colors.css(palette.bg.dull)+`;
        --`+UID+`_bgColorDarkest: `+screenSettings.colors.css(palette.bg.darkest)+`;
        --`+UID+`_bgColorDark: `+screenSettings.colors.css(palette.bg.dark)+`;

        --`+UID+`_bgColor: `+screenSettings.colors.css(palette.bg.normal)+`;
        
        --`+UID+`_bgColorBright: `+screenSettings.colors.css(palette.bg.bright)+`;
        --`+UID+`_bgColorBrightest: `+screenSettings.colors.css(palette.bg.brightest)+`;
        --`+UID+`_bgColorBloom: `+screenSettings.colors.css(palette.bg.bloom)+`;
    }
    body {
        background:var(--`+UID+`_bgColor);
        overflow: hidden;
        margin: 0;
    }
    .`+UID+`game-save-menu-title{
        color: var(--`+UID+`_fgColor);
        margin: auto;
        text-align: center;
        font-size:1.5em;
    }
    
    .`+UID+`game-save-menu-head-selected{
        color: var(--`+UID+`_bgColorDarkest);
        background-color: var(--`+UID+`_fgColor);
        
        border: var(--`+UID+`_fgColor);
        border-style: solid;
        border-width: 15px 0 15px 0;
    }
    .`+UID+`game-save-menu-head-not-selected{
        color: var(--`+UID+`_fgColor);
        background-color: var(--`+UID+`_bgColorDarkest);
        
        border: var(--`+UID+`_bgColorDarkest);
        border-style: solid;
        border-width: 15px 0 15px 0;
    }
    .`+UID+`game-save-menu-head{
        margin: auto;
        text-align: center;
        width: 80%;
        margin-block-start: 1em;
        margin-block-end: 1em;
        font-size: 1.5em;
    }
    .`+UID+`game-save-menu-head h2{
        margin-block-start: 0;
        margin-block-end: 0;
    }
    .`+UID+`game-save-menu-description {
        color: var(--`+UID+`_fgColor);
        background: var(--`+UID+`_bgColorDark);
        margin-block-start:0em;
    }
    .`+UID+`body-main-div{
        top: 10%;
        left: 0%;
        width: 100%;
        position: absolute;
    }
    .`+UID+`description-wrapper h2{
        margin: auto;
        margin-block-start: 0;
        margin-block-end: 0;
        font-weight:normal;
    }
    .`+UID+`description-wrapper{
        width:80%;
        margin: auto;
        overflow: hidden;
    }
    `;
    var screenElement=document.createElement("div");
    screenElement.setAttribute("id",UID+"body-wrapper");

    let content=`<div class="`+UID+`body-main-div" id="`+UID+`bodyMainDiv">
    <div class="`+UID+`game-save-menu-title" id="`+UID+`MainHeader">
    <h1>Mängu laadimine</h1></div>
    <div class="`+UID+`game-save-menu-element" id="`+UID+`setting-0">
        <div class="`+UID+`game-save-menu-head `+UID+`game-save-menu-head-selected" id="`+UID+`head-0">
            <h2>Uus Mäng</h2>
        </div>
        <div id="`+UID+`setting-0-0"></div>
    </div>
    <div class="`+UID+`game-save-menu-element" id="`+UID+`setting-1">
        <div class="`+UID+`game-save-menu-head `+UID+`game-save-menu-head-not-selected" id="`+UID+`head-1">
            <h2>Eelmine Mäng</h2>
        </div>
        <div id="`+UID+`setting-1-0"></div>
    </div>
    </div>
    `; 

    screenElement.innerHTML=content;
    context.appendChild(screenElement);

    var selectedSave=0;

    saveSubMenuIn(selectedSave);
    function saveSubMenuIn(SubMenu){
        if(SubMenu===0){var description="Alustage uut mängu mänguvaliku menüüst!"}
        else{var description="Jätkake eelmist poolelijäänud mängu!"}
        screenElement.querySelector("#"+UID+"setting-"+SubMenu+"-0").innerHTML=`<div></div>
        <div class="`+UID+`game-save-menu-description" id="`+UID+`description">
            <div class="`+UID+`description-wrapper" id="`+UID+`description-wrapper"><h2>`+description+`</h2></div>
        </div>`;
    }

    function saveSubMenuOut(SubMenu){
        screenElement.querySelector("#"+UID+"setting-"+SubMenu+"-0").innerHTML="";
    }

    function menuUp(){
        MenuSetState(UID+'head-'+selectedSave, 'not selected',UID+'game-save-menu-head-selected',UID+'game-save-menu-head-not-selected');

        saveSubMenuOut(selectedSave);
        selectedSave--;
        if(selectedSave===-1){selectedSave=1;}
        saveSubMenuIn(selectedSave);
       
        MenuSetState(UID+'head-'+selectedSave, 'selected',UID+'game-save-menu-head-selected',UID+'game-save-menu-head-not-selected');
    }
    function menuDown(){
        MenuSetState(UID+'head-'+selectedSave, 'not selected',UID+'game-save-menu-head-selected',UID+'game-save-menu-head-not-selected');
        
        saveSubMenuOut(selectedSave);
        selectedSave++;
        if(selectedSave===2){selectedSave=0;}
        saveSubMenuIn(selectedSave);

        MenuSetState(UID+'head-'+selectedSave, 'selected',UID+'game-save-menu-head-selected',UID+'game-save-menu-head-not-selected');
    }
    function selectSave(){
        if(selectedSave){
            savefile.gameData.currentQuestion--;
            exitScreen("nextType");
        }
        else{exitScreen("gameMenu");}
    };
    controls.key.set("up",0,menuUp,"Move Up");
    controls.key.set("down",0,menuDown,"Move Down");
    controls.key.set("confirm",0,selectSave,"Select Save");
}

function task_handler(context, style, controls, contentElementObject, localTimerIds ,screenSettings,gameData,settings,UID) {
    screenSettings["colors"].bgcolor=new screenSettings["colors"].Color100(settings.color.background[0],settings.color.background[1],settings.color.background[2]);
    screenSettings["colors"].fgcolor=new screenSettings["colors"].Color100(settings.color.foreground[0],settings.color.foreground[1],settings.color.foreground[2]);
    let palette=screenSettings["colors"].palette;
    palette=screenSettings["colors"].getPalette(screenSettings["colors"].fgcolor, screenSettings["colors"].bgcolor);
    
    style.innerHTML=`:root {
     
        --`+UID+`_fgColorDull: `+screenSettings.colors.css(palette.fg.dull)+`;
        --`+UID+`_fgColorDarkest: `+screenSettings.colors.css(palette.fg.darkest)+`;
        --`+UID+`_fgColorDark: `+screenSettings.colors.css(palette.fg.dark)+`;

        --`+UID+`_fgColor: `+screenSettings.colors.css(palette.fg.normal)+`;
        
        --`+UID+`_fgColorBright: `+screenSettings.colors.css(palette.fg.bright)+`;
        --`+UID+`_fgColorBrightest: `+screenSettings.colors.css(palette.fg.brightest)+`;
        --`+UID+`_fgColorBloom: `+screenSettings.colors.css(palette.fg.bloom)+`;


        --`+UID+`_bgColorDull: `+screenSettings.colors.css(palette.bg.dull)+`;
        --`+UID+`_bgColorDarkest: `+screenSettings.colors.css(palette.bg.darkest)+`;
        --`+UID+`_bgColorDark: `+screenSettings.colors.css(palette.bg.dark)+`;

        --`+UID+`_bgColor: `+screenSettings.colors.css(palette.bg.normal)+`;
        
        --`+UID+`_bgColorBright: `+screenSettings.colors.css(palette.bg.bright)+`;
        --`+UID+`_bgColorBrightest: `+screenSettings.colors.css(palette.bg.brightest)+`;
        --`+UID+`_bgColorBloom: `+screenSettings.colors.css(palette.bg.bloom)+`;
    }
    body {
        background:var(--`+UID+`_bgColor);
        overflow: hidden;
        margin: 0;
    }

    .`+UID+`game-contentElements-head{
        position: absolute;
        top: 20%;
        width: 70%;
        left: 15%;
        height: 72px;
    }
    .`+UID+`game-contentElements-str {
        position: absolute;
        color: var(--`+UID+`_fgColor);
        background-color: var(--`+UID+`_bgColorDark);
        top: 29%;
        left: 0%;
        width: 100%;
        
        
    }
    .`+UID+`game-contentElements-str p{
        width: 70%;
        margin: auto;
        font-size: 1.5em;
    
    }
    .`+UID+`game-contentElements-nr{
        color: var(--`+UID+`_bgColorDarkest);
        background-color: var(--`+UID+`_fgColor);
        float: left;
        width: 72px;
    
        text-align: center;
        
        font-size: 1.5em;
    
        border: var(--`+UID+`_fgColor);
        border-style: solid;
        border-width: 15px 0 15px 0;
        margin-right: 10px;
    }
    .`+UID+`game-contentElements-type{
        color:var(--`+UID+`_bgColorDarkest);
        background-color: var(--`+UID+`_fgColor);
        margin-left: 82px;
        
    
        font-size: 1.5em;
    
        border: var(--`+UID+`_fgColor);
        border-style: solid;
        border-width: 15px;
    }
    .`+UID+`game-contentElements-type h2{
        margin-block-start: 0;
        margin-block-end: 0;
    }
    .`+UID+`game-contentElements-nr h2{
        margin-block-start: 0;
        margin-block-end: 0;
    }
    .`+UID+`timer {
        float: right;
    }
    `;


    var screenElement=document.createElement("div");
    screenElement.setAttribute("id",UID+"body-wrapper");

    let content=`<div class="`+UID+`game-contentElements-head" id="`+UID+`gameHead">
    <div class="`+UID+`game-contentElements-nr" id="`+UID+`nr"><h2>0</h2></div>
    <div class="`+UID+`game-contentElements-type" id="`+UID+`type">
    <h2>Ülesanne<a class="`+UID+`timer" id="`+UID+`task-timer">Timer</a></h2></div></div>
    <div class="`+UID+`game-contentElements-str" id="`+UID+`task"></div>
    `;

    screenElement.innerHTML=content;
    context.appendChild(screenElement);
    screenElement.querySelector("#"+UID+"nr").innerHTML="<h2>"+(gameData.currentQuestion + 1)+"</h2>";console.log((gameData.currentQuestion + 1));
    screenElement.querySelector("#"+UID+"task").innerHTML="<p>"+contentElementObject.str+"</p>";
    
    startTimer(screenSettings.duration,UID+"task-timer",exitScreen,"nextType",localTimerIds);

    function taskNextQuestion() {
        console.log("task-right");
        exitScreen("nextType");
    }
    
    function taskPreviousQuestion() {
        console.log("task-left");
        exitScreen("previousType");
    }
    function gameMenu(){
        console.log("task-menu");
        exitScreen("gameMenu");
    }
    
    controls.key.set("up",1000,gameMenu,"Exit Game");
    controls.key.set("left",0,taskPreviousQuestion,"Previous Question");
    controls.key.set("right",0,taskNextQuestion,"Next Question");
    
}

function question_handler(context, style, controls, contentElementObject, localTimerIds ,screenSettings,gameData,settings,UID){
    screenSettings["colors"].bgcolor=new screenSettings["colors"].Color100(settings.color.background[0],settings.color.background[1],settings.color.background[2]);
    screenSettings["colors"].fgcolor=new screenSettings["colors"].Color100(settings.color.foreground[0],settings.color.foreground[1],settings.color.foreground[2]);
    let palette=screenSettings["colors"].palette;
    palette=screenSettings["colors"].getPalette(screenSettings["colors"].fgcolor, screenSettings["colors"].bgcolor);
    
    style.innerHTML=`:root {
     
        --`+UID+`_fgColorDull: `+screenSettings.colors.css(palette.fg.dull)+`;
        --`+UID+`_fgColorDarkest: `+screenSettings.colors.css(palette.fg.darkest)+`;
        --`+UID+`_fgColorDark: `+screenSettings.colors.css(palette.fg.dark)+`;

        --`+UID+`_fgColor: `+screenSettings.colors.css(palette.fg.normal)+`;
        
        --`+UID+`_fgColorBright: `+screenSettings.colors.css(palette.fg.bright)+`;
        --`+UID+`_fgColorBrightest: `+screenSettings.colors.css(palette.fg.brightest)+`;
        --`+UID+`_fgColorBloom: `+screenSettings.colors.css(palette.fg.bloom)+`;


        --`+UID+`_bgColorDull: `+screenSettings.colors.css(palette.bg.dull)+`;
        --`+UID+`_bgColorDarkest: `+screenSettings.colors.css(palette.bg.darkest)+`;
        --`+UID+`_bgColorDark: `+screenSettings.colors.css(palette.bg.dark)+`;

        --`+UID+`_bgColor: `+screenSettings.colors.css(palette.bg.normal)+`;
        
        --`+UID+`_bgColorBright: `+screenSettings.colors.css(palette.bg.bright)+`;
        --`+UID+`_bgColorBrightest: `+screenSettings.colors.css(palette.bg.brightest)+`;
        --`+UID+`_bgColorBloom: `+screenSettings.colors.css(palette.bg.bloom)+`;
    }
    body {
        background:var(--`+UID+`_bgColor);
        overflow: hidden;
        margin: 0;
    }

    .`+UID+`game-contentElements-head{
        position: absolute;
        top: 20%;
        width: 70%;
        left: 15%;
        height: 72px;
    }
    .`+UID+`game-contentElements-str {
        position: absolute;
        color: var(--`+UID+`_fgColor);
        background-color: var(--`+UID+`_bgColorDark);
        top: 29%;
        left: 0%;
        width: 100%;
        
        
    }
    .`+UID+`game-contentElements-str p{
        width: 70%;
        margin: auto;
        font-size: 1.5em;
    
    }
    .`+UID+`game-contentElements-nr{
        color: var(--`+UID+`_bgColorDarkest);
        background-color: var(--`+UID+`_fgColor);
        float: left;
        width: 72px;
    
        text-align: center;
        
        font-size: 1.5em;
    
        border: var(--`+UID+`_fgColor);
        border-style: solid;
        border-width: 15px 0 15px 0;
        margin-right: 10px;
    }
    .`+UID+`game-contentElements-type{
        color:var(--`+UID+`_bgColorDarkest);
        background-color: var(--`+UID+`_fgColor);
        margin-left: 82px;
        
    
        font-size: 1.5em;
    
        border: var(--`+UID+`_fgColor);
        border-style: solid;
        border-width: 15px;
    }
    .`+UID+`game-contentElements-type h2{
        margin-block-start: 0;
        margin-block-end: 0;
    }
    .`+UID+`game-contentElements-nr h2{
        margin-block-start: 0;
        margin-block-end: 0;
    }
    .`+UID+`timer {
        float: right;
    }
    `;

    var screenElement=document.createElement("div");
    screenElement.setAttribute("id",UID+"body-wrapper");

    let content=`<div class="`+UID+`game-contentElements-head" id="`+UID+`gameHead">
    <div class="`+UID+`game-contentElements-nr" id="`+UID+`nr"><h2>0</h2></div>
    <div class="`+UID+`game-contentElements-type" id="`+UID+`type">
    <h2>Küsimus<a class="`+UID+`timer" id="`+UID+`question-timer">Timer</a></h2></div></div>
    <div class="`+UID+`game-contentElements-str" id="`+UID+`question"></div>
    `;

    screenElement.innerHTML=content;
    context.appendChild(screenElement);
    screenElement.querySelector("#"+UID+"nr").innerHTML="<h2>"+(gameData.currentQuestion + 1)+"</h2>";console.log((gameData.currentQuestion + 1));
    screenElement.querySelector("#"+UID+"question").innerHTML="<p>"+contentElementObject.str+"</p>";
    
    startTimer(screenSettings.duration,UID+"question-timer",exitScreen,"nextType",localTimerIds);

    function questionNextQuestion() {
        console.log("question-right");
        exitScreen("nextType");
    }
    function questionPreviousQuestion() {
        console.log("question-left");
        exitScreen("previousType");
    }
    function gameMenu(){
        console.log("question-menu");
        exitScreen("gameMenu");
    }

    controls.key.set("up",1000,gameMenu,"Exit Game");
    controls.key.set("left",0,questionPreviousQuestion,"Previous Question");
    controls.key.set("right",0,questionNextQuestion,"Next Question");
    
}

function minigame_handler(context, style, controls, contentElementObject, localTimerIds, screenSettings,gameData,settings,UID) {
    screenSettings["colors"].bgcolor=new screenSettings["colors"].Color100(settings.color.background[0],settings.color.background[1],settings.color.background[2]);
    screenSettings["colors"].fgcolor=new screenSettings["colors"].Color100(settings.color.foreground[0],settings.color.foreground[1],settings.color.foreground[2]);
    var palette=screenSettings["colors"].palette;
    palette=screenSettings["colors"].getPalette(screenSettings["colors"].fgcolor, screenSettings["colors"].bgcolor);
    function minigameNext() {
        console.log("minigame-right");
        exitScreen("nextType");
    }
    function minigamePrevious() {
        console.log("minigame-left");
        exitScreen("previousType");
    }
    function gameMenu(){
        console.log("minigame-menu");
        exitScreen("gameMenu");
    }

    if(gameData.gameOrder[gameData.currentQuestion]===-1){
        function Render() {
            this.private=new (function() {
                this.reDrawHack=function (target) {
                    document.getElementById(target).offsetWidth;
                    console.log(document.getElementById(target)); 
                }
            });
            this.hide=function hide(id) {
                this.private.reDrawHack(id);
                context.querySelector("#"+String(id)).classList.add(UID+"_invisible");
                this.private.reDrawHack(id);
            }
            this.unhide=function unhide(id) {
                this.private.reDrawHack(id);
                context.querySelector("#"+String(id)).classList.remove(UID+"_invisible");
                this.private.reDrawHack(id);
            }
            this.setAnimation=function (id, className) {
                this.private.reDrawHack(id);
                context.querySelector("#"+String(id)).classList.add(className);
                this.private.reDrawHack(id);
            }
            this.removeAnimation=function (id, className) {
                this.private.reDrawHack(id);
                context.querySelector("#"+String(id)).classList.remove(className);
                this.private.reDrawHack(id);
            }
            
        }
        const MG_SETTINGS = {
            fadeTime:400,
            inBetweenTime: 400,
            rollTime:3000,
            instructionPopupTime: 15000
        }
        var render=new Render();
        const arrow_pointing_angle=Math.random()*360+5*360;
        const arrow_pointed_angle=Math.random()*360+5*360;
        
        style.innerHTML=`:root {
            --`+UID+`_fgColor: `+screenSettings.colors.css(palette.fg.normal)+`;
            --`+UID+`_fgColorInactive: `+screenSettings.colors.css(palette.bg.brightest)+`;
            --`+UID+`_bgColor: `+screenSettings.colors.css(palette.bg.normal)+`;
            --`+UID+`_fgColorBrightest: `+screenSettings.colors.css(palette.fg.brightest)+`;
        }
        body {
            background:var(--`+UID+`_bgColor);
            overflow: hidden;
            margin: 0;
        }  
        
        .`+UID+`_circleSVG {
            position: absolute;
            width: 100%;
            height: 100%;
            display: block;
            top: 0;
            left: 0;
            stroke: var(--`+UID+`_fgColor);
        }
        .`+UID+`_invisible {
            opacity: 0 !important;
        }
        #`+UID+`_UIdiv {
            width: 100%;
            height: 100%;
            position: absolute;
            background: var(--`+UID+`_bgColor);
            color: var(--`+UID+`_fgColor);
        }
        .`+UID+`_UI_fadeable {
            transition: opacity 400ms ease-in-out 0s;
            opacity: 1;
        }
        
        .`+UID+`_circle {
            display: table;
            width: 600px;
            height: 600px;
            margin: auto;
            vertical-align: middle;
            position: absolute;
            top: 84px;
            left: 84px;
        }
        
        .`+UID+`_circle-centerer {
            display: table-cell;
            vertical-align: middle;
            position: relative;
            height: 90%;
        }
        .`+UID+`_arrow_animation {
            animation-timing-function: cubic-bezier(0.34, 0, 0, 0.99);
            animation-fill-mode: forwards;
        }
        .`+UID+`_UI_smalltext {
        }
        .`+UID+`_arrow_pointing {}
        .`+UID+`_arrow_pointed {}
        .`+UID+`_arrow_pointed_animation {
            animation-duration: 8s;
            animation-name: `+UID+`_arrow_pointed_kf;
        }
        .`+UID+`_arrow_pointing_animation {
            animation-duration: 10s;
            animation-name: `+UID+`_arrow_pointing_kf;
        }
        .`+UID+`_circleSVG {}
        @keyframes `+UID+`_arrow_pointed_kf {
            0% {transform: rotate(0deg);}
            100% {transform: rotate(1600deg);}
        }
        @keyframes `+UID+`_arrow_pointing_kf {
            0% {transform: rotate(0deg);}
            100% {transform: rotate(-1690deg);}
        }
        .`+UID+`_UI-largeSVG {display: block;width: 400px;position: absolute;top: 168px;right: 20px;}
        .`+UID+`_buttonSymbol_glow_middle {
            --svg-b-top-glow: transparent;
            --svg-b-top: var(--`+UID+`_fgColorInactive);
            --svg-b-right-glow: transparent;
            --svg-b-right: var(--`+UID+`_fgColorInactive);
            --svg-b-bottom-glow: transparent;
            --svg-b-bottom: var(--`+UID+`_fgColorInactive);
            --svg-b-left-glow: transparent;
            --svg-b-left: var(--`+UID+`_fgColorInactive);
            --svg-b-center-glow: var(--`+UID+`_fgColor);
            --svg-b-center: var(--`+UID+`_fgColorBrightest);
        }
        
        p#`+UID+`_nextNotice {
            position: relative;
            width: 60%;
            margin: auto;
            text-align: center;
            top: 20px;
            font-size: 1.5em;
            color: var(--`+UID+`_bgColor);
            background: var(--`+UID+`_fgColor);
            padding: 0.5em;
        }
        
        .`+UID+`_UI_text_startNotice {
            position: absolute;
            width: 360px;
            text-align: center;
            top: 330px;
            font-size: 1.5em;
            color: var(--`+UID+`_fgColor);
            background: var(--`+UID+`_bgColor); 
        }
        
        `;
        context.innerHTML=`
        <div id="`+UID+`_UIdiv" class="`+UID+`_invisible `+UID+`_UI_fadeable">
            <svg class="`+UID+`_UI-largeSVG `+UID+`_buttonSymbol_glow_middle" version="1.1" viewBox="0 0 12.7 12.7" preserveAspectRatio="xMinYMin meet" xmlns="http://www.w3.org/2000/svg">
                <filter id="filter2993" x="-.256" y="-.256" width="1.512" height="1.512" style="color-interpolation-filters:sRGB">
                    <feGaussianBlur stdDeviation="0.33866608"/>
                </filter>
                <filter id="filter2989" x="-.256" y="-.256" width="1.512" height="1.512" style="color-interpolation-filters:sRGB">
                    <feGaussianBlur stdDeviation="0.33866608"/>
                </filter>
                <filter id="filter2985" x="-.256" y="-.256" width="1.512" height="1.512" style="color-interpolation-filters:sRGB">
                    <feGaussianBlur stdDeviation="0.33866608"/>
                </filter>
                <filter id="filter2981" x="-.256" y="-.256" width="1.512" height="1.512" style="color-interpolation-filters:sRGB">
                    <feGaussianBlur stdDeviation="0.33866608"/>
                </filter>
                <filter id="filter2977" x="-.256" y="-.256" width="1.512" height="1.512" style="color-interpolation-filters:sRGB">
                    <feGaussianBlur stdDeviation="0.33866608"/>
                </filter>
                </defs>
                    <g transform="translate(0 -284.3)">
                        <path d="m4.7626 285.36v3.175h3.175v-3.175zm0.5291 0.52917h2.1167v2.1167h-2.1167z" style="fill:var(--svg-b-top-glow);filter:url(#filter2977);paint-order:markers fill stroke"/>
                        <path d="m4.7626 285.36v3.175h3.175v-3.175zm0.5291 0.52917h2.1167v2.1167h-2.1167z" style="fill:var(--svg-b-top);paint-order:markers fill stroke"/>
                        <path d="m8.4667 289.06v3.175h3.175v-3.175zm0.5292 0.52917h2.1167v2.1167h-2.1167z" style="fill:var(--svg-b-right-glow);filter:url(#filter2981);paint-order:markers fill stroke"/>
                        <path d="m8.4667 289.06v3.175h3.175v-3.175zm0.5292 0.52917h2.1167v2.1167h-2.1167z" style="fill:var(--svg-b-right);paint-order:markers fill stroke"/>
                        <path d="m4.7626 292.77v3.175h3.175v-3.175zm0.5291 0.52917h2.1167v2.1167h-2.1167z" style="fill:var(--svg-b-bottom-glow);filter:url(#filter2985);paint-order:markers fill stroke"/>
                        <path d="m4.7626 292.77v3.175h3.175v-3.175zm0.5291 0.52917h2.1167v2.1167h-2.1167z" style="fill:var(--svg-b-bottom);paint-order:markers fill stroke"/>
                        <path d="m1.0584 289.06v3.175h3.175v-3.175zm0.5292 0.52917h2.1166v2.1167h-2.1166z" style="fill:var(--svg-b-left-glow);filter:url(#filter2989);paint-order:markers fill stroke"/>
                        <path d="m1.0584 289.06v3.175h3.175v-3.175zm0.5292 0.52917h2.1166v2.1167h-2.1166z" style="fill:var(--svg-b-left);paint-order:markers fill stroke"/>
                        <path d="m4.7625 289.06v3.175h3.175v-3.175zm0.5292 0.52917h2.1167v2.1167h-2.1167z" style="fill:var(--svg-b-center-glow);filter:url(#filter2993);paint-order:markers fill stroke"/>
                        <path d="m4.7625 289.06v3.175h3.175v-3.175zm0.5292 0.52917h2.1167v2.1167h-2.1167z" style="fill:var(--svg-b-center);paint-order:markers fill stroke"/>
                    </g>
            </svg>
            <p class="`+UID+`_UI_smalltext `+UID+`_UI_text_startNotice">Vajuta nuppu, et alustada</p>
        </div>
        `;
        render.unhide(UID+"_UIdiv");
        function screen_startMinigame() {
            render.hide(UID+"_UIdiv");
            localTimerIds.push(setTimeout(function(){
                context.innerHTML=`
                
                <div id="`+UID+`_UIdiv" class="`+UID+`_invisible `+UID+`_UI_fadeable" >
                    <div class="`+UID+`_circle">
                        <div class="`+UID+`_circle-centerer">
                            <svg id="`+UID+`_UI-circle" class="`+UID+`_circleSVG `+UID+`_arrow_animation" version="1.1" viewBox="0 0 146.58 146.58" preserveAspectRatio="xMinYMin meet" xmlns="http://www.w3.org/2000/svg">
                                <g transform="translate(-32.544 -123.17)">
                                    <circle cx="105.83" cy="196.46" r="71.967" style="fill:none;paint-order:markers fill stroke;stroke-linecap:round;stroke-width:2.6458;"/>
                                </g>
                            </svg>
                            <svg id="`+UID+`_UI-arrow-pointing" class="`+UID+`_circleSVG `+UID+`_arrow_animation"   version="1.1" viewBox="0 0 146.58 146.58" preserveAspectRatio="xMinYMin meet" xmlns="http://www.w3.org/2000/svg">
                                <g transform="translate(-32.544 -123.17)">
                                    <path d="m71.967 221.86-25.4-25.4 25.4-25.4m33.867 25.4h-59.267" style="fill:none;stroke-linecap:round;stroke-width:2.6458;"/>
                                </g>
                            </svg>
                            <svg id="`+UID+`_UI-arrow-pointed" class="`+UID+`_circleSVG `+UID+`_arrow_animation"  version="1.1" viewBox="0 0 146.58 146.58" preserveAspectRatio="xMinYMin meet" xmlns="http://www.w3.org/2000/svg">
                                <g transform="translate(-32.544 -123.17)">
                                    <path d="m160.87 171.06-25.4 25.4 25.4 25.4m-55.033-25.4h29.633" style="fill:none;stroke-linecap:round;stroke-width:2.6458;"/>
                                </g>
                            </svg>
    
                        </div>
                    </div>
                    <p id="`+UID+`_nextNotice" class="`+UID+`_UI_smalltext `+UID+`_UI_text_nextNotice `+UID+`_invisible `+UID+`_UI_fadeable">Tehtud? hoia edasi nuppu, et edasi liikuda</p>
                </div>
                `;
                render.unhide(UID+"_UIdiv");
                localTimerIds.push(setTimeout(function(){
                    render.setAnimation(UID+"_UI-arrow-pointed", UID+"_arrow_pointed_animation");
                    render.setAnimation(UID+"_UI-arrow-pointing", UID+"_arrow_pointing_animation");
                    localTimerIds.push(setTimeout(function(){
                        render.unhide(UID+"_nextNotice");
                    }, 
                    MG_SETTINGS.instructionPopupTime));
                }, MG_SETTINGS.rollTime));
            }, MG_SETTINGS.fadeTime+MG_SETTINGS.inBetweenTime));
        }
        controls.key.set("left",0, minigamePrevious, "Previous");
        controls.key.set("right",0, minigameNext, "Next");
        controls.key.set("up",1000,gameMenu,"Exit Game");
        controls.key.set("confirm",0, screen_startMinigame,"Start");
    }

    if(gameData.gameOrder[gameData.currentQuestion]===-2){
        function Render() {
            this.private=new (function() {
                this.reDrawHack=function (target) {
                    document.getElementById(target).offsetWidth;
                    //console.log(document.getElementById(target)); 
                }
            });
            this.hide=function hide(id) {
                this.private.reDrawHack(id);
                context.querySelector("#"+String(id)).classList.add(UID+"_invisible");
                this.private.reDrawHack(id);
            }
            this.unhide=function unhide(id) {
                this.private.reDrawHack(id);
                context.querySelector("#"+String(id)).classList.remove(UID+"_invisible");
                this.private.reDrawHack(id);
            }
            this.setAnimation=function (id, className) {
                this.private.reDrawHack(id);
                context.querySelector("#"+String(id)).classList.add(className);
                this.private.reDrawHack(id);
            }
            this.removeAnimation=function (id, className) {
                this.private.reDrawHack(id);
                context.querySelector("#"+String(id)).classList.remove(className);
                this.private.reDrawHack(id);
            }
            
        }
        const MG_SETTINGS = {
            fadeTime:400,
            inBetweenTime: 400,
            instructionTime:3000,
            readyTime: 1000,
            maxReactions: 10,
            endNoticeTime: 6000
        };
        let nrOfReactions=  Math.floor(Math.random() * (MG_SETTINGS.maxReactions+1));
        nrOfReactions=3;
        var buttons=[
            "left",
            "right",
            "up",
            "down",
            "confirm"
        ];

        //let promptKey=buttons[  Math.floor(Math.random() * (buttons.length+1))  ];
        var render=new Render();
        let arrow_pointing_angle=Math.random()*360+5*360;
        let arrow_pointed_angle=Math.random()*360+5*360;

        //lisa nupu event alustamiseks
        //UID: UniqueID
        //pane ekraanile "vajuta nuppu, et alustada"
        let CSS_root=`:root {
            --`+UID+`_fgColor: `+screenSettings.colors.css(palette.fg.normal)+`;
            --`+UID+`_fgColorInactive: `+screenSettings.colors.css(palette.bg.brightest)+`;
            --`+UID+`_bgColor: `+screenSettings.colors.css(palette.bg.normal)+`;
            --`+UID+`_fgColorBrightest: `+screenSettings.colors.css(palette.fg.brightest)+`;
        }`;
        let CSS_style=`
        body {
            background:var(--`+UID+`_bgColor);
            overflow: hidden;
            margin: 0;
        }
        .`+UID+`_circleSVG {
            position: absolute;
            width: 100%;
            height: 100%;
            display: block;
            top: 0;
            left: 0;
            stroke: var(--`+UID+`_fgColor);
        }
        .`+UID+`_invisible {
            opacity: 0 !important;
        }
        #`+UID+`_UIdiv {
            width: 100%;
            height: 100%;
            position: relative;
            background: var(--`+UID+`_bgColor);
            color: var(--`+UID+`_fgColor);
        }
        .`+UID+`_UI_fadeable {
            transition: opacity 400ms ease-in-out 0s;
            opacity: 1;
        }
        
        .`+UID+`_circle {
            display: table;
            width: 600px;
            height: 600px;
            margin: auto;
            vertical-align: middle;
            position: absolute;
            top: 84px;
            left: 84px;
        }
        
        .`+UID+`_circle-centerer {
            display: table-cell;
            vertical-align: middle;
            position: relative;
            height: 90%;
        }
        .`+UID+`_arrow_animation {
            animation-timing-function: cubic-bezier(0.34, 0, 0, 0.99);
            animation-fill-mode: forwards;
        }
        .`+UID+`_UI_smalltext {
        }
        .`+UID+`_arrow_pointing {}
        .`+UID+`_arrow_pointed {}
        .`+UID+`_arrow_pointed_animation {
            animation-duration: 8s;
            animation-name: `+UID+`_arrow_pointed_kf;
        }
        .`+UID+`_arrow_pointing_animation {
            animation-duration: 10s;
            animation-name: `+UID+`_arrow_pointing_kf;
        }
        .`+UID+`_circleSVG {}
        @keyframes `+UID+`_arrow_pointed_kf {
            0% {transform: rotate(0deg);}
            100% {transform: rotate(1600deg);}
        }
        @keyframes `+UID+`_arrow_pointing_kf {
            0% {transform: rotate(0deg);}
            100% {transform: rotate(-1690deg);}
        }
        .`+UID+`_UI-largeSVG {display: block;width: 400px;position: absolute;top: 168px;right: 20px;}
        .`+UID+`_buttonSymbol_glow_middle {
            --svg-b-top-glow: transparent;
            --svg-b-top: var(--`+UID+`_fgColorInactive);
            --svg-b-right-glow: transparent;
            --svg-b-right: var(--`+UID+`_fgColorInactive);
            --svg-b-bottom-glow: transparent;
            --svg-b-bottom: var(--`+UID+`_fgColorInactive);
            --svg-b-left-glow: transparent;
            --svg-b-left: var(--`+UID+`_fgColorInactive);
            --svg-b-center-glow: var(--`+UID+`_fgColor);
            --svg-b-center: var(--`+UID+`_fgColorBrightest);
        }
        
        p#`+UID+`_nextNotice {
            position: relative;
            width: 60%;
            margin: auto;
            text-align: center;
            top: 20px;
            font-size: 1.5em;
            color: var(--`+UID+`_bgColor);
            background: var(--`+UID+`_fgColor);
            padding: 0.5em;
        }
        
        .`+UID+`_UI_text_startNotice {
            position: absolute;
            width: 360px;
            text-align: left;
            top: 90px;
            left: 40px;
            font-size: 5em;
            font-weight: 600;
            font-family: 'Raleway';
            margin: 0;
        }
        `;
        style.innerHTML=CSS_root+CSS_style;
        context.innerHTML=`
        <div id="`+UID+`_UIdiv" class="`+UID+`_invisible `+UID+`_UI_fadeable">
            <svg class="`+UID+`_UI-largeSVG `+UID+`_buttonSymbol_glow_middle" version="1.1" viewBox="0 0 12.7 12.7" preserveAspectRatio="xMinYMin meet" xmlns="http://www.w3.org/2000/svg">
                <filter id="filter2993" x="-.256" y="-.256" width="1.512" height="1.512" style="color-interpolation-filters:sRGB">
                    <feGaussianBlur stdDeviation="0.33866608"/>
                </filter>
                <filter id="filter2989" x="-.256" y="-.256" width="1.512" height="1.512" style="color-interpolation-filters:sRGB">
                    <feGaussianBlur stdDeviation="0.33866608"/>
                </filter>
                <filter id="filter2985" x="-.256" y="-.256" width="1.512" height="1.512" style="color-interpolation-filters:sRGB">
                    <feGaussianBlur stdDeviation="0.33866608"/>
                </filter>
                <filter id="filter2981" x="-.256" y="-.256" width="1.512" height="1.512" style="color-interpolation-filters:sRGB">
                    <feGaussianBlur stdDeviation="0.33866608"/>
                </filter>
                <filter id="filter2977" x="-.256" y="-.256" width="1.512" height="1.512" style="color-interpolation-filters:sRGB">
                    <feGaussianBlur stdDeviation="0.33866608"/>
                </filter>
                </defs>
                    <g transform="translate(0 -284.3)">
                        <path d="m4.7626 285.36v3.175h3.175v-3.175zm0.5291 0.52917h2.1167v2.1167h-2.1167z" style="fill:var(--svg-b-top-glow);filter:url(#filter2977);paint-order:markers fill stroke"/>
                        <path d="m4.7626 285.36v3.175h3.175v-3.175zm0.5291 0.52917h2.1167v2.1167h-2.1167z" style="fill:var(--svg-b-top);paint-order:markers fill stroke"/>
                        <path d="m8.4667 289.06v3.175h3.175v-3.175zm0.5292 0.52917h2.1167v2.1167h-2.1167z" style="fill:var(--svg-b-right-glow);filter:url(#filter2981);paint-order:markers fill stroke"/>
                        <path d="m8.4667 289.06v3.175h3.175v-3.175zm0.5292 0.52917h2.1167v2.1167h-2.1167z" style="fill:var(--svg-b-right);paint-order:markers fill stroke"/>
                        <path d="m4.7626 292.77v3.175h3.175v-3.175zm0.5291 0.52917h2.1167v2.1167h-2.1167z" style="fill:var(--svg-b-bottom-glow);filter:url(#filter2985);paint-order:markers fill stroke"/>
                        <path d="m4.7626 292.77v3.175h3.175v-3.175zm0.5291 0.52917h2.1167v2.1167h-2.1167z" style="fill:var(--svg-b-bottom);paint-order:markers fill stroke"/>
                        <path d="m1.0584 289.06v3.175h3.175v-3.175zm0.5292 0.52917h2.1166v2.1167h-2.1166z" style="fill:var(--svg-b-left-glow);filter:url(#filter2989);paint-order:markers fill stroke"/>
                        <path d="m1.0584 289.06v3.175h3.175v-3.175zm0.5292 0.52917h2.1166v2.1167h-2.1166z" style="fill:var(--svg-b-left);paint-order:markers fill stroke"/>
                        <path d="m4.7625 289.06v3.175h3.175v-3.175zm0.5292 0.52917h2.1167v2.1167h-2.1167z" style="fill:var(--svg-b-center-glow);filter:url(#filter2993);paint-order:markers fill stroke"/>
                        <path d="m4.7625 289.06v3.175h3.175v-3.175zm0.5292 0.52917h2.1167v2.1167h-2.1167z" style="fill:var(--svg-b-center);paint-order:markers fill stroke"/>
                    </g>
            </svg>
            <p class="`+UID+`_UI_smalltext `+UID+`_UI_text_startNotice">VAJUTA NUPPU KOHE, KUI SEE PÕLEMA LÄHEB</p>
        </div>
        `;
        render.unhide(UID+"_UIdiv");
        localTimerIds.push(setTimeout(function(){
            render.hide(UID+"_UIdiv");
            localTimerIds.push(setTimeout(function(){
                context.innerHTML=`
                
                <div id="`+UID+`_UIdiv" class="`+UID+`_invisible `+UID+`_UI_fadeable">
                    <p class="`+UID+`_UI_smalltext `+UID+`_UI_text_readyNotice">VALMIS?</p>
                </div>
                `;
                render.unhide(UID+"_UIdiv");
                localTimerIds.push(setTimeout(function(){
                    render.hide(UID+"_UIdiv");
                    localTimerIds.push(setTimeout(function(){
                        let setCounter=0;
                        let score=0;
                        
                        let time=Date;
                        let startTime=time.now();
                        notify("start Timestamp: "+String(startTime), "screen");
                        let responses=[
                            {time: 700, str: "Imeline"},
                            {time: 1000, str: "Kiire"},
                            {time: 18000, str: "Väsinud"},
                            {time: 2700, str: "Täis?"},
                            {time: Infinity, str: "Mine magama"}
                        ];
                        let actionIDs = [];
                        actionIDs.length = buttons.length;
                        actionIDs.fill(0); //Create array of 0s

                        function setKeys() {
                            let promptKeyIndex=Math.floor(Math.random() * (buttons.length));
                            notify("Random button index: "+String(promptKeyIndex), "screen");
                            for (let i=0; i<buttons.length; i++) {
                                if(promptKeyIndex===i) {
                                    actionIDs[i]=controls.key.set(buttons[i], 0, reactionCapture_correct, false);
                                    notify(buttons[i], "screen");
                                }
                                else {
                                    actionIDs[i]=controls.key.set(buttons[i], 0, reactionCapture_incorrect, false);
                                }
                            }
                        }
                        function setup(success) {
                            //controls.key.clear.byKey("all");
                            for (let i=0; i<buttons.length; i++) {
                                controls.key.clear.byId(actionIDs[i]);
                            }
                            let reactionTime=setScore(success);
                            notify("Reaction time: "+String(reactionTime), "screen");
                            startTime=time.now();

                            let str="Vale";
                            if(success) {
                                str=getResponse(reactionTime);
                            }
                            document.getElementById(UID+"_UI_text_prompt").innerHTML=str;

                            if(setCounter<nrOfReactions) {
                                setCounter++;
                                setKeys();
                            }
                            else {

                                
                                
                                endGame();
                            }
                        }
                        function reactionCapture_correct() {
                            notify("correct", "function") ;
                            setup(true);
                        }
                        function endGame() {
                            controls.key.clear.byKey("all");
                            controls.key.set("left",0, minigamePrevious, "Previous");
                            controls.key.set("right",0, minigameNext, "Next");
                            controls.key.set("up",1000,gameMenu,"Exit Game");
                            //controls.key.set("confirm",0, screen_startMinigame,"Start");
                            localTimerIds.push(setTimeout(function(){
                                render.hide(UID+"_UIdiv");
                                localTimerIds.push(setTimeout(function(){
                                    document.getElementById(UID+"_UI_text_prompt").innerHTML=score;
                                    render.unhide(UID+"_UIdiv");


                                    localTimerIds.push(setTimeout(function(){
                                        render.hide(UID+"_UIdiv");
                                        localTimerIds.push(setTimeout(function(){
                                            exitScreen("nextType");
                                        }, MG_SETTINGS.fadeTime+MG_SETTINGS.inBetweenTime));
                                    }, MG_SETTINGS.endNoticeTime));
                                }, MG_SETTINGS.fadeTime+MG_SETTINGS.inBetweenTime));
                            }, MG_SETTINGS.fadeTime+MG_SETTINGS.inBetweenTime));
                        }
                        function reactionCapture_incorrect() {
                            notify("not correct", "function") ;
                            setup(false);
                        }
                        function setScore(success) {
                            let reactionTime=time.now()-startTime;
                            if (success) {
                                score+=reactionTime;
                            }
                            else {
                                score+=reactionTime*5;
                            }
                            
                            return reactionTime;
                        }
                        function getResponse(reactionTime) {
                            let str="";
                            for(let i=responses.length; i>0; i--) {
                                if(reactionTime<responses[i-1].time) {
                                    str=responses[i-1].str;
                                }
                            }
                            return str;
                        }
                        
                        setKeys();


                        context.innerHTML=`
                        <div id="`+UID+`_UIdiv" class="`+UID+`_invisible `+UID+`_UI_fadeable">
                            <p class="`+UID+`_UI_smalltext `+UID+`_UI_text_readyNotice" id="`+UID+`_UI_text_prompt">LÄKS</p>
                        </div>
                        `;
                        render.unhide(UID+"_UIdiv");


                        
                    }, MG_SETTINGS.fadeTime+MG_SETTINGS.inBetweenTime));
                }, MG_SETTINGS.readyTime+MG_SETTINGS.fadeTime+MG_SETTINGS.inBetweenTime));   
            }, MG_SETTINGS.fadeTime+MG_SETTINGS.inBetweenTime));
            
        }, MG_SETTINGS.instructionTime));
    }
}

function gameMenu_handler(context, style, controls, contentElementObject, localTimerIds ,screenSettings,gameData,settings,UID){
    screenSettings["colors"].bgcolor=new screenSettings["colors"].Color100(settings.color.background[0],settings.color.background[1],settings.color.background[2]);
    screenSettings["colors"].fgcolor=new screenSettings["colors"].Color100(settings.color.foreground[0],settings.color.foreground[1],settings.color.foreground[2]);
    let palette=screenSettings["colors"].palette;
    palette=screenSettings["colors"].getPalette(screenSettings["colors"].fgcolor, screenSettings["colors"].bgcolor);
    
    style.innerHTML=`:root {
     
        --`+UID+`_fgColorDull: `+screenSettings.colors.css(palette.fg.dull)+`;
        --`+UID+`_fgColorDarkest: `+screenSettings.colors.css(palette.fg.darkest)+`;
        --`+UID+`_fgColorDark: `+screenSettings.colors.css(palette.fg.dark)+`;

        --`+UID+`_fgColor: `+screenSettings.colors.css(palette.fg.normal)+`;
        
        --`+UID+`_fgColorBright: `+screenSettings.colors.css(palette.fg.bright)+`;
        --`+UID+`_fgColorBrightest: `+screenSettings.colors.css(palette.fg.brightest)+`;
        --`+UID+`_fgColorBloom: `+screenSettings.colors.css(palette.fg.bloom)+`;


        --`+UID+`_bgColorDull: `+screenSettings.colors.css(palette.bg.dull)+`;
        --`+UID+`_bgColorDarkest: `+screenSettings.colors.css(palette.bg.darkest)+`;
        --`+UID+`_bgColorDark: `+screenSettings.colors.css(palette.bg.dark)+`;

        --`+UID+`_bgColor: `+screenSettings.colors.css(palette.bg.normal)+`;
        
        --`+UID+`_bgColorBright: `+screenSettings.colors.css(palette.bg.bright)+`;
        --`+UID+`_bgColorBrightest: `+screenSettings.colors.css(palette.bg.brightest)+`;
        --`+UID+`_bgColorBloom: `+screenSettings.colors.css(palette.bg.bloom)+`;
    }
    body {
        background:var(--`+UID+`_bgColor);
        overflow: hidden;
        margin: 0;
    }
    .`+UID+`game-game-menu-title{
        color: var(--`+UID+`_fgColor);
        margin: auto;
        text-align: center;
        font-size: 1.5em;
    }
    .`+UID+`game-game-menu-nr{
        float: left;
        width: 72px;
    
        text-align: center;
        font-size: 1.5em;
    }
    
    
    .`+UID+`game-game-menu-nr-selected{
        color: var(--`+UID+`_bgColorDarkest);
        background-color: var(--`+UID+`_fgColor);
        
        border: var(--`+UID+`_fgColor);
        border-style: solid;
        border-width: 15px 0 15px 0;
        margin-right: 10px;
    }
    .`+UID+`game-game-menu-nr-not-selected{
        color: var(--`+UID+`_fgColor);
        background-color: var(--`+UID+`_bgColorDarkest);
        
        border: var(--`+UID+`_bgColorDarkest);
        border-style: solid;
        border-width: 15px 0 15px 0;
        margin-right: 10px;
    }
    .`+UID+`game-game-title{
        margin-left: 82px;
        font-size: 1.5em;
    
    }
    .`+UID+`game-game-title-selected{
        color: var(--`+UID+`_bgColorDarkest);
        background-color: var(--`+UID+`_fgColor);
        
        border: var(--`+UID+`_fgColor);
        border-style: solid;
        border-width: 15px;
    }
    .`+UID+`game-game-title-not-selected{
        color: var(--`+UID+`_fgColor);
        background-color: var(--`+UID+`_bgColorDarkest);
        
        border: var(--`+UID+`_bgColorDarkest);
        border-style: solid;
        border-width: 15px;
    }
    .`+UID+`game-game-menu-head{
        margin: auto;
        width: 80%;
        margin-block-start: 1em;
        margin-block-end: 1em;
    }
    .`+UID+`game-game-title h2{
        margin-block-start: 0;
        margin-block-end: 0;
    }
    .`+UID+`game-game-menu-nr h2{
        margin-block-start: 0;
        margin-block-end: 0;
    }
    .`+UID+`game-properties-menu-description {
        color: var(--`+UID+`_fgColor);
        background: var(--`+UID+`_bgColorDark);
        margin-block-start:0em;
    }
    .`+UID+`game-properties-menu-title{
        color: var(--`+UID+`_fgColor);
        margin: auto;
        width: 80%;
    }
    .`+UID+`body-main-div{
        top: 10%;
        left: 0%;
        width: 100%;
        position: absolute;
    }
    .`+UID+`description-wrapper{
        width:80%;
        margin: auto;
        overflow: hidden;
    }
    .`+UID+`description-right{
        height:100%;
        width:39%;
        position:relative;
        float:right;
    }
    .`+UID+`description-left{
        height:100%;
        width:59%;
        margin-right:2%;
        position:relative;
        float:left;
        overflow-wrap: break-word;
    }
    `;

    gameData.selectedGame=0;
    var screenElement=document.createElement("div");
    screenElement.setAttribute("id",UID+"body-wrapper");

    let content=`<div class="`+UID+`body-main-div" id="`+UID+`bodyMainDiv">
    <div class="`+UID+`game-game-menu-title" id="`+UID+`MainHeader">
    <h1>Mänguvalik</h1>
    </div></div>
    `; 

    screenElement.innerHTML=content;
    context.appendChild(screenElement);
     
    for(i=0;i<contentElementObject.length;i++){
        if(i===0){
            screenElement.querySelector("#"+UID+"bodyMainDiv").innerHTML+=`
            <div class="`+UID+`game-game-menu-element" id="`+UID+`setting-0">
                <div class="`+UID+`game-game-menu-head" id="`+UID+`head-0">
                    <div class=" `+UID+`game-game-menu-nr `+UID+`game-game-menu-nr-selected" id="`+UID+`head-nr-0"><h2>1</h2></div>
                    <div class=" `+UID+`game-game-title `+UID+`game-game-title-selected" id="`+UID+`head-title-0"><h2>Mäng</h2></div>
                </div>
                <div id="`+UID+`setting-0-0"></div>
            </div>
            `;
        }
        else{
            screenElement.querySelector("#"+UID+"bodyMainDiv").innerHTML+= `
            <div class="`+UID+`game-game-menu-element" id="`+UID+`setting-`+i+`">
                <div class="`+UID+`game-game-menu-head" id="`+UID+`head-`+i+`">
                    <div class="`+UID+`game-game-menu-nr `+UID+`game-game-menu-nr-not-selected" id="`+UID+`head-nr-`+i+`"><h2>`+(i+1)+`</h2></div>
                    <div class="`+UID+`game-game-title `+UID+`game-game-title-not-selected" id="`+UID+`head-title-`+i+`"><h2>Mäng</h2></div>
                </div>
                <div id="`+UID+`setting-`+i+`-0"></div>
            </div>
            `;
        }
        screenElement.querySelector("#"+UID+"head-title-"+i).innerHTML='<h2>'+contentElementObject[i].title+'</h2>';
    }
    gameSubMenuIn(gameData.selectedGame);

    function gameSubMenuIn(SubMenu){
        screenElement.querySelector("#"+UID+"setting-"+SubMenu+"-0").innerHTML='<div></div><div class="'+UID+'game-properties-menu-description" id="'+UID+'description"></div>';
        nextGameSubMenu();
    }

    function gameSubMenuOut(SubMenu){
        screenElement.querySelector("#"+UID+"setting-"+SubMenu+"-0").innerHTML="";
    }

    function nextGameSubMenu() {
        var div = screenElement.querySelector("#"+UID+'description');
        div.innerHTML =`
        <div class="`+UID+`description-wrapper" id="`+UID+`description-wrapper">
        <div class="`+UID+`description-left" id="`+UID+`description-left">
        <p class="`+UID+`description-text" id="`+UID+`description-text">`+ contentElementObject[gameData.selectedGame].description +`</p>
        </div><div class="`+UID+`description-right" id="`+UID+`description-right">
        <p class='inner'> Keskmine mängu kestvus: `+ contentElementObject[gameData.selectedGame].duration +`</p>
        <p class='inner'> Mängijate arv: `+ contentElementObject[gameData.selectedGame].players.min +`-`+ contentElementObject[gameData.selectedGame].players.max +`</p>
        <p class='inner'> Soovitatav vol: `+ contentElementObject[gameData.selectedGame].volume +`% </p>
        <p class='inner'> Konditsioon: `+ contentElementObject[gameData.selectedGame].condition +`</p>
        </div></div>
        `;
    }
    function menuUp(){

        MenuSetState(UID+'head-nr-'+gameData.selectedGame, 'not selected',UID+'game-game-menu-nr-selected',UID+'game-game-menu-nr-not-selected');
        MenuSetState(UID+'head-title-'+gameData.selectedGame, 'not selected',UID+'game-game-title-selected',UID+'game-game-title-not-selected');

        gameSubMenuOut(gameData.selectedGame);
        
        gameData.selectedGame--;
        if(gameData.selectedGame===-1){gameData.selectedGame=game.content.length-1;}
        
        gameSubMenuIn(gameData.selectedGame);
        MenuSetState(UID+'head-nr-'+gameData.selectedGame, 'selected',UID+'game-game-menu-nr-selected',UID+'game-game-menu-nr-not-selected');
        MenuSetState(UID+'head-title-'+gameData.selectedGame, 'selected',UID+'game-game-title-selected',UID+'game-game-title-not-selected');

    }
    function menuDown(){
   
        MenuSetState(UID+'head-nr-'+gameData.selectedGame, 'not selected',UID+'game-game-menu-nr-selected',UID+'game-game-menu-nr-not-selected');
        MenuSetState(UID+'head-title-'+gameData.selectedGame, 'not selected',UID+'game-game-title-selected',UID+'game-game-title-not-selected');
        
        gameSubMenuOut(gameData.selectedGame);
        gameData.selectedGame++;
        if(gameData.selectedGame===game.content.length){gameData.selectedGame=0;}
        gameSubMenuIn(gameData.selectedGame);

        MenuSetState(UID+'head-nr-'+gameData.selectedGame, 'selected',UID+'game-game-menu-nr-selected',UID+'game-game-menu-nr-not-selected');
        MenuSetState(UID+'head-title-'+gameData.selectedGame, 'selected',UID+'game-game-title-selected',UID+'game-game-title-not-selected');
    
    }
    function settingsMenu(){
        console.log("Go settings");
        exitScreen("settingsMenu");
    }
    function selectGame(){
        console.log("Select game");
        exitScreen("startGame");
    }
    
    controls.key.set("up",0,menuUp,"Move Up");
    controls.key.set("down",0,menuDown,"Move Down");
    controls.key.set("left",0,settingsMenu,"Settings Menu");
    controls.key.set("confirm",0,selectGame,"Select Game");
}

function settingsMenu_handler(context, style, controls, contentElementObject, localTimerIds ,screenSettings,gameData,settings,UID){
    refreshStyle();
    
    var selectedSetting=0;
    var screenElement=document.createElement("div");
    screenElement.setAttribute("id",UID+"body-wrapper");
    screenElement.setAttribute("class",UID+"body-wrapper");

    let content=`<div>
    <div class="`+UID+`settings-menu-title"><h1>Alammenüü</h1></div>
    <div class="`+UID+`settings-menu-element `+UID+`settings-menu-element-selected" id="`+UID+`setting-0"><h3>Minigame 1 <a id="`+UID+`setting-0-a"></a></h3></div>
    <div class="`+UID+`settings-menu-element `+UID+`settings-menu-element-not-selected" id="`+UID+`setting-1"><h3>Minigame 2 <a id="`+UID+`setting-1-a"></a></h3></div>
    <div class="`+UID+`settings-menu-element `+UID+`settings-menu-element-not-selected" id="`+UID+`setting-2"><h3>Mingi valik <a id="`+UID+`setting-2-a"></a></h3></div></div>

    <div>
    <div class="`+UID+`settings-menu-title"><h2>Peavärv</h2></div>
    <div class="`+UID+`settings-menu-element `+UID+`settings-menu-element-not-selected" id="`+UID+`setting-3"><h3>Toon <a class="`+UID+`setting-value" id="`+UID+`setting-value-3-a0">100</a><a class="`+UID+`setting-arrow" id="`+UID+`setting-arrow-3"></a></h3><div></div></div>
    <div class="`+UID+`settings-menu-element `+UID+`settings-menu-element-not-selected" id="`+UID+`setting-4"><h3>Küllastus <a class="`+UID+`setting-value" id="`+UID+`setting-value-4-a0">100</a><a class="`+UID+`setting-arrow" id="`+UID+`setting-arrow-4"></a></h3><div></div></div>
    <div class="`+UID+`settings-menu-element `+UID+`settings-menu-element-not-selected" id="`+UID+`setting-5"><h3>Heledus <a class="`+UID+`setting-value" id="`+UID+`setting-value-5-a0">100</a><a class="`+UID+`setting-arrow" id="`+UID+`setting-arrow-5"></a></h3><div></div></div></div>
    
    <div>
    <div class="`+UID+`settings-menu-title"><h2>Tausta värv</h2></div>
    <div class="`+UID+`settings-menu-element `+UID+`settings-menu-element-not-selected" id="`+UID+`setting-6"><h3>Toon <a class="`+UID+`setting-value" id="`+UID+`setting-value-6-a0">100</a><a class="`+UID+`setting-arrow" id="`+UID+`setting-arrow-6"></a></h3><div></div></div>
    <div class="`+UID+`settings-menu-element `+UID+`settings-menu-element-not-selected" id="`+UID+`setting-7"><h3>Küllastus <a class="`+UID+`setting-value" id="`+UID+`setting-value-7-a0">100</a><a class="`+UID+`setting-arrow" id="`+UID+`setting-arrow-7"></a></h3><div></div></div>
    <div class="`+UID+`settings-menu-element `+UID+`settings-menu-element-not-selected" id="`+UID+`setting-8"><h3>Heledus <a class="`+UID+`setting-value" id="`+UID+`setting-value-8-a0">100</a><a class="`+UID+`setting-arrow" id="`+UID+`setting-arrow-8"></a></h3><div></div></div></div>
    `; 

    screenElement.innerHTML=content;
    context.appendChild(screenElement);
    toggleLoader();
    colorLoader();
    var settingSelected=false

    function toggleLoader(){
        for(i=0;i<3;i++){
            if(settings.toggle[i]){
                document.getElementById(UID+"setting-"+i+"-a").innerHTML=`<svg class="`+UID+`toggle width="25.4mm" height="12.7mm" version="1.1" viewBox="0 0 25.4 12.7" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(0 -284.3)">
                    <path d="m5.027 288.53v4.2333h10.187v-4.2333zm13.097 0v4.2333h1.7192v-4.2333z" style="fill:var(--`+UID+`_svg-innercolor);"/>
                    <path transform="matrix(.26458 0 0 .26458 0 284.3)" d="m60.5 9.5v29.004h4.9961v-29.004h-4.9961zm-44.5 3.5v22h41.502v-2.0039h-38.504c-0.54916 0-0.99383-0.44693-0.99609-0.99609v-15.996c0-0.55219 0.4439-1.0016 0.99609-1.0039h38.504v-2h-41.502zm52.502 0v2h6.4961c0.55559 0 1.0058 0.4485 1.0039 1.0039v15.996c0 0.5523-0.45172 0.99829-1.0039 0.99609h-6.4961v2.0039h9.498v-22h-9.498z" style="fill:var(--`+UID+`_svg-outercolor);"/>
                </g>
                </svg> `;
            }
            else{
                document.getElementById(UID+"setting-"+i+"-a").innerHTML=`<svg class="`+UID+`toggle width="25.4mm" height="12.7mm" version="1.1" viewBox="0 0 25.4 12.7" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(0 -284.3)">
                    <g transform="translate(-1126.1 757.77)">
                    <path d="m1145.9-469.23v4.2333h-10.187v-4.2333zm-13.097 0v4.2333h-1.7192v-4.2333z" style="fill:var(--`+UID+`_svg-innercolor);"/>
                    <path transform="matrix(.26458 0 0 .26458 1126.1 -473.47)" d="m28.504 9.5v29.004h4.9961v-29.004h-4.9961zm-12.504 3.5v22h9.498v-2.0039h-6.4961c-0.55219 0.002192-1.0039-0.44379-1.0039-0.99609v-15.996c-0.00189-0.5554 0.44832-1.0039 1.0039-1.0039h6.4961v-2h-9.498zm20.498 0v2h38.504c0.55219 0.002306 0.99609 0.45172 0.99609 1.0039v15.996c-0.002268 0.54916-0.44693 0.99609-0.99609 0.99609h-38.504v2.0039h41.502v-22h-41.502z" style="fill:var(--`+UID+`_svg-outercolor);"/>
                    </g>
                </g>
                </svg> `;
                
            }
        }

    }
    function upDownLoader(state){
        if(state){
            document.getElementById(UID+"setting-arrow-"+selectedSetting).innerHTML=`<svg width="8.4667mm" height="12.7mm" version="1.1" viewBox="0 0 8.4667 12.7" xmlns="http://www.w3.org/2000/svg">
                    <g transform="translate(0 -284.3)">
                        <path d="m2.1167 289.86h4.2333l-2.1166-3.175"/>
                        <path d="m2.1167 291.44h4.2333l-2.1166 3.175z"/>
                    </g>
            </svg>
            `;
        }
        else{
            document.getElementById(UID+"setting-arrow-"+selectedSetting).innerHTML="";
        }
    }

    function colorLoader(){
        for(i=3;i<=8;i++){
            if(i<=5)document.getElementById(UID+"setting-value-"+i+"-a0").innerHTML=savefile.settings.color.foreground[i-3];
            else document.getElementById(UID+"setting-value-"+i+"-a0").innerHTML=savefile.settings.color.background[i-6];
        }
    }

    function refreshStyle(){
        footerColors();
        screenSettings["colors"].bgcolor=new screenSettings["colors"].Color100(settings.color.background[0],settings.color.background[1],settings.color.background[2]);
        screenSettings["colors"].fgcolor=new screenSettings["colors"].Color100(settings.color.foreground[0],settings.color.foreground[1],settings.color.foreground[2]);
        let palette=screenSettings["colors"].palette;
        palette=screenSettings["colors"].getPalette(screenSettings["colors"].fgcolor, screenSettings["colors"].bgcolor);
    

        style.innerHTML=`:root {
            --`+UID+`_fgColorDull: `+screenSettings.colors.css(palette.fg.dull)+`;
            --`+UID+`_fgColorDarkest: `+screenSettings.colors.css(palette.fg.darkest)+`;
            --`+UID+`_fgColorDark: `+screenSettings.colors.css(palette.fg.dark)+`;

            --`+UID+`_fgColor: `+screenSettings.colors.css(palette.fg.normal)+`;
            
            --`+UID+`_fgColorBright: `+screenSettings.colors.css(palette.fg.bright)+`;
            --`+UID+`_fgColorBrightest: `+screenSettings.colors.css(palette.fg.brightest)+`;
            --`+UID+`_fgColorBloom: `+screenSettings.colors.css(palette.fg.bloom)+`;


            --`+UID+`_bgColorDull: `+screenSettings.colors.css(palette.bg.dull)+`;
            --`+UID+`_bgColorDarkest: `+screenSettings.colors.css(palette.bg.darkest)+`;
            --`+UID+`_bgColorDark: `+screenSettings.colors.css(palette.bg.dark)+`;

            --`+UID+`_bgColor: `+screenSettings.colors.css(palette.bg.normal)+`;
            
            --`+UID+`_bgColorBright: `+screenSettings.colors.css(palette.bg.bright)+`;
            --`+UID+`_bgColorBrightest: `+screenSettings.colors.css(palette.bg.brightest)+`;
            --`+UID+`_bgColorBloom: `+screenSettings.colors.css(palette.bg.bloom)+`;
        }
        body {
            background:var(--`+UID+`_bgColor);
            overflow: hidden;
            margin: 0;
        }
        .`+UID+`body-wrapper{
            top: 6%;
            left: 0%;
            width: 100%;
            position: absolute;
        }   
        .`+UID+`settings-menu-title h1{
            color: var(--`+UID+`_fgColor);
            margin: auto;
            text-align: center;
        }
        .`+UID+`settings-menu-title h2{
            color: var(--`+UID+`_fgColor);
            margin: auto;
            text-align: center;
        }
        
        .`+UID+`settings-menu-element{
            margin: auto;
            margin-block-start: 1em;
            margin-block-end: 1em;
            height:3em;
            width: 80%;
        }

        .`+UID+`settings-menu-element h3{
            font-size:1.5em;
            margin: auto;
            margin-block-start: 0;
            margin-block-end: 0;
            line-height: 2em;
        }

        .`+UID+`settings-menu-element-selected {
            --`+UID+`_svg-innercolor:var(--`+UID+`_bgColorDarkest:);
            --`+UID+`_svg-outercolor:var(--`+UID+`_bgColorDarkest:);
            background: var(--`+UID+`_fgColor);
            color: var(--`+UID+`_bgColorDarkest:);
        }

        .`+UID+`settings-menu-element-not-selected {
            --`+UID+`_svg-innercolor:var(--`+UID+`_fgColor);
            --`+UID+`_svg-outercolor:var(--`+UID+`_fgColor);
            color: var(--`+UID+`_fgColor);
            background: var(--`+UID+`_bgColorDarkest);
        }

        .`+UID+`setting-value{
            float:right;
            margin-right:2%;
        }
        .`+UID+`setting-arrow{
            float:right;
            margin-right:1%;
        }
        .`+UID+`toggle{
            text-align: center;
            margin-block-start: 0;
            margin-block-end: 0;
            margin:auto;
            float:right;
        }  
        
        `;
    }

    function contrastCheck(){
        let B= (savefile.settings.color.background[0]*100 + savefile.settings.color.background[1]*450 + savefile.settings.color.background[2]*450)/1000; 
        let P= (savefile.settings.color.foreground[0]*100 + savefile.settings.color.foreground[1]*450 + savefile.settings.color.foreground[2]*450)/1000;
        console.log(Math.round(Math.abs(B - P)));
        if(Math.round(Math.abs(B - P))>0)return true;
        else return false;
    }

    function menuUp(){
        

        MenuSetState(UID+'setting-'+selectedSetting, 'not selected',UID+'settings-menu-element-selected',UID+'settings-menu-element-not-selected');
        selectedSetting--;
        if (selectedSetting===-1){selectedSetting=8;}
        MenuSetState(UID+'setting-'+selectedSetting, 'selected',UID+'settings-menu-element-selected',UID+'settings-menu-element-not-selected');

    }

    function menuDown(){
        
   
        MenuSetState(UID+'setting-'+selectedSetting, 'not selected',UID+'settings-menu-element-selected',UID+'settings-menu-element-not-selected');
        selectedSetting++;
        if (selectedSetting===9){selectedSetting=0;}
        MenuSetState(UID+'setting-'+selectedSetting, 'selected',UID+'settings-menu-element-selected',UID+'settings-menu-element-not-selected');

    }

    function selectSetting(){
        if(selectedSetting<=2){
            if(settings.toggle[selectedSetting])settings.toggle[selectedSetting]=0;
        
            else settings.toggle[selectedSetting]=1;

            toggleLoader()
        }
        else{//siia saab teha locki kui pole piisavalt kontrasti, siis ei saa välja
            var contrast=contrastCheck();
            if(settingSelected){
                if(contrast===true){
                    upDownLoader(false);
                    colorLoader();
                    refreshStyle();
                    controls.key.clear.byKey("all");
                    clearFooter();
                    settingSelected=false;

                    controls.key.set("up",0,menuUp,"Move Up");
                    controls.key.set("down",0,menuDown,"Move Down");
                    controls.key.set("left",0,gameMenu,"Game Menu");
                    controls.key.set("confirm",0,selectSetting,"Select Setting");
                }
               
            }
            else if(!settingSelected){
                controls.key.clear.byKey("all");
                clearFooter();
                upDownLoader(true);
                settingSelected=true;
                
                controls.key.set("up",0,increaseValue,"Increase");
                controls.key.set("down",0,decreaseValue,"Decrease");
                controls.key.set("confirm",0,selectSetting,"Un Select Setting");
            }
        }
        savefileSaver();
    }

    function increaseValue(){
        console.log("increase");
        if(selectedSetting>=3 && selectedSetting<=5){
            savefile.settings.color.foreground[selectedSetting-3]++;
            if(savefile.settings.color.foreground[selectedSetting-3]>100)savefile.settings.color.foreground[selectedSetting-3]=100;
        }
        if(selectedSetting>=6 && selectedSetting<=8){
            savefile.settings.color.background[selectedSetting-6]++;
            if(savefile.settings.color.background[selectedSetting-6]>100)savefile.settings.color.background[selectedSetting-6]=100;
        }
        colorLoader();
        
    }

    function decreaseValue(){
        console.log("decrease")
        if(selectedSetting>=3 && selectedSetting<=5){
            savefile.settings.color.foreground[selectedSetting-3]--;
            if(savefile.settings.color.foreground[selectedSetting-3]<0)savefile.settings.color.foreground[selectedSetting-3]=0;
        }
        if(selectedSetting>=6 && selectedSetting<=8){
            savefile.settings.color.background[selectedSetting-6]--;
            if(savefile.settings.color.background[selectedSetting-6]<0)savefile.settings.color.background[selectedSetting-6]=0;
        }
        colorLoader();
    }

    function gameMenu(){
        exitScreen("gameMenu");
    }
 
    controls.key.set("up",0,menuUp,"Move Up");
    controls.key.set("down",0,menuDown,"Move Down");
    controls.key.set("left",0,gameMenu,"Game Menu");
    controls.key.set("confirm",0,selectSetting,"Select Setting");

}

function splash_handler(context, style, controls, contentElementObject, localTimerIds ,screenSettings,gameData,settings,UID){
    function splashIn(bottomBox,topBox){
        document.getElementById("bodyId").innerHTML=`
        <div class="`+UID+`wrapper">
            <div class="`+UID+`box1">`+contentElementObject.bottomBox+`</div>
    
            <div class="`+UID+`box2">`+contentElementObject.topBox+`</div>
        </div>`;
    }
    screenSettings["colors"].bgcolor=new screenSettings["colors"].Color100(settings.color.background[0],settings.color.background[1],settings.color.background[2]);
    screenSettings["colors"].fgcolor=new screenSettings["colors"].Color100(settings.color.foreground[0],settings.color.foreground[1],settings.color.foreground[2]);
    let palette=screenSettings["colors"].palette;
    palette=screenSettings["colors"].getPalette(screenSettings["colors"].fgcolor, screenSettings["colors"].bgcolor);

    style.innerHTML=`:root {
     
        --`+UID+`_fgColorDull: `+screenSettings.colors.css(palette.fg.dull)+`;
        --`+UID+`_fgColorDarkest: `+screenSettings.colors.css(palette.fg.darkest)+`;
        --`+UID+`_fgColorDark: `+screenSettings.colors.css(palette.fg.dark)+`;

        --`+UID+`_fgColor: `+screenSettings.colors.css(palette.fg.normal)+`;
        
        --`+UID+`_fgColorBright: `+screenSettings.colors.css(palette.fg.bright)+`;
        --`+UID+`_fgColorBrightest: `+screenSettings.colors.css(palette.fg.brightest)+`;
        --`+UID+`_fgColorBloom: `+screenSettings.colors.css(palette.fg.bloom)+`;


        --`+UID+`_bgColorDull: `+screenSettings.colors.css(palette.bg.dull)+`;
        --`+UID+`_bgColorDarkest: `+screenSettings.colors.css(palette.bg.darkest)+`;
        --`+UID+`_bgColorDark: `+screenSettings.colors.css(palette.bg.dark)+`;

        --`+UID+`_bgColor: `+screenSettings.colors.css(palette.bg.normal)+`;
        
        --`+UID+`_bgColorBright: `+screenSettings.colors.css(palette.bg.bright)+`;
        --`+UID+`_bgColorBrightest: `+screenSettings.colors.css(palette.bg.brightest)+`;
        --`+UID+`_bgColorBloom: `+screenSettings.colors.css(palette.bg.bloom)+`;
    }
    body {
        background:var(--`+UID+`_bgColor);
        overflow: hidden;
        margin: 0;
    }
    .`+UID+`trisign{
        --svg-fgcolor: var(--`+UID+`_bgColor);
        width: 13em;
        text-align: center;
        margin-block-start: 0;
        margin-block-end: 0;
        margin:auto;
        margin-right: 1%;
    }
    .`+UID+`bottomBox{
        font-size: 5em;
        font-weight: bold;
        color: var(--`+UID+`_bgColor);
        text-align: center;
        margin-block-start: 0;
        margin-block-end: 0;
        margin:auto;
        margin-left: 1%;
    }
    
    .`+UID+`topBox{
        font-size: 11em;
        font-weight: bold;
        color: var(--`+UID+`_bgColor);
        text-align: center;
        margin-block-start: 0;
        margin-block-end: 0;
        margin:auto;
        margin-right: 1%;
    }
    
    .`+UID+`box1{
        width: 1500px;
        height: 200px;
        transform: translate(300%,220%);
        background-color: var(--`+UID+`_fgColor);
        position: absolute;
        display:flex;
        
        animation-name: `+UID+`box1slide;
        animation-duration: 5s;
        animation-timing-function: ease-out;
        animation-fill-mode: forwards;
        animation-direction: normal;
       
    }
    .`+UID+`box2{
        width: 1500px;
        height: 200px;
        transform: translate(-300%,100%);
        background-color: var(--`+UID+`_fgColor);
        position: absolute;
        display:flex;
        
        animation-name: `+UID+`box2slide;
        animation-duration: 5s;
        animation-timing-function: ease-out;
        animation-fill-mode: forwards;
        animation-direction: normal;
    
        text-align: right;
        
    }
    .`+UID+`wrapper {
        transform: rotate(-20deg);
        position: relative;
        width: 100%;
        height: 100%;
        content: "";
    }
    
    
    @keyframes `+UID+`box1slide {
        0% { }
        25% { transform: translate(50%,220%);}
        75% { transform: translate(50%,220%);}
        100% { transform: translate(300%,220%);}
    }
    @keyframes `+UID+`box2slide {
        0% { }
        25% { transform: translate(-40%,100%);}
        75% { transform: translate(-40%,100%);}
        100% {transform: translate(-300%,100%);}
    }
    `;
    function splashOut(whatNext){
        //clearTimers(localTimerIds);
        //controls.key.clear.byKey("all");
        clearFooter();
        clearStyle()
        clearBody();
        nextScreen(whatNext);
    }
    if(gameData.currentQuestion===0 || gameData.currentQuestion>=gameData.gameOrder.length){
        splashIn(contentElementObject.bottomBox,contentElementObject.topBox);
        if(gameData.currentQuestion===0)setTimeout(splashOut,5000,nextTypeFinder());
        else setTimeout(exitScreen,5000,"gameMenu");
    }
    else if(gameData.gameOrder[gameData.currentQuestion]===-1){
        splashIn(contentElementObject.bottomBox,contentElementObject.topBox);
        setTimeout(splashOut,5000,"minigame");
    
    }
    else if(gameData.gameOrder[gameData.currentQuestion]===-2){
        splashIn(contentElementObject.bottomBox,contentElementObject.topBox);
        setTimeout(splashOut,5000,"minigame");
    
    }
    
    
}

var controls={
    key:{
        listenerActive:false,
        linkId:0,
        bind:{
            up: 'w',
            down: 's',
            left: 'a',
            right: 'd',
            confirm: 'x' 
        },
        link:{
           up:[],
            down:[],
             left:[],
             right:[],
             confirm:[]
        },
        fill:function(selectedKey,keyDuration,keyAction,keyDescription,bindId){
            var keyObject={
                duration:keyDuration,
                action:keyAction,
                description:keyDescription,
                id: bindId
                }
            if(DEBUG)console.log(keyObject);
            controls.key.link[selectedKey].push(keyObject);
        },
        clear:{
            byKey:function(selectedKey){
                if(selectedKey==="all"){
                    controls.key.link.up=[];
                    controls.key.link.down=[];
                    controls.key.link.left=[];
                    controls.key.link.right=[];
                    controls.key.link.confirm=[];
                }
                else{
                    controls.key.link[selectedKey]=[];
                }
            },
            byId:function(targetId){
            var values=Object.values(controls.key.link);
            var found=false;
            id:
            for(i=0;i<values.length;i++){
                for(j=0;j<values[i].length;j++){
                    if(values[i][j].id===targetId){
                        values[i][j]={};
                        found=true;
                        break id;
                    }
                }
            }
            if(!found){notify("targetId not found!!!", "function");}
            }
        },
        
        set: function(selectedKey,keyDuration,keyAction,keyDescription){
            var keyBinds=[controls.key.bind.up,controls.key.bind.down,controls.key.bind.left,controls.key.bind.right,controls.key.bind.confirm];
            this.linkId++;
            if(!controls.key.listenerActive){
                document.addEventListener('keydown',keyDownFunction);
                document.addEventListener('keyup',keyUpFunction);
                controls.key.listenerActive=true;
            }
            controls.key.fill(selectedKey,keyDuration,keyAction,keyDescription,this.linkId);
            var whichKey = {};

            function keyDownFunction(event){
                if ( whichKey[event.key] ) return;
                whichKey[event.key] = event.timeStamp;
            }

            function keyUpFunction(event){
                notify(event.key, "update");
                if ( !whichKey[event.key] ) return;
                var pressDuration = event.timeStamp - whichKey[event.key];
                whichKey[event.key] = 0;
                notify(pressDuration, "update");
                findAction(pressDuration);
            }

            function findAction(pressDuration){
                if(keyBinds.includes(event.key,0)){
                    find:
                    for(i=0;i<5;i++){
                        if (event.key === keyBinds[i]){
                            var values=Object.values(controls.key.link);
                            if(values[i].length!==0){
                                var keyDurations=[];
                                for(j=0;j<values[i].length;j++){
                                    keyDurations[j]=values[i][j].duration;
                                }
                                keyDurations.push(86400000);
                                keyDurations.sort(function(a, b){return a-b});
                                for(j=0;j<keyDurations.length;j++){
                                    if(keyDurations[j]>pressDuration){
                                        if(j===0) break find;
                                        else{ 
                                            for(k=0;k<keyDurations.length;k++){
                                                if(keyDurations[j-1]===values[i][k].duration){
                                                    values[i][k].action(pressDuration);

                                                    break find;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if(keyDescription===false){return this.linkId;}
            else{
                footerUISVG(keyDescription,selectedKey);
                return this.linkId;
            }
        }
    
    }

}

function footerUISVG(description,key){
    document.getElementById("footerId").innerHTML+= "<a><h3>"+ description +
        `: <svg class="UI-smallSVG buttonSymbol_glow_`+key+`" version="1.1" viewBox="0 0 12.7 12.7" preserveAspectRatio="xMinYMin meet" xmlns="http://www.w3.org/2000/svg">
        <filter id="filter2993" x="-.256" y="-.256" width="1.512" height="1.512" style="color-interpolation-filters:sRGB">
        <feGaussianBlur stdDeviation="0.33866608"/>
        </filter>
        <filter id="filter2989" x="-.256" y="-.256" width="1.512" height="1.512" style="color-interpolation-filters:sRGB">
        <feGaussianBlur stdDeviation="0.33866608"/>
        </filter>
        <filter id="filter2985" x="-.256" y="-.256" width="1.512" height="1.512" style="color-interpolation-filters:sRGB">
        <feGaussianBlur stdDeviation="0.33866608"/>
        </filter>
        <filter id="filter2981" x="-.256" y="-.256" width="1.512" height="1.512" style="color-interpolation-filters:sRGB">
        <feGaussianBlur stdDeviation="0.33866608"/>
        </filter>
        <filter id="filter2977" x="-.256" y="-.256" width="1.512" height="1.512" style="color-interpolation-filters:sRGB">
        <feGaussianBlur stdDeviation="0.33866608"/>
        </filter>

        <g transform="translate(0 -284.3)">
            <path d="m4.7626 285.36v3.175h3.175v-3.175zm0.5291 0.52917h2.1167v2.1167h-2.1167z" style="fill:var(--svg-b-up-glow);filter:url(#filter2977);paint-order:markers fill stroke"/>
            <path d="m4.7626 285.36v3.175h3.175v-3.175zm0.5291 0.52917h2.1167v2.1167h-2.1167z" style="fill:var(--svg-b-up);paint-order:markers fill stroke"/>
            <path d="m8.4667 289.06v3.175h3.175v-3.175zm0.5292 0.52917h2.1167v2.1167h-2.1167z" style="fill:var(--svg-b-right-glow);filter:url(#filter2981);paint-order:markers fill stroke"/>
            <path d="m8.4667 289.06v3.175h3.175v-3.175zm0.5292 0.52917h2.1167v2.1167h-2.1167z" style="fill:var(--svg-b-right);paint-order:markers fill stroke"/>
            <path d="m4.7626 292.77v3.175h3.175v-3.175zm0.5291 0.52917h2.1167v2.1167h-2.1167z" style="fill:var(--svg-b-down-glow);filter:url(#filter2985);paint-order:markers fill stroke"/>
            <path d="m4.7626 292.77v3.175h3.175v-3.175zm0.5291 0.52917h2.1167v2.1167h-2.1167z" style="fill:var(--svg-b-down);paint-order:markers fill stroke"/>
            <path d="m1.0584 289.06v3.175h3.175v-3.175zm0.5292 0.52917h2.1166v2.1167h-2.1166z" style="fill:var(--svg-b-left-glow);filter:url(#filter2989);paint-order:markers fill stroke"/>
            <path d="m1.0584 289.06v3.175h3.175v-3.175zm0.5292 0.52917h2.1166v2.1167h-2.1166z" style="fill:var(--svg-b-left);paint-order:markers fill stroke"/>
            <path d="m4.7625 289.06v3.175h3.175v-3.175zm0.5292 0.52917h2.1167v2.1167h-2.1167z" style="fill:var(--svg-b-confirm-glow);filter:url(#filter2993);paint-order:markers fill stroke"/>
            <path d="m4.7625 289.06v3.175h3.175v-3.175zm0.5292 0.52917h2.1167v2.1167h-2.1167z" style="fill:var(--svg-b-confirm);paint-order:markers fill stroke"/>
        </g>
        </svg>`+
        "</h3></a>";
}

function clearTimers(localTimerIds){
    for(i=0;i<localTimerIds.length;i++){
        clearInterval(localTimerIds[i])
    }
    localTimerIds.length=0;
}

function clearStyle(){
    document.getElementById("styleId").innerHTML="";
}

function clearFooter(){
    document.getElementById("footerId").innerHTML="";
}

function clearBody(){
    document.getElementById("bodyId").innerHTML="";
}

function reloadFooter(){
    for(i=0;i<controls.key.link.up.length;i++){
        footerUISVG(controls.key.link.up[i].description,"up");
    }
    for(i=0;i<controls.key.link.down.length;i++){
        footerUISVG(controls.key.link.down[i].description,"down");
    }
    for(i=0;i<controls.key.link.left.length;i++){
        footerUISVG(controls.key.link.left[i].description,"left");
    }
    for(i=0;i<controls.key.link.right.length;i++){
        footerUISVG(controls.key.link.right[i].description,"right");
    }
    for(i=0;i<controls.key.link.confirm.length;i++){
        footerUISVG(controls.key.link.confirm[i].description,"confirm");
    }
}

function logicController(whatNext){
    if(whatNext==="gameMenu"){
        savefile.gameData.currentQuestion=0;
        savefile.gameData.state=1;
        savefile.gameData.selectedGame=0;
        nextScreen(nextTypeFinder());
    }
    if(whatNext==="settingsMenu"){
        savefile.gameData.state=3;
        nextScreen(nextTypeFinder());
    }
    
    if(whatNext==="startGame"){
        savefile.gameData.state=2;
        savefile.gameData.gameOrder=gameOrderer();
        nextScreen("splash");

    }

    if(whatNext==="nextType"){
        savefile.gameData.currentQuestion++;
        if(savefile.gameData.currentQuestion>=savefile.gameData.gameOrder.length){
            nextScreen("splash");
        }
        else if(nextTypeFinder()==="minigame"){
            nextScreen("splash");}
        else nextScreen(nextTypeFinder());
    }

    if(whatNext==="previousType"){
        savefile.gameData.currentQuestion--;
        if(savefile.gameData.currentQuestion<0){savefile.gameData.currentQuestion=0;}
        nextScreen(nextTypeFinder());
    }
    savefileSaver();
}

function exitScreen(whatNext) {
    clearTimers(localTimerIds);
    controls.key.clear.byKey("all");
    clearFooter();
    clearStyle()
    clearBody();
    logicController(whatNext);
}

//Kasulik info:
//Object oriented programming + inheritance
// IIFE (Immediately Invokable Function Expression) startupil asjade tegmiseks

//window.requestAnimationFrame(function (){logicController(whatNext)});
//setTimeout(function(){logicController(whatNext);},0);


//BUGGGGGGGGGGG BASE
//keyDurations.push() LOOOOOOL

//FUTURE 
//minigame sagedus setting

//CONTROLS
