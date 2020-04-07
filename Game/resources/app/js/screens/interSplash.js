var screen_splash;
screen_splash={
    type: "splash",
    handler: function(
        context,       
        style,        
        controls,       
        screenContent, 
        localTimerIds,  
        screenSettings, 
        render,
        UID,             
    )
    /*
    context,      <div> to draw into
    style,          <style> to send styles to
    controls,       controls object with methods to handle controls
    screenContent,  data passed to screen, in any format, possibly suitable to this screen only
    localTimerIds,  Array of active timers
    screenSettings, settings like colors
    UID   
    */
    {
    system.screen.loadResource("/resources/css/interSplash.css").then(
        (css)=>{
            if(fileCSS) {
                system.screen.loadCSStoDOM("placeHolderDOMCSS", "resources/css/interSplash.css");
            }
            else{
                style.innerHTML=css;
            }

            let icon=this.findIcon(screenContent.icon)

            let str=`
                <svg style="display: none" width="50.8mm" height="50.8mm" version="1.1" viewBox="0 0 50.8 50.8" preserveAspectRatio="xMinYMin meet" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <symbol id="i-trisign-exclamationmark">
                            <g transform="translate(0,-246.2)">
                                <path d="m25.525 250.97a2.6461 2.6461 0 0 0-0.26511 0 2.6461 2.6461 0 0 0-2.1502 1.3204l-20.164 34.924a2.6461 2.6461 0 0 0 2.2908 3.9688h40.328a2.6461 2.6461 0 0 0 2.2908-3.9688l-20.164-34.924a2.6461 2.6461 0 0 0-2.1663-1.3208zm-0.16536 8.4264a2.6461 2.6461 0 0 1 2.6851 2.6836v12.699a2.6461 2.6461 0 1 1-5.2906 0v-12.699a2.6461 2.6461 0 0 1 2.6055-2.6836zm0 21.168a2.6461 2.6461 0 0 1 2.6851 2.682v0.26564a2.6461 2.6461 0 1 1-5.2906 0v-0.26564a2.6461 2.6461 0 0 1 2.6055-2.682z" style="fill:var(--svg-fgcolor)"/>
                            </g>
                        </symbol>
                        <symbol id="i-trisign-bolt">
                            <g transform="translate(0,-246.2)">
                                <path d="m25.526 250.97a2.6461 2.6461 0 0 0-0.26562 0 2.6461 2.6461 0 0 0-2.1523 1.3204l-20.164 34.924a2.6461 2.6461 0 0 0 2.2913 3.9688h40.328a2.6461 2.6461 0 0 0 2.2913-3.9688l-20.162-34.924a2.6461 2.6461 0 0 0-2.1663-1.3208zm-2.2381 9.5503h4.669l-3.3342 9.3462 5.7743-1.1782-4.5392 11.546 4.1217-0.28112-7.7344 7.1603-2.743-6.4461 2.9538-0.20156 2.4112-8.0135-4.8178 0.92605z" style="fill:var(--svg-fgcolor)"/>
                            </g>
                        </symbol>
                        <symbol id="i-trisign-arrow">
                            <g transform="translate(0,-246.2)">
                                <path d="m25.524 250.97a2.6461 2.6461 0 0 0-0.26405 0 2.6461 2.6461 0 0 0-2.1508 1.3183l-20.164 34.927a2.6461 2.6461 0 0 0 2.2913 3.9688h40.328a2.6461 2.6461 0 0 0 2.2908-3.9688l-20.164-34.926a2.6461 2.6461 0 0 0-2.1673-1.3193zm-6.4849 16.284 13.17 13.172v-9.3224h3.3357v15.018h-15.015v-3.3378h9.3183l-13.168-13.17z" style="fill:var(--svg-fgcolor)"/>
                            </g>
                        </symbol>
                    </defs>
                </svg>


                <div id="UID_splashContainer">
                    <div id="UID_splashbox_left" class="UID_splashbox UID_splashbox_left UID_splashbox_left-start">
                        <div class="UID_splashbox_icon">`+icon+`</div>
                    </div>
                    <div id="UID_splashbox_right" class="UID_splashbox UID_splashbox_right UID_splashbox_right-start">
                        <div class="UID_splashbox_text">
                            <p>`+screenContent.text+`</p>
                        </div>
                    </div>
                </div>`;
            str=str.split("UID").join(UID);
            context.innerHTML=str;

            return delay(screenContent.movetime,localTimerIds);
        
    }).then(()=>{
                    
                document.getElementById(UID+"_splashbox_left").classList.add(UID+"_splashbox_left-end");
                document.getElementById(UID+"_splashbox_right").classList.add(UID+"_splashbox_right-end");

                document.getElementById(UID+"_splashbox_left").classList.remove(UID+"_splashbox_left-start");
                document.getElementById(UID+"_splashbox_right").classList.remove(UID+"_splashbox_right-start");
                render.fade.in(context);
                return delay(screenContent.movetime,localTimerIds);
                
    }).then(()=>{
        
            console.log("Jõudis keskele");
            return delay(screenContent.staytime,localTimerIds);

    }).then(()=>{

            console.log("Hakkab ära minema")
            document.getElementById(UID+"_splashbox_left").classList.remove(UID+"_splashbox_left-end");
            document.getElementById(UID+"_splashbox_right").classList.remove(UID+"_splashbox_right-end");

            document.getElementById(UID+"_splashbox_left").classList.add(UID+"_splashbox_left-start");
            document.getElementById(UID+"_splashbox_right").classList.add(UID+"_splashbox_right-start");
            return delay(screenContent.movetime,localTimerIds);                    

    }).then(()=>{
        
            console.log("LÄBI");

    }).catch((error)=>{
        console.log("Error caught"+error)
    })
    


    },
    findIcon: function(iconNr){
        if(iconNr===0){
            return `<svg class="i" width="508mm" height="508mm" version="1.1" viewBox="0 0 50.8 50.8" preserveAspectRatio="xMinYMin meet">
                <use xlink:href="#i-trisign-exclamationmark" />
            </svg>`;
        }
        else if(iconNr===1){
            return `<svg class="i" width="508mm" height="508mm" version="1.1" viewBox="0 0 50.8 50.8" preserveAspectRatio="xMinYMin meet">
                <use xlink:href="#i-trisign-bolt" />
            </svg>`;
        }
        else if(iconNr===2){
            return `<svg class="i" width="508mm" height="508mm" version="1.1" viewBox="0 0 50.8 50.8" preserveAspectRatio="xMinYMin meet">
                <use xlink:href="#i-trisign-arrow" />
            </svg>`;
        }
        else{
            console.log("Icon not found");
            return err;
        }
    }

}