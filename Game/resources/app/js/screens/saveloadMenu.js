//Save/load menu screem
var screen_saveloadMenu;
screen_saveloadMenu={
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
    {
    var end;
    var endpromise=new Promise((resolve) =>{
           end=resolve;
       }
    );
    render.footer.show();
    system.screen.loadResource("/resources/css/saveloadMenu.css").then(
    (css)=>{

        if(fileCSS) {
            system.screen.loadCSStoDOM("resources/css/saveloadMenu.css");
        }
        else{
            style.innerHTML=css;
        }
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
        let choice=0;
        controls.key.set("up",0,()=>{changeChoice();},lastCondition=insertText("9"),false,true);
        controls.key.set("down",0,()=>{changeChoice();},lastCondition=insertText("10"),false,true);
        controls.key.set("confirm",0,()=>{end({type: "choiceMade", value: choice});},lastCondition=insertText("17"),false,true);
        
        function changeChoice(){
            document.getElementById("_"+choice+"_"+UID+"_header_title").classList.remove(UID+"_menulistHeaderActive");

            if(choice===0)choice=1;
            else if(choice===1)choice=0;
            
            document.getElementById("_"+choice+"_"+UID+"_header_title").classList.add(UID+"_menulistHeaderActive");
            return choice;            
        }
        
    });
    return endpromise;
    },
    setContent:function(screenElement,screenContent,UID){
        //Paneb õige sisu
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
