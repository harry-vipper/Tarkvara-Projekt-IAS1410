//Save load menu screen to give to user a choice of continuing the last game if it was ended prematurely.
var screen_saveloadMenu={
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

        //Display the footer.
        render.footer.show();

        //Load the screen CSS to DOM or the style element.
        system.screen.loadResource("/resources/css/saveloadMenu.css").then((css)=>{
            if(fileCSS) {
                system.screen.loadCSStoDOM("resources/css/saveloadMenu.css");
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

            //Fade in the screen.
            return render.fade.in(context);

        }).then(()=>{
            //Bind the controls.
            let choice=0;
            controls.key.set("up",0,()=>{changeChoice();},lastCondition=insertText("9"),false,true);
            controls.key.set("down",0,()=>{changeChoice();},lastCondition=insertText("10"),false,true);
            controls.key.set("confirm",0,()=>{end({type: "choiceMade", value: choice});},lastCondition=insertText("17"),false,true);
            

            function changeChoice(){//The change choice function to handle the user switching between options.
                document.getElementById("_"+choice+"_"+UID+"_header_title").classList.remove(UID+"_menulistHeaderActive");

                if(choice===0)choice=1;
                else if(choice===1)choice=0;
                
                document.getElementById("_"+choice+"_"+UID+"_header_title").classList.add(UID+"_menulistHeaderActive");
                return choice;            
            }
            
        });
        return endpromise;
    },

    setContent:function(screenElement,screenContent,UID){//The set content function to correct the data in the element.
        let lastCondition=undefined;

        lastCondition=conditionToText(screenContent.savefile.lastGame.condition)
        
        screenElement.querySelector("#_"+UID+"_menulistDescriptionText").innerHTML=`<p>
            `+insertText("35")+`
            <br><span class="UID_menulistDescriptionText_title" id="UID_lastGame_title">`+screenContent.savefile.lastGame.title.toUpperCase()+`</span><br><br>
            `+insertText("36")+`: <span class="UID_menulistDescriptionText_time" id="UID_lastGame_time">`+screenContent.savefile.lastGame.time+` </span>
            <span class="UID_menulistDescriptionText_date" id="UID_lastGame_date">`+screenContent.savefile.lastGame.date+`</span><br><br>
            `+insertText("37")+`
            <span class="UID_menulistDescriptionText_condition" id="UID_lastGame_condition">`+lastCondition+`</span>
        </p>`;

        screenElement.querySelector("#_0_"+UID+"_header_title").innerHTML="<p>"+insertText("42")+"</p>";
        screenElement.querySelector("#_1_"+UID+"_header_title").innerHTML="<p>"+insertText("43")+"</p>";

    },
    //The stored HTML to be filled and displayed on the screen.
    HTMLbase:`
    <div id="UID_menulistContainer">
    <div class="UID_menulistItem">
        <div class="UID_menulistHeader">
            <div class="UID_menulistHeaderTitle UID_menulistHeaderActive" id="_0_UID_header_title">
                <p>LAST</p>
            </div>
        </div>
        <div class="UID_menulistDescriptionBackground">
            <div class="UID_menulistDescription">
                <div class="UID_menulistDescriptionText" id="_UID_menulistDescriptionText">
                </div>
            </div>
        </div>
    </div>
    <div class="UID_menulistItem">
        <div class="UID_menulistHeader">
            <div class="UID_menulistHeaderTitle" id="_1_UID_header_title">
                <p>NEW</p>
            </div>
        </div>
    </div>
</div>
    `,
}
