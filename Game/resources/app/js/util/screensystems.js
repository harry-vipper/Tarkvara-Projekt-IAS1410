var system={//The system method for handling most central functions of the game.
    screen: {
        displayScreen: function(type, data) {
            //The display screen function to display a screen based on input parameter type.

            //Set the scroller to the top of the screen.
            window.scrollTo(0, 0);

            //Clear old style.
            this.removeDOMLoadedCSS();

            //Display the footer.
            render.footer.show();

            //Choose which screen to show. For all screens fade out after the screen has ended, and pass on output back to the main game loop.
            //Minigame splashes are displayed before the minigame screen.
            switch(type) {
                case "game-element-reaction-test":
                    return screens.splash.handler(
                        document.getElementById("screenContainer"),
                        document.getElementById("screenStyleContainer"),
                        controls,
                        {
                            icon:"bolt",
                            text:insertText("4"),
                            movetime:900,
                            staytime:3000,
                        }
                        ,
                        system.screen.timers.localTimerIds,
                        null,
                        render,
                        system.screen.UID.generate()
        
                    ).then(()=> {
                        this.destroy();
                        return screens.reaction_test.handler(
                            document.getElementById("screenContainer"),
                            document.getElementById("screenStyleContainer"),
                            controls,
                            null,
                            system.screen.timers.localTimerIds,
                            {
                                inBetweenTime: 400,
                                instructionTime:3000,
                                readyTime: 1000,
                                maxReactions: 10,
                                endNoticeTime: 6000
                            },
                            render,
                            system.screen.UID.generate()
                        )}
                    ).then((output)=>{
                        return render.fade.out(document.getElementById("screenContainer")).then(()=>{this.destroy();return output;});
                    });
                case "game-element-truth-or-dare":
                    return screens.splash.handler(
                        document.getElementById("screenContainer"),
                        document.getElementById("screenStyleContainer"),
                        controls,
                        {
                            icon:"arrow",
                            text:insertText("3"),
                            movetime:900,
                            staytime:3000,
                        }
                        ,
                        system.screen.timers.localTimerIds,
                        null,
                        render,
                        system.screen.UID.generate()
        
                    ).then(()=> {
                        this.destroy();
                        return screens.truth_or_dare.handler(
                            document.getElementById("screenContainer"),
                            document.getElementById("screenStyleContainer"),
                            controls,
                            null,
                            system.screen.timers.localTimerIds,
                            {
                                fadeTime:400,
                                inBetweenTime: 400,
                                rollTime:3000,
                                instructionPopupTime: 15000
                            },
                            render,
                            system.screen.UID.generate()
                        )}
                    ).then((output)=>{
                        return render.fade.out(document.getElementById("screenContainer")).then(()=>{this.destroy();return output;});
                    });
                case "gameSelectionMenu":
                    return screens.gameSelectionMenu.handler(
                        document.getElementById("screenContainer"),
                        document.getElementById("screenStyleContainer"),
                        controls,
                        {
                            gamefile: file.gamefile.content,
                            savefile: file.savefile.content,
                        },
                        system.screen.timers.localTimerIds,
                        null,
                        render,
                        system.screen.UID.generate()
                    ).then((output)=>{
                        return render.fade.out(document.getElementById("screenContainer")).then(()=>{this.destroy();return output;});
                    });
                case "gameEnd":
                    return screens.splash.handler(
                        document.getElementById("screenContainer"),
                        document.getElementById("screenStyleContainer"),
                        controls,
                        {
                            icon:"exclamationmark",
                            text:insertText("5"),
                            movetime:900,
                            staytime:3000,
                        },
                        system.screen.timers.localTimerIds,
                        null,
                        render,
                        system.screen.UID.generate()
        
                    ).then(()=> {
                        this.destroy();
                        return screens.gameSelectionMenu.handler(
                            document.getElementById("screenContainer"),
                            document.getElementById("screenStyleContainer"),
                            controls,
                            {
                                gamefile: file.gamefile.content,
                                savefile: file.savefile.content,
                            },
                            system.screen.timers.localTimerIds,
                            null,
                            render,
                            system.screen.UID.generate()
                        )
                    }).then((output)=>{
                            return render.fade.out(document.getElementById("screenContainer")).then(()=>{this.destroy();return output;});
                    });
                case "game-element-question-task":
                    return screens.question_task.handler(
                        document.getElementById("screenContainer"),
                        document.getElementById("screenStyleContainer"),
                        controls,
                        {   
                            type:file.gamefile.content.content[file.savefile.content.gameData.selectedGame].contentElements[file.savefile.content.gameData.gameOrder[file.savefile.content.gameData.currentQuestion]].type,
                            number:(file.savefile.content.gameData.currentQuestion+1),
                            content:file.gamefile.content.content[file.savefile.content.gameData.selectedGame].contentElements[file.savefile.content.gameData.gameOrder[file.savefile.content.gameData.currentQuestion]].str,
                        },
                        system.screen.timers.localTimerIds,
                        {
                            duration:file.gamefile.content.content[file.savefile.content.gameData.selectedGame].settings.contentElementDuration,
                        },
                        render,
                        system.screen.UID.generate() 
                    ).then((output)=>{
                        return render.fade.out(document.getElementById("screenContainer")).then(()=>{this.destroy();return output;});
                    });
                    
                case "saveloadMenu":
                    return screens.saveloadMenu.handler(
                        document.getElementById("screenContainer"),
                        document.getElementById("screenStyleContainer"),
                        controls,
                        {
                            savefile: file.savefile.content,
                        },
                        system.screen.timers.localTimerIds,
                        null,
                        render,
                        system.screen.UID.generate()
                    ).then((output)=> {
                        this.destroy();
                        return output;
                    });
                case "settingsMenu":
                    return screens.settingsMenu.handler(
                        document.getElementById("screenContainer"),
                        document.getElementById("screenStyleContainer"),
                        controls,
                        {
                            gamefile: file.gamefile.content,
                            savefile: file.savefile.content,
                        },
                        system.screen.timers.localTimerIds,
                        null,
                        render,
                        system.screen.UID.generate()
                    ).then((output)=>{
                        return render.fade.out(document.getElementById("screenContainer")).then(()=>{this.destroy();return output;});
                    });
                case "fill":
                    return screens.fill.handler(
                        document.getElementById("screenContainer"),
                        document.getElementById("screenStyleContainer"),
                        controls,
                        {
                            staytime:10000,
                        },
                        system.screen.timers.localTimerIds,
                        null,
                        render,
                        system.screen.UID.generate()
                    ).then(()=>{
                        return render.fade.out(document.getElementById("screenContainer")).then(()=>{this.destroy(); return {"type":"fillEnd"};});
                    });
                case "editorConnect":
                    return screens.editorConnect.handler(
                        document.getElementById("screenContainer"),
                        document.getElementById("screenStyleContainer"),
                        controls,
                        null,
                        system.screen.timers.localTimerIds,
                        null,
                        render,
                        system.screen.UID.generate()
                    ).then((output)=> {
                        return render.fade.out(document.getElementById("screenContainer")).then(()=>{this.destroy(); return output;});
                    });
            }
        },

        UID: {//Unique Id generation method to make unique identifiers for HTML/CSS elements.
            lastUID: 0,
            generate: function() {

                if (DEFAULT_UID) {
                    return "UID";
                }

                let length=4;
                let char='abcdefghijklmnopqrstuvwxyz';

                if (this.lastUID>=Math.pow(char.length, length)) {
                    this.lastUID=0;
                }

                let str="";
                let tmpUID=this.lastUID;
                
                for (i = 0; i < length; i++) {
                    str += char.charAt(Math.floor(tmpUID%char.length));
                    tmpUID=Math.floor(tmpUID/char.length);
                }

                this.lastUID++;
                return str;
            }
        },

        timers: {//The timers method for storing timers and clearing all of them to avoid unwanted function triggering.
            localTimerIds: [],
            clear: function(){
                for(i=0;i<this.localTimerIds.length;i++){
                    clearInterval(this.localTimerIds[i]);
                }
                this.localTimerIds.length=0;
            }
        },

        body:{//The body clear function to clear the contents of the screenContainer.
            clear:function(){
                document.getElementById("screenContainer").innerHTML="";
            }
        },

        style: {//The style clear function to clear the contents of the screenStyleContainer.
            clear: function() {
                document.getElementById("screenStyleContainer").innerHTML="";
            } 
        },

        footer:{//The footer method for handling the footer.

            SCROLL_PIXELS_PER_SECOND: 60,
            SCROLL_WAITTIME: 2,
            SCROLL_FADETIME: 0.8,

            updateAnimation: function() {//The update animation function to update footer scroll lenght and duration based on contents.

                notify("Updating footer animation", "function");
                let wrapperDiv=document.getElementById("footer_scrollWrapper");
                let displayDiv=document.getElementById("footer");
                let styleTag=document.getElementById("footer-style");


                let scrollDistance = (-1 *wrapperDiv.clientWidth) +displayDiv.clientWidth;
                let time=0;
                let keyframes;
                let style;

                if (wrapperDiv.clientWidth>displayDiv.clientWidth) {
                    
                    time=Math.abs(scrollDistance)/this.SCROLL_PIXELS_PER_SECOND+(this.SCROLL_WAITTIME*2);
                    keyframes=
                    `@keyframes _footer_kf
                    {
                        0%{opacity: 0;transform:translateX(0);}
                        `+((this.SCROLL_FADETIME/time)*100)+`%{opacity: 1;}
                        `+((this.SCROLL_WAITTIME/time)*100)+`%{transform:translateX(0);}
                        `+(100-((this.SCROLL_WAITTIME/time)*100))+`%{transform:translateX(`+scrollDistance+`px);}
                        `+(100-((this.SCROLL_FADETIME/time)*100))+`%{opacity: 1; transform:translateX(`+scrollDistance+`px);}
                        100%{opacity: 0;transform:translateX(`+scrollDistance+`px);}
                    }`;
                    style='animation:_footer_kf '+time+'s cubic-bezier(0.13, 0, 0.87, 1) infinite';
                    styleTag.innerHTML=keyframes;
                    wrapperDiv.style.cssText=style;
                    notify("Footer scroll calculation: time:" + time + " dis:" + scrollDistance + " ratio:"+ Math.abs(scrollDistance)/this.SCROLL_PIXELS_PER_SECOND + " calc: "+ (this.SCROLL_FADETIME/time), "draw");
                }
                else {
                    styleTag.innerHTML="";
                }
                return time;
            },

            reload:function(){//The footer reload function to reload footer content after an element is removed from controls.key.link.
                this.clear();
                let i;                
                for(i=0;i<controls.key.link.up.length;i++){
                    system.screen.footer.UISVG(controls.key.link.up[i].description,"up",controls.key.link.up[i].duration);
                }
                for(i=0;i<controls.key.link.down.length;i++){
                    system.screen.footer.UISVG(controls.key.link.down[i].description,"down",controls.key.link.down[i].duration);
                }
                for(i=0;i<controls.key.link.left.length;i++){
                    system.screen.footer.UISVG(controls.key.link.left[i].description,"left",controls.key.link.left[i].duration);
                }
                for(i=0;i<controls.key.link.right.length;i++){
                    system.screen.footer.UISVG(controls.key.link.right[i].description,"right",controls.key.link.right[i].duration);
                }
                for(i=0;i<controls.key.link.confirm.length;i++){
                    system.screen.footer.UISVG(controls.key.link.confirm[i].description,"confirm",controls.key.link.confirm[i].duration);
                }
                system.screen.footer.updateAnimation();
            },
            clear: function(){//The footer clear function to clear the contents of the footer_scrollWrapper.
                this.hold=false;
                this.press=false;
                document.getElementById("footer_scrollWrapper").innerHTML="";
            },

            hold:false,
            press:false,

            UISVG: function(description,key,duration){//The user interface SVG function to add graphics to the footer representing the game platform buttons.
                let icon=`<svg class="UI-smallSVG buttonSymbol_glow_`+key+`" version="1.1" viewBox="0 0 12.7 12.7" preserveAspectRatio="xMinYMin meet" xmlns="http://www.w3.org/2000/svg">
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
                </svg>`;
                if(duration!==0){
                    if(this.hold){
                        document.getElementById("footerElementGroupHold").innerHTML+=`
                        <div class="footerElement">
                            <div class="footerElementIcon">`+icon+`</div>
                            <div class="footerElementText"><p>`+description+`</p></div>
                        </div>`;
                    }
                    else{
                        this.hold=true;
                        document.getElementById("footer_scrollWrapper").innerHTML+=`
                        <div id="footerElementGroupHold" class="footerElementGroup">
                            <div class="footerElementGroupTitle">
                                <p>`+file.languagefile.content["33"][file.savefile.content.settings.language]+`:</p>
                            </div>
                            <div class="footerElement">
                                <div class="footerElementIcon">`+icon+`</div>
                                <div class="footerElementText"><p>`+description+`</p></div>
                            </div>
                        </div>`;
                    }
                }
                else{
                    if(this.press){
                        document.getElementById("footerElementGroupPress").innerHTML+=`
                        <div class="footerElement">
                            <div class="footerElementIcon">`+icon+`</div>
                            <div class="footerElementText"><p>`+description+`</p></div>
                        </div>`;
                    }
                    else{
                        this.press=true;
                        document.getElementById("footer_scrollWrapper").innerHTML+=`
                        <div id="footerElementGroupPress" class="footerElementGroup">
                            <div class="footerElementGroupTitle">
                                <p>`+file.languagefile.content["34"][file.savefile.content.settings.language]+`:</p>
                            </div>
                            <div class="footerElement">
                                <div class="footerElementIcon">`+icon+`</div>
                                <div class="footerElementText"><p>`+description+`</p></div>
                            </div>
                        </div>`;
                    }
                }
            }

        },

        loadResource: function(URI) {//The load resource function to load CSS resources into a variable.
            return fs.promises.readFile(path.join(__dirname, URI), {encoding: 'UTF-8'});
        },

        loadCSStoDOM: function(URI) {//The load CSS to DOM function to load the CSS file into a HTML document object model.
            let link=document.getElementById("placeHolderDOMCSS");
            if(link!=undefined) {
                link.remove();
            }
            link=document.createElement('link');
            link.setAttribute("rel", "stylesheet");
            link.setAttribute("type", "text/css");
            link.setAttribute("href", URI);
            link.setAttribute("id", "placeHolderDOMCSS");
            document.getElementsByTagName('head')[0].appendChild(link)
        },

        removeDOMLoadedCSS() {//The remove DOM loaded CSS to remove the CSS from the DOM.
            let link=document.getElementById("placeHolderDOMCSS");
            if(link!=undefined) {
                link.remove();
            }
        },

        destroy: function() {//The destroy function to clear all necessary data after a screen ends.
            this.timers.clear();
            controls.key.clear.byKey("all");
            this.body.clear();
            this.style.clear();
            this.footer.clear();
            LED.reset();
        }
    }
}