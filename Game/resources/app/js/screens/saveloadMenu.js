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
    system.screen.loadResource("/resources/css/saveloadMenu.css").then(
    (css)=>{style.innerHTML=css;

        /*if(fileCSS) {
            system.screen.loadCSStoDOM("placeHolderDOMCSS", "resources/css/saveloadMenu.css");
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
        let choice=0;
        controls.key.set("up",0,()=>{changeChoice();},lastCondition=screenContent.languagefile["9"][screenContent.savefile.settings.language]);
        controls.key.set("down",0,()=>{changeChoice();},lastCondition=screenContent.languagefile["10"][screenContent.savefile.settings.language]);
        controls.key.set("confirm",0,()=>{end({type: "choiceMade", value: choice});},lastCondition=screenContent.languagefile["17"][screenContent.savefile.settings.language]);

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
        if(screenContent.savefile.lastGame.condition===0){
            lastCondition=screenContent.languagefile["38"][screenContent.savefile.settings.language];
        }
        if(screenContent.savefile.lastGame.condition===1){
            lastCondition=screenContent.languagefile["39"][screenContent.savefile.settings.language];
        }
        if(screenContent.savefile.lastGame.condition===2){
            lastCondition=screenContent.languagefile["40"][screenContent.savefile.settings.language];
        }
        if(screenContent.savefile.lastGame.condition===3){
            lastCondition=screenContent.languagefile["41"][screenContent.savefile.settings.language];
        }
        screenElement.querySelector("#_"+UID+"_menulistDescriptionText").innerHTML=`<p>
            `+screenContent.languagefile["35"][screenContent.savefile.settings.language]+`
            <br><span class="UID_menulistDescriptionText_title" id="UID_lastGame_title">`+screenContent.savefile.lastGame.title.toUpperCase()+`</span><br><br>
            `+screenContent.languagefile["36"][screenContent.savefile.settings.language]+`: <span class="UID_menulistDescriptionText_time" id="UID_lastGame_time">`+screenContent.savefile.lastGame.time+` </span>
            <span class="UID_menulistDescriptionText_date" id="UID_lastGame_date">`+screenContent.savefile.lastGame.date+`</span><br><br>
            `+screenContent.languagefile["37"][screenContent.savefile.settings.language]+`
            <span class="UID_menulistDescriptionText_condition" id="UID_lastGame_condition">`+lastCondition+`</span>
        </p>`;
        screenElement.querySelector("#_0_"+UID+"_header_title").innerHTML="<p>"+screenContent.languagefile["42"][screenContent.savefile.settings.language]+"</p>";
        screenElement.querySelector("#_1_"+UID+"_header_title").innerHTML="<p>"+screenContent.languagefile["43"][screenContent.savefile.settings.language]+"</p>";
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
