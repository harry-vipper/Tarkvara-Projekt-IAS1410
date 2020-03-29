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