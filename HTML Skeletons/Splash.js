function splash_handler(context, style, controls, contentElementObject, localTimerIds ,screenSettings,gameData,settings,UID){
    function splashIn(bottomBox,topBox){
        document.getElementById("bodyId").innerHTML=`
        <div class="`+UID+`wrapper">
            <div id="`+UID+`box1" class="`+UID+`box1">`+bottomBox+`</div>
    
            <div id="`+UID+`box2" class="`+UID+`box2">`+topBox+`</div>
        </div>`;
    }
    screenSettings["colors"].bgcolor=new screenSettings["colors"].Color100(settings.colour.background[0],settings.colour.background[1],settings.colour.background[2]);
    screenSettings["colors"].fgcolor=new screenSettings["colors"].Color100(settings.colour.foreground[0],settings.colour.foreground[1],settings.colour.foreground[2]);
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
        
        
       
    }
    .box1_move{
        
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
        
        text-align: right;
        
    }
    .box2_move{
        animation-name: `+UID+`box2slide;
        animation-duration: 5s;
        animation-timing-function: ease-out;
        animation-fill-mode: forwards;
        animation-direction: normal;
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
        clearTimers(localTimerIds);
        controls.key.clear.byKey("all");
        clearFooter();
        clearStyle()
        clearBody();
        nextScreen(whatNext);
    }
    if(gameData.currentQuestion===0 || savefile.gameData.currentQuestion>=savefile.gameData.gameOrder.length){
        var topBox=`<div class='`+UID+`topBox'>`+(savefile.gameData.selectedGame+1)+`</div>`;
        var bottomBox=`<div class='`+UID+`bottomBox'>`+screens[3].screenObject.contentElementObject[savefile.gameData.selectedGame].title +`</div>`;
        splashIn(bottomBox,topBox);




        let animationPlay = new Promise(function(resolve,reject){
            document.getElementById(UID+'box1').classList.add('box1_move');
            document.getElementById(UID+'box2').classList.add('box2_move');

            document.getElementById(UID+'box1').addEventListener("animationend",function(){resolve("Splash Animation Ended")},{once:true},false)
            
            if(0===1){reject("Failed")}
        });

        animationPlay.then(function(message){
            console.log(message);
            if(gameData.currentQuestion===0)splashOut(nextTypeFinder());
                    else splashOut("gameMenu");
        }).catch(function(message){
            console.log(message);
        });
        


    }
    else if(gameData.gameOrder[gameData.currentQuestion]===-1){
        var topBox=`<svg class="`+UID+`trisign" version="1.1" viewBox="0 0 50.8 50.8" preserveAspectRatio="xMinYMin meet" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(0,-246.2)">
                <path d="m25.524 250.97a2.6461 2.6461 0 0 0-0.26405 0 2.6461 2.6461 0 0 0-2.1508 1.3183l-20.164 34.927a2.6461 2.6461 0 0 0 2.2913 3.9688h40.328a2.6461 2.6461 0 0 0 2.2908-3.9688l-20.164-34.926a2.6461 2.6461 0 0 0-2.1673-1.3193zm-6.4849 16.284 13.17 13.172v-9.3224h3.3357v15.018h-15.015v-3.3378h9.3183l-13.168-13.17z" style="fill:var(--svg-fgcolor)"/>
            </g>
        </svg>`;
        var bottomBox=`<div class='`+UID+`bottomBox'>TRUTH OR<br>DARE</div>`;
        splashIn(bottomBox,topBox);
        setTimeout(splashOut,5000,"minigame");
    
    }
    else if(gameData.gameOrder[gameData.currentQuestion]===-2){
        var topBox=`<svg class="`+UID+`trisign" version="1.1" viewBox="0 0 50.8 50.8" preserveAspectRatio="xMinYMin meet" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(0,-246.2)">
                <path d="m25.525 250.97a2.6461 2.6461 0 0 0-0.26511 0 2.6461 2.6461 0 0 0-2.1502 1.3204l-20.164 34.924a2.6461 2.6461 0 0 0 2.2908 3.9688h40.328a2.6461 2.6461 0 0 0 2.2908-3.9688l-20.164-34.924a2.6461 2.6461 0 0 0-2.1663-1.3208zm-0.16536 8.4264a2.6461 2.6461 0 0 1 2.6851 2.6836v12.699a2.6461 2.6461 0 1 1-5.2906 0v-12.699a2.6461 2.6461 0 0 1 2.6055-2.6836zm0 21.168a2.6461 2.6461 0 0 1 2.6851 2.682v0.26564a2.6461 2.6461 0 1 1-5.2906 0v-0.26564a2.6461 2.6461 0 0 1 2.6055-2.682z" style="fill:var(--svg-fgcolor)"/>
            </g>
        </svg>`;
        
        var bottomBox=`<div class='`+UID+`bottomBox'>REACTION<br>TEST</div>`;
        splashIn(bottomBox,topBox);
        setTimeout(splashOut,5000,"minigame");
    
    }
    
    
}