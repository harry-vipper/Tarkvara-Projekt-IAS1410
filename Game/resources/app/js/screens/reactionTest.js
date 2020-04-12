var screen_reaction_test;
screen_reaction_test={
    handler:function (context,       
        style,        
        controls,       
        screenContent, 
        localTimerIds,  
        screenSettings, 
        render,
        UID,
    ){
        /*screenSettings["colors"].bgcolor=new screenSettings["colors"].Color100(settings.color.background[0],settings.color.background[1],settings.color.background[2]);
        screenSettings["colors"].fgcolor=new screenSettings["colors"].Color100(settings.color.foreground[0],settings.color.foreground[1],settings.color.foreground[2]);
        var palette=screenSettings["colors"].palette;
        palette=screenSettings["colors"].getPalette(screenSettings["colors"].fgcolor, screenSettings["colors"].bgcolor);
        */
        var end;
        var endpromise=new Promise((resolve) =>{
            end=resolve;
            }
        );
        const MG_SETTINGS = {//Need võiks parameetrina anda
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
        system.screen.loadResource("/resources/css/reactionTest.css").then(
        (css)=>{

            if(fileCSS) {
            system.screen.loadCSStoDOM("placeHolderDOMCSS", "resources/css/reactionTest.css");
            }
            else{
            style.innerHTML=css;
            }}
        ).then(()=>{
            
            let str=this.HTMLbase;
            str=str.split("UID").join(UID);
            context.innerHTML=str;

            render.fade.in(context);

            return delay(MG_SETTINGS.instructionTime,localTimerIds);
        }).then(()=>{
            render.fade.out(document.getElementById(UID+"_UIdiv"));

            return delay(MG_SETTINGS.inBetweenTime,localTimerIds);
            
        }).then(()=>{  
            let str=`<div id="UID_UIdiv" class="r_invis r_invisCapable">
                <p id="UID_UI_text_prompt" class="UID_UI_smalltext UID_UI_text_readyNotice">VALMIS?</p>
            </div>`;
            str=str.split("UID").join(UID);
            context.innerHTML=str;
            render.fade.in(document.getElementById(UID+"_UIdiv"));

            return delay((MG_SETTINGS.readyTime+MG_SETTINGS.inBetweenTime),localTimerIds); 
        }).then(()=>{
            render.fade.out(document.getElementById(UID+"_UIdiv"));

            return delay(MG_SETTINGS.inBetweenTime,localTimerIds);
        }).then(()=>{        
            var endMinigame;
            var minigame=new Promise((resolve) =>{
            endMinigame=resolve;
            }
        );
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
                    return endMinigame(score);
                }
            }
            function reactionCapture_correct() {
                notify("correct", "function") ;
                return setup(true);
            }
            function reactionCapture_incorrect() {
                notify("not correct", "function") ;
                return setup(false);
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
            let str=`<div id="UID_UIdiv" class="r_invis r_invisCapable">
                <p id="UID_UI_text_prompt" class="UID_UI_smalltext UID_UI_text_readyNotice">LÄKS</p>
            </div>`;
            str=str.split("UID").join(UID);
            context.innerHTML=str;

            render.fade.in(document.getElementById(UID+"_UIdiv"));
            setKeys();
            return minigame
    
        }).then((input)=>{  
            controls.key.clear.byKey("all");
            return delay(MG_SETTINGS.inBetweenTime,localTimerIds).then(()=>{return input;});
        }).then((input)=>{ 
            return render.fade.out(document.getElementById(UID+"_UIdiv")).then(()=>{return input;});
        }).then((input)=>{     
            document.getElementById(UID+"_UI_text_prompt").innerHTML=input

            return delay(MG_SETTINGS.inBetweenTime,localTimerIds);
        }).then(()=>{ 
            controls.key.set("left",0, ()=>{end({type: "nextScreen", value: "last"});}, "Previous");
            controls.key.set("right",0, ()=>{end({type: "nextScreen", value: "next"});}, "Next");
            controls.key.set("up",1000,()=>{end({type: "gameSelectionMenu", value: null});},"Exit Game");
            return render.fade.in(document.getElementById(UID+"_UIdiv"));
        }).then(()=>{ 
            return delay(MG_SETTINGS.endNoticeTime,localTimerIds);
        }).then(()=>{   
            return render.fade.out(document.getElementById(UID+"_UIdiv"));
        }).then(()=>{   
            return end({type: "nextScreen", value: "next"});
        });
        return endpromise;
    },
    HTMLbase:`<div id="UID_UIdiv" class="r_invisCapable">
        <svg class="UID_UI-largeSVG UID_buttonSymbol_glow_middle" version="1.1" viewBox="0 0 12.7 12.7" preserveAspectRatio="xMinYMin meet" xmlns="http://www.w3.org/2000/svg">
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
        <p class="UID_UI_smalltext UID_UI_text_startNotice">VAJUTA NUPPU KOHE, KUI SEE PÕLEMA LÄHEB</p>
    </div>`
}