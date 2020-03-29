function minigame_reactionTest(context, style, controls, contentElementObject, localTimerIds, screenSettings,gameData,settings,UID){
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