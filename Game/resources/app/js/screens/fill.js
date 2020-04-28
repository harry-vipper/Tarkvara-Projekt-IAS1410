//Fill screen
var screen_fill;
screen_fill={
    type: "editorConnect",
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
        return system.screen.loadResource("/resources/css/fill.css").then(
            (css)=>{
                if(fileCSS) {
                    system.screen.loadCSStoDOM("resources/css/fill.css");
                }
                else{
                    style.innerHTML=css;
                }
    
                let str=` <div class="UID_screenwrapper">
                <div class="UID_textwrapper">
                    <p id="UID_p-1">TÄIDA TÄIDA TÄIDA TÄIDA TÄIDA TÄIDA TÄIDA TÄIDA </p>
                    <p id="UID_p-2">KLAASID KLAASID KLAASID KLAASID KLAASID KLAASID</p>
                    <p id="UID_p-3">TÄIDA TÄIDA TÄIDA <span>TÄIDA</span> TÄIDA TÄIDA TÄIDA TÄIDA </p>
                    <p id="UID_p-4">KLAASID KLAASID <span>KLAASID</span> KLAASID KLAASID KLAASID</p>
                    <p id="UID_p-5">TÄIDA TÄIDA TÄIDA TÄIDA TÄIDA TÄIDA TÄIDA TÄIDA </p>
                    <p id="UID_p-6">KLAASID KLAASID KLAASID KLAASID KLAASID KLAASID</p>
                    <p id="UID_p-7">TÄIDA TÄIDA TÄIDA TÄIDA TÄIDA TÄIDA TÄIDA TÄIDA </p>
                    <p id="UID_p-8">KLAASID KLAASID KLAASID KLAASID KLAASID KLAASID</p>
                </div></div>`;
    
                str=str.split("UID").join(UID);//Replace UID in str with correct UID
                str=str.split("TÄIDA").join(insertText(44));
                str=str.split("KLAASID").join(insertText(47));
                context.innerHTML=str;
                return render.fade.in(context);
        }).then(()=>{
            
            return delay(screenContent.staytime,localTimerIds);//Wait so user can read and fill
    
        }).then(()=>{
            return render.fade.out(context);
        });
        }
}