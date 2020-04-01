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
    */

    screens.gameSelectionMenu.handler(
        document.getElementById("screenContainer"),
        document.getElementById("screenStyleContainer"),
        controls,
        {
            gamefile: file.gamefile,
            savefile: file.savefile
        },
        system.screen.timers.localTimerIds,
        system.settings,
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