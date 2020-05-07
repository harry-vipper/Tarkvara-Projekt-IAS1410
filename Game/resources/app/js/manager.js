function startup() {
    //Load save-, game- and languagefiles
    file.savefile.load();
    file.gamefile.load();
    file.languagefile.load();





    //Set colors of the game based on saved data.
    color.setColor();

    //Set LEDs to off state.
    LED.reset();

    //Start promise chain.
    var lastScreenPromise=new Promise((resolve)=>{resolve()});

    //If there was a game in progress display saveloadMenu to user else display game selection menu.
    if(file.savefile.content.gameData.state===2){
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
        return mainGameLoop(output);//Start promise loop.
    });
    
    //Set fill screen settings
    var fillCounter=0;
    var fillFrequency=3;

    function typeFinder(){//Find game element type and return correct screen.
        fillCounter++;
        if(fillCounter===Math.floor(10/fillFrequency)){
            fillCounter=0;
            return system.screen.displayScreen("fill", undefined);
        }

        if(file.savefile.content.gameData.currentQuestion>=file.savefile.content.gameData.gameOrder.length){
            return system.screen.displayScreen("gameEnd", undefined);
        }
        else if(0>file.savefile.content.gameData.gameOrder[file.savefile.content.gameData.currentQuestion]){
            if(file.savefile.content.gameData.gameOrder[file.savefile.content.gameData.currentQuestion]===-1){
                return system.screen.displayScreen("game-element-truth-or-dare",undefined);
            }
            else if(file.savefile.content.gameData.gameOrder[file.savefile.content.gameData.currentQuestion]===-2){
                return system.screen.displayScreen("game-element-reaction-test",undefined);
            }
        }
        else{
            return system.screen.displayScreen("game-element-question-task", undefined);
        }
    }
    

    function mainGameLoop(input){//Main game loop, loops infinitely, controls game logic.
        lastScreenPromise=lastScreenPromise.then(()=>{//Decides what to do next based on output of last screen.

            if(input.type==="choiceMade"){//If last screen was save-load menu decide whether to continue last game or display game selection menu.

                if(input.value===1){
                    file.savefile.content.gameData.state=1;
                    file.gamefile.load();
                    return system.screen.displayScreen("gameSelectionMenu", undefined);
                }

                else if(input.value===0){
                    file.savefile.content.gameData.currentQuestion++;
                    
                    return typeFinder();
                }
            }

            else if(input.type==="startGame") {//If user started game from game selection menu screen, construct the order of game elements and set metadata to reflect the start and display first game element.
                file.savefile.content.gameData.state=2;
                file.savefile.content.gameData.currentQuestion=0;
                file.savefile.content.gameData.gameOrder=gameOrderer();
                file.savefile.content.lastGame.title=file.gamefile.content.content[file.savefile.content.gameData.selectedGame].properties.title;
                fillCounter=0;

                return typeFinder();
            }
            else if(input.type==="nextScreen"){//If element time ran out or user changed game element, decide direction of movement and display correct element based on that.
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
            else if(input.type==="gameSelectionMenu"){//If user returns to game selection menu reload the gamefile to display possibly made changes
                file.savefile.content.gameData.state=1;
                file.gamefile.load();
                return system.screen.displayScreen("gameSelectionMenu", undefined);
            }
            else if(input.type==="settingsMenu"){//If user goes to settings menu display 
                file.savefile.content.gameData.state=3;
                return system.screen.displayScreen("settingsMenu", undefined);
            }
            else if(input.type==="fillEnd"){
                return typeFinder();
            }
            else if(input.type==="editorConnect"){//If user wants to connect to the device display editor connect screen
                return system.screen.displayScreen("editorConnect", undefined);
            }
            else if(input.type==="return"){//If user leaves editor connect screen return to the correct previous screen
                if(file.savefile.content.gameData.state===1){
                    file.gamefile.load();
                    return system.screen.displayScreen("gameSelectionMenu", undefined);
                }
                else if(file.savefile.content.gameData.state===2) return typeFinder();
                else if(file.savefile.content.gameData.state===3) return system.screen.displayScreen("settingsMenu", undefined);
            }
            else{//If unexpected input is given to the loop pause the game for debugging
                debugger;
            }
        }).then((output)=>{//After each iteration of the loop save the game info to the savefile and continue the loop
            file.savefile.save();
            mainGameLoop(output);
        });
    }
}

function delay(time, timerArray) {//Delay function. Creates a promise which resolves when the time elapses.
    return new Promise((resolve)=>{
        timerArray.push(setTimeout(resolve, time));
    });
}

function gameOrderer(){//Game ordering function. Creates the order for each game, based on selected game from the gamefile.
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
    
    gameOrder.splice(0,1);//Removes the first and last element 
    gameOrder.pop();

    if(file.gamefile.content.content[file.savefile.content.gameData.selectedGame].settings.random){//If the game order is supposed to be random suffles the game order
        shuffle(gameOrder);
    }

    let mgF=file.savefile.content.settings.mgFrequency;
    let count=gameOrder.length/mgF;

    for(let i=1;i<=count;i++){//Adds minigames to the game order if enabled 
        if(file.savefile.content.settings.toggle[0]===1 && file.gamefile.content.content[file.savefile.content.gameData.selectedGame].settings.minigames.mg1){
            gameOrder.splice(Math.floor(mgF*i-(Math.random()*mgF/2)),0,-1);
        }
        if(file.savefile.content.settings.toggle[1]===1 && file.gamefile.content.content[file.savefile.content.gameData.selectedGame].settings.minigames.mg2){
            gameOrder.splice(Math.floor(mgF*i+(Math.random()*mgF/2)),0,-2);
        }
    }

    gameOrder.splice(0,0,0);//Adds back the previously removed elements
    gameOrder.push(file.gamefile.content.content[file.savefile.content.gameData.selectedGame].contentElements.length-1)

    notify(gameOrder,"update");

    return gameOrder;
}

function shuffle(array) {//Shuffle function, based on the Fisher–Yates shuffle as we want all permutations to be equally likely
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

function startTimer(duration,timerLocationId,localTimerIds) {//Start timer function, sets a visible countdown to the specified location

    return new Promise((resolve)=>{

        let timer = duration;
        let minutes=1;
        let seconds=1;
        let i=0;
        let length=localTimerIds.length;
    
        localTimerIds[length]=setInterval(()=>{//Runs the loop every 10ms to balance refresh delay and performance.

            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);
            
            seconds = seconds < 10 ? "0" + seconds : seconds;
            document.getElementById(timerLocationId).innerHTML = minutes + ":" + seconds;

            if(timer===0){
                notify("TIMER 0", "function");
                clearInterval(localTimerIds[length]);
                localTimerIds[length]=null;
                resolve();
            }
            if(i===100){
                i=0;
                timer--;
            }

            i++;
        }, 10);
    });
}

function insertText(index){//Insert text function returns the correct text from the languagefile based on given index.
    return file.languagefile.content[index][file.savefile.content.settings.language];
}

const port=setPort();//Defines port so data can be writen to the Arduino.

function setPort(){//Set port function, uses the SerialPort node module to communicate with the Arduino through UART pins on the PI GPIO.
    
    if(SYSTEM!="PI"){//If the system is not PI returns to allow development on other systems.
        return null;
    }
    //Defines the module and parser
    const SerialPort = require('serialport');
    const port = new SerialPort("/dev/ttyAMA0",{baudRate:9600});
    const Readline = require('@serialport/parser-readline');
    const parser = new Readline();
    port.pipe(parser);

    port.on('open', function() {//When the port has finished setting up starts parser to run on the port
        var upCounter=true,downCounter=true,leftCounter=true,rightCounter=true,confirmCounter=true;
        parser.on('data', function (data){//If the parser detects a line of data trigger the respective action
            //If data was "rotate" rotate screen
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
            //If data was a button press emulate the corresponding keypress event
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
            notify('Data from Arduino: ' + data, "function");
       });
    }); 
    return port;
}

var LED={//The LED method 
    set:function(key,state){//LED set function to send color of a key LED to the Arduino for application to the LED
        let str;
        if(state){
            let colors=file.savefile.content.settings.color;
            str=key.toString().charAt(0)+":"+color.toHex(colors.foreground[0],colors.foreground[1],colors.foreground[2]);
        }
        else{
            str=key.toString().charAt(0)+":#000000\n";
        }
        if(SYSTEM!="PI"){//If the systme isn't the PI notify instead of writing to port
            return notify(str,"update");
        }
        return port.write(str);
    },
    reset:function(){//LED reset function to send color of all key LEDs to the Arduino, used after changing controls.  

        let state={"up":false,"down":false,"left":false,"right":false,"confirm":false}; 
        var keys=Object.keys(state)

        //Checks all the controls.key.links for any bound keys. If it finds any then sets corresponding LED color, if not then turns the LED off.

        for(let j=0;j<keys.length;j++){
            for(let i=0;i<controls.key.link[keys[j]].length;i++){
                if(controls.key.link[keys[j]][i].LEDstate){
                    state[keys[j]]=true;
                }
            }
            this.set(keys[j],state[keys[j]]);
        }
        return;
    }
}