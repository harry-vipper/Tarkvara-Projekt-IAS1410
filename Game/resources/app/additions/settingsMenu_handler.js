function settingsMenu_handler(context, style, controls, contentElementObject, localTimerIds ,screenSettings,gameData,settings,UID){
    refreshStyle();
    
    var selectedSetting=0;
    var screenElement=document.createElement("div");
    screenElement.setAttribute("id",UID+"body-wrapper");
    screenElement.setAttribute("class",UID+"body-wrapper");

    let content=`<div>
    <div class="`+UID+`settings-menu-title"><h1>Alammenüü</h1></div>
    <div class="`+UID+`settings-menu-element `+UID+`settings-menu-element-selected" id="`+UID+`setting-0"><h3>Minigame 1 <a id="`+UID+`setting-0-a"></a></h3></div>
    <div class="`+UID+`settings-menu-element `+UID+`settings-menu-element-not-selected" id="`+UID+`setting-1"><h3>Minigame 2 <a id="`+UID+`setting-1-a"></a></h3></div>
    <div class="`+UID+`settings-menu-element `+UID+`settings-menu-element-not-selected" id="`+UID+`setting-2"><h3>Mingi valik <a id="`+UID+`setting-2-a"></a></h3></div></div>

    <div>
    <div class="`+UID+`settings-menu-title"><h2>Peavärv</h2></div>
    <div class="`+UID+`settings-menu-element `+UID+`settings-menu-element-not-selected" id="`+UID+`setting-3"><h3>Toon <a class="`+UID+`setting-value" id="`+UID+`setting-value-3-a0">100</a><a class="`+UID+`setting-arrow" id="`+UID+`setting-arrow-3"></a></h3><div></div></div>
    <div class="`+UID+`settings-menu-element `+UID+`settings-menu-element-not-selected" id="`+UID+`setting-4"><h3>Küllastus <a class="`+UID+`setting-value" id="`+UID+`setting-value-4-a0">100</a><a class="`+UID+`setting-arrow" id="`+UID+`setting-arrow-4"></a></h3><div></div></div>
    <div class="`+UID+`settings-menu-element `+UID+`settings-menu-element-not-selected" id="`+UID+`setting-5"><h3>Heledus <a class="`+UID+`setting-value" id="`+UID+`setting-value-5-a0">100</a><a class="`+UID+`setting-arrow" id="`+UID+`setting-arrow-5"></a></h3><div></div></div></div>
    
    <div>
    <div class="`+UID+`settings-menu-title"><h2>Tausta värv</h2></div>
    <div class="`+UID+`settings-menu-element `+UID+`settings-menu-element-not-selected" id="`+UID+`setting-6"><h3>Toon <a class="`+UID+`setting-value" id="`+UID+`setting-value-6-a0">100</a><a class="`+UID+`setting-arrow" id="`+UID+`setting-arrow-6"></a></h3><div></div></div>
    <div class="`+UID+`settings-menu-element `+UID+`settings-menu-element-not-selected" id="`+UID+`setting-7"><h3>Küllastus <a class="`+UID+`setting-value" id="`+UID+`setting-value-7-a0">100</a><a class="`+UID+`setting-arrow" id="`+UID+`setting-arrow-7"></a></h3><div></div></div>
    <div class="`+UID+`settings-menu-element `+UID+`settings-menu-element-not-selected" id="`+UID+`setting-8"><h3>Heledus <a class="`+UID+`setting-value" id="`+UID+`setting-value-8-a0">100</a><a class="`+UID+`setting-arrow" id="`+UID+`setting-arrow-8"></a></h3><div></div></div></div>
    `; 

    screenElement.innerHTML=content;
    context.appendChild(screenElement);
    toggleLoader();
    colorLoader();
    var settingSelected=false

    function toggleLoader(){
        for(i=0;i<3;i++){
            if(settings.toggle[i]){
                document.getElementById(UID+"setting-"+i+"-a").innerHTML=`<svg class="`+UID+`toggle width="25.4mm" height="12.7mm" version="1.1" viewBox="0 0 25.4 12.7" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(0 -284.3)">
                    <path d="m5.027 288.53v4.2333h10.187v-4.2333zm13.097 0v4.2333h1.7192v-4.2333z" style="fill:var(--`+UID+`_svg-innercolor);"/>
                    <path transform="matrix(.26458 0 0 .26458 0 284.3)" d="m60.5 9.5v29.004h4.9961v-29.004h-4.9961zm-44.5 3.5v22h41.502v-2.0039h-38.504c-0.54916 0-0.99383-0.44693-0.99609-0.99609v-15.996c0-0.55219 0.4439-1.0016 0.99609-1.0039h38.504v-2h-41.502zm52.502 0v2h6.4961c0.55559 0 1.0058 0.4485 1.0039 1.0039v15.996c0 0.5523-0.45172 0.99829-1.0039 0.99609h-6.4961v2.0039h9.498v-22h-9.498z" style="fill:var(--`+UID+`_svg-outercolor);"/>
                </g>
                </svg> `;
            }
            else{
                document.getElementById(UID+"setting-"+i+"-a").innerHTML=`<svg class="`+UID+`toggle width="25.4mm" height="12.7mm" version="1.1" viewBox="0 0 25.4 12.7" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(0 -284.3)">
                    <g transform="translate(-1126.1 757.77)">
                    <path d="m1145.9-469.23v4.2333h-10.187v-4.2333zm-13.097 0v4.2333h-1.7192v-4.2333z" style="fill:var(--`+UID+`_svg-innercolor);"/>
                    <path transform="matrix(.26458 0 0 .26458 1126.1 -473.47)" d="m28.504 9.5v29.004h4.9961v-29.004h-4.9961zm-12.504 3.5v22h9.498v-2.0039h-6.4961c-0.55219 0.002192-1.0039-0.44379-1.0039-0.99609v-15.996c-0.00189-0.5554 0.44832-1.0039 1.0039-1.0039h6.4961v-2h-9.498zm20.498 0v2h38.504c0.55219 0.002306 0.99609 0.45172 0.99609 1.0039v15.996c-0.002268 0.54916-0.44693 0.99609-0.99609 0.99609h-38.504v2.0039h41.502v-22h-41.502z" style="fill:var(--`+UID+`_svg-outercolor);"/>
                    </g>
                </g>
                </svg> `;
                
            }
        }

    }
    function upDownLoader(state){
        if(state){
            document.getElementById(UID+"setting-arrow-"+selectedSetting).innerHTML=`<svg width="8.4667mm" height="12.7mm" version="1.1" viewBox="0 0 8.4667 12.7" xmlns="http://www.w3.org/2000/svg">
                    <g transform="translate(0 -284.3)">
                        <path d="m2.1167 289.86h4.2333l-2.1166-3.175"/>
                        <path d="m2.1167 291.44h4.2333l-2.1166 3.175z"/>
                    </g>
            </svg>
            `;
        }
        else{
            document.getElementById(UID+"setting-arrow-"+selectedSetting).innerHTML="";
        }
    }

    function colorLoader(){
        for(i=3;i<=8;i++){
            if(i<=5)document.getElementById(UID+"setting-value-"+i+"-a0").innerHTML=savefile.settings.color.foreground[i-3];
            else document.getElementById(UID+"setting-value-"+i+"-a0").innerHTML=savefile.settings.color.background[i-6];
        }
    }

    function refreshStyle(){
        footerColors();
        screenSettings["colors"].bgcolor=new screenSettings["colors"].Color100(settings.color.background[0],settings.color.background[1],settings.color.background[2]);
        screenSettings["colors"].fgcolor=new screenSettings["colors"].Color100(settings.color.foreground[0],settings.color.foreground[1],settings.color.foreground[2]);
        let palette=screenSettings["colors"].palette;
        palette=screenSettings["colors"].getPalette(screenSettings["colors"].fgcolor, screenSettings["colors"].bgcolor);
    

        style.innerHTML=`:root {
            --`+UID+`_fgColorDull: `+screenSettings.colors.css(palette.fg.dull)+`;
            --`+UID+`_fgColorDarkest: `+screenSettings.colors.css(palette.fg.darkest)+`;
            --`+UID+`_fgColorDark: `+screenSettings.colors.css(palette.fg.dark)+`;

            --`+UID+`_fgColor: `+screenSettings.colors.css(palette.fg.normal)+`;
            
            --`+UID+`_fgColorBright: `+screenSettings.colors.css(palette.fg.bright)+`;
            --`+UID+`_fgColorBrightest: `+screenSettings.colors.css(palette.fg.brightest)+`;
            --`+UID+`_fgColorBloom: `+screenSettings.colors.css(palette.fg.bloom)+`;


            --`+UID+`_bgColorDull: `+screenSettings.colors.css(palette.bg.dull)+`;
            --`+UID+`_bgColorDarkest: `+screenSettings.colors.css(palette.bg.darkest)+`;
            --`+UID+`_bgColorDark: `+screenSettings.colors.css(palette.bg.dark)+`;

            --`+UID+`_bgColor: `+screenSettings.colors.css(palette.bg.normal)+`;
            
            --`+UID+`_bgColorBright: `+screenSettings.colors.css(palette.bg.bright)+`;
            --`+UID+`_bgColorBrightest: `+screenSettings.colors.css(palette.bg.brightest)+`;
            --`+UID+`_bgColorBloom: `+screenSettings.colors.css(palette.bg.bloom)+`;
        }
        body {
            background:var(--`+UID+`_bgColor);
            overflow: hidden;
            margin: 0;
        }
        .`+UID+`body-wrapper{
            top: 6%;
            left: 0%;
            width: 100%;
            position: absolute;
        }   
        .`+UID+`settings-menu-title h1{
            color: var(--`+UID+`_fgColor);
            margin: auto;
            text-align: center;
        }
        .`+UID+`settings-menu-title h2{
            color: var(--`+UID+`_fgColor);
            margin: auto;
            text-align: center;
        }
        
        .`+UID+`settings-menu-element{
            margin: auto;
            margin-block-start: 1em;
            margin-block-end: 1em;
            height:3em;
            width: 80%;
        }

        .`+UID+`settings-menu-element h3{
            font-size:1.5em;
            margin: auto;
            margin-block-start: 0;
            margin-block-end: 0;
            line-height: 2em;
        }

        .`+UID+`settings-menu-element-selected {
            --`+UID+`_svg-innercolor:var(--`+UID+`_bgColorDarkest:);
            --`+UID+`_svg-outercolor:var(--`+UID+`_bgColorDarkest:);
            background: var(--`+UID+`_fgColor);
            color: var(--`+UID+`_bgColorDarkest:);
        }

        .`+UID+`settings-menu-element-not-selected {
            --`+UID+`_svg-innercolor:var(--`+UID+`_fgColor);
            --`+UID+`_svg-outercolor:var(--`+UID+`_fgColor);
            color: var(--`+UID+`_fgColor);
            background: var(--`+UID+`_bgColorDarkest);
        }

        .`+UID+`setting-value{
            float:right;
            margin-right:2%;
        }
        .`+UID+`setting-arrow{
            float:right;
            margin-right:1%;
        }
        .`+UID+`toggle{
            text-align: center;
            margin-block-start: 0;
            margin-block-end: 0;
            margin:auto;
            float:right;
        }  
        
        `;
    }

    function contrastCheck(){
        let B= (savefile.settings.color.background[0]*100 + savefile.settings.color.background[1]*450 + savefile.settings.color.background[2]*450)/1000; 
        let P= (savefile.settings.color.foreground[0]*100 + savefile.settings.color.foreground[1]*450 + savefile.settings.color.foreground[2]*450)/1000;
        console.log(Math.round(Math.abs(B - P)));
        if(Math.round(Math.abs(B - P))>0)return true;
        else return false;
    }

    function menuUp(){
        

        MenuSetState(UID+'setting-'+selectedSetting, 'not selected',UID+'settings-menu-element-selected',UID+'settings-menu-element-not-selected');
        selectedSetting--;
        if (selectedSetting===-1){selectedSetting=8;}
        MenuSetState(UID+'setting-'+selectedSetting, 'selected',UID+'settings-menu-element-selected',UID+'settings-menu-element-not-selected');

    }

    function menuDown(){
        
   
        MenuSetState(UID+'setting-'+selectedSetting, 'not selected',UID+'settings-menu-element-selected',UID+'settings-menu-element-not-selected');
        selectedSetting++;
        if (selectedSetting===9){selectedSetting=0;}
        MenuSetState(UID+'setting-'+selectedSetting, 'selected',UID+'settings-menu-element-selected',UID+'settings-menu-element-not-selected');

    }

    function selectSetting(){
        if(selectedSetting<=2){
            if(settings.toggle[selectedSetting])settings.toggle[selectedSetting]=0;
        
            else settings.toggle[selectedSetting]=1;

            toggleLoader()
        }
        else{//siia saab teha locki kui pole piisavalt kontrasti, siis ei saa välja
            var contrast=contrastCheck();
            if(settingSelected){
                if(contrast===true){
                    upDownLoader(false);
                    colorLoader();
                    refreshStyle();
                    controls.key.clear.byKey("all");
                    clearFooter();
                    settingSelected=false;

                    controls.key.set("up",0,menuUp,"Move Up");
                    controls.key.set("down",0,menuDown,"Move Down");
                    controls.key.set("left",0,gameMenu,"Game Menu");
                    controls.key.set("confirm",0,selectSetting,"Select Setting");
                }
               
            }
            else if(!settingSelected){
                controls.key.clear.byKey("all");
                clearFooter();
                upDownLoader(true);
                settingSelected=true;
                
                controls.key.set("up",0,increaseValue,"Increase");
                controls.key.set("down",0,decreaseValue,"Decrease");
                controls.key.set("confirm",0,selectSetting,"Un Select Setting");
            }
        }
        savefileSaver();
    }

    function increaseValue(){
        console.log("increase");
        if(selectedSetting>=3 && selectedSetting<=5){
            savefile.settings.color.foreground[selectedSetting-3]++;
            if(savefile.settings.color.foreground[selectedSetting-3]>100)savefile.settings.color.foreground[selectedSetting-3]=100;
        }
        if(selectedSetting>=6 && selectedSetting<=8){
            savefile.settings.color.background[selectedSetting-6]++;
            if(savefile.settings.color.background[selectedSetting-6]>100)savefile.settings.color.background[selectedSetting-6]=100;
        }
        colorLoader();
        
    }

    function decreaseValue(){
        console.log("decrease")
        if(selectedSetting>=3 && selectedSetting<=5){
            savefile.settings.color.foreground[selectedSetting-3]--;
            if(savefile.settings.color.foreground[selectedSetting-3]<0)savefile.settings.color.foreground[selectedSetting-3]=0;
        }
        if(selectedSetting>=6 && selectedSetting<=8){
            savefile.settings.color.background[selectedSetting-6]--;
            if(savefile.settings.color.background[selectedSetting-6]<0)savefile.settings.color.background[selectedSetting-6]=0;
        }
        colorLoader();
    }

    function gameMenu(){
        exitScreen("gameMenu");
    }
 
    controls.key.set("up",0,menuUp,"Move Up");
    controls.key.set("down",0,menuDown,"Move Down");
    controls.key.set("left",0,gameMenu,"Game Menu");
    controls.key.set("confirm",0,selectSetting,"Select Setting");

}