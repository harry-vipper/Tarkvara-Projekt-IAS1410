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

    */
    screens.splash.handler(
        document.getElementById("screenContainer"),
        document.getElementById("screenStyleContainer"),
        controls,
        {
            icon:0,
            text:"MINGI TEXT",
            movetime:900,
            staytime:3000,
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