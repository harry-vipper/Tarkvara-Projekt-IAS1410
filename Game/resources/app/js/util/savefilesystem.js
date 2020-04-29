var file;
file={
    savefile: {
        content: undefined,
        save: function() {
            function zero(input) {
                if (input < 10)input="0"+input;
                return input;
              }
            let current=new Date();
            this.content.lastGame.time= (zero(current.getHours())+":"+zero(current.getMinutes())+":"+zero(current.getSeconds())).toString();
            this.content.lastGame.date= (zero(current.getDate())+"/"+zero(current.getMonth()+1)+"/"+zero(current.getFullYear())).toString();;
            let str=JSON.stringify(this.content,null,1);
            fs.writeFileSync(this.path, str, function (err){if(DEBUG)notify("Save ERROR","function")});
        },
        load: function() {
            let str = fs.readFileSync(this.path);
            this.content=JSON.parse(str);
        },
        path: path.join(__dirname, '/save/save/savefile.JSON')

    },
    gamefile: {
        content: undefined,
        load: function() {
            let primary=this.path.substring(0,this.path.length-18)
 
            let games=path.join(primary,"Server/htdocs/games/");
            let state=path.join(primary,"Server/htdocs/state/state.JSON");

            let loadFile = fs.readFileSync(state);
            let current =JSON.parse(loadFile);

            games=path.join(games,current.activeSaveFile);

            loadFile = fs.readFileSync(games);
            this.content=JSON.parse(loadFile);
            for(let i=0;i<this.content.content.length;i++){
                this.content.content[i].id=castToType("number",this.content.content[i].id);
                this.content.content[i].properties.title=castToType("string",this.content.content[i].properties.title);
                this.content.content[i].properties.description=castToType("string",this.content.content[i].properties.description);
                this.content.content[i].properties.players.min=castToType("number",this.content.content[i].properties.players.min);
                this.content.content[i].properties.players.max=castToType("number",this.content.content[i].properties.players.max);
                this.content.content[i].properties.volume=castToType("number",this.content.content[i].properties.volume);
                this.content.content[i].properties.condition=castToType("number",this.content.content[i].properties.condition);
                this.content.content[i].settings.random=castToType("boolean",this.content.content[i].settings.random);
                this.content.content[i].settings.contentElementDuration=castToType("number",this.content.content[i].settings.contentElementDuration);
                this.content.content[i].settings.minigames.mg1=castToType("boolean",this.content.content[i].settings.minigames.mg1);
                this.content.content[i].settings.minigames.mg2=castToType("boolean",this.content.content[i].settings.minigames.mg2);
                //this.content.content[i].settings.minigames.mg3=castToType("boolean",this.content.content[i].settings.minigames.mg3);
                for(let j=0;j<this.content.content[i].contentElements.length;j++){
                    this.content.content[i].contentElements[j].id=castToType("number",this.content.content[i].contentElements[j].id);
                    this.content.content[i].contentElements[j].type=castToType("contentElementType",this.content.content[i].contentElements[j].type);
                    this.content.content[i].contentElements[j].str=castToType("string",this.content.content[i].contentElements[j].str);
                    this.content.content[i].contentElements[j].repeatable=castToType("boolean",this.content.content[i].contentElements[j].repeatable);
                    this.content.content[i].contentElements[j].likelyRepeats=castToType("number",this.content.content[i].contentElements[j].likelyRepeats);


                }
            }
            this.content
        },
        path: __dirname
    },
    languagefile:{
        content:undefined,
        load: function() {
            let loadFile = fs.readFileSync(this.path);
            this.content=JSON.parse(loadFile);
        },
        path: path.join(__dirname, '/save/language/languagefile.JSON')
    }
}