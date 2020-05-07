var file={//The file method for handling the saving and loading of files.
    savefile: {
        content: undefined,

        save: function() {//The savefile saving function to to set the save time in to the savefile and then save it.

            function zero(input) {//Zero function to add a zero infront of number smaller than 10, 7 becomes 07...
                if (input < 10)input="0"+input;
                return input;
            }

            let current=new Date();

            this.content.lastGame.time= (zero(current.getHours())+":"+zero(current.getMinutes())+":"+zero(current.getSeconds())).toString();
            this.content.lastGame.date= (zero(current.getDate())+"/"+zero(current.getMonth()+1)+"/"+zero(current.getFullYear())).toString();;

            let str=JSON.stringify(this.content,null,1);

            fs.writeFileSync(this.path, str, function (err){if(DEBUG)notify("SF save ERROR","function")});
        },
        
        load: function() {//The savefile load function to load the savefile .

            let str = fs.readFileSync(this.path);
            this.content=JSON.parse(str);
        },

        path: path.join(__dirname, '/save/save/savefile.JSON')

    },
    gamefile: {//Gamefile object to load and store the currently active gamefile into the game.
        content: undefined,

        load: function() {
            if(SYSTEM==="PI"){//If the system is PI take the file from a different location.
                var games="/var/www/html/Editor/games/";
                var state="/var/www/html/Editor/state/state.json";
            }
            else{
                var games=path.join(__dirname,"/../../../Server/htdocs/games/");
                var state=path.join(__dirname,"/../../../Server/htdocs/state/state.JSON");
            }
            var loadFile = fs.readFileSync(state);
            var current =JSON.parse(loadFile);
        
            games=path.join(games,current.activeSaveFile);

            loadFile = fs.readFileSync(games);
            this.content=JSON.parse(loadFile);
            checkStructure(this.content);//Check the structure of the file
        }
    },
    languagefile:{//Languagefile object to load the language file into an object
        content:undefined,

        load: function() {
            let loadFile = fs.readFileSync(this.path);
            this.content=JSON.parse(loadFile);
        },

        path: path.join(__dirname, '/save/language/languagefile.JSON')
    },
    apfile:{//Apfile to handle Access Point configuration saving
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
wpa_passphrase=$$$`,//^^^This is intentionally unindented. Linux configuration requires this.

        save: function(input) {
            //Insert the input into the configuration file.
            let str=this.content.split("###").join(input.SSID.toString());
            str=str.split("$$$").join(input.PW.toString());
            fs.writeFileSync(this.path, str, function (err){if(DEBUG)notify("AP save ERROR","function")});
        },
        path: path.join(__dirname, '/save/ap/changedhostapd.conf')
    }
}
