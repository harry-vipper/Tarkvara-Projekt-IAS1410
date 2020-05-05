const SYSTEM="WIN";
function startup() {
    
    //Load savefile and game JSON
    file.savefile.load();
    file.gamefile.load();
    file.languagefile.load();    
    
    color.setColor();
    LED.reset();
    
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
    
    var fillCounter=0;
    function typeFinder(){//Find game element type and return correct screen
        fillCounter++;
        if(fillCounter===Math.floor(10/file.gamefile.content.content[file.savefile.content.gameData.selectedGame].properties.condition)){
            fillCounter=0;
            return system.screen.displayScreen("fill", undefined);
        }

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
    //Next screens
    function loop(input){
        lastScreenPromise=lastScreenPromise.then(()=>{
            if(input.type==="choiceMade"){
                if(input.value===1){
                    file.savefile.content.gameData.state=1;
                    file.gamefile.load();
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
                fillCounter=0;
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
                file.gamefile.load();
                return system.screen.displayScreen("gameSelectionMenu", undefined);
            }
            else if(input.type==="settingsMenu"){
                file.savefile.content.gameData.state=3;
                return system.screen.displayScreen("settingsMenu", undefined);
            }
            else if(input.type==="fillEnd"){
                return typeFinder();
            }
            else if(input.type==="editorConnect"){
                return system.screen.displayScreen("editorConnect", undefined);
            }
            else if(input.type==="return"){
                if(file.savefile.content.gameData.state===1){
                    file.gamefile.load();
                    return system.screen.displayScreen("gameSelectionMenu", undefined);
                }
                else if(file.savefile.content.gameData.state===2) return typeFinder();
                else if(file.savefile.content.gameData.state===3) return system.screen.displayScreen("settingsMenu", undefined);
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
    
    gameOrder.splice(0,1);
    gameOrder.pop();
    if(file.gamefile.content.content[file.savefile.content.gameData.selectedGame].settings.random)shuffle(gameOrder);

    let mgF=file.savefile.content.settings.mgFrequency;
    let count=gameOrder.length/mgF;

    for(let i=1;i<=count;i++){
        if(file.savefile.content.settings.toggle[0]===1 && file.gamefile.content.content[file.savefile.content.gameData.selectedGame].settings.minigames.mg1){
            gameOrder.splice(Math.floor(mgF*i-(Math.random()*mgF/2)),0,-1);
        }
        if(file.savefile.content.settings.toggle[1]===1 && file.gamefile.content.content[file.savefile.content.gameData.selectedGame].settings.minigames.mg2){
            gameOrder.splice(Math.floor(mgF*i+(Math.random()*mgF/2)),0,-2);
        }
    }

    gameOrder.splice(0,0,0);
    gameOrder.push(file.gamefile.content.content[file.savefile.content.gameData.selectedGame].contentElements.length-1)
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

const port=setPort();

function setPort(){
    if(SYSTEM!="PI"){
        return null;
    }
    const SerialPort = require('serialport');
    const port = new SerialPort("/dev/ttyAMA0",{baudRate:9600});
    const Readline = require('@serialport/parser-readline');
    const parser = new Readline();
    port.pipe(parser);

    port.on('open', function() {
        var upCounter=true,downCounter=true,leftCounter=true,rightCounter=true,confirmCounter=true;
        parser.on('data', function (data) {
            if(data==='rotate0'){
                document.getElementById('screenContainer').style.transform = 'rotate(0deg)';
            }
            else if(data==='rotate90'){
                document.getElementById('screenContainer').style.transform = 'rotate(90deg)';
            }
            else if(data==='rotate180'){
                document.getElementById('screenContainer').style.transform = 'rotate(180deg)';
            }
            else if(data==='rotate270'){
                document.getElementById('screenContainer').style.transform = 'rotate(270deg)';
            }
            else if(data==='up'){
                if(upCounter){
                    upCounter=false;
                    let down = new KeyboardEvent("keydown", {key:"w"});
                    document.dispatchEvent(down);
                }
                else if(!upCounter){
                    upCounter=true;
                    let up = new KeyboardEvent("keyup", {key:"w"});
                    document.dispatchEvent(up);
                }
            }
            else if(data==='down'){
                if(downCounter){
                    downCounter=false;
                    let down = new KeyboardEvent("keydown", {key:"s"});
                    document.dispatchEvent(down);
                }
                else if(!downCounter){
                    downCounter=true;
                    let up = new KeyboardEvent("keyup", {key:"s"});
                    document.dispatchEvent(up);
                }
            }
            else if(data==='left'){
                if(leftCounter){
                    leftCounter=false;
                    let down = new KeyboardEvent("keydown", {key:"a"});
                    document.dispatchEvent(down);
                }
                else if(!leftCounter){
                    leftCounter=true;
                    let up = new KeyboardEvent("keyup", {key:"a"});
                    document.dispatchEvent(up);
                }
            }
            else if(data==='right'){
                if(rightCounter){
                    rightCounter=false;
                    let down = new KeyboardEvent("keydown", {key:"d"});
                    document.dispatchEvent(down);
                }
                else if(!rightCounter){
                    rightCounter=true;
                    let up = new KeyboardEvent("keyup", {key:"d"});
                    document.dispatchEvent(up);
                }
            }
            else if(data==='confirm'){
                if(confirmCounter){
                    confirmCounter=false;
                    let down = new KeyboardEvent("keydown", {key:"x"});
                    document.dispatchEvent(down);
                }
                else if(!confirmCounter){
                    confirmCounter=true;
                    let up = new KeyboardEvent("keyup", {key:"x"});
                    document.dispatchEvent(up);
                }
            }
            console.log('Data from Arduino: ' + data);
       });
    }); 
    return port;
}

var LED={
    set:function(key,state){
        let str;
        if(state){
            let colors=file.savefile.content.settings.color;
            str=key.toString().charAt(0)+":"+color.toHex(colors.foreground[0],colors.foreground[1],colors.foreground[2]);
        }
        else{
            str=key.toString().charAt(0)+":#000000\n";
        }
        if(SYSTEM!="PI"){
            return console.log(str);
        }
        return port.write(str);
    },
    reset:function(){
        let i,upLED=false,downLED=false,leftLED=false,rightLED=false,confirmLED=false;   

        for(i=0;i<controls.key.link.up.length;i++){
            if(controls.key.link.up[i].LEDstate){
                upLED=true;
            }
        }
        this.set("up",upLED);

        for(i=0;i<controls.key.link.down.length;i++){
            if(controls.key.link.down[i].LEDstate){
                downLED=true;
            }
        }
        this.set("down",downLED);

        for(i=0;i<controls.key.link.left.length;i++){
            if(controls.key.link.left[i].LEDstate){
                leftLED=true;
            }
        }
        this.set("left",leftLED);

        for(i=0;i<controls.key.link.right.length;i++){
            if(controls.key.link.right[i].LEDstate){
                rightLED=true;
            }
        }
        this.set("right",rightLED);

        for(i=0;i<controls.key.link.confirm.length;i++){
            if(controls.key.link.confirm[i].LEDstate){
                confirmLED=true;
            }
        }
        this.set("confirm",confirmLED);

        return;
    }
}