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