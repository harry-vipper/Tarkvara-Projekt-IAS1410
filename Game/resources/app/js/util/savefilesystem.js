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