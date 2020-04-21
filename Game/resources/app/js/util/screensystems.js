/*function clearTimers(localTimerIds){
    for(i=0;i<localTimerIds.length;i++){
        clearInterval(localTimerIds[i])
    }
    localTimerIds.length=0;
}

function clearStyle(){
    document.getElementById("styleId").innerHTML="";
}

function clearFooter(){
    document.getElementById("footerId").innerHTML="";
}

function clearBody(){
    document.getElementById("bodyId").innerHTML="";
}
function exitScreen(whatNext) {
    clearTimers(localTimerIds);
    controls.key.clear.byKey("all");
    clearFooter();
    clearStyle()
    clearBody();
    logicController(whatNext);
}*/
var system;
system={
    screen: {
        displayScreen: function(type, data) {
            switch(type) {
                case "game-element-reaction-test":
                    return screens.splash.handler(
                        document.getElementById("screenContainer"),
                        document.getElementById("screenStyleContainer"),
                        controls,
                        {
                            icon:"bolt",
                            text:"REACTION TEST",
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
                            null,
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
                            text:"TRUTH OR DARE",
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
                            null,
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
                            gamefile: file.gamefile,
                            savefile: file.savefile
                        },
                        system.screen.timers.localTimerIds,
                        {
                            duration:30,
                        },
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
                            text:"Mäng läbi",
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
                        return screens.gameSelectionMenu.handler(
                            document.getElementById("screenContainer"),
                            document.getElementById("screenStyleContainer"),
                            controls,
                            {
                                gamefile: file.gamefile,
                                savefile: file.savefile
                            },
                            system.screen.timers.localTimerIds,
                            null,
                            render,
                            system.screen.UID.generate()
                        )
                    }).then((output)=>{
                            return render.fade.out(document.getElementById("screenContainer")).then(()=>{this.destroy();return output;});
                    });
                case "game-element-question":
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
                        //system.settings
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
                            time:"12:32",
                            date:"09/04/19",
                            condition:"konditsioon",
                            title:"Viimase mängu nimi",
                        }
                        ,
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
                            gamefile: file.gamefile,
                            savefile: file.savefile
                        },
                        system.screen.timers.localTimerIds,
                        null,
                        render,
                        system.screen.UID.generate()
                    ).then((output)=>{
                        return render.fade.out(document.getElementById("screenContainer")).then(()=>{this.destroy();return output;});
                    });
            }
        },
        UID: {
            lastUID: 0, //0 to zzzz (басс26)
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
        timers: {
            localTimerIds: [],
            clear: function(){
                for(i=0;i<this.localTimerIds.length;i++){
                    clearInterval(this.localTimerIds[i]);
                }
                this.localTimerIds.length=0;
            }
        },
        body:{
            clear:function(){
                document.getElementById("screenContainer").innerHTML="";
            }
        },
        style: {
            clear: function() {
                document.getElementById("screenStyleContainer").innerHTML="";
            }
        },
        footer:{
            SCROLL_PIXELS_PER_SECOND: 60,
            SCROLL_WAITTIME: 2,
            SCROLL_FADETIME: 0.8,
            updateAnimation: function() {
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
                    notify("time:"+ time, "draw");
                    notify("dis:"+ scrollDistance, "draw");
                    notify("abs dis:"+ Math.abs(scrollDistance), "draw");
                    notify("ratio:"+ Math.abs(scrollDistance)/this.SCROLL_PIXELS_PER_SECOND, "draw");
                    notify("calc: "+ (this.SCROLL_FADETIME/time), "draw");
                }
                else {
                    styleTag.innerHTML="";
                }
                return time;
            },
            clear: function(){
                this.hold=false;
                this.press=false;
                document.getElementById("footer_scrollWrapper").innerHTML="";
            },
            hold:false,
            press:false,
            UISVG: function(description,key,duration){
                console.log(description,key,duration);
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
                                <p>HOIA:</p>
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
                                <p>VAJUTA:</p>
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
        loadResource: function(URI) {
            return fs.promises.readFile(path.join(__dirname, URI), {encoding: 'UTF-8'});
        },
        loadCSStoDOM: function(id, URI) {
            let link=document.createElement('link');
            link.setAttribute("rel", "stylesheet");
            link.setAttribute("type", "text/css");
            link.setAttribute("href", URI);
            link.setAttribute("id", id);
            document.getElementsByTagName('head')[0].appendChild(link)
        },
        destroy: function() {
            console.log("DESTRUCTION!!!")
            this.timers.clear();
            controls.key.clear.byKey("all");
            this.body.clear();
            this.style.clear();
            this.footer.clear();
        }
        /*launch: function() {

        }*/
    },
    settings: {} 
}