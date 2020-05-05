var controls={//The controls method, handles user input to the game.
    key:{//Metadata
        listenerActive:false,
        linkId:0,
        lockKeyUp:false,
        lockKeyDown:false,
        currentKey:"",
        timers:[],
        bind:{//Key.binds linking keyboard keys to game buttons
            up: ['w', '8'],
            down: ['s', '2'],
            left: ['a', '4'],
            right: ['d', '6'],
            confirm: ['x', '5']
        },
        link:{//Key.link containing all currently set controls.
           up:[],
            down:[],
             left:[],
             right:[],
             confirm:[]
        },
        fill:function(selectedKey,keyDuration,keyAction,keyDescription,holdRepeat,keyLEDstate,bindId){//Fill function to fill key.link in the correct format.
            var keyObject={
                duration:keyDuration,
                action:keyAction,
                description:keyDescription,
                repeat:holdRepeat,
                LEDstate:keyLEDstate,
                id: bindId
                }
            if(DEBUG)console.log(keyObject);
            controls.key.link[selectedKey].push(keyObject);
        },
        clear:{
            byKey:function(selectedKey){//The clear.byKey function to clear set controls from key.link by key or all at once.
                if(selectedKey==="all"){
                    controls.key.link.up=[];
                    controls.key.link.down=[];
                    controls.key.link.left=[];
                    controls.key.link.right=[];
                    controls.key.link.confirm=[];
                }
                else{
                    controls.key.link[selectedKey]=[];
                }
            },
            byId:function(targetId){//The clear.byId function to clear a specific control from key.link by its id.
            var values=Object.values(controls.key.link);
            var found=false;
            id:
            for(i=0;i<values.length;i++){
                for(j=0;j<values[i].length;j++){
                    if(values[i][j].id===targetId){
                        values[i].splice(j,1);
                        found=true;
                        break id;
                    }
                }
            }
            if(!found){notify("targetId not found", "controls");}
            }
        },
        
        set: function(selectedKey,keyDuration,keyAction,keyDescription,holdRepeat,keyLEDstate){//The key.set function to set a new control.
            //Correction of unset parameters
            if(keyDescription==undefined)keyDescription=false;
            if(holdRepeat==undefined)holdRepeat=false;
            if(keyLEDstate==undefined)keyLEDstate=false;

            if(keyDescription!==false)keyDescription=keyDescription.toUpperCase();

            var keyBinds = [
                controls.key.bind.up, 
                controls.key.bind.down, 
                controls.key.bind.left,
                controls.key.bind.right, 
                controls.key.bind.confirm
            ];
            this.linkId++;
            if(!controls.key.listenerActive){//Check to avoid duplicate event listeners
                document.addEventListener('keydown',keyDownFunction);
                document.addEventListener('keyup',keyUpFunction);
                controls.key.listenerActive=true;
            
            }
            controls.key.fill(selectedKey,keyDuration,keyAction,keyDescription,holdRepeat,keyLEDstate,this.linkId);
           
            var whichKey = {};
            var length=this.timers.length;
            

            function keyDownFunction(event){//The keyDownFunction, this triggers when a key is pressed. 
                
                if ( whichKey[event.key] || controls.key.lockKeyDown) return;
                let keyTarget= findKeyTarget(event.key);
                //Filters out incorrect and duplicate inputs from the user.
               
                if(keyTarget!=undefined){
                    controls.key.currentKey=event.key;
                    controls.key.lockKeyDown=true;
                    let values=Object.values(controls.key.link);
                    //Check if there are more than one functions attached to the same key, if yes then find the one with the longest required press duration.
                   
                    if(values[keyTarget].length!==0){
                        let keyDurations=[];
                        
                        for(let i=0;i<values[keyTarget].length;i++){
                            keyDurations[i]=values[keyTarget][i].duration;
                        
                        }
                        keyDurations.sort(function(a, b){return a-b});
                        var maxPressDuration=keyDurations.pop();
                        
                        for(let i=0;i<values[keyTarget].length;i++){
                            if(maxPressDuration===values[keyTarget][i].duration){
                                var byDuration=i;
                                break;
                            }
                        }
                    }
                    else{
                        var maxPressDuration=0;
                        var byDuration=0;
                    }
                    
                    whichKey[event.key] = JSON.parse(JSON.stringify(event.timeStamp));

                    controls.key.timers[length]=setTimeout(()=>{//Set a timeout to trigger when the longest required press duration has elapsed.
                        
                        controls.key.lockKeyUp=true;
                        notify("Pressed "+event.key, "controls");
                        
                        if(values[keyTarget][byDuration]!=undefined){
                        	if(values[keyTarget][byDuration].repeat){
                            		whichKey[event.key]=0;
                            		controls.key.lockKeyDown=false;
                        	}
			            }
                        findAction(maxPressDuration+1,event);//Find the corresponding action
                    },maxPressDuration);  
                }
                else{
                    return;
                } 
            }

            function keyUpFunction(event){//The keyUpFunction, this triggers when a key press has ended.
                if(controls.key.currentKey != event.key)return;
                //Filter incorrect keys and avoid triggering same action twice
                if(controls.key.lockKeyUp){
                    controls.key.lockKeyDown=false;
                    controls.key.lockKeyUp=false;
                    whichKey[event.key] = 0;
                    return;
                }
                //Clear the timeout to avoid triggering same action twice
                clearTimeout(controls.key.timers[length]);
                controls.key.lockKeyDown=false;
                let pressDuration = event.timeStamp - whichKey[event.key];
                whichKey[event.key] = 0;
                notify("Held "+event.key+" for "+Math.floor(pressDuration)+"ms", "controls");
                findAction(pressDuration,event);//Find the corresponding action
            }

            function findKeyTarget(key){//FindKeyTarget function to find if a pressed key is in the key.binds 
                let keyTarget=undefined;
                for(let ct=0; ct<keyBinds.length;ct++){
                    if(keyBinds[ct].includes(key,0)) {
                        keyTarget=ct;
                        break;
                    }
                };
                return keyTarget;
            }

            function findAction(pressDuration,event){//The findAction function to trigger correct function based on press duration
                let keyTarget= findKeyTarget(event.key);
                if(keyTarget!=undefined){
                    var values=Object.values(controls.key.link);
                    var i=keyTarget;
                    if(values[i].length!==0){
                        //Create array of set key functions' required keypress durations, to compare with later
                        var keyDurations=[];
                        for(j=0;j<values[i].length;j++){
                            keyDurations[j]=values[i][j].duration;
                        }
                        //Add a 24hr limit
                        keyDurations.push(86400000);

                        //Sort it from from smaller to larger
                        keyDurations.sort(function(a, b){return a-b});

                        //Go over every keypress event
                        for(j=0;j<keyDurations.length;j++){

                            //If the currently pressed key duration is under the specified duration of the selected event
                            if(keyDurations[j]>pressDuration){
                                if(j===0) return false; //This was less than the first element, so no action should be taken
                                
                                else{ 
                                    for(k=0;k<keyDurations.length;k++){
                                        //Find the function related to the duration
                                        if(keyDurations[j-1]===values[i][k].duration){
                                            values[i][k].action(pressDuration);//Trigger the function
                                            return true;
                                        }
                                    }
                                }
                            }
                        }
                        return false;
                    }
                }
            }
            //Set LED and description if required
            if(keyLEDstate===true){
                LED.set(selectedKey,true);
            }
            if(keyDescription===false){return this.linkId;}
            else{
                system.screen.footer.UISVG(keyDescription,selectedKey,keyDuration);
                system.screen.footer.updateAnimation();
                return this.linkId;
            }
            
        }
    }
}