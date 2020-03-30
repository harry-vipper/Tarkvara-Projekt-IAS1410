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
    .`+UID+`game-save-menu-title h1{
        margin: 1em 0 2em 0;
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
    }
    .`+UID+`game-save-menu-head-not-selected{
        color: var(--`+UID+`_fgColor);
        background-color: var(--`+UID+`_bgColorDarkest);
        
    }
    .`+UID+`game-save-menu-head{
        margin: auto;
        text-align: center;
        width: 80%;
        margin-block-start: 1em;
        margin-block-end: 1em;
        font-size: 1.5em;
        padding: 0.5em;
        box-sizing: border-box;
        transition: background 0.1s ease-in-out, color 0.2s ease-in-out;
        
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
        padding: 2em 0 3em 0;
        box-sizing: border-box;
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