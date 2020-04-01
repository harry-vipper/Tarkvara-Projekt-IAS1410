var screens = [
    {
        screenObject: {
            type: "task",
            initialiser: task_handler, //(divObject,)
            contentElementObject:{
                str:"Task1 sisu mida iganes"
            },
            settings: {
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
];
var game;

var localTimerIds=[];

var i,j,k,l;

var savefile;



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
    var current=array.length, temp, random;
    while (0 !== current) {                   
        random = Math.floor(Math.random() * current);
        current --;                   
        temp = array[current];
        array[current] = array[random];
        array[random] = temp;
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

/*function UIDgenerator(){
    let UID="id"
    var char='abcdefghijklmnopqrstuvwxyz0123456789';
   for (i = 0; i < 7; i++) {
      UID += char.charAt(Math.floor(Math.random() * 36));
   }
    return UID;
}
*/
function startup(){
    /*savefileLoader(); 
    gamefileLoader();
    footerColors();
    if(savefile.gameData.state===2){
        nextScreen("save");
    }
    else exitScreen("gameMenu");*/
}



function footerColors(){//Sets footer color variables in STYLE 
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
       // debugger;
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

/*function MenuSetState(elementId,state,selected,notSelected) {
    var element = document.getElementById(elementId);
    if (state=="selected") {
        element.classList.remove(notSelected);
        element.classList.add(selected);
    }
    else if (state=="not selected") {
        element.classList.remove(selected);
        element.classList.add(notSelected);
    }
}*/

function minigame_handler(context, style, controls, contentElementObject, localTimerIds, screenSettings,gameData,settings,UID) {
    if(gameData.gameOrder[gameData.currentQuestion]===-1){
        minigame_truthOrDare(context, style, controls, contentElementObject, localTimerIds, screenSettings,gameData,settings,UID);
    }

    if(gameData.gameOrder[gameData.currentQuestion]===-2){
        minigame_reactionTest(context, style, controls, contentElementObject, localTimerIds, screenSettings,gameData,settings,UID);
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


/*function reloadFooter(){
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
}*/

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



//window.requestAnimationFrame(function (){logicController(whatNext)});
//setTimeout(function(){logicController(whatNext);},0);


//BUGGGGGGGGGGG BASE
//keyDurations.push() LOOOOOOL

//FUTURE 
//minigame sagedus setting
