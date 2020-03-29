var controls={
    key:{
        listenerActive:false,
        linkId:0,
        bind:{
            up: 'w',
            down: 's',
            left: 'a',
            right: 'd',
            confirm: 'x' 
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
            var keyBinds=[controls.key.bind.up,controls.key.bind.down,controls.key.bind.left,controls.key.bind.right,controls.key.bind.confirm];
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
                notify(event.key, "update");
                if ( !whichKey[event.key] ) return;
                var pressDuration = event.timeStamp - whichKey[event.key];
                whichKey[event.key] = 0;
                notify(pressDuration, "update");
                findAction(pressDuration);
            }

            function findAction(pressDuration){
                if(keyBinds.includes(event.key,0)){
                    find:
                    for(i=0;i<5;i++){
                        if (event.key === keyBinds[i]){
                            var values=Object.values(controls.key.link);
                            if(values[i].length!==0){
                                var keyDurations=[];
                                for(j=0;j<values[i].length;j++){
                                    keyDurations[j]=values[i][j].duration;
                                }
                                keyDurations.push(86400000);
                                keyDurations.sort(function(a, b){return a-b});
                                for(j=0;j<keyDurations.length;j++){
                                    if(keyDurations[j]>pressDuration){
                                        if(j===0) break find;
                                        else{ 
                                            for(k=0;k<keyDurations.length;k++){
                                                if(keyDurations[j-1]===values[i][k].duration){
                                                    values[i][k].action(pressDuration);

                                                    break find;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if(keyDescription===false){return this.linkId;}
            else{
                footerUISVG(keyDescription,selectedKey);
                return this.linkId;
            }
        }
    
    }

}