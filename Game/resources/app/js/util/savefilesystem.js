var file;
file={
    savefile: {
        content: undefined,
        save: function() {
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
            let loadFile = fs.readFileSync(this.path);
            this.content=JSON.parse(loadFile);
        },
        path: path.join(__dirname, '/save/game/gamefile.JSON')
    }
}