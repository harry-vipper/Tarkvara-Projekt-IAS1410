//The Question/Task screen, to display game elements.
var screen_question_task={
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
        });

        //Make the footer semi transparent.
        render.footer.transparentize();
        
        //Load the screen CSS to DOM or the style element.
        system.screen.loadResource("/resources/css/element-question-task.css").then((css)=>{
            if(fileCSS) {
                system.screen.loadCSStoDOM("resources/css/element-question-task.css");
            }
            else{
                style.innerHTML=css;
            }

        }).then(()=>{
            //Make a copy of the HTMLbase, replace the placeholders and set it into the needed element.
            let str=this.HTMLbase;
            str=render.insertUID(str,UID);
            context.innerHTML=str;
            
            this.setContent(context,screenContent,UID);
        
            return render.fade.in(context);

        }).then(()=>{
            //Set the controls and start the countdown timer.
            controls.key.set("up",defaultHold,()=>{end({type: "gameSelectionMenu", value: null});},insertText(6),false,true);
            controls.key.set("left",defaultHold,()=>{end({type: "nextScreen", value: "last"});},insertText(7),false,true);
            controls.key.set("right",defaultHold,()=>{end({type: "nextScreen", value: "next"});},insertText(8),false,true);
            controls.key.set('down', defaultHold, ()=>{end({type:"editorConnect"});}, insertText("46"),false,true);
            
            return startTimer(screenSettings.duration,UID+"_timer",localTimerIds);

        }).then(()=>{
            //If the timer runs out end the screen.
            return end({type: "nextScreen", value: "next"})
        });
        return endpromise;
    },

    setContent:function(screenElement,screenContent,UID){//The set content function to correct the data in the element.
        let type;
        if(screenContent.type.toUpperCase()==="QUESTION"){
            type=insertText(1);
        }
        else if(screenContent.type.toUpperCase()==="TASK"){
            type=insertText(2);
        }

        screenElement.querySelector("#"+UID+"_listHeaderTitle").innerHTML="<p>"+type+"</p>";
        screenElement.querySelector("#"+UID+"_listHeaderNumber").innerHTML="<p>"+screenContent.number+"</p>";
        screenElement.querySelector("#"+UID+"_listDescriptionText").innerHTML="<p>"+strToHTML(screenContent.content)+"</p>";
    },
    //The stored HTML to be filled and displayed on the screen.
    HTMLbase:`
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
    `,
}