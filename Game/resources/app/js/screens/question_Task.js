//Question/Task screem
var screen_question_task;
screen_question_task={
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
    var end;
    var endpromise=new Promise((resolve) =>{
           end=resolve;
       }
    );
    system.screen.loadResource("/resources/css/element-question-task.css").then(
    (css)=>{style.innerHTML=css;

        /*if(fileCSS) {
            system.screen.loadCSStoDOM("placeHolderDOMCSS", "resources/css/element-question-task.css");
        }
        else{
            style.innerHTML=css;
        }*/
    }
    ).then(()=>{

        let str=this.HTMLbase;
        str=str.split("UID").join(UID);

        let screenElement=document.createElement("div");
        screenElement.setAttribute("id",UID+"wrapper");
        screenElement.innerHTML=str;

        this.setContent(screenElement,screenContent,UID);
        
        context.appendChild(screenElement);
        return render.fade.in(context);
    }
    ).then(()=>{

        controls.key.set("up",1000,()=>{end({type: "gameSelectionMenu", value: null});},screenContent.languagefile[6][screenContent.savefile.settings.language]);
        controls.key.set("left",1000,()=>{end({type: "nextScreen", value: "last"});},screenContent.languagefile[7][screenContent.savefile.settings.language]);
        controls.key.set("right",1000,()=>{end({type: "nextScreen", value: "next"});},screenContent.languagefile[8][screenContent.savefile.settings.language]);
        return startTimer(screenSettings.duration,UID+"_timer",localTimerIds);
    }
    ).then(()=>{
        return end({type: "nextScreen", value: "next"})
    });
    return endpromise;
    },
    setContent:function(screenElement,screenContent,UID){
        //Paneb õige sisu
        let type;
        if(screenContent.type.toUpperCase()==="QUESTION"){
            type=screenContent.languagefile[1][screenContent.savefile.settings.language];
        }
        else if(screenContent.type.toUpperCase()==="TASK"){
            type=screenContent.languagefile[2][screenContent.savefile.settings.language];
        }
        screenElement.querySelector("#"+UID+"_listHeaderTitle").innerHTML="<p>"+type+"</p>";
        screenElement.querySelector("#"+UID+"_listHeaderNumber").innerHTML="<p>"+screenContent.number+"</p>";
        screenElement.querySelector("#"+UID+"_listDescriptionText").innerHTML="<p>"+screenContent.content+"</p>";
    },
    HTMLbase:`
    <div id="screenContainer">
        <div id="UID_elementContainer">
            <div class="UID_listItem">

                <div class="UID_listHeader">
                    <div class="UID_listHeaderNumber" id="UID_listHeaderNumber">
                        <p>2</p>
                    </div>
                    <div class="UID_listHeaderTitle" id="UID_listHeaderTitle">
                        <p>TYPE</p>
                    </div>
                </div>
                
                <div class="UID_listDescriptionBackground">
                    <div class="UID_listDescription">
                        <div class="UID_listDescriptionText" id="UID_listDescriptionText">
                            <p>CONTENT</p>
                        </div>
                        <div class="UID_listDescriptionTimer">
                            <p><span id="UID_timer">0:00</span></p>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
    `,
}