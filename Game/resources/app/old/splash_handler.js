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