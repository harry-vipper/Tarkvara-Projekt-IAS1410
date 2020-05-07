//Settings menu screen for changing settings of the game.
var screen_settingsMenu={
    type: "settingsMenu",
    handler: function(
        context,       
        style,        
        controls,       
        screenContent, 
        localTimerIds,  
        screenSettings, 
        render,
        UID,             
    )
    /*
    context,        <div> to draw into
    style,          <style> to send styles to
    controls,       controls object with methods to handle controls
    screenContent,  data passed to the screen, in any format, possibly suitable to this screen only
    localTimerIds,  Array of active timers
    screenSettings, settings like colors
    UID             Unique ID of the HTML/CSS elements
    */
    {   
        //Set screen metadata.
        this.selectedSetting=0;
        this.settingSelected=false;

        var end;
        //Setting the endpromise to trigger when the end promise comes true.
        var endpromise=new Promise((resolve) =>{
                end=resolve;
            }
        );

        
        render.menuEntry={//Menu entry activation and deactivation functions, change the CSS classes of the entries.
            activate: function(index) {
                index=String(index);
                document.getElementById("_"+index+render.insertUID("_UID_header_index",UID)).classList.add(render.insertUID("UID_menulistHeaderActive",UID));
                document.getElementById("_"+index+render.insertUID("_UID_header_description",UID)).classList.remove(render.insertUID("r_hidden_animatable",UID));
                if(index<=1){
                    document.getElementById("_"+index+render.insertUID("_UID_menulistSettingSwitch",UID)).classList.add(render.insertUID("UID_switch-selected",UID));
                }
            },
            deactivate: function(index) {
                index=String(index);
                document.getElementById("_"+index+render.insertUID("_UID_header_index",UID)).classList.remove(render.insertUID("UID_menulistHeaderActive",UID));
                document.getElementById("_"+index+render.insertUID("_UID_header_description",UID)).classList.add(render.insertUID("r_hidden_animatable",UID));
                if(index<=1){
                    document.getElementById("_"+index+render.insertUID("_UID_menulistSettingSwitch",UID)).classList.remove(render.insertUID("UID_switch-selected",UID));
                }
            } 
        }

        //Display the footer.
        render.footer.show();   

    	//Load the screen CSS to DOM or the style element.
        system.screen.loadResource("/resources/css/settingsMenu.css").then((css)=>{
            if(fileCSS) {
                system.screen.loadCSStoDOM("resources/css/settingsMenu.css");
            }
            else{
                style.innerHTML=css;
            }
        }).then(()=>{
            //Make a copy of the HTMLbase, replace the placeholders and set it into the needed element.
            let str=this.HTMLbase;
            str=render.insertUID(str,UID);           
            context.innerHTML=str;

            return this.setContent(context,screenContent,UID);

        }).then(()=>{         
            //Start the scroller and move it to the top most element. 
            const scroller = new SweetScroll();
            scroller.to("#"+render.insertUID("_0_UID_menuHeader",UID));

            //Fade in the screen.
            return render.fade.in(context).then(()=>{return scroller;});
        }).then((scroller)=>{
            //Set the controls.
            controls.key.set('up', 0, ()=>{changeSetting('-');}, insertText("9"),false,true);
            controls.key.set('down', 0, ()=>{changeSetting('+');}, insertText("10"),false,true);
            controls.key.set('confirm', 0, ()=>{selectSetting();}, insertText("13"),false,true);
            controls.key.set('left', 0, ()=>{end({type:"gameSelectionMenu"});}, insertText("14"),false,true);
            controls.key.set('right', defaultHold, ()=>{end({type:"editorConnect"});}, insertText("46"),false,true);

            function changeSetting(direction){//Change setting function to handle scrolling, entry activation and deactivation.
                render.menuEntry.deactivate(screen_settingsMenu.selectedSetting);

                screen_settingsMenu.selectedSetting=calcNextIndex(
                    direction, 
                    screen_settingsMenu.selectedSetting, 
                    10
                );

                if(3>screen_settingsMenu.selectedSetting && screen_settingsMenu.selectedSetting>=0){
                    var elementId=render.insertUID("_0_UID_menuHeader",UID);
                }
                else if(6>screen_settingsMenu.selectedSetting && screen_settingsMenu.selectedSetting>2){
                    var elementId=render.insertUID("_1_UID_menulistGroupHeader",UID);
                }
                else if(10>screen_settingsMenu.selectedSetting && screen_settingsMenu.selectedSetting>5){
                    var elementId=render.insertUID("_2_UID_menulistGroupHeader",UID);
                }
                
                render.menuEntry.activate(screen_settingsMenu.selectedSetting);

                scroller.to("#"+elementId);
                
            }


            function calcNextIndex(direction, data, size){//Calculate next index function to allow selection of only valid entries.
                if(direction==='+') {
                    if(data<size-1) {
                        data++;
                    }
                    else {
                        data=0;
                    }
                }
                else if(direction==='-') {
                    if(data>0){
                        data--;
                    }
                    else data=size-1;
                }

                return data;
            }


            function selectSetting(){//Select setting function to turn on/off toggle settings or lock into setting change mode.

                if(screen_settingsMenu.selectedSetting<=1){//Turn on/off toggles.

                    if(screenContent.savefile.settings.toggle[screen_settingsMenu.selectedSetting]){
                        screenContent.savefile.settings.toggle[screen_settingsMenu.selectedSetting]=0;
                    }

                    else {
                        screenContent.savefile.settings.toggle[screen_settingsMenu.selectedSetting]=1;
                    }

                    //Reload the toggle switches.
                    screen_settingsMenu.toggleLoader(context,screenContent,UID);
                }

                else if(screen_settingsMenu.selectedSetting===9){//Change language betweens EST/ENG.

                    if(screenContent.savefile.settings.language==="ENG")screenContent.savefile.settings.language="EST";
                    else if(screenContent.savefile.settings.language==="EST")screenContent.savefile.settings.language="ENG"
                    
                    //Reload the language of the screen.
                    screen_settingsMenu.languageLoader(context,screenContent,UID);

                    //Clear the footer and reset the controls.
                    controls.key.clear.byKey("all");
                    system.screen.footer.clear();

                    controls.key.set('up', 0, ()=>{changeSetting('-');}, insertText("9"),false,true);
                    controls.key.set('down', 0, ()=>{changeSetting('+');}, insertText("10"),false,true);
                    controls.key.set('confirm', 0, ()=>{selectSetting();}, insertText("13"),false,true);
                    controls.key.set('left', 0, ()=>{end({type:"gameSelectionMenu"});}, insertText("14"),false,true);
                    controls.key.set('right', defaultHold, ()=>{end({type:"editorConnect"});}, insertText("46"),false,true);
                }

                else{//Color setting change.

                    if(screen_settingsMenu.settingSelected){//If a setting is locked
                        //Check the contrast of the colors.
                        let contrast=screen_settingsMenu.contrastCheck(0,0,screenContent);

                        //If the contrast is acceptable allow the user to unlock from the setting.
                        if(contrast===true){
                            //Change the controls to allow movement in the menu and reload the up-down arrows.
                            controls.key.clear.byKey("all");
                            system.screen.footer.clear();

                            screen_settingsMenu.upDownLoader(context,screenContent,UID,screen_settingsMenu.selectedSetting,false);
                            screen_settingsMenu.settingSelected=false;
        
                            controls.key.set('up', 0, ()=>{changeSetting('-');}, insertText("9"),false,true);
                            controls.key.set('down', 0, ()=>{changeSetting('+');}, insertText("10"),false,true);
                            controls.key.set('confirm', 0, ()=>{selectSetting();}, insertText("13"),false,true);
                            controls.key.set('left', 0, ()=>{end({type:"gameSelectionMenu"});}, insertText("14"),false,true);
                            controls.key.set('right', defaultHold, ()=>{end({type:"editorConnect"});}, insertText("46"),false,true);
                        }
                       
                    }
                    else{//If a setting isn't selected.
                        //Change the controls to allow value change, and reload the up-down arrows.
                        controls.key.clear.byKey("all");
                        system.screen.footer.clear();

                        screen_settingsMenu.upDownLoader(context,screenContent,UID,screen_settingsMenu.selectedSetting,true);
                        screen_settingsMenu.settingSelected=true;
                        
                        controls.key.set('up', 0, ()=>{changeValue('+',screen_settingsMenu.selectedSetting);}, insertText("15"),true,true);
                        controls.key.set('down', 0, ()=>{changeValue('-',screen_settingsMenu.selectedSetting);}, insertText("16"),true,true);
                        controls.key.set('confirm', 0, ()=>{selectSetting();}, insertText("17"),false,true);
                    }
                }

            }


            function changeValue(direction,index){//The change value function to change the value of a setting.
                if(index===2){//Change minigame frequency setting.
                    if(direction==="+"){
                        screenContent.savefile.settings.mgFrequency++;
                        if(screenContent.savefile.settings.mgFrequency>100)screenContent.savefile.settings.mgFrequency=100;
                    }

                    else if(direction==="-"){
                        screenContent.savefile.settings.mgFrequency--;
                        if(screenContent.savefile.settings.mgFrequency<1)screenContent.savefile.settings.mgFrequency=1;
                    }
                    screen_settingsMenu.minigameFrequencyLoader(context,screenContent,UID);
                }

                //Change a value of a color. If a lightness value is changed check the contrast, if contrast is good allow the change.
                else if(direction==="+"){

                    if(index===3 || index===4){
                        screenContent.savefile.settings.color.foreground[index-3]++;
                        if(screenContent.savefile.settings.color.foreground[index-3]>100)screenContent.savefile.settings.color.foreground[index-3]=100;
                    }

                    else if(index===5){
                        if(screen_settingsMenu.contrastCheck(1,0,screenContent)){
                            screenContent.savefile.settings.color.foreground[index-3]++;
                        }
                    }

                    else if(index===6 || index===7){
                        screenContent.savefile.settings.color.background[index-6]++;
                        if(screenContent.savefile.settings.color.background[index-6]>100)screenContent.savefile.settings.color.background[index-6]=100;
                    }
                    
                    else if(index===8){
                        if(screen_settingsMenu.contrastCheck(0,1,screenContent)){
                            screenContent.savefile.settings.color.background[index-6]++;
                        }
                    }

                    //Refresh the color
                    color.setColor();
                }

                else if(direction==="-"){

                    if(index===3 || index===4){
                        screenContent.savefile.settings.color.foreground[index-3]--;
                        if(screenContent.savefile.settings.color.foreground[index-3]<0)screenContent.savefile.settings.color.foreground[index-3]=0;
                    }

                    else if(index===5){
                        if(screen_settingsMenu.contrastCheck(-1,0,screenContent)){
                            screenContent.savefile.settings.color.foreground[index-3]--;
                        }
                    }

                    else if(index===6 || index===7){
                        screenContent.savefile.settings.color.background[index-6]--;
                        if(screenContent.savefile.settings.color.background[index-6]<0)screenContent.savefile.settings.color.background[index-6]=0;
                    }

                    else if(index===8){
                        if(screen_settingsMenu.contrastCheck(0,-1,screenContent)){
                            screenContent.savefile.settings.color.background[index-6]--;
                        }
                    }

                    //Refresh the color
                    color.setColor();
                    
                }

                //Reload the values and up-down arrows.
                screen_settingsMenu.valueLoader(context,screenContent,UID);
                screen_settingsMenu.upDownLoader(context,screenContent,UID,screen_settingsMenu.selectedSetting,true);
            }
        });
        
        return endpromise;
    },

    contrastCheck:function(FGoffset,BGoffset,screenContent){//Contrast check function to check if the contrast between the foreground and background color is good.
        let FGL=(screenContent.savefile.settings.color.foreground[2])+FGoffset;
        let BGL=(screenContent.savefile.settings.color.background[2])+BGoffset;
        if(FGL-BGL<15 || BGL<25 || FGL<40){//Compare lightness values.
            return false;
        }
        else{
            return true;
        }
    },

    upDownLoader:function(screenElement,screenContent,UID,index,state){//Up-down arrow loader function to turn on/off the arrows for a changeable value, and show possible changes in a value.

        //Remove all previous enabled/disabled classes.
        screenElement.querySelector("#_"+index+render.insertUID("_UID_menulistSettingArrow",UID)).classList.remove(
            render.insertUID("UID_arrows-upEnabled",UID),
            render.insertUID("UID_arrows-upDisabled",UID),
            render.insertUID("UID_arrows-downEnabled",UID),
            render.insertUID("UID_arrows-downDisabled",UID));
        
        //Check for possible changes and indicate them with arrow color.
        var value;
        if(index===2){

            if(screenContent.savefile.settings.mgFrequency===1) value=0;
            else value=screenContent.savefile.settings.mgFrequency;

        }

        else if(index===3 || index===4) value=screenContent.savefile.settings.color.foreground[index-3];
    
        else if(index===6 || index===7) value=screenContent.savefile.settings.color.background[index-6];

        else if(index===5){

            if(!screen_settingsMenu.contrastCheck(-1,0,screenContent) && !screen_settingsMenu.contrastCheck(1,0,screenContent)) value="none";
            else if(!screen_settingsMenu.contrastCheck(-1,0,screenContent)) value=0;
            else if(!screen_settingsMenu.contrastCheck(1,0,screenContent)) value=100;

        }

        else if(index===8){

            if(!screen_settingsMenu.contrastCheck(0,-1,screenContent) && !screen_settingsMenu.contrastCheck(0,1,screenContent)) value="none";
            else if(!screen_settingsMenu.contrastCheck(0,-1,screenContent)) value=0;
            else if(!screen_settingsMenu.contrastCheck(0,1,screenContent)) value=100;

        }

        if(state){

            if(value==="none"){
                screenElement.querySelector("#_"+index+render.insertUID("_UID_menulistSettingArrow",UID)).classList.add(render.insertUID("UID_arrows-upDisabled",UID),render.insertUID("UID_arrows-downDisabled",UID));
            }
            else if(value===0){
                screenElement.querySelector("#_"+index+render.insertUID("_UID_menulistSettingArrow",UID)).classList.add(render.insertUID("UID_arrows-upEnabled",UID),render.insertUID("UID_arrows-downDisabled",UID));
            }
            else if(value===100){
                screenElement.querySelector("#_"+index+render.insertUID("_UID_menulistSettingArrow",UID)).classList.add(render.insertUID("UID_arrows-upDisabled",UID),render.insertUID("UID_arrows-downEnabled",UID));
            }
            else{  
                screenElement.querySelector("#_"+index+render.insertUID("_UID_menulistSettingArrow",UID)).classList.add(render.insertUID("UID_arrows-upEnabled",UID),render.insertUID("UID_arrows-downEnabled",UID));
            }
            screenElement.querySelector("#_"+index+render.insertUID("_UID_menulistSettingArrows",UID)).classList.remove("r_invis");
        }
        else{
            screenElement.querySelector("#_"+index+render.insertUID("_UID_menulistSettingArrows",UID)).classList.add("r_invis");
        }
    },

    toggleLoader:function(screenElement,screenContent,UID){//Toggle loading function to load the state of toggelable settings.
        screenElement.querySelector("#_0"+render.insertUID("_UID_menulistSettingSwitch",UID)).classList.remove(render.insertUID("UID_switch-on",UID),render.insertUID("UID_switch-off",UID));
        screenElement.querySelector("#_1"+render.insertUID("_UID_menulistSettingSwitch",UID)).classList.remove(render.insertUID("UID_switch-on",UID),render.insertUID("UID_switch-off",UID));

        for(i=0;i<2;i++){

            if(screenContent.savefile.settings.toggle[i]){
                screenElement.querySelector("#_"+i+render.insertUID("_UID_menulistSettingSwitch",UID)).innerHTML=`<use xlink:href="#i-slider-on" />`;
                screenElement.querySelector("#_"+i+render.insertUID("_UID_menulistSettingSwitch",UID)).classList.add(render.insertUID("UID_switch-on",UID));
            }
            else{
                screenElement.querySelector("#_"+i+render.insertUID("_UID_menulistSettingSwitch",UID)).innerHTML=`<use xlink:href="#i-slider-off" />`;
                screenElement.querySelector("#_"+i+render.insertUID("_UID_menulistSettingSwitch",UID)).classList.add(render.insertUID("UID_switch-off",UID));
            }
        }
        return 0;
    },

    valueLoader:function(screenElement,screenContent,UID){//Value loading function to display the current values of color settings.
        screenElement.querySelector("#_2"+render.insertUID("_UID_setting_value",UID)).innerHTML=screenContent.savefile.settings.mgFrequency;

        for(i=3;i<=8;i++){

            if(i<=5){
                screenElement.querySelector("#_"+i+render.insertUID("_UID_setting_value",UID)).innerHTML=screenContent.savefile.settings.color.foreground[i-3];
            }
            else{
                screenElement.querySelector("#_"+i+render.insertUID("_UID_setting_value",UID)).innerHTML=screenContent.savefile.settings.color.background[i-6];
            } 
        }
        return 0;
    },

    minigameFrequencyLoader:function(screenElement,screenContent,UID){//Minigame frequency loader to display the minigame frequency value.
        let str=insertText("28");

        str=str.split("###").join((screenContent.savefile.settings.mgFrequency).toString());

        screenElement.querySelector("#"+render.insertUID("_2_UID_header_description_text",UID)).innerHTML="<p>"+str+"</p>";
    },

    languageLoader:function(screenElement,screenContent,UID){//Language loader to load the current text. 
        screenElement.querySelector("#"+render.insertUID("UID_menuHeaderTitle",UID)).innerHTML="<p>"+insertText("18")+"</p>";//Settings.


        screenElement.querySelector("#"+render.insertUID("_0_UID_menulistGroupHeader",UID)).innerHTML="<p>"+insertText("19")+"</p>";//Minigame settings.

        screenElement.querySelector("#"+render.insertUID("_0_UID_header_title",UID)).innerHTML="<p>"+insertText("3")+"</p>";//Truth or Dare.
        screenElement.querySelector("#"+render.insertUID("_0_UID_header_description_text",UID)).innerHTML="<p>"+insertText("26")+"</p>";

        screenElement.querySelector("#"+render.insertUID("_1_UID_header_title",UID)).innerHTML="<p>"+insertText("4")+"</p>";//Reaction test.
        screenElement.querySelector("#"+render.insertUID("_1_UID_header_description_text",UID)).innerHTML="<p>"+insertText("27")+"</p>";

        screenElement.querySelector("#"+render.insertUID("_2_UID_header_title",UID)).innerHTML="<p>"+insertText("20")+"</p>";//Minigame frequency.
        


        screenElement.querySelector("#"+render.insertUID("_1_UID_menulistGroupHeader",UID)).innerHTML="<p>"+insertText("21")+"</p>";//Foreground color.

        screenElement.querySelector("#"+render.insertUID("_3_UID_header_title",UID)).innerHTML="<p>"+insertText("23")+"</p>";//Hue.

        screenElement.querySelector("#"+render.insertUID("_4_UID_header_title",UID)).innerHTML="<p>"+insertText("24")+"</p>";//Saturation.

        screenElement.querySelector("#"+render.insertUID("_5_UID_header_title",UID)).innerHTML="<p>"+insertText("25")+"</p>";//Lightness.


        screenElement.querySelector("#"+render.insertUID("_2_UID_menulistGroupHeader",UID)).innerHTML="<p>"+insertText("22")+"</p>";//Background color.
    
        screenElement.querySelector("#"+render.insertUID("_6_UID_header_title",UID)).innerHTML="<p>"+insertText("23")+"</p>";//Hue.

        screenElement.querySelector("#"+render.insertUID("_7_UID_header_title",UID)).innerHTML="<p>"+insertText("24")+"</p>";//Saturation.

        screenElement.querySelector("#"+render.insertUID("_8_UID_header_title",UID)).innerHTML="<p>"+insertText("25")+"</p>";//Lightness.


        screenElement.querySelector("#"+render.insertUID("_3_UID_menulistGroupHeader",UID)).innerHTML="<p>"+insertText("31")+"</p>";//Language.

        screenElement.querySelector("#"+render.insertUID("_9_UID_header_title",UID)).innerHTML="<p>"+insertText("31")+"</p>";

        screenElement.querySelector("#"+render.insertUID("_9_UID_header_description_text",UID)).innerHTML="<p>"+insertText("32")+"</p>";

        screenElement.querySelector("#"+render.insertUID("_9_UID_setting_value",UID)).innerHTML=screenContent.savefile.settings.language;

        screen_settingsMenu.minigameFrequencyLoader(screenElement,screenContent,UID);
    },

    setContent:function(screenElement,screenContent,UID){//Set content function to run all loaders at once.
        this.toggleLoader(screenElement,screenContent,UID);
        this.valueLoader(screenElement,screenContent,UID);
        this.languageLoader(screenElement,screenContent,UID);
        return 0;
    },
    //Screen metadata.
    selectedSetting:0,

    settingSelected:false,
    
    //The stored HTML to be filled and displayed on the screen.
    HTMLbase:`
    <svg style="display: none" width="254mm" height="127mm" version="1.1" viewBox="0 0 25.4 12.7" preserveAspectRatio="xMinYMin meet" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <symbol id="i-slider-on">
                <g transform="translate(0 -284.3)">
                    <path d="m5.027 288.53v4.2333h10.187v-4.2333zm13.097 0v4.2333h1.7192v-4.2333z" style="fill:var(--svg-innercolor);"/>
                    <path transform="matrix(.26458 0 0 .26458 0 284.3)" d="m60.5 9.5v29.004h4.9961v-29.004h-4.9961zm-44.5 3.5v22h41.502v-2.0039h-38.504c-0.54916 0-0.99383-0.44693-0.99609-0.99609v-15.996c0-0.55219 0.4439-1.0016 0.99609-1.0039h38.504v-2h-41.502zm52.502 0v2h6.4961c0.55559 0 1.0058 0.4485 1.0039 1.0039v15.996c0 0.5523-0.45172 0.99829-1.0039 0.99609h-6.4961v2.0039h9.498v-22h-9.498z" style="fill:var(--svg-outercolor);"/>
                </g>
            </symbol>
            <symbol id="i-slider-off">
                <g transform="translate(0 -284.3)">
                    <g transform="translate(-1126.1 757.77)">
                        <path d="m1145.9-469.23v4.2333h-10.187v-4.2333zm-13.097 0v4.2333h-1.7192v-4.2333z" style="fill:var(--svg-innercolor);"/>
                        <path transform="matrix(.26458 0 0 .26458 1126.1 -473.47)" d="m28.504 9.5v29.004h4.9961v-29.004h-4.9961zm-12.504 3.5v22h9.498v-2.0039h-6.4961c-0.55219 0.002192-1.0039-0.44379-1.0039-0.99609v-15.996c-0.00189-0.5554 0.44832-1.0039 1.0039-1.0039h6.4961v-2h-9.498zm20.498 0v2h38.504c0.55219 0.002306 0.99609 0.45172 0.99609 1.0039v15.996c-0.002268 0.54916-0.44693 0.99609-0.99609 0.99609h-38.504v2.0039h41.502v-22h-41.502z" style="fill:var(--svg-outercolor);"/>
                    </g>
                </g>
            </symbol>
        </defs>
    </svg>
    <svg style="display: none" width="8.4667mm" height="12.7mm" version="1.1" viewBox="0 0 8.4667 12.7" preserveAspectRatio="xMinYMin meet" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <symbol id="i-updownarrow">
                <g transform="translate(0 -284.3)">
                    <path d="m2.1167 289.86h4.2333l-2.1166-3.175z" style="fill:var(--svg-upcolor);"/>
                    <path d="m2.1167 291.44h4.2333l-2.1166 3.175z" style="fill:var(--svg-downcolor);"/>
                </g>
            </symbol>
        </defs>
    </svg>

    <div id="_0_UID_menuHeader" class="UID_menuHeader">
        <div class="UID_menuHeaderTitle" id="UID_menuHeaderTitle">
            <p >SETTINGS</p>
        </div>
    </div>

    <div id="UID_menulistContainer">

        <div class="UID_menulistGroup">
            <div class="UID_menulistGroupHeader" id="_0_UID_menulistGroupHeader">
                <p>MINIMÄNGU SEADED</p>
            </div>

            <div class="UID_menulistItem">
                <div id="_0_UID_header_index" class="UID_menulistHeader UID_menulistHeaderActive">
                    <div class="UID_menulistHeaderTitle" id="_0_UID_header_title">
                        <p>TÕDE JA TEGU</p>
                    </div>
                    <div class="UID_menulistSettingSwitch">
                        <svg id="_0_UID_menulistSettingSwitch" width="254mm" height="127mm" version="1.1" viewBox="0 0 25.4 12.7" preserveAspectRatio="xMinYMin meet" class="UID_switch UID_switch-selected" ">
                            
                        </svg>
                    </div>
                </div>
                <div id="_0_UID_header_description" class="UID_menulistDescriptionBackground r_hidden_animatable_capable">
                    <div class="UID_menulistDescription">
                        <div class="UID_menulistDescriptionText" id="_0_UID_header_description_text">
                            <p>Parameetri kirjeldus (Kui vaja)</p>
                        </div>
                    </div>
                </div>
            </div>


            <div class="UID_menulistItem">
                <div id="_1_UID_header_index" class="UID_menulistHeader">
                    <div class="UID_menulistHeaderTitle" id="_1_UID_header_title">
                        <p>REAKTSIOONI TEST</p>
                    </div>
                    <div class="UID_menulistSettingSwitch">
                        <svg id="_1_UID_menulistSettingSwitch" width="254mm" height="127mm" version="1.1" viewBox="0 0 25.4 12.7" preserveAspectRatio="xMinYMin meet" class="UID_switch">
                            
                        </svg>
                    </div>
                </div>
                <div id="_1_UID_header_description" class="UID_menulistDescriptionBackground r_hidden_animatable r_hidden_animatable_capable">
                    <div class="UID_menulistDescription">
                        <div class="UID_menulistDescriptionText" id="_1_UID_header_description_text">
                            <p>Parameetri kirjeldus (Kui vaja)</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="UID_menulistItem">
                <div id="_2_UID_header_index" class="UID_menulistHeader">
                    <div class="UID_menulistHeaderTitle" id="_2_UID_header_title">
                        <p>SAGEDUS</p>
                    </div>
                    <div class="UID_menulistSettingValue">
                        <div id="_2_UID_menulistSettingArrows" class="UID_menulistSettingValueArrows r_invis">
                            <svg id="_2_UID_menulistSettingArrow" width="84.667mm" height="127mm" version="1.1" viewBox="0 0 8.4667 12.7" preserveAspectRatio="xMinYMin meet" class="">
                                <use xlink:href="#i-updownarrow" />
                            </svg>
                        </div>
                        <div class="UID_menulistSettingValueText">
                            <p id=_2_UID_setting_value>5</p>
                        </div>

                    </div>
                </div>
                <div id="_2_UID_header_description" class="UID_menulistDescriptionBackground r_hidden_animatable r_hidden_animatable_capable">
                    <div class="UID_menulistDescription">
                        <div class="UID_menulistDescriptionText" id="_2_UID_header_description_text">
                            <p>Parameetri kirjeldus (Kui vaja)</p>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>

        <div class="UID_menulistGroup">
            <div class="UID_menulistGroupHeader" id="_1_UID_menulistGroupHeader">
                <p>PEA VÄRV</p>
            </div>

            <div class="UID_menulistItem">
                <div id="_3_UID_header_index" class="UID_menulistHeader">
                    <div class="UID_menulistHeaderTitle" id="_3_UID_header_title">
                        <p>TOON</p>
                    </div>
                    <div class="UID_menulistSettingValue">
                        <div id="_3_UID_menulistSettingArrows" class="UID_menulistSettingValueArrows r_invis">
                            <svg id="_3_UID_menulistSettingArrow" width="84.667mm" height="127mm" version="1.1" viewBox="0 0 8.4667 12.7" preserveAspectRatio="xMinYMin meet" class="">
                                <use xlink:href="#i-updownarrow" />
                            </svg>
                        </div>
                        <div class="UID_menulistSettingValueText">
                            <p id=_3_UID_setting_value>32</p>
                        </div>

                    </div>
                </div>
                <div id="_3_UID_header_description" class="UID_menulistDescriptionBackground r_hidden_animatable r_hidden_animatable_capable">
                </div>
            </div>

            <div class="UID_menulistItem">
                <div id="_4_UID_header_index" class="UID_menulistHeader">
                    <div class="UID_menulistHeaderTitle" id="_4_UID_header_title">
                        <p>KÜLLASTUS</p>
                    </div>
                    <div class="UID_menulistSettingValue">
                        <div id="_4_UID_menulistSettingArrows" class="UID_menulistSettingValueArrows r_invis">
                            <svg id="_4_UID_menulistSettingArrow" width="84.667mm" height="127mm" version="1.1" viewBox="0 0 8.4667 12.7" preserveAspectRatio="xMinYMin meet" class="">
                                <use xlink:href="#i-updownarrow" />
                            </svg>
                        </div>
                        <div class="UID_menulistSettingValueText">
                            <p id=_4_UID_setting_value>0</p>
                        </div>

                    </div>
                </div>
                <div id="_4_UID_header_description" class="UID_menulistDescriptionBackground r_hidden_animatable r_hidden_animatable_capable">
                </div>
            </div>

            <div class="UID_menulistItem">
                <div id="_5_UID_header_index" class="UID_menulistHeader">
                    <div class="UID_menulistHeaderTitle" id="_5_UID_header_title">
                        <p>HELEDUS</p>
                    </div>
                    <div class="UID_menulistSettingValue">
                        <div id="_5_UID_menulistSettingArrows" class="UID_menulistSettingValueArrows r_invis">
                            <svg id="_5_UID_menulistSettingArrow" width="84.667mm" height="127mm" version="1.1" viewBox="0 0 8.4667 12.7" preserveAspectRatio="xMinYMin meet" class="">
                                <use xlink:href="#i-updownarrow" />
                            </svg>
                        </div>
                        <div class="UID_menulistSettingValueText">
                            <p id=_5_UID_setting_value>100</p>
                        </div>

                    </div>
                </div>
                <div id="_5_UID_header_description" class="UID_menulistDescriptionBackground r_hidden_animatable r_hidden_animatable_capable">
                    <!--<div class="UID_menulistDescription">
                        <div class="UID_menulistDescriptionText" id="_5_UID_header_description_text">
                            <p>Parameetri kirjeldus (Kui vaja)</p>
                        </div>
                    </div>-->
                </div>
            </div>
            
        </div>

        <div class="UID_menulistGroup">
            <div class="UID_menulistGroupHeader" id="_2_UID_menulistGroupHeader">
                <p>TAUSTA VÄRV</p>
            </div>

            <div class="UID_menulistItem">
                <div id="_6_UID_header_index" class="UID_menulistHeader">
                    <div class="UID_menulistHeaderTitle" id="_6_UID_header_title">
                        <p>TOON</p>
                    </div>
                    <div class="UID_menulistSettingValue">
                        <div id="_6_UID_menulistSettingArrows" class="UID_menulistSettingValueArrows r_invis">
                            <svg id="_6_UID_menulistSettingArrow" width="84.667mm" height="127mm" version="1.1" viewBox="0 0 8.4667 12.7" preserveAspectRatio="xMinYMin meet" class="">
                                <use xlink:href="#i-updownarrow" />
                            </svg>
                        </div>
                        <div class="UID_menulistSettingValueText">
                            <p id=_6_UID_setting_value>32</p>
                        </div>

                    </div>
                </div>
                <div id="_6_UID_header_description" class="UID_menulistDescriptionBackground r_hidden_animatable r_hidden_animatable_capable">
                </div>
            </div>

            <div class="UID_menulistItem">
                <div id="_7_UID_header_index" class="UID_menulistHeader">
                    <div class="UID_menulistHeaderTitle" id="_7_UID_header_title">
                        <p>KÜLLASTUS</p>
                    </div>
                    <div class="UID_menulistSettingValue">
                        <div id="_7_UID_menulistSettingArrows" class="UID_menulistSettingValueArrows r_invis">
                            <svg id="_7_UID_menulistSettingArrow" width="84.667mm" height="127mm" version="1.1" viewBox="0 0 8.4667 12.7" preserveAspectRatio="xMinYMin meet" class="">
                                <use xlink:href="#i-updownarrow" />
                            </svg>
                        </div>
                        <div class="UID_menulistSettingValueText">
                            <p id=_7_UID_setting_value>0</p>
                        </div>

                    </div>
                </div>
                <div id="_7_UID_header_description" class="UID_menulistDescriptionBackground r_hidden_animatable r_hidden_animatable_capable">
                </div>
            </div>

            <div class="UID_menulistItem">
                <div id="_8_UID_header_index" class="UID_menulistHeader">
                    <div class="UID_menulistHeaderTitle" id="_8_UID_header_title">
                        <p>HELEDUS</p>
                    </div>
                    <div class="UID_menulistSettingValue">
                        <div id="_8_UID_menulistSettingArrows" class="UID_menulistSettingValueArrows r_invis">
                            <svg id="_8_UID_menulistSettingArrow" width="84.667mm" height="127mm" version="1.1" viewBox="0 0 8.4667 12.7" preserveAspectRatio="xMinYMin meet" class="">
                                <use xlink:href="#i-updownarrow" />
                            </svg>
                        </div>
                        <div class="UID_menulistSettingValueText">
                            <p id=_8_UID_setting_value>100</p>
                        </div>

                    </div>
                </div>
                <div id="_8_UID_header_description" class="UID_menulistDescriptionBackground r_hidden_animatable r_hidden_animatable_capable">
                <!--<div class="UID_menulistDescription">
                        <div class="UID_menulistDescriptionText" id="_8_UID_header_description_text">
                            <p>Parameetri kirjeldus (Kui vaja)</p>
                        </div>
                    </div>-->
                </div>
            </div>
            
        </div>
        <div class="UID_menulistGroup">
            <div class="UID_menulistGroupHeader" id="_3_UID_menulistGroupHeader">
                <p>LANGUAGE</p>
            </div>

            <div class="UID_menulistItem">
                <div id="_9_UID_header_index" class="UID_menulistHeader">
                    <div class="UID_menulistHeaderTitle" id="_9_UID_header_title">
                        <p>LANGUAGE</p>
                    </div>
                    <div class="UID_menulistSettingValue">
                        <div id="_9_UID_menulistSettingArrows" class="UID_menulistSettingValueArrows r_invis">
                            <svg id="_9_UID_menulistSettingArrow" width="84.667mm" height="127mm" version="1.1" viewBox="0 0 8.4667 12.7" preserveAspectRatio="xMinYMin meet" class="">
                                <use xlink:href="#i-updownarrow" />
                            </svg>
                        </div>
                        <div class="UID_menulistSettingValueTextLanguage">
                            <p id=_9_UID_setting_value>ENG</p>
                        </div>

                    </div>
                </div>
                <div id="_9_UID_header_description" class="UID_menulistDescriptionBackground r_hidden_animatable r_hidden_animatable_capable">
                    <div class="UID_menulistDescription">
                        <div class="UID_menulistDescriptionText" id="_9_UID_header_description_text">
                            <p>Parameetri kirjeldus (Kui vaja)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</div>`
}