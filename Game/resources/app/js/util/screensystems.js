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
        UID: {
            lastUID: 0, //0 to zzzz (басс26)
            generate: function() {
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
        }
        /*launch: function() {

        }*/
    },
    settings: {} 
}