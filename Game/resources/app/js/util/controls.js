var controls={
    key:{
        listenerActive:false,
        linkId:0,
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
                        values[i][j]={};
                        found=true;
                        break id;
                    }
                }
            }
            if(!found){notify("targetId not found!!!", "function");}
            }
        },
        
        set: function(selectedKey,keyDuration,keyAction,keyDescription){
            keyDescription.toUpperCase();
            var keyBinds = [
                controls.key.bind.up, 
                controls.key.bind.down, 
                controls.key.bind.left,
                controls.key.bind.right, 
                controls.key.bind.confirm
            ];
            this.linkId++;
            if(!controls.key.listenerActive){
                document.addEventListener('keydown',keyDownFunction);
                document.addEventListener('keyup',keyUpFunction);
                controls.key.listenerActive=true;
            }
            controls.key.fill(selectedKey,keyDuration,keyAction,keyDescription,this.linkId);
            var whichKey = {};

            function keyDownFunction(event){
                if ( whichKey[event.key] ) return;
                whichKey[event.key] = event.timeStamp;
            }

            function keyUpFunction(event){
                if ( !whichKey[event.key] ) return;
                var pressDuration = event.timeStamp - whichKey[event.key];
                whichKey[event.key] = 0;
                notify("Pressed "+event.key+" for "+Math.floor(pressDuration)+"ms", "controls");
                findAction(pressDuration);
            }

            function findAction(pressDuration){
                let keyTarget=undefined;
                let ct=0;
                for(ct; ct<keyBinds.length;ct++){
                    if(keyBinds[ct].includes(event.key,0)) {
                        keyTarget=ct;
                        break;
                    }
                };
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
                //footerUISVG(keyDescription,selectedKey);
                return this.linkId;
            }
        }
    }
}