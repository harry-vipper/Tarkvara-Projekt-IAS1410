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

    /*    
    screenSettings["colors"].bgcolor=new screenSettings["colors"].Color100(settings.color.background[0],settings.color.background[1],settings.color.background[2]);
    screenSettings["colors"].fgcolor=new screenSettings["colors"].Color100(settings.color.foreground[0],settings.color.foreground[1],settings.color.foreground[2]);
    let palette=screenSettings["colors"].palette;
    palette=screenSettings["colors"].getPalette(screenSettings["colors"].fgcolor, screenSettings["colors"].bgcolor);
    */
    var end;
    var endpromise=new Promise((resolve) =>{
           end=resolve;
       }
    );
    system.screen.loadResource("/resources/css/saveloadMenu.css").then(
    (css)=>{

        if(fileCSS) {
            system.screen.loadCSStoDOM("placeHolderDOMCSS", "resources/css/saveloadMenu.css");
        }
        else{
            style.innerHTML=css;
        }}
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
        controls.key.set("up",0,()=>{changeChoice();},"Move Up");
        controls.key.set("down",0,()=>{changeChoice();},"Move Down");
        controls.key.set("confirm",0,()=>{end({type: "choiceMade", value: choice});},"Confirm Choice");

        function changeChoice(){
            document.getElementById(choice+"_"+UID+"_header_title").classList.remove(UID+"_menulistHeaderActive");

            if(choice===0)choice=1;
            else if(choice===1)choice=0;
            
            document.getElementById(choice+"_"+UID+"_header_title").classList.add(UID+"_menulistHeaderActive");
            return choice;            
        }
        
    });
    return endpromise;
    },
    setContent:function(screenElement,screenContent,UID){
        //Paneb õige sisu
        screenElement.querySelector("#"+UID+"_lastGame_title").innerHTML=screenContent.title.toUpperCase();
        screenElement.querySelector("#"+UID+"_lastGame_time").innerHTML=screenContent.time;
        screenElement.querySelector("#"+UID+"_lastGame_date").innerHTML=screenContent.date;
        screenElement.querySelector("#"+UID+"_lastGame_condition").innerHTML=screenContent.condition;
    },
    HTMLbase:`
    <div id="UID_menulistContainer">
    <div class="UID_menulistItem">
        <div class="UID_menulistHeader">
            <div class="UID_menulistHeaderTitle UID_menulistHeaderActive" id="0_UID_header_title">
                <p>JÄTKA VIIMAST MÄNGU</p>
            </div>
        </div>
        <div class="UID_menulistDescriptionBackground">
            <div class="UID_menulistDescription">
                <div class="UID_menulistDescriptionText">
                    <p>
                        Viimati mängisid mängu
                        <br><span class="UID_menulistDescriptionText_title" id="UID_lastGame_title">Bruh</span><br><br>
                        Kell <span class="UID_menulistDescriptionText_time" id="UID_lastGame_time">13:37</span> <span class="UID_menulistDescriptionText_date" id="UID_lastGame_date">30. veebruaril</span><br><br>
                        Sa olid tõenäoliselt
                        <span class="UID_menulistDescriptionText_condition" id="UID_lastGame_condition">lappes</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
    <div class="UID_menulistItem">
        <div class="UID_menulistHeader">
            <div class="UID_menulistHeaderTitle" id="1_UID_header_title">
                <p>ALUSTA UUT</p>
            </div>
        </div>
    </div>
</div>
    `,
}
