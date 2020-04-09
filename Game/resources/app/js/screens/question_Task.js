//Question/Task screem
var screen_question_Task;
screen_question_Task={
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
    
   system.screen.loadResource("/resources/css/element-question-task.css").then(
    (css)=>{

        if(fileCSS) {
            system.screen.loadCSStoDOM("placeHolderDOMCSS", "resources/css/element-question-task.css");
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

        controls.key.set("up",1000,()=>{exitScreen("gameMenu");},"Exit Game");
        controls.key.set("left",0,()=>{exitScreen("previousType");},"Previous Question");//Mis juhtub promisega kui need tulevad
        controls.key.set("right",0,()=>{exitScreen("nextType");},"Next Question");
        return startTimer(screenSettings.duration,UID+"_timer",localTimerIds);
    }
    /*var promiseResolve, promiseReject;

    var promise = new Promise(function(resolve, reject){
    promiseResolve = resolve;
    promiseReject = reject;
    });

    promiseResolve();
    */
    ).then(()=>{
        console.log("Timer done!!");
        //next screen
        //return...
    }
    ).catch(()=>{
        console.log("Error tuli")
        //mingi handlemine
    });

    },
    setContent:function(screenElement,screenContent,UID){
        //Paneb õige sisu
        screenElement.querySelector("#"+UID+"_listHeaderTitle").innerHTML="<p>"+screenContent.type.toUpperCase()+"</p>";
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
function startTimer(duration,timerLocationId,localTimerIds) {//Vaja promise peale üle teha

    return new Promise((resolve)=>{
        let timer = duration;
        let minutes=1;
        let seconds=1;
        let i=0;
        let length=localTimerIds.length;
    
        localTimerIds[length]=setInterval(()=>{
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);
            
            seconds = seconds < 10 ? "0" + seconds : seconds;
            document.getElementById(timerLocationId).innerHTML = minutes + ":" + seconds;
            if(timer===0){
                notify("TIMER 0", "function");
                clearInterval(localTimerIds[length]);//localTimerIdsse jääb alles!!! vist pole halb---clearInterval(null) errorit ei anna
                localTimerIds[length]=null;
                resolve();}
            if(i===100){i=0;timer--;}
            i++;
            }, 10);
        });
}