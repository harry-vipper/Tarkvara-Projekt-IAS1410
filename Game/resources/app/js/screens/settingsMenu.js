//Settings menu
var screen_settingsMenu;
screen_settingsMenu={
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
    {   
        this.selectedSetting=0;
        this.settingSelected=false;
        var end;
        var endpromise=new Promise((resolve) =>{
                end=resolve;
            }
        );
        var screenElement=document.createElement("div");

        render.strUID=function(str) {
            return str.split("UID").join(UID);
            };
        render.menuEntry={
            activate: function(index) {
                index=String(index);
                document.getElementById("_"+index+render.strUID("_UID_header_index")).classList.add(render.strUID("UID_menulistHeaderActive"));
                document.getElementById("_"+index+render.strUID("_UID_header_description")).classList.remove(render.strUID("r_hidden"));
                if(index<=1){
                    document.getElementById("_"+index+render.strUID("_UID_menulistSettingSwitch")).classList.add(render.strUID("UID_switch-selected"));
                }
            },
            deactivate: function(index) {
                index=String(index);
                document.getElementById("_"+index+render.strUID("_UID_header_index")).classList.remove(render.strUID("UID_menulistHeaderActive"));
                document.getElementById("_"+index+render.strUID("_UID_header_description")).classList.add(render.strUID("r_hidden"));
                if(index<=1){
                    document.getElementById("_"+index+render.strUID("_UID_menulistSettingSwitch")).classList.remove(render.strUID("UID_switch-selected"));
                }
            } 
        }      
        system.screen.loadResource("/resources/css/settingsMenu.css").then(
            (css)=>{style.innerHTML=css;
                /*if(fileCSS) {
                    system.screen.loadCSStoDOM("placeHolderDOMCSS", "resources/css/settingsMenu.css");
                }
                else{
                    style.innerHTML=css;
                }*/
        }).then(()=>{

            let str=this.HTMLbase;
            str=str.split("UID").join(UID);
    
            screenElement.setAttribute("id",UID+"_wrapper");
            screenElement.innerHTML=str;
            context.appendChild(screenElement);

            return this.setContent(screenElement,screenContent);
        }).then(()=>{            
            return render.fade.in(context);
        }).then(()=>{

            controls.key.set('up', 0, ()=>{changeSetting('-');}, "Eelmine");
            controls.key.set('down', 0, ()=>{changeSetting('+');}, "Järgmine");
            controls.key.set('confirm', 0, ()=>{selectSetting();}, "Vali");
            controls.key.set('left', 1000, ()=>{end({type:"gameSelectionMenu"});}, "Peamenüü");
            
            const scroller = new SweetScroll();
            
            function changeSetting(direction) {
                render.menuEntry.deactivate(screen_settingsMenu.selectedSetting);
                screen_settingsMenu.selectedSetting=calcNextIndex(
                    direction, 
                    screen_settingsMenu.selectedSetting, 
                    9
                );
                
                if(screen_settingsMenu.selectedSetting>=3){
                    var elementId="_"+screen_settingsMenu.selectedSetting+render.strUID("_UID_header_index");
                }
                else{
                    var elementId=render.strUID("_0_UID_menuHeader");
                }
                
                
                render.menuEntry.activate(screen_settingsMenu.selectedSetting);
                scroller.to(
                    ("#"+elementId)
                )

            }
            function calcNextIndex(direction, data, size) {
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
            function selectSetting(){
                if(screen_settingsMenu.selectedSetting<=1){
                    if(screenContent.savefile.content.settings.toggle[screen_settingsMenu.selectedSetting]){
                        screenContent.savefile.content.settings.toggle[screen_settingsMenu.selectedSetting]=0;
                    }
                    else {
                        screenContent.savefile.content.settings.toggle[screen_settingsMenu.selectedSetting]=1;
                    }
                    screen_settingsMenu.toggleLoader(screenElement,screenContent);
                }
                else{
                    if(screen_settingsMenu.settingSelected){
                        let contrast=screen_settingsMenu.contrastCheck(0,0);
                        if(contrast===true){
                            controls.key.clear.byKey("all");
                            system.screen.footer.clear();
                            screen_settingsMenu.upDownLoader(screenElement,screenContent,screen_settingsMenu.selectedSetting,false);
                            screen_settingsMenu.settingSelected=false;
        
                            controls.key.set('up', 0, ()=>{changeSetting('-');}, "Eelmine");
                            controls.key.set('down', 0, ()=>{changeSetting('+');}, "Järgmine");
                            controls.key.set('confirm', 0, ()=>{selectSetting();}, "Vali");
                            controls.key.set('left', 1000, ()=>{end({type:"gameSelectionMenu"});}, "Peamenüü");
                        }
                       
                    }
                    else{
                        controls.key.clear.byKey("all");
                        system.screen.footer.clear();
                        screen_settingsMenu.upDownLoader(screenElement,screenContent,screen_settingsMenu.selectedSetting,true);
                        screen_settingsMenu.settingSelected=true;
                        
                        controls.key.set('up', 0, ()=>{changeValue('+',screen_settingsMenu.selectedSetting);}, "Suurneda");
                        controls.key.set('down', 0, ()=>{changeValue('-',screen_settingsMenu.selectedSetting);}, "Vähenda");
                        controls.key.set('confirm', 0, ()=>{selectSetting();}, "Kinnita");
                    }
                }

            }
            function changeValue(direction,index){
                if(index===2){
                    if(direction==="+"){
                        screenContent.savefile.content.settings.mgFrequency++;
                        if(screenContent.savefile.content.settings.mgFrequency>100)screenContent.savefile.content.settings.mgFrequency=100;
                    }
                    else if(direction==="-"){
                        screenContent.savefile.content.settings.mgFrequency--;
                        if(screenContent.savefile.content.settings.mgFrequency<0)screenContent.savefile.content.settings.mgFrequency=0;
                    }
                }
                else if(direction==="+"){
                    if(index===3 || index===4){
                        screenContent.savefile.content.settings.color.foreground[index-3]++;
                        if(screenContent.savefile.content.settings.color.foreground[index-3]>100)screenContent.savefile.content.settings.color.foreground[index-3]=100;
                    }
                    else if(index===5){
                        if(screen_settingsMenu.contrastCheck(1,0)){
                            screenContent.savefile.content.settings.color.foreground[index-3]++;
                        }
                    }
                    else if(index===6 || index===7){
                        screenContent.savefile.content.settings.color.background[index-6]++;
                        if(screenContent.savefile.content.settings.color.background[index-6]>100)screenContent.savefile.content.settings.color.background[index-6]=100;
                    }
                    else if(index===8){
                        if(screen_settingsMenu.contrastCheck(0,1)){
                            screenContent.savefile.content.settings.color.background[index-6]++;
                        }
                    }
                    color.setColor();
                }
                else if(direction==="-"){
                    if(index===3 || index===4){
                        screenContent.savefile.content.settings.color.foreground[index-3]--;
                        if(screenContent.savefile.content.settings.color.foreground[index-3]<0)screenContent.savefile.content.settings.color.foreground[index-3]=0;
                    }
                    else if(index===5){
                        if(screen_settingsMenu.contrastCheck(-1,0)){
                            screenContent.savefile.content.settings.color.foreground[index-3]--;
                        }
                    }
                    else if(index===6 || index===7){
                        screenContent.savefile.content.settings.color.background[index-6]--;
                        if(screenContent.savefile.content.settings.color.background[index-6]<0)screenContent.savefile.content.settings.color.background[index-6]=0;
                    }
                    else if(index===8){
                        if(screen_settingsMenu.contrastCheck(0,-1)){
                            screenContent.savefile.content.settings.color.background[index-6]--;
                        }
                    }
                    color.setColor();
                    
                }
                screen_settingsMenu.valueLoader(screenElement,screenContent);
                screen_settingsMenu.upDownLoader(screenElement,screenContent,screen_settingsMenu.selectedSetting,true);
            }
        });
        
        return endpromise;
    },
    contrastCheck:function(FGoffset,BGoffset){
        let FGL=(file.savefile.content.settings.color.foreground[2])+FGoffset;
        let BGL=(file.savefile.content.settings.color.background[2])+BGoffset;
        console.log(FGL-BGL,BGL,FGL);
        if(FGL-BGL<15 || BGL<25 || FGL<40){
            return false;
        }
        else{
            return true;
        }
    },
    upDownLoader:function(screenElement,screenContent,index,state){

        screenElement.querySelector("#_"+index+render.strUID("_UID_menulistSettingArrow")).classList.remove(render.strUID("UID_arrows-upEnabled"),render.strUID("UID_arrows-upDisabled"),render.strUID("UID_arrows-downEnabled"),render.strUID("UID_arrows-downDisabled"));
        
        var value;
        if(index===2) value=screenContent.savefile.content.settings.mgFrequency; 

        else if(index===3 || index===4) value=screenContent.savefile.content.settings.color.foreground[index-3];
    
        else if(index===6 || index===7) value=screenContent.savefile.content.settings.color.background[index-6];

        else if(index===5){
            if(!screen_settingsMenu.contrastCheck(-1,0) && !screen_settingsMenu.contrastCheck(1,0)) value="none";
            else if(!screen_settingsMenu.contrastCheck(-1,0)) value=0;
            else if(!screen_settingsMenu.contrastCheck(1,0)) value=100;
        }

        else if(index===8){
            if(!screen_settingsMenu.contrastCheck(0,-1) && !screen_settingsMenu.contrastCheck(0,1)) value="none";
            else if(!screen_settingsMenu.contrastCheck(0,-1)) value=0;
            else if(!screen_settingsMenu.contrastCheck(0,1)) value=100;
        }

        if(state){
            if(value==="none"){
                screenElement.querySelector("#_"+index+render.strUID("_UID_menulistSettingArrow")).classList.add(render.strUID("UID_arrows-upDisabled"),render.strUID("UID_arrows-downDisabled"));
            }
            else if(value===0){
                screenElement.querySelector("#_"+index+render.strUID("_UID_menulistSettingArrow")).classList.add(render.strUID("UID_arrows-upEnabled"),render.strUID("UID_arrows-downDisabled"));
            }
            else if(value===100){
                screenElement.querySelector("#_"+index+render.strUID("_UID_menulistSettingArrow")).classList.add(render.strUID("UID_arrows-upDisabled"),render.strUID("UID_arrows-downEnabled"));
            }
            else{  
                screenElement.querySelector("#_"+index+render.strUID("_UID_menulistSettingArrow")).classList.add(render.strUID("UID_arrows-upEnabled"),render.strUID("UID_arrows-downEnabled"));
            }
            screenElement.querySelector("#_"+index+render.strUID("_UID_menulistSettingArrows")).classList.remove("r_invis");
        }
        else{
            screenElement.querySelector("#_"+index+render.strUID("_UID_menulistSettingArrows")).classList.add("r_invis");
        }
    },
    toggleLoader:function(screenElement,screenContent){
        screenElement.querySelector("#_0"+render.strUID("_UID_menulistSettingSwitch")).classList.remove(render.strUID("UID_switch-on"),render.strUID("UID_switch-off"));
        screenElement.querySelector("#_1"+render.strUID("_UID_menulistSettingSwitch")).classList.remove(render.strUID("UID_switch-on"),render.strUID("UID_switch-off"));
        for(i=0;i<2;i++){
            if(screenContent.savefile.content.settings.toggle[i]){
                screenElement.querySelector("#_"+i+render.strUID("_UID_menulistSettingSwitch")).innerHTML=`<use xlink:href="#i-slider-on" />`;
                screenElement.querySelector("#_"+i+render.strUID("_UID_menulistSettingSwitch")).classList.add(render.strUID("UID_switch-on"));
            }
            else{
                screenElement.querySelector("#_"+i+render.strUID("_UID_menulistSettingSwitch")).innerHTML=`<use xlink:href="#i-slider-off" />`;
                screenElement.querySelector("#_"+i+render.strUID("_UID_menulistSettingSwitch")).classList.add(render.strUID("UID_switch-off"));
            }
        }
        return 0;
    },
    valueLoader:function(screenElement,screenContent){
        screenElement.querySelector("#_2"+render.strUID("_UID_setting_value")).innerHTML=screenContent.savefile.content.settings.mgFrequency;
        for(i=3;i<=8;i++){
            if(i<=5){
                screenElement.querySelector("#_"+i+render.strUID("_UID_setting_value")).innerHTML=screenContent.savefile.content.settings.color.foreground[i-3];
            }
            else{
                screenElement.querySelector("#_"+i+render.strUID("_UID_setting_value")).innerHTML=screenContent.savefile.content.settings.color.background[i-6];
            } 
        }
        return 0;
    },
    setContent:function(screenElement,screenContent){
        this.toggleLoader(screenElement,screenContent);
        this.valueLoader(screenElement,screenContent);
        return 0;
    },
    selectedSetting:0,
    settingSelected:false,
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
        <div class="UID_menuHeaderTitle">
            <p>SEADED</p>
        </div>
    </div>

    <div id="UID_menulistContainer">

        <div class="UID_menulistGroup">
            <div class="UID_menulistGroupHeader">
                <p>MINIMÄNGU SEADED</p>
            </div>

            <div class="UID_menulistItem">
                <div id="_0_UID_header_index" class="UID_menulistHeader UID_menulistHeaderActive">
                    <div class="UID_menulistHeaderTitle">
                        <p>TÕDE JA TEGU</p>
                    </div>
                    <div class="UID_menulistSettingSwitch">
                        <svg id="_0_UID_menulistSettingSwitch" width="254mm" height="127mm" version="1.1" viewBox="0 0 25.4 12.7" preserveAspectRatio="xMinYMin meet" class="UID_switch UID_switch-selected" ">
                            
                        </svg>
                    </div>
                </div>
                <div id="_0_UID_header_description" class="UID_menulistDescriptionBackground ">
                    <div class="UID_menulistDescription">
                        <div class="UID_menulistDescriptionText">
                            <p>Parameetri kirjeldus (Kui vaja)</p>
                        </div>
                    </div>
                </div>
            </div>


            <div class="UID_menulistItem">
                <div id="_1_UID_header_index" class="UID_menulistHeader">
                    <div class="UID_menulistHeaderTitle">
                        <p>REAKTSIOONI TEST</p>
                    </div>
                    <div class="UID_menulistSettingSwitch">
                        <svg id="_1_UID_menulistSettingSwitch" width="254mm" height="127mm" version="1.1" viewBox="0 0 25.4 12.7" preserveAspectRatio="xMinYMin meet" class="UID_switch">
                            
                        </svg>
                    </div>
                </div>
                <div id="_1_UID_header_description" class="UID_menulistDescriptionBackground r_hidden">
                    <div class="UID_menulistDescription">
                        <div class="UID_menulistDescriptionText">
                            <p>Parameetri kirjeldus (Kui vaja)</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="UID_menulistItem">
                <div id="_2_UID_header_index" class="UID_menulistHeader">
                    <div class="UID_menulistHeaderTitle">
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
                <div id="_2_UID_header_description" class="UID_menulistDescriptionBackground r_hidden">
                    <div class="UID_menulistDescription">
                        <div class="UID_menulistDescriptionText">
                            <p>Parameetri kirjeldus (Kui vaja)</p>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>

        <div class="UID_menulistGroup">
            <div class="UID_menulistGroupHeader">
                <p>PEA VÄRV</p>
            </div>

            <div class="UID_menulistItem">
                <div id="_3_UID_header_index" class="UID_menulistHeader">
                    <div class="UID_menulistHeaderTitle">
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
                <div id="_3_UID_header_description" class="UID_menulistDescriptionBackground r_hidden">
                    <div class="UID_menulistDescription">
                        <div class="UID_menulistDescriptionText">
                            <p>Parameetri kirjeldus (Kui vaja)</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="UID_menulistItem">
                <div id="_4_UID_header_index" class="UID_menulistHeader">
                    <div class="UID_menulistHeaderTitle">
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
                <div id="_4_UID_header_description" class="UID_menulistDescriptionBackground r_hidden">
                    <div class="UID_menulistDescription">
                        <div class="UID_menulistDescriptionText">
                            <p>Parameetri kirjeldus (Kui vaja)</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="UID_menulistItem">
                <div id="_5_UID_header_index" class="UID_menulistHeader">
                    <div class="UID_menulistHeaderTitle">
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
                <div id="_5_UID_header_description" class="UID_menulistDescriptionBackground r_hidden">
                    <div class="UID_menulistDescription">
                        <div class="UID_menulistDescriptionText">
                            <p>Parameetri kirjeldus (Kui vaja)</p>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>

        <div class="UID_menulistGroup">
            <div class="UID_menulistGroupHeader">
                <p>TAUSTA VÄRV</p>
            </div>

            <div class="UID_menulistItem">
                <div id="_6_UID_header_index" class="UID_menulistHeader">
                    <div class="UID_menulistHeaderTitle">
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
                <div id="_6_UID_header_description" class="UID_menulistDescriptionBackground r_hidden">
                    <div class="UID_menulistDescription">
                        <div class="UID_menulistDescriptionText">
                            <p>Parameetri kirjeldus (Kui vaja)</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="UID_menulistItem">
                <div id="_7_UID_header_index" class="UID_menulistHeader">
                    <div class="UID_menulistHeaderTitle">
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
                <div id="_7_UID_header_description" class="UID_menulistDescriptionBackground r_hidden">
                    <div class="UID_menulistDescription">
                        <div class="UID_menulistDescriptionText">
                            <p>Parameetri kirjeldus (Kui vaja)</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="UID_menulistItem">
                <div id="_8_UID_header_index" class="UID_menulistHeader">
                    <div class="UID_menulistHeaderTitle">
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
                <div id="_8_UID_header_description" class="UID_menulistDescriptionBackground r_hidden">
                    <div class="UID_menulistDescription">
                        <div class="UID_menulistDescriptionText">
                            <p>Parameetri kirjeldus (Kui vaja)</p>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
        
    </div>
</div>`
}