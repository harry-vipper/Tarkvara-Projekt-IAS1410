//The reaction test screen to test the users reaction time.
var screen_reaction_test={
    handler:function (context,       
        style,        
        controls,       
        screenContent, 
        localTimerIds,  
        screenSettings, 
        render,
        UID,
    )
    /*
    context,        <div> to draw into
    style,          <style> to send styles to
    controls,       controls object with methods to handle controls
    screenContent,  data passed to the screen, in any format, possibly suitable to this screen only
    localTimerIds,  Array of active timers
    screenSettings, settings like colors
    UID             Unique ID of the HTML/CSS elements
    */
    {
        var end;
        //Setting the endpromise to trigger when the end promise comes true.
        var endpromise=new Promise((resolve) =>{
            end=resolve;
            }
        );

        //Calculate the random number of reactions.
        let nrOfReactions=  Math.floor(Math.random() * (screenSettings.maxReactions+1));
        
        var buttons=Object.keys(controls.key.link);

        //Make the footer semi transparent.
        render.footer.transparentize();

        //Load the screen CSS to DOM or the style element.
        system.screen.loadResource("/resources/css/reactionTest.css").then((css)=>{
            if(fileCSS) {
            system.screen.loadCSStoDOM("resources/css/reactionTest.css");
            }
            else{
            style.innerHTML=css;
            }

        }).then(()=>{
            //Make a copy of the HTMLbase, replace the placeholders and set it into the needed element.
            let str=this.HTMLbase;
            str=str.split("###").join(insertText(61));
            str=render.insertUID(str,UID);
            context.innerHTML=str;

            //Fade in the screen.
            render.fade.in(context);

            //Wait for the given instruction time.
            return delay(screenSettings.instructionTime,localTimerIds);

        }).then(()=>{
            //Fade out the instructions.
            render.fade.out(document.getElementById(UID+"_UIdiv"));

            //Wait for the give in between time.
            return delay(screenSettings.inBetweenTime,localTimerIds);
            
        }).then(()=>{  
            //Present the user with the ready notice.
            let str=`<div id="UID_UIdiv" class="r_invis r_invisCapable">
                <p id="UID_UI_text_prompt" class="UID_UI_smalltext UID_UI_text_readyNotice">`+insertText(59)+`</p>
            </div>`;
            str=render.insertUID(str,UID);
            context.innerHTML=str;

            //Fade in the ready notice.
            render.fade.in(document.getElementById(UID+"_UIdiv"));

            //Wait.
            return delay((screenSettings.readyTime+screenSettings.inBetweenTime),localTimerIds); 

        }).then(()=>{
            //Fade out the ready notice.
            render.fade.out(document.getElementById(UID+"_UIdiv"));

            //Wait.
            return delay(screenSettings.inBetweenTime,localTimerIds);

        }).then(()=>{        
            //Setting the minigame promise to trigger when the endMinigame promise comes true.
            var endMinigame;
            var minigame=new Promise((resolve) =>{
                endMinigame=resolve;
            });

            //Set start data.
            let setCounter=0;
            let score=0;
            
            let time=Date;
            let startTime=time.now();

            notify("start Timestamp: "+String(startTime), "screen");

            let responses=[
                {time: 700, str: insertText(54)},
                {time: 1000, str: insertText(55)},
                {time: 18000, str: insertText(56)},
                {time: 2700, str: insertText(57)},
                {time: Infinity, str: insertText(58)}
            ];

            let actionIDs = [];

            actionIDs.length = buttons.length;

            actionIDs.fill(0);


            function setKeys() {//Set keys function to set the keys for the reaction test randomly.

                let promptKeyIndex=Math.floor(Math.random() * (buttons.length));

                notify("Random button index: "+String(promptKeyIndex), "screen");

                for (let i=0; i<buttons.length; i++) {
                    if(promptKeyIndex===i) {
                        actionIDs[i]=controls.key.set(buttons[i], 0, ()=>{notify("Correct", "function"); return setup(true);}, false, false, true);
                        notify(buttons[i], "screen");
                    }
                    else {
                        actionIDs[i]=controls.key.set(buttons[i], 0, ()=>{notify("Incorrect", "function"); return setup(false);}, false, false, false);
                    }
                }
            }


            function setup(success) {//The setup function to construct a respone based on the reaction time of the user.

                for (let i=0; i<buttons.length; i++) {
                    controls.key.clear.byId(actionIDs[i]);
                }

                let reactionTime=setScore(success);

                notify("Reaction time: "+String(reactionTime), "screen");

                startTime=time.now();

                let str=insertText(62);

                if(success) {
                    str=getResponse(reactionTime);
                }

                document.getElementById(UID+"_UI_text_prompt").innerHTML=str;

                //If there are supposed to be more reactions set the keys again, else end the minigame.
                if(setCounter<nrOfReactions) {
                    setCounter++;
                    setKeys();
                }
                else {
                    return endMinigame(score);
                }
            }


            function setScore(success) {//The set score function to calculate the total score of the user.

                let reactionTime=time.now()-startTime;
                if (success) {
                    score+=reactionTime;
                }
                else {
                    score+=reactionTime*5;
                }
                
                return reactionTime;
            }


            function getResponse(reactionTime) {//The get response function to find the correct response based on reaction time.
                let str="";

                for(let i=responses.length; i>0; i--) {
                    if(reactionTime<responses[i-1].time) {
                        str=responses[i-1].str;
                    }
                }

                return str;
            }

            //Construct the start notice and fade it in.
            let str=`<div id="UID_UIdiv" class="r_invis r_invisCapable">
                <p id="UID_UI_text_prompt" class="UID_UI_smalltext UID_UI_text_readyNotice">`+insertText(60)+`</p>
            </div>`;

            str=render.insertUID(str,UID);
            context.innerHTML=str;

            render.fade.in(document.getElementById(UID+"_UIdiv"));

            //Start the reaction test.
            setKeys();

            //Return after all reactions are complete.
            return minigame
    
        }).then((input)=>{  
            //Clear the leftover controls, and delay for the give inBetweenTime.
            controls.key.clear.byKey("all");

            return delay(screenSettings.inBetweenTime,localTimerIds).then(()=>{return input;});

        }).then((input)=>{ 
            //Fade out the last score.
            return render.fade.out(document.getElementById(UID+"_UIdiv")).then(()=>{return input;});

        }).then((input)=>{     
            //Insert the total score and wait.
            document.getElementById(UID+"_UI_text_prompt").innerHTML=input

            return delay(screenSettings.inBetweenTime,localTimerIds);

        }).then(()=>{ 
            //Set the controls so the user can skip waiting or take other actions and display the total score.
            controls.key.set("up",1000,()=>{end({type: "gameSelectionMenu", value: null});},insertText(6),false,true);
            controls.key.set("left",1000,()=>{end({type: "nextScreen", value: "last"});},insertText(7),false,true);
            controls.key.set("right",1000,()=>{end({type: "nextScreen", value: "next"});},insertText(8),false,true);
            controls.key.set('down', 1000, ()=>{end({type:"editorConnect"});}, insertText(46),false,true);

            return render.fade.in(document.getElementById(UID+"_UIdiv"));

        }).then(()=>{ 
            //Wait.
            return delay(screenSettings.endNoticeTime,localTimerIds);

        }).then(()=>{   
            //Fade out the total score.
            return render.fade.out(document.getElementById(UID+"_UIdiv"));

        }).then(()=>{   
            //End the minigame.
            return end({type: "nextScreen", value: "next"});
        });
        return endpromise;
    },
    //The stored HTML to be filled and displayed on the screen.
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
        <p class="UID_UI_smalltext UID_UI_text_startNotice" id="UID_UI_text_startNotice">###</p>
    </div>`
}