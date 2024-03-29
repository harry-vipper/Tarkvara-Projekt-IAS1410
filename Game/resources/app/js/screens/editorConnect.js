//The editor connect screen for connecting to the WiFi access point of the Raspberry Pi.
var screen_editorConnect={
    type: "editorConnect",
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
        var end;
        //Setting the endpromise to trigger when the end promise comes true.
        var endpromise=new Promise((resolve) =>{
                end=resolve;
            }
        );

        
        //Load the screen CSS to DOM or the style element.
        system.screen.loadResource("/resources/css/editorConnect.css").then((css)=>{
            if(fileCSS) {
                system.screen.loadCSStoDOM("resources/css/editorConnect.css");
            }
            else{
                style.innerHTML=css;
            }
        

        }).then(()=>{
            //Make a copy of the HTMLbase, replace the placeholders and set it into the needed element.
            let str=this.HTMLbase;
            str=render.insertUID(str,UID);
            context.innerHTML=str;

            return this.setContent(context,UID);


        }).then(()=>{
            //Fade in the screen
            return render.fade.in(context);


        }).then(()=>{
            //Check if the system is PI if yes change the access point name and password.
            if(SYSTEM==="PI"){
                file.apfile.save(this.generateName(true));
                const exec = require('child_process').exec;
                exec('sudo  /home/pi/APchange.sh');
            }
            controls.key.set('down', defaultHold, ()=>{end({type:"return"});}, insertText("45"),false,true);
        });
        return endpromise;
        
    },
    setContent:function(screenElement,UID){//The set content function to fill the required fields of the base string with current data.
        let i=0;
        render.footer.transparentize();
        screenElement.querySelector("#"+UID+"_desc_SSID").innerHTML=insertText("48");
        screenElement.querySelector("#"+UID+"_desc_PW").innerHTML=insertText("49");
        screenElement.querySelector("#"+UID+"_desc_URL").innerHTML=insertText("50");
        screenElement.querySelector("#"+UID+"_desc_END").innerHTML=insertText("51");
        screenElement.querySelector("#"+UID+"_desc_WPA").innerHTML=insertText("52");

        let networkElement=document.createElement("div");

        networkElement.classList.add(UID+"instructionImage_entry");
        
        let str=screen_editorConnect.networkHTML;
        str=str.split("UID").join(UID);
        str=str.split("###").join(i);
        networkElement.innerHTML=str;

        let input=screen_editorConnect.generateName(true);
        screenElement.querySelector("#"+UID+"_param_SSID").innerHTML=input.SSID;
        screenElement.querySelector("#"+UID+"_param_PW").innerHTML=input.PW;
        screenElement.querySelector("#"+UID+"_param_URL").innerHTML=`192.168.220.1`;

        networkElement.querySelector("#"+UID+"_entry_0_ssid").innerHTML=input.SSID;
        
        screenElement.querySelector("#"+UID+"_instructionImage_entries").appendChild(networkElement);

        //Generate random network names to fill the phone screen.
        let nrJokeNets=5;
        for(;i<nrJokeNets;i++){
            networkElement=document.createElement("div");

            networkElement.classList.add(UID+"instructionImage_entry",UID+"_instructionImage_otherEntry");
            
            let str=screen_editorConnect.networkHTML;

            str=render.insertUID(str,UID);

            str=str.split("###").join(i);

            networkElement.innerHTML=str;

            input=screen_editorConnect.generateName(false);
            
            networkElement.querySelector("#"+UID+"_entry_"+i+"_ssid").innerHTML=input.joke;
            screenElement.querySelector("#"+UID+"_instructionImage_entries").appendChild(networkElement);
        }
        return true;
    },
    generateName:function(random){//The generate name function to return a random network name or the set WiFi SSID and password.
        if(random){
            return {"SSID":"lauamäng","PW":"mynamejeff"}//SSID and password can be changed here, careful with special characters and lenght (min:8 max:63 char).
        }
        else{
            let words=[
                ['Petsi', 'Jaani', 'Mardo'],
                ['Giga', 'Kodu', 'võrgu'],
                ['Pauk', 'LAN', '1337']
            ];

            let output="";
            words.forEach(function(word){
                output+=word[randomIntFromInterval(0, word.length-1)];
            })

            return {"joke":output};
        }
    },
    //The stored HTML to be filled and displayed on the screen.
    HTMLbase:`
    <div id="screenContainer">
    <div class="UID_screenwrapper">
        <div class="UID_instructionContainer">
            <div class="UID_instruction_class">
                <div class="UID_instruction_group">
                    <p id="UID_desc_SSID">Ühenda oma nutiseade või sülearvuti WiFi võrguga</p>
                    <p id="UID_param_SSID" class="UID_param">testNet</p>
                </div>
                <div class="UID_instruction_group">
                    <p id="UID_desc_PW">Võrgu parool on:</p>
                    <p id="UID_param_PW" class="UID_param">testPas</p>
                    <p id="UID_desc_WPA" class="UID_param_other">WPA-2 Misiganes muud advanced settingud igaks juhuks</p>
                </div>
                
            </div>
            <div class="UID_instruction_class">
                <div class="UID_instruction_group">
                    <p id="UID_desc_URL">Ava brauseris leht</p>
                    <p id="UID_param_URL" class="UID_param">test.ee</p>
                </div>
            </div>
            <div class="UID_instruction_class">
                <div class="UID_instruction_group">
                    <p id="UID_desc_END">Lõpetades lae mängud seadmesse</p>
                </div>
            </div>
        </div>
        <div class="UID_instructionImage">
            <div class="UID_instructionImage_shadow">
                <div class="UID_instructionImage_shadowbox"></div>
            </div>
            
            <div class="UID_instructionImage_background">
                <svg preserveAspectRatio="xMinYMin meet" version="1.1" viewBox="0 0 328.08 656.17" xmlns="http://www.w3.org/2000/svg">
                    <rect x="18.521" y="13.229" width="291.04" height="624.42" ry="22.49" style="fill:#ffffff;paint-order:markers fill stroke"/>
                    <g transform="translate(21.167 338)">
                        <text transform="translate(0 -322.13)" x="16.930647" y="16.647165" style="fill:#3e3e3e;font-family:Now;font-size:10.583px;letter-spacing:0px;line-height:1.25;stroke-width:.26458;word-spacing:0px" xml:space="preserve">
                            <tspan x="16.930647" y="16.647165" style="fill:#3e3e3e;font-family:Roboto;font-size:9.525px;font-weight:500;stroke-width:.26458">22:48</tspan>
                        </text>
                        <rect x="231.51" y="-248.04" width="35.719" height="21.167" rx="10.583" ry="10.583" style="fill:#0097fe;paint-order:markers fill stroke"/>
                        <circle cx="256.65" cy="-237.46" r="7.4083" style="fill:#ffffff;paint-order:markers fill stroke"/>
                        <path d="m26.061-274.5-5.5562-5.2917 5.5562-5.2917" style="fill:none;paint-order:markers fill stroke;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5875;stroke:#191919"/>
                        <g style="fill:#000000" aria-label="Wi-Fi">
                            <path d="m136.43-277.13 1.3891-6.7965h1.5565l-2.0836 9.0289h-1.5007l-1.7177-6.5918-1.7549 6.5918h-1.5069l-2.0836-9.0289h1.5565l1.4015 6.7841 1.7239-6.7841h1.3146z" style="stroke-width:.26458"/>
                            <path d="m142-274.9h-1.5069v-6.7097h1.5069zm-1.5999-8.4522q0-0.34726 0.21704-0.5767 0.22324-0.22945 0.63252-0.22945t0.63252 0.22945q0.22324 0.22944 0.22324 0.5767 0 0.34107-0.22324 0.57051-0.22324 0.22324-0.63252 0.22324t-0.63252-0.22324q-0.21704-0.22944-0.21704-0.57051z" style="stroke-width:.26458"/>
                            <path d="m146.57-278.13h-3.2556v-1.2154h3.2556z" style="stroke-width:.26458"/>
                            <path d="m153.16-278.72h-3.6339v3.8261h-1.5689v-9.0289h5.7361v1.265h-4.1672v2.6851h3.6339z" style="stroke-width:.26458"/>
                            <path d="m156.38-274.9h-1.5069v-6.7097h1.5069zm-1.5999-8.4522q0-0.34726 0.21704-0.5767 0.22324-0.22945 0.63252-0.22945t0.63252 0.22945q0.22324 0.22944 0.22324 0.5767 0 0.34107-0.22324 0.57051-0.22324 0.22324-0.63252 0.22324t-0.63252-0.22324q-0.21704-0.22944-0.21704-0.57051z" style="stroke-width:.26458"/>
                        </g>
                        <g style="fill:#000000" aria-label="Wi-Fi">
                            <path d="m21.017-235.86 0.14469 0.99219 0.21187-0.894 1.4883-5.2503h0.83716l1.4521 5.2503 0.20671 0.9095 0.1602-1.0128 1.1679-5.147h0.99736l-1.8242 7.5241h-0.90434l-1.5503-5.4829-0.11886-0.57361-0.11886 0.57361-1.6071 5.4829h-0.90434l-1.819-7.5241h0.99219z" style="stroke-width:.26458"/>
                            <path d="m29.667-233.49h-0.95601v-5.5914h0.95601zm-1.0335-7.0745q0-0.23255 0.13953-0.39274 0.14469-0.1602 0.42375-0.1602t0.42375 0.1602q0.14469 0.16019 0.14469 0.39274 0 0.23254-0.14469 0.38757t-0.42375 0.15503-0.42375-0.15503q-0.13953-0.15503-0.13953-0.38757z" style="stroke-width:.26458"/>
                            <path d="m33.181-236.3h-2.5218v-0.78031h2.5218z" style="stroke-width:.26458"/>
                            <path d="m38.406-236.81h-3.1574v3.3228h-0.99219v-7.5241h4.6612v0.81649h-3.669v2.5735h3.1574z" style="stroke-width:.26458"/>
                            <path d="m40.995-233.49h-0.95601v-5.5914h0.95601zm-1.0335-7.0745q0-0.23255 0.13953-0.39274 0.14469-0.1602 0.42375-0.1602t0.42375 0.1602q0.14469 0.16019 0.14469 0.39274 0 0.23254-0.14469 0.38757t-0.42375 0.15503-0.42375-0.15503q-0.13953-0.15503-0.13953-0.38757z" style="stroke-width:.26458"/>
                        </g>
                    </g>
                    <g transform="translate(21.167 338)" style="fill:#8c92af" aria-label="AVAILABLE NETWORKS">
                        <path d="m22.419-62.883h-2.2831l-0.47766 1.3723h-1.0646l2.2264-5.8939h0.91889l2.2304 5.8939h-1.0687zm-1.9957-0.82579h1.7082l-0.85412-2.445z" style="fill:#8c92af;stroke-width:.26458"/>
                        <path d="m26.41-62.794 1.4978-4.6107h1.1253l-2.1211 5.8939h-0.99176l-2.113-5.8939h1.1213z" style="fill:#8c92af;stroke-width:.26458"/>
                        <path d="m32.685-62.883h-2.2831l-0.47766 1.3723h-1.0646l2.2264-5.8939h0.91889l2.2304 5.8939h-1.0687zm-1.9957-0.82579h1.7083l-0.85412-2.445z" style="fill:#8c92af;stroke-width:.26458"/>
                        <path d="m35.988-61.51h-1.0201v-5.8939h1.0201z" style="fill:#8c92af;stroke-width:.26458"/>
                        <path d="m38.279-62.328h2.6757v0.81769h-3.6999v-5.8939h1.0241z" style="fill:#8c92af;stroke-width:.26458"/>
                        <path d="m45.12-62.883h-2.2831l-0.47766 1.3723h-1.0646l2.2264-5.8939h0.91889l2.2304 5.8939h-1.0687zm-1.9957-0.82579h1.7082l-0.85412-2.445z" style="fill:#8c92af;stroke-width:.26458"/>
                        <path d="m47.343-61.51v-5.8939h2.0199q0.99985 0 1.522 0.40075 0.52219 0.40075 0.52219 1.1942 0 0.4048-0.21859 0.72864-0.21859 0.32384-0.63958 0.50195 0.47766 0.12954 0.73673 0.48981 0.26312 0.35622 0.26312 0.85817 0 0.82984-0.53433 1.2751-0.53029 0.44528-1.522 0.44528zm1.0241-2.6595v1.8418h1.1375q0.48171 0 0.75292-0.23883 0.27122-0.23883 0.27122-0.66387 0-0.91889-0.93913-0.93913zm0-0.75292h1.0039q0.47766 0 0.74483-0.21454 0.27122-0.21859 0.27122-0.61529 0-0.43718-0.25098-0.63149-0.24693-0.1943-0.77317-0.1943h-0.9958z" style="fill:#8c92af;stroke-width:.26458"/>
                        <path d="m53.597-62.328h2.6757v0.81769h-3.6999v-5.8939h1.0241z" style="fill:#8c92af;stroke-width:.26458"/>
                        <path d="m60.503-64.142h-2.4207v1.8135h2.8295v0.81769h-3.8537v-5.8939h3.8253v0.82579h-2.8012v1.6273h2.4207z" style="fill:#8c92af;stroke-width:.26458"/>
                        <path d="m68.501-61.51h-1.0241l-2.6271-4.1816v4.1816h-1.0241v-5.8939h1.0241l2.6352 4.1978v-4.1978h1.016z" style="fill:#8c92af;stroke-width:.26458"/>
                        <path d="m73.165-64.142h-2.4207v1.8135h2.8295v0.81769h-3.8537v-5.8939h3.8253v0.82579h-2.8012v1.6273h2.4207z" style="fill:#8c92af;stroke-width:.26458"/>
                        <path d="m78.755-66.579h-1.8378v5.0681h-1.016v-5.0681h-1.8216v-0.82579h4.6754z" style="fill:#8c92af;stroke-width:.26458"/>
                        <path d="m84.22-62.968 0.90675-4.4366h1.016l-1.3601 5.8939h-0.97961l-1.1213-4.303-1.1456 4.303h-0.98366l-1.3601-5.8939h1.016l0.91484 4.4285 1.1253-4.4285h0.85817z" style="fill:#8c92af;stroke-width:.26458"/>
                        <path d="m91.603-64.304q0 0.86627-0.29955 1.522-0.29955 0.65173-0.85817 1.0039-0.55457 0.34813-1.2792 0.34813-0.71649 0-1.2792-0.34813-0.55862-0.35218-0.86627-0.99985-0.3036-0.64768-0.30765-1.4937v-0.33194q0-0.86222 0.3036-1.522 0.30765-0.65982 0.86222-1.0079 0.55862-0.35218 1.2792-0.35218t1.2751 0.34813q0.55862 0.34408 0.86222 0.9958 0.3036 0.64768 0.30765 1.5099zm-1.0241-0.30765q0-0.97961-0.37242-1.5018-0.36837-0.52219-1.0484-0.52219-0.66387 0-1.0403 0.52219-0.37241 0.51814-0.38051 1.4694v0.34003q0 0.97152 0.37646 1.5018 0.38051 0.53029 1.0525 0.53029 0.68006 0 1.0444-0.51814 0.36837-0.51814 0.36837-1.5139z" style="fill:#8c92af;stroke-width:.26458"/>
                        <path d="m94.797-63.781h-1.1415v2.2709h-1.0241v-5.8939h2.0726q1.0201 0 1.5747 0.45742 0.55458 0.45742 0.55458 1.3237 0 0.59101-0.28741 0.99176-0.28336 0.3967-0.79341 0.61125l1.3237 2.4571v0.05262h-1.097zm-1.1415-0.82174h1.0525q0.51814 0 0.8096-0.25907 0.29146-0.26312 0.29146-0.71649 0-0.47361-0.27122-0.73269-0.26717-0.25907-0.8015-0.26717h-1.0808z" style="fill:#8c92af;stroke-width:.26458"/>
                        <path d="m99.505-64.057-0.66792 0.7084v1.8378h-1.0241v-5.8939h1.0241v2.7648l0.56672-0.7003 1.7244-2.0645h1.2387l-2.19 2.611 2.3154 3.2829h-1.2144z" style="fill:#8c92af;stroke-width:.26458"/>
                        <path d="m106.12-63.028q0-0.38861-0.27526-0.5991-0.27122-0.2105-0.98366-0.42504-0.71245-0.21454-1.1334-0.47766-0.80555-0.506-0.80555-1.3196 0-0.71245 0.57886-1.1739 0.58291-0.46147 1.5099-0.46147 0.6153 0 1.097 0.22669 0.48171 0.22669 0.75697 0.64768 0.27526 0.41694 0.27526 0.92699h-1.0201q0-0.46147-0.29145-0.72054-0.28741-0.26312-0.82579-0.26312-0.50195 0-0.78126 0.21454-0.27527 0.21454-0.27527 0.5991 0 0.32384 0.29955 0.54243 0.29955 0.21454 0.98771 0.42099 0.68816 0.2024 1.1051 0.46552 0.41694 0.25907 0.61125 0.5991 0.1943 0.33598 0.1943 0.78936 0 0.73673-0.56672 1.1739-0.56267 0.43314-1.5301 0.43314-0.63958 0-1.178-0.23478-0.53433-0.23883-0.83389-0.65577-0.2955-0.41694-0.2955-0.97152h1.0241q0 0.50195 0.33194 0.77721 0.33193 0.27526 0.95127 0.27526 0.53434 0 0.80151-0.21454 0.27121-0.21859 0.27121-0.57481z" style="fill:#8c92af;stroke-width:.26458"/>
                    </g>
                    <g transform="translate(21.167 338)" style="fill:#8c92af" aria-label="CONNECTED">
                        <path d="m23.617-169.53q-0.08906 0.94318-0.69625 1.4735-0.6072 0.52624-1.6151 0.52624-0.70435 0-1.2427-0.33194-0.53433-0.33598-0.82579-0.95127-0.29146-0.6153-0.3036-1.4289v-0.55053q0-0.83389 0.2955-1.4694t0.84603-0.97961q0.55457-0.34408 1.2792-0.34408 0.97556 0 1.5706 0.53028 0.59505 0.53029 0.69221 1.4978h-1.0201q-0.07286-0.63553-0.37242-0.91485-0.2955-0.28335-0.87032-0.28335-0.66792 0-1.0282 0.4898-0.35622 0.48576-0.36432 1.4289v0.52219q0 0.95533 0.34003 1.4573 0.34408 0.50195 1.0039 0.50195 0.60315 0 0.90675-0.27122 0.3036-0.27121 0.38456-0.9027z" style="fill:#8c92af;stroke-width:.26458"/>
                        <path d="m29.232-170.4q0 0.86627-0.29955 1.522-0.29955 0.65173-0.85817 1.0039-0.55457 0.34813-1.2792 0.34813-0.71649 0-1.2792-0.34813-0.55862-0.35217-0.86627-0.99985-0.3036-0.64768-0.30765-1.4937v-0.33193q0-0.86223 0.3036-1.522 0.30765-0.65982 0.86222-1.008 0.55862-0.35217 1.2792-0.35217 0.72054 0 1.2751 0.34813 0.55862 0.34407 0.86222 0.9958 0.3036 0.64768 0.30765 1.5099zm-1.0241-0.30765q0-0.97961-0.37242-1.5018-0.36837-0.52219-1.0484-0.52219-0.66387 0-1.0403 0.52219-0.37242 0.51814-0.38051 1.4694v0.34003q0 0.97151 0.37646 1.5018 0.38051 0.53029 1.0525 0.53029 0.68006 0 1.0444-0.51815 0.36837-0.51814 0.36837-1.5139z" style="fill:#8c92af;stroke-width:.26458"/>
                        <path d="m34.935-167.61h-1.0241l-2.6271-4.1816v4.1816h-1.0241v-5.8939h1.0241l2.6352 4.1978v-4.1978h1.016z" style="fill:#8c92af;stroke-width:.26458"/>
                        <path d="m40.829-167.61h-1.0241l-2.6271-4.1816v4.1816h-1.0241v-5.8939h1.0241l2.6352 4.1978v-4.1978h1.016z" style="fill:#8c92af;stroke-width:.26458"/>
                        <path d="m45.493-170.24h-2.4207v1.8135h2.8295v0.8177h-3.8537v-5.8939h3.8253v0.82579h-2.8012v1.6273h2.4207z" style="fill:#8c92af;stroke-width:.26458"/>
                        <path d="m51.241-169.53q-0.08906 0.94318-0.69625 1.4735-0.6072 0.52624-1.6151 0.52624-0.70435 0-1.2427-0.33194-0.53434-0.33598-0.82579-0.95127-0.29146-0.6153-0.3036-1.4289v-0.55053q0-0.83389 0.2955-1.4694t0.84603-0.97961q0.55457-0.34408 1.2792-0.34408 0.97556 0 1.5706 0.53028 0.59505 0.53029 0.6922 1.4978h-1.0201q-0.07286-0.63553-0.37242-0.91485-0.2955-0.28335-0.87032-0.28335-0.66792 0-1.0282 0.4898-0.35622 0.48576-0.36432 1.4289v0.52219q0 0.95533 0.34003 1.4573 0.34408 0.50195 1.0039 0.50195 0.60315 0 0.90675-0.27122 0.3036-0.27121 0.38456-0.9027z" style="fill:#8c92af;stroke-width:.26458"/>
                        <path d="m56.297-172.68h-1.8378v5.0681h-1.016v-5.0681h-1.8216v-0.82579h4.6754z" style="fill:#8c92af;stroke-width:.26458"/>
                        <path d="m60.519-170.24h-2.4207v1.8135h2.8295v0.8177h-3.8537v-5.8939h3.8253v0.82579h-2.8012v1.6273h2.4207z" style="fill:#8c92af;stroke-width:.26458"/>
                        <path d="m61.77-167.61v-5.8939h1.7406q0.78126 0 1.3844 0.34813 0.6072 0.34812 0.93913 0.9877 0.33194 0.63959 0.33194 1.4654v0.2955q0 0.83793-0.33598 1.4735-0.33194 0.63553-0.95128 0.97961-0.61529 0.34408-1.4127 0.34408zm1.0241-5.0681v4.2504h0.66792q0.80555 0 1.2346-0.50195 0.43314-0.50599 0.44123-1.4492v-0.32788q0-0.95938-0.41694-1.4654-0.41694-0.506-1.2103-0.506z" style="fill:#8c92af;stroke-width:.26458"/>
                    </g>
                    <g transform="translate(21.167 338)">
                        <path d="m27.781-132.29a4.7625 4.7625 0 0 0-3.2298 1.2682l0.93638 0.93636a3.4396 3.4396 0 0 1 2.2934-0.88159 3.4396 3.4396 0 0 1 2.2939 0.88109l0.93483-0.93483a4.7625 4.7625 0 0 0-3.2287-1.2692z" style="fill:#1593e8;paint-order:markers fill stroke"/>
                        <path d="m27.781-134.93a7.4083 7.4083 0 0 0-5.102 2.0417l0.93638 0.93638a6.0854 6.0854 0 0 1 4.1656-1.6552 6.0854 6.0854 0 0 1 4.1636 1.6573l0.93483-0.93483a7.4083 7.4083 0 0 0-5.0984-2.0454z" style="fill:#1593e8;paint-order:markers fill stroke"/>
                        <path d="m27.781-137.58a10.054 10.054 0 0 0-6.9743 2.8153l0.93586 0.93586a8.7312 8.7312 0 0 1 6.0384-2.4283 8.7312 8.7312 0 0 1 6.0332 2.4335l0.93483-0.93483a10.054 10.054 0 0 0-6.968-2.8215z" style="fill:#1593e8;paint-order:markers fill stroke"/>
                        <path d="m27.781-129.64a2.1167 2.1167 0 0 0-1.357 0.49506l1.357 1.357 1.3586-1.3586a2.1167 2.1167 0 0 0-1.3586-0.4935z" style="fill:#1593e8;paint-order:markers fill stroke"/>
                        <text x="47.095833" y="-134.27086" style="fill:#1d8ede;font-family:Now;font-size:10.583px;letter-spacing:0px;line-height:1.25;stroke-width:.26458;word-spacing:0px" xml:space="preserve">
                            <tspan x="47.095833" y="-134.27086" style="fill:#1d8ede;font-family:Roboto;stroke-width:.26458">Kaitsepolitsei</tspan>
                        </text>
                        <rect x="113.77" y="-141.94" width="30.162" height="8.4667" rx="1.3229" ry="1.3229" style="fill:none;paint-order:markers fill stroke;stroke-linejoin:round;stroke-width:.44979;stroke:#7f7f7f"/>
                        <text x="115.54265" y="-135.32919" style="fill:#7f7f7f;font-family:Now;font-size:10.583px;letter-spacing:0px;line-height:1.25;stroke-width:.26458;word-spacing:0px" xml:space="preserve">
                            <tspan x="115.54265" y="-135.32919" style="fill:#7f7f7f;font-family:Roboto;font-size:7.0556px;stroke-width:.26458">2.4G/5G</tspan>
                        </text>
                        <path d="m235.21-137.05c-1.3089 0-2.3807 1.0718-2.3807 2.3807h-5.1e-4v1.3229h-0.52917c-0.43974 0-0.79375 0.35401-0.79375 0.79375v3.4396c0 0.43974 0.35401 0.79375 0.79375 0.79375h5.8208c0.43974 0 0.79375-0.35401 0.79375-0.79375v-3.4396c0-0.43974-0.35401-0.79375-0.79375-0.79375h-0.52916v-1.3229c0-1.3089-1.0724-2.3807-2.3812-2.3807zm0 1.0588c0.7369 0 1.3224 0.585 1.3224 1.3219h5.1e-4v1.3229h-2.6458v-1.3229h1e-3c0-0.73689 0.585-1.3219 1.3219-1.3219z" style="color-rendering:auto;color:#000000;dominant-baseline:auto;fill:#808080;font-feature-settings:normal;font-variant-alternates:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-variant-numeric:normal;font-variant-position:normal;image-rendering:auto;isolation:auto;mix-blend-mode:normal;paint-order:markers fill stroke;shape-padding:0;shape-rendering:auto;solid-color:#000000;text-decoration-color:#000000;text-decoration-line:none;text-decoration-style:solid;text-indent:0;text-orientation:mixed;text-transform:none;white-space:normal"/>
                        <circle cx="258.63" cy="-132.42" r="8.599" style="fill:#f0f0f0;paint-order:markers fill stroke"/>
                        <path d="m257.18-135.99 3.4396 3.4396-3.4396 3.4396" style="fill:none;paint-order:markers fill stroke;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.3229;stroke:#adadad"/>
                        <text x="47.095833" y="-122.3646" style="fill:#1d8ede;font-family:Now;font-size:10.583px;letter-spacing:0px;line-height:1.25;stroke-width:.26458;word-spacing:0px" xml:space="preserve">
                            <tspan x="47.095833" y="-122.3646" style="fill:#1d8ede;font-family:Roboto;font-size:8.8194px;stroke-width:.26458">Connected</tspan>
                        </text>
                    </g>
                    <path d="m39.688 243.42h248.71" style="fill:none;paint-order:markers fill stroke;stroke-linejoin:round;stroke-width:.52917;stroke:#adadad"/>
                    <g transform="translate(21.167 15.875)">
                        <path transform="matrix(.26458 0 0 .26458 -21.167 -15.875)" d="m160 30c-60.94 0-110 49.06-110 110v2180c0 60.94 49.06 110 110 110h920c60.94 0 110-49.06 110-110v-2180c0-60.94-49.06-110-110-110h-920zm0 30h320c55 0 62.5 18.75 80 37.5s25 37.5 60 37.5 42.5-18.75 60-37.5 25-37.5 80-37.5h320c44.32 0 80 35.68 80 80v2180c0 44.32-35.68 80-80 80h-920c-44.32 0-80-35.68-80-80v-2180c0-44.32 35.68-80 80-80z" style="fill:#000000;paint-order:markers fill stroke"/>
                    </g>
                    <rect transform="translate(21.167 338)" x="252.68" y="-311.54" width="14.287" height="4.7625" rx="2.3813" ry="2.3813" style="fill:#e6e6e6;paint-order:markers fill stroke"/>
                    <path transform="translate(21.167 338)" d="m241.04-313.1a8.3989 8.3989 0 0 0-5.826 2.3518l0.78179 0.78178a7.2937 7.2937 0 0 1 5.0442-2.0285 7.2937 7.2937 0 0 1 5.0399 2.0328l0.78092-0.78092a8.3989 8.3989 0 0 0-5.8208-2.357zm0 2.2102a6.1886 6.1886 0 0 0-4.262 1.7056l0.78222 0.78222a5.0835 5.0835 0 0 1 3.4798-1.3827 5.0835 5.0835 0 0 1 3.4781 1.3844l0.78092-0.78092a6.1886 6.1886 0 0 0-4.259-1.7086zm0 2.2102a3.9784 3.9784 0 0 0-2.698 1.0594l0.78221 0.7822a2.8733 2.8733 0 0 1 1.9158-0.73645 2.8733 2.8733 0 0 1 1.9162 0.73603l0.78092-0.78092a3.9784 3.9784 0 0 0-2.6972-1.0602zm0 2.2102a1.7682 1.7682 0 0 0-1.1336 0.41356l1.1336 1.1336 1.1349-1.1349a1.7682 1.7682 0 0 0-1.1349-0.41226z" style="fill:#000000;paint-order:markers fill stroke"/>
                    <path transform="translate(21.167 338)" d="m244.48-307.04v1.3229h-0.52917l1.0583 1.3229v-2.6458z" style="fill:#3e3e3e;paint-order:markers fill stroke"/>
                    <path transform="translate(21.167 338)" d="m246.06-304.4v-1.3229h0.52917l-1.0583-1.3229v2.6458z" style="fill:#9c9c9c;paint-order:markers fill stroke"/>
                    <rect transform="translate(21.167 338)" x="251.09" y="-312.86" width="17.462" height="7.4083" rx="3.7042" ry="3.7042" style="fill:none;paint-order:markers fill stroke;stroke-linejoin:round;stroke-width:.60854;stroke:#393939"/>
                    <g transform="translate(21.167 338)" style="fill:#393939" aria-label="69">
                        <path d="m259.27-308.41c-0.0159-0.89694-0.77788-1.5399-1.5399-1.5954-0.0952 0-0.1905 8e-3 -0.26987 0.0238l1.2621-1.5637h-0.90487l-1.5954 2.1114c-0.23019 0.3175-0.40481 0.68263-0.38894 1.1033 0.0159 0.91282 0.80169 1.6272 1.7542 1.6034 0.92869-0.0238 1.6986-0.75406 1.6828-1.6828zm-1.6828 1.0001c-0.57944 0.0159-0.98425-0.37306-1.0081-0.92075-0.0159-0.5715 0.36512-1.0081 0.93662-1.0319 0.5715-0.0159 0.99219 0.38894 1.0081 0.96044 0.0238 0.53975-0.36512 0.96837-0.93662 0.99218z" style="fill:#393939;stroke-width:.26458"/>
                        <path d="m263.28-309.99c-0.0159-0.91281-0.80963-1.6272-1.7542-1.6034-0.93663 0.0238-1.7066 0.75407-1.6828 1.6828 0.0159 0.89694 0.77787 1.5399 1.5399 1.5954 0.0952 0 0.1905-8e-3 0.26988-0.0238l-1.2621 1.5637h0.89693l1.6034-2.1114c0.23019-0.3175 0.39687-0.68262 0.38894-1.1033zm-1.6828 1.0319c-0.57944 0.0159-0.99219-0.38893-1.016-0.96043-0.0238-0.53975 0.36512-0.96838 0.94456-0.99219 0.5715-0.0159 0.98425 0.381 1.0081 0.92075 0.0159 0.5715-0.36512 1.0081-0.93662 1.0319z" style="fill:#393939;stroke-width:.26458"/>
                    </g>
                    <path d="m252.41 24.871-1.3229 0.8599v6.813h1.3229zm-1.9844 1.2898-1.3229 0.8599v5.5232h1.3229zm-2.1167 1.3756-1.3229 0.8599v4.1476h1.3229zm-2.1167 1.3761-1.3229 0.8599v2.7714h1.3229zm-1.9844 1.2898-2.3812 1.5477v0.79375h2.3812z" style="fill:#3f3f3f;paint-order:markers fill stroke"/>
                </svg>
            </div>
            <div class="UID_instructionImage_entries" id="UID_instructionImage_entries">
            </div>
        </div>
    </div>
</div>
`
,
networkHTML:`
<svg version="1.1" viewBox="0 0 328.08 42.598" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(0 -254.4)">
        <path d="m48.948 276.1a4.7625 4.7625 0 0 0-3.2298 1.2682l0.93638 0.93636a3.4396 3.4396 0 0 1 2.2934-0.88159 3.4396 3.4396 0 0 1 2.2939 0.88108l0.93483-0.93482a4.7625 4.7625 0 0 0-3.2287-1.2692z" style="fill:#000000;paint-order:markers fill stroke"/>
        <path d="m48.948 273.45a7.4083 7.4083 0 0 0-5.102 2.0417l0.93638 0.93639a6.0854 6.0854 0 0 1 4.1656-1.6552 6.0854 6.0854 0 0 1 4.1636 1.6573l0.93483-0.93482a7.4083 7.4083 0 0 0-5.0984-2.0454z" style="fill:#000000;paint-order:markers fill stroke"/>
        <path d="m48.948 270.81a10.054 10.054 0 0 0-6.9742 2.8153l0.93586 0.93585a8.7312 8.7312 0 0 1 6.0384-2.4283 8.7312 8.7312 0 0 1 6.0332 2.4334l0.93483-0.93482a10.054 10.054 0 0 0-6.968-2.8216z" style="fill:#000000;paint-order:markers fill stroke"/>
        <path d="m48.948 278.74a2.1167 2.1167 0 0 0-1.357 0.49506l1.357 1.357 1.3586-1.3586a2.1167 2.1167 0 0 0-1.3586-0.4935z" style="fill:#000000;paint-order:markers fill stroke"/>
        <text x="68.262497" y="279.80237" style="fill:#000000;font-family:Now;font-size:10.583px;letter-spacing:0px;line-height:1.25;stroke-width:.26458;word-spacing:0px" xml:space="preserve"><tspan id="UID_entry_###_ssid" x="68.262497" y="279.80237" style="font-family:Roboto;stroke-width:.26458"></tspan></text>
        <path d="m256.38 271.34c-1.3089 0-2.3807 1.0718-2.3807 2.3807h-5.3e-4v1.3229h-0.52917c-0.43974 0-0.79375 0.35401-0.79375 0.79375v3.4396c0 0.43974 0.35401 0.79375 0.79375 0.79375h5.8208c0.43974 0 0.79375-0.35401 0.79375-0.79375v-3.4396c0-0.43974-0.35401-0.79375-0.79375-0.79375h-0.52916v-1.3229c0-1.3089-1.0724-2.3807-2.3812-2.3807zm0 1.0588c0.7369 0 1.3224 0.585 1.3224 1.3219h5.3e-4v1.3229h-2.6458v-1.3229h1e-3c0-0.73689 0.585-1.3219 1.3219-1.3219z" style="color-rendering:auto;color:#000000;dominant-baseline:auto;fill:#808080;font-feature-settings:normal;font-variant-alternates:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-variant-numeric:normal;font-variant-position:normal;image-rendering:auto;isolation:auto;mix-blend-mode:normal;paint-order:markers fill stroke;shape-padding:0;shape-rendering:auto;solid-color:#000000;text-decoration-color:#000000;text-decoration-line:none;text-decoration-style:solid;text-indent:0;text-orientation:mixed;text-transform:none;white-space:normal"/>
        <circle cx="279.8" cy="275.97" r="8.599" style="fill:#f0f0f0;paint-order:markers fill stroke"/>
        <path d="m278.34 272.39 3.4396 3.4396-3.4396 3.4396" style="fill:none;paint-order:markers fill stroke;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.3229;stroke:#adadad"/>
    </g>
</svg>`
}