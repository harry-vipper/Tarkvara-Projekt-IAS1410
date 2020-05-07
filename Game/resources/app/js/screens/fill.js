//The fill screen to display a quick message to the user.
var screen_fill={
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
        //Hide the footer.
        render.footer.hide();

        //Load the screen CSS to DOM or the style element.
        return system.screen.loadResource("/resources/css/fill.css").then((css)=>{
            if(fileCSS) {
                system.screen.loadCSStoDOM("resources/css/fill.css");
            }
            else{
                style.innerHTML=css;
            }

            let str=`
            <div class="UID_screenwrapper">
                <div class="UID_textwrapper">
                    <p id="UID_p-1">### ### ### ### ### ### ### ### ### </p>
                    <p id="UID_p-2">$$$ $$$ $$$ $$$ $$$ $$$ $$$</p>
                    <p id="UID_p-3">### ### ### ### <span>###</span> ### ### ### ### </p>
                    <p id="UID_p-4">$$$ $$$ $$$ <span>$$$</span> $$$ $$$ $$$</p>
                    <p id="UID_p-5">### ### ### ### ### ### ### ### ### </p>
                    <p id="UID_p-6">$$$ $$$ $$$ $$$ $$$ $$$ $$$</p>
                    <p id="UID_p-7">### ### ### ### ### ### ### ### ### </p>
                    <p id="UID_p-8">$$$ $$$ $$$ $$$ $$$ $$$ $$$</p>
                </div>
            </div>
            `;

            //Replace UID in str with the correct UID.
            str=render.insertUID(str,UID);

            //Change the placeholders with the correct text.
            str=str.split("###").join(insertText(44));
            str=str.split("$$$").join(insertText(47));
            context.innerHTML=str;

            //Fade in the screen
            return render.fade.in(context);

        }).then(()=>{
            //Wait so the user can read the screen.
            return delay(screenContent.staytime,localTimerIds);

        }).then(()=>{
            //Fade out the screen.
            return render.fade.out(context);
        });
    }
}