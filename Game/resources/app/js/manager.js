function startup() {
    
    //Load savefile and game JSON

    file.savefile.load();
    file.gamefile.load();
    file.languagefile.load();

    color.setColor();

    //Always
    
    var lastScreenPromise=new Promise((resolve)=>{resolve()});
    
    if(file.savefile.content.gameData.state===2){//if there's an old game
    lastScreenPromise=lastScreenPromise.then(()=>{
        return system.screen.displayScreen("saveloadMenu", undefined);
    });
    }
    else{
    lastScreenPromise=lastScreenPromise.then(()=>{
        return system.screen.displayScreen("gameSelectionMenu", undefined);
    });
    }
    
    lastScreenPromise=lastScreenPromise.then((output)=>{

        return loop(output);
    });
    
    //Järgmised tegevused
    function typeFinder(){
        if(file.savefile.content.gameData.currentQuestion>=file.savefile.content.gameData.gameOrder.length){
            return system.screen.displayScreen("gameEnd", undefined);
        }
        else if(0>file.savefile.content.gameData.gameOrder[file.savefile.content.gameData.currentQuestion]){
            if(file.savefile.content.gameData.gameOrder[file.savefile.content.gameData.currentQuestion]===-1)return system.screen.displayScreen("game-element-truth-or-dare",undefined);
            else if(file.savefile.content.gameData.gameOrder[file.savefile.content.gameData.currentQuestion]===-2)return system.screen.displayScreen("game-element-reaction-test",undefined);
       
        }
        else{
            return system.screen.displayScreen("game-element-question-task", undefined);
        }
    }
    
    function loop(input){
        lastScreenPromise=lastScreenPromise.then(()=>{
            if(input.type==="choiceMade"){
                if(input.value===1){
                    file.savefile.content.gameData.state=1;
                    return system.screen.displayScreen("gameSelectionMenu", undefined);
                }
                if(input.value===0){
                    file.savefile.content.gameData.currentQuestion++;
                    
                    return typeFinder();
                }
            }


            else if(input.type==="startGame") {
                file.savefile.content.gameData.state=2;
                file.savefile.content.gameData.currentQuestion=0;
                file.savefile.content.gameData.gameOrder=gameOrderer();
                file.savefile.content.lastGame.title=file.gamefile.content.content[file.savefile.content.gameData.selectedGame].properties.title;
                file.savefile.content.lastGame.condition=file.gamefile.content.content[file.savefile.content.gameData.selectedGame].properties.condition;

                return typeFinder();
            }
            else if(input.type==="nextScreen"){
                if(input.value==="next"){
                    file.savefile.content.gameData.currentQuestion++;

                    return typeFinder();
                }
                else if(input.value==="last"){
                    file.savefile.content.gameData.currentQuestion--;
                    if(file.savefile.content.gameData.currentQuestion<0){file.savefile.content.gameData.currentQuestion=0;}

                    return typeFinder();
                }
            }
            else if(input.type==="gameSelectionMenu"){
                file.savefile.content.gameData.state=1;
                return system.screen.displayScreen("gameSelectionMenu", undefined);
            }
            else if(input.type==="settingsMenu"){
                file.savefile.content.gameData.state=3;
                return system.screen.displayScreen("settingsMenu", undefined);
            }
            else{
                debugger;
            }
        }).then((output)=>{
            file.savefile.save();
            loop(output);
        });
    }
}



function delay(time, timerArray) {
    return new Promise((resolve)=>{
        timerArray.push(setTimeout(resolve, time));
    });
}
function gameOrderer(){
    let nrOfContentElements=file.gamefile.content.content[file.savefile.content.gameData.selectedGame].contentElements.length;  
    let nrOfType=nrOfContentElements;
    for(let i=0;i<nrOfContentElements;i++){
        if(file.gamefile.content.content[file.savefile.content.gameData.selectedGame].contentElements[i].repeatable){
            nrOfType=nrOfType + file.gamefile.content.content[file.savefile.content.gameData.selectedGame].contentElements[i].likelyRepeats-1;
            }
    }
    var gameOrder=new Array(nrOfType);
    let currentTypeNr=0;
    for(let i=0,j=0 ;i<nrOfType;i++){
        if(file.gamefile.content.content[file.savefile.content.gameData.selectedGame].contentElements[currentTypeNr].repeatable){
            for(j=0;j<file.gamefile.content.content[file.savefile.content.gameData.selectedGame].contentElements[currentTypeNr].likelyRepeats;j++){
                gameOrder[i+j]=currentTypeNr
            }
            i=i+j-1;
        }
        else if(!(file.gamefile.content.content[file.savefile.content.gameData.selectedGame].contentElements[currentTypeNr].repeatable)){
            gameOrder[i]=currentTypeNr;
        }
        currentTypeNr++;
    }
    let count=gameOrder.length/file.savefile.content.settings.mgFrequency;
    for(let i=0,random;i<count;i++){
        if(file.gamefile.content.content[file.savefile.content.gameData.selectedGame].settings.random){
            if(file.savefile.content.settings.toggle[0]===1 && file.gamefile.content.content[file.savefile.content.gameData.selectedGame].settings.minigames.mg1){
                gameOrder.push(-1);
            }
            if(file.savefile.content.settings.toggle[1]===1 && file.gamefile.content.content[file.savefile.content.gameData.selectedGame].settings.minigames.mg2){
                gameOrder.push(-2);
            }
        }
        else{
            random=Math.floor((Math.random() * (gameOrder.length-2)) + 1);
            if(file.savefile.content.settings.toggle[0]===1 && file.gamefile.content.content[file.savefile.content.gameData.selectedGame].settings.minigames.mg1){
                gameOrder.splice(random,0,-1);
            }
            random=Math.floor((Math.random() * (gameOrder.length-2)) + 1);
            if(file.savefile.content.settings.toggle[1]===1 && file.gamefile.content.content[file.savefile.content.gameData.selectedGame].settings.minigames.mg2){
                gameOrder.splice(random,0,-2);
            }
        }
    }
    if(file.gamefile.content.content[file.savefile.content.gameData.selectedGame].settings.random){
        gameOrder.splice(0,1);
        gameOrder.pop();
        shuffle(gameOrder);
        gameOrder.splice(0,0,0);
        gameOrder.push(file.gamefile.content.content[file.savefile.content.gameData.selectedGame].contentElements.length-1)
    }
    notify(gameOrder,"update");

    return gameOrder;
}

function shuffle(array) {
    var current=array.length, temp, random;
    while (0 !== current) {                   
        random = Math.floor(Math.random() * current);
        current --;                   
        temp = array[current];
        array[current] = array[random];
        array[random] = temp;
    }
    return array;
}
function startTimer(duration,timerLocationId,localTimerIds) {

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

function insertText(index){
    return file.languagefile.content[index][file.savefile.content.settings.language];
}