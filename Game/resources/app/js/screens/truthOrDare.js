//The truth or dare minigame screen to let the user play the truth or dare game.
var screen_truth_or_dare={
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

        //Make the footer semi transparent.
        render.footer.transparentize();

        //Load the screen CSS to DOM or the style element.
        system.screen.loadResource("/resources/css/truthOrDare.css").then((css)=>{
            if(fileCSS) {
                system.screen.loadCSStoDOM("resources/css/truthOrDare.css");
            }
            else{
                style.innerHTML=css;
            }

        }).then(()=>{
            //Make a copy of the HTMLbase key, replace the placeholders and set it into the needed element.
            let str=this.HTMLbase.key;
            str=str.split("###").join(insertText(63));
            str=render.insertUID(str,UID);
            context.innerHTML=str;

            //Fade in the screen
            return render.fade.in(context);
        }).then(()=>{
            //Calculate the angles of the arrows.
            const arrow_pointing_angle=Math.random()*360+5*360;
            const arrow_pointed_angle=Math.random()*360+5*360;

            function startMinigame(){//Start minigame function to start the minigame.
                //Clear the start key and reload, footer and fade out the instructions.
                controls.key.clear.byId(keylinkId);

                system.screen.footer.reload();

                return render.fade.out(document.getElementById(UID+"_UIdiv")).then(()=>{
                    //Wait.
                    return delay(screenSettings.fadeTime+screenSettings.inBetweenTimem,localTimerIds);

                }).then(()=>{
                    //Make a copy of the HTMLbase arrow, replace the placeholders and set it into the element.
                    let str=screen_truth_or_dare.HTMLbase.arrow;
                    str=str.split("###").join(insertText(64));
                    str=render.insertUID(str,UID);
                    context.innerHTML=str;

                    //Fade in the arrows.
                    return render.fade.in(document.getElementById(UID+"_UIdiv"));
                }).then(()=>{
                    //Wait.
                    return delay(screenSettings.rollTime,localTimerIds);

                }).then(()=>{
                    //Set the animations of the arrows.
                    render.setAnimation(UID+"_UI-arrow-pointed", UID+"_arrow_pointed_animation");
                    render.setAnimation(UID+"_UI-arrow-pointing", UID+"_arrow_pointing_animation");
                    
                    //Wait.
                    return delay(screenSettings.instructionPopupTime,localTimerIds);

                }).then(()=>{
                    //Fade in the end notice.
                    render.fade.in(document.getElementById(UID+"_nextNotice"));
                    return true;
                });
            }

            //Set the controls and link the start key to an id so it can be cleared.
            controls.key.set("up",1000,()=>{end({type: "gameSelectionMenu", value: null});},insertText(6),false,true);
            controls.key.set("left",1000,()=>{end({type: "nextScreen", value: "last"});},insertText(7),false,true);
            controls.key.set("right",1000,()=>{end({type: "nextScreen", value: "next"});},insertText(8),false,true);
            controls.key.set('down', 1000, ()=>{end({type:"editorConnect"});}, insertText("46"),false,true);

            let keylinkId=controls.key.set("confirm",0, startMinigame,insertText(11),false,true);
        });

        return endpromise
    },
    //The stored HTMLs to be filled and displayed on the screen.
    HTMLbase:{
        key:`
        <div id="UID_UIdiv" class="r_invisCapable">
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
            <p class="UID_UI_smalltext UID_UI_text_startNotice">###</p>
        </div>
    `,
    arrow:`
        <div id="UID_UIdiv" class="r_invis r_invisCapable" >
            <div class="UID_circle">
                <div class="UID_circle-centerer">
                    <svg id="UID_UI-circle" class="UID_circleSVG UID_arrow_animation" version="1.1" viewBox="0 0 146.58 146.58" preserveAspectRatio="xMinYMin meet" xmlns="http://www.w3.org/2000/svg">
                        <g transform="translate(-32.544 -123.17)">
                            <circle cx="105.83" cy="196.46" r="71.967" style="fill:none;paint-order:markers fill stroke;stroke-linecap:round;stroke-width:2.6458;"/>
                        </g>
                    </svg>
                    <svg id="UID_UI-arrow-pointing" class="UID_circleSVG UID_arrow_animation"   version="1.1" viewBox="0 0 146.58 146.58" preserveAspectRatio="xMinYMin meet" xmlns="http://www.w3.org/2000/svg">
                        <g transform="translate(-32.544 -123.17)">
                            <path d="m71.967 221.86-25.4-25.4 25.4-25.4m33.867 25.4h-59.267" style="fill:none;stroke-linecap:round;stroke-width:2.6458;"/>
                        </g>
                    </svg>
                    <svg id="UID_UI-arrow-pointed" class="UID_circleSVG UID_arrow_animation"  version="1.1" viewBox="0 0 146.58 146.58" preserveAspectRatio="xMinYMin meet" xmlns="http://www.w3.org/2000/svg">
                        <g transform="translate(-32.544 -123.17)">
                            <path d="m160.87 171.06-25.4 25.4 25.4 25.4m-55.033-25.4h29.633" style="fill:none;stroke-linecap:round;stroke-width:2.6458;"/>
                        </g>
                    </svg>

                </div>
            </div>
            <p id="UID_nextNotice" class="UID_UI_smalltext UID_UI_text_nextNotice r_invis r_invisCapable">###</p>
        </div>
    `
    }
}