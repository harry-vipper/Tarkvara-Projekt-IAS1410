/*function clearTimers(localTimerIds){
    for(i=0;i<localTimerIds.length;i++){
        clearInterval(localTimerIds[i])
    }
    localTimerIds.length=0;
}

function clearStyle(){
    document.getElementById("styleId").innerHTML="";
}

function clearFooter(){
    document.getElementById("footerId").innerHTML="";
}

function clearBody(){
    document.getElementById("bodyId").innerHTML="";
}
function exitScreen(whatNext) {
    clearTimers(localTimerIds);
    controls.key.clear.byKey("all");
    clearFooter();
    clearStyle()
    clearBody();
    logicController(whatNext);
}*/
var system;
system={
    screen: {
        displayScreen: function(type, data) {
            switch(type) {
                case "minigame-td":
                    alert("käi putsi");
                    break;
                case "gameSelectionMenu":
                    return screens.gameSelectionMenu.handler(
                        document.getElementById("screenContainer"),
                        document.getElementById("screenStyleContainer"),
                        controls,
                        {
                            gamefile: file.gamefile,
                            savefile: file.savefile
                        },
                        system.screen.timers.localTimerIds,
                        {
                            duration:30,
                        },
                        render,
                        system.screen.UID.generate()
                    ).then((output)=>{
                        return render.fade.out(document.getElementById("screenContainer")).then(()=>{return output;});
                    }).then((output)=>{
                        this.destroy();
                        console.log(output);
                    });
                case "game-element-question":
                    screens.splash.handler(
                        document.getElementById("screenContainer"),
                        document.getElementById("screenStyleContainer"),
                        controls,
                        {
                            icon:"arrow",
                            text:"MINGI TEXT",
                            movetime:900,
                            staytime:3000,
                        }
                        ,
                        system.screen.timers.localTimerIds,
                        null,
                        render,
                        system.screen.UID.generate()
        
                    ).then(()=> {
                        this.destroy();
                        return screens.question_task.handler(
                            document.getElementById("screenContainer"),
                            document.getElementById("screenStyleContainer"),
                            controls,
                            {
                                type:"question",
                                number:3,
                                content:"Küsimuse sisu midgi midagi midagi",
                            },
                            system.screen.timers.localTimerIds,
                            //system.settings
                            {
                                duration:30,
                            },
                            render,
                            system.screen.UID.generate() 
                        );
                        }
                    ).then((output)=>{
                        return render.fade.out(document.getElementById("screenContainer")).then(()=>{return output;});
                    });
            }
            /*screens.splash.handler(
                document.getElementById("screenContainer"),
                document.getElementById("screenStyleContainer"),
                controls,
                {
                    icon:"arrow",
                    text:"MINGI TEXT",
                    movetime:900,
                    staytime:3000,
                }
                ,
                system.screen.timers.localTimerIds,
                null,
                render,
                system.screen.UID.generate()

            ).then(()=> {
                this.destroy();
                return screens.gameSelectionMenu.handler(
                    document.getElementById("screenContainer"),
                    document.getElementById("screenStyleContainer"),
                    controls,
                    {
                        gamefile: file.gamefile,
                        savefile: file.savefile
                    },
                    system.screen.timers.localTimerIds,
                    {
                        duration:30,
                    },
                    render,
                    system.screen.UID.generate()
                );
                }
            ).then((output)=>{
                return render.fade.out(document.getElementById("screenContainer")).then(()=>{return output;});
            }).then((output)=>{
                this.destroy();
                console.log(output);
                return screens.question_task.handler(
                    document.getElementById("screenContainer"),
                    document.getElementById("screenStyleContainer"),
                    controls,
                    {
                        type:"question",
                        number:3,
                        content:"Küsimuse sisu midgi midagi midagi",
                    },
                    system.screen.timers.localTimerIds,
                    //system.settings
                    {
                        duration:30,
                    },
                    render,
                    system.screen.UID.generate() 
                );
            });*/
        },
        UID: {
            lastUID: 0, //0 to zzzz (басс26)
            generate: function() {
                if (DEFAULT_UID) {
                    return "UID";
                }
                let length=4;
                let char='abcdefghijklmnopqrstuvwxyz';
                if (this.lastUID>=Math.pow(char.length, length)) {
                    this.lastUID=0;
                }
                let str="";
                let tmpUID=this.lastUID;
                
                for (i = 0; i < length; i++) {
                    str += char.charAt(Math.floor(tmpUID%char.length));
                    tmpUID=Math.floor(tmpUID/char.length);
                }
                this.lastUID++;
                return str;
            }
        },
        timers: {
            localTimerIds: [],
            clear: function(){
                for(i=0;i<this.localTimerIds.length;i++){
                    clearInterval(this.localTimerIds[i]);
                }
                this.localTimerIds.length=0;
            }
        },
        body:{
            clear:function(){
                document.getElementById("screenContainer").innerHTML="";
            }
        },
        style: {
            clear: function() {
                document.getElementById("screenStyleContainer").innerHTML="";
            }
        },
        footer:{
            clear: function(){
                document.getElementById("footer").innerHTML="";
            }
        },
        loadResource: function(URI) {
            return fs.promises.readFile(path.join(__dirname, URI), {encoding: 'UTF-8'});
        },
        loadCSStoDOM: function(id, URI) {
            let link=document.createElement('link');
            link.setAttribute("rel", "stylesheet");
            link.setAttribute("type", "text/css");
            link.setAttribute("href", URI);
            link.setAttribute("id", id);
            document.getElementsByTagName('head')[0].appendChild(link)
        },
        destroy: function() {
            this.timers.clear();
            this.body.clear();
            this.style.clear();
            this.footer.clear();
        }
        /*launch: function() {

        }*/
    },
    settings: {} 
}