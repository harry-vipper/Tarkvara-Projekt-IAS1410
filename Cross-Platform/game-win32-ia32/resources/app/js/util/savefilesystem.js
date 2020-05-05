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
            if(SYSTEM==="PI"){
                var games="/var/www/html/Editor/games/";
                var state="/var/www/html/Editor/state/state.json";
            }
            else{
                var games=path.join(__dirname,"/../../../../Server/htdocs/games/");
                var state=path.join(__dirname,"/../../../../Server/htdocs/state/state.JSON");
            }
            var loadFile = fs.readFileSync(state);
            var current =JSON.parse(loadFile);
            
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
                for(let j=0;j<this.content.content[i].contentElements.length;j++){
                    this.content.content[i].contentElements[j].id=castToType("number",this.content.content[i].contentElements[j].id);
                    this.content.content[i].contentElements[j].type=castToType("contentElementType",this.content.content[i].contentElements[j].type);
                    this.content.content[i].contentElements[j].str=castToType("string",this.content.content[i].contentElements[j].str);
                    this.content.content[i].contentElements[j].repeatable=castToType("boolean",this.content.content[i].contentElements[j].repeatable);
                    this.content.content[i].contentElements[j].likelyRepeats=castToType("number",this.content.content[i].contentElements[j].likelyRepeats);


                }
            }
        }
    },
    languagefile:{
        content:undefined,
        load: function() {
            let loadFile = fs.readFileSync(this.path);
            this.content=JSON.parse(loadFile);
        },
        path: path.join(__dirname, '/save/language/languagefile.JSON')
    },
    apfile:{
        apSSID:"TESTSSID",
        apPW:"TESTPASSWORD",//Min 8 max 63 char
        content:`interface=wlan0
driver=nl80211

hw_mode=g
channel=6
ieee80211n=1
wmm_enabled=0
macaddr_acl=0
ignore_broadcast_ssid=0

auth_algs=1
wpa=2
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP

ssid=###
wpa_passphrase=$$$`,//^^^See on põhjusega imelikult indentitud
        save: function(input) {
            let str=this.content.split("###").join(input.SSID.toString());
            str=str.split("$$$").join(input.PW.toString());
            fs.writeFileSync(this.path, str, function (err){if(DEBUG)notify("Save ERROR","function")});
        },
        path: path.join(__dirname, '/save/ap/changedhostapd.conf')
    }
}
