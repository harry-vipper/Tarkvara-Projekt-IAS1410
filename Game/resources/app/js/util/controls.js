var controls={
    key:{
        listenerActive:false,
        linkId:0,
        lockKeyUp:false,
        timers:[],
        bind:{
            up: ['w', '8'],
            down: ['s', '2'],
            left: ['a', '4'],
            right: ['d', '6'],
            confirm: ['x', '5']
        },
        link:{
           up:[],
            down:[],
             left:[],
             right:[],
             confirm:[]
        },
        fill:function(selectedKey,keyDuration,keyAction,keyDescription,bindId){
            var keyObject={
                duration:keyDuration,
                action:keyAction,
                description:keyDescription,
                id: bindId
                }
            if(DEBUG)console.log(keyObject);
            controls.key.link[selectedKey].push(keyObject);
        },
        clear:{
            byKey:function(selectedKey){
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
            byId:function(targetId){
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
        
        set: function(selectedKey,keyDuration,keyAction,keyDescription){
            if(keyDescription!==false)keyDescription=keyDescription.toUpperCase();
            var keyBinds = [
                controls.key.bind.up, 
                controls.key.bind.down, 
                controls.key.bind.left,
                controls.key.bind.right, 
                controls.key.bind.confirm
            ];
            this.linkId++;
            if(!controls.key.listenerActive){
                document.addEventListener('keydown',keyDownFunction,{once:true});
                document.addEventListener('keyup',keyUpFunction);
                controls.key.listenerActive=true;
            }
            controls.key.fill(selectedKey,keyDuration,keyAction,keyDescription,this.linkId);
            var whichKey = {};
            var length=this.timers.length;
            

            function keyDownFunction(event){
                if ( whichKey[event.key] ) return;
                let keyTarget= findKeyTarget(event.key);
                if(keyTarget!=undefined){
                    let values=Object.values(controls.key.link);
                    if(values[keyTarget].length!==0){
                        let keyDurations=[];
                        for(let j=0;j<values[keyTarget].length;j++){
                            keyDurations[j]=values[keyTarget][j].duration;
                        }
                        keyDurations.sort(function(a, b){return a-b});
                        var maxPressDuration=keyDurations.pop();
                    }
                    else var maxPressDuration=0;

                    whichKey[event.key] = JSON.parse(JSON.stringify(event.timeStamp));
                    controls.key.timers[length]=setTimeout(()=>{
                        controls.key.lockKeyUp=true;
                        notify("Pressed "+event.key, "controls");
                        findAction(maxPressDuration+1,event);
                    },maxPressDuration);  
                }
                else return;
            }

            function keyUpFunction(event){
                if(!whichKey[event.key])return;
                if(controls.key.lockKeyUp){
                    whichKey[event.key] = 0;
                    controls.key.lockKeyUp=false; 
                    document.addEventListener('keydown',keyDownFunction,{once:true});
                    return;
                }
                document.addEventListener('keydown',keyDownFunction,{once:true});
                clearTimeout(controls.key.timers[length]);
                let pressDuration = event.timeStamp - whichKey[event.key];
                whichKey[event.key] = 0;
                notify("Held "+event.key+" for "+Math.floor(pressDuration)+"ms", "controls");
                findAction(pressDuration,event);
            }

            function findKeyTarget(key){
                let keyTarget=undefined;
                let ct=0;
                for(ct; ct<keyBinds.length;ct++){
                    if(keyBinds[ct].includes(key,0)) {
                        keyTarget=ct;
                        break;
                    }
                };
                return keyTarget;
            }

            function findAction(pressDuration,event){
                let keyTarget= findKeyTarget(event.key);
                if(keyTarget!=undefined){
                    var values=Object.values(controls.key.link);
                    var i=keyTarget;
                    if(values[i].length!==0){
                        //Create array of set key functions' required keypress durations, to compare later
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

                            //If the currently pressed key duration is under the specified duration if the selected event
                            if(keyDurations[j]>pressDuration){
                                if(j===0) return false; //This was less than the first element, so no action should be taken
                                
                                else{ 
                                    for(k=0;k<keyDurations.length;k++){
                                        if(keyDurations[j-1]===values[i][k].duration){
                                            values[i][k].action(pressDuration);
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
            
            if(keyDescription===false){return this.linkId;}
            else{
                system.screen.footer.UISVG(keyDescription,selectedKey,keyDuration);
                system.screen.footer.updateAnimation();
                return this.linkId;
            }
            
        }
    }
}