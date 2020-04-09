function startup() {
    //Load savefile and game JSON
    file.savefile.load();
    file.gamefile.load();

    //start main menu:
    /*
    context,      <div> to draw into
    style,          <style> to send styles to
    controls,       controls object with methods to handle controls
    screenContent,  data passed to screen, in any format, possibly suitable to this screen only
    localTimerIds,  Array of active timers
    screenSettings, settings like colors
    UID   
    {
            gamefile: file.gamefile,
            savefile: file.savefile
    }
{
            icon:"arrow",
            text:"MINGI TEXT",
            movetime:900,
            staytime:3000,
        }
    */
    screens.question_Task.handler(
        document.getElementById("screenContainer"),
        document.getElementById("screenStyleContainer"),
        controls,
        {
            type:"question",
            number:3,
            content:"Küsimuse sisu midgi midagi midagi",
        }
        ,
        system.screen.timers.localTimerIds,
        //system.settings
        {
            duration:30,
        },
        render,
        /*system.screen.UID.generate()*/"UID"
    )
    
    //footeri värvid
    /*if(file.savefile.content.gameData.state===2){
        nextScreen("save");
    }
    else exitScreen("gameMenu");*/
}
function delay(time, timerArray) {
    return new Promise((resolve)=>{
        timerArray.push(setTimeout(resolve, time));
    });
}