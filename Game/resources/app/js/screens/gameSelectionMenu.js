//Main menu
var screen_gameSelectionMenu;
screen_gameSelectionMenu={
    type: "gameSelectionMenu",
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
    context,      <div> to draw into
    style,          <style> to send styles to
    controls,       controls object with methods to handle controls
    screenContent,  data passed to screen, in any format, possibly suitable to this screen only
    localTimerIds,  Array of active timers
    screenSettings, settings like colors
    UID   
    */
    {   
        
        var end;
        var endpromise=new Promise((resolve) =>{
                end=resolve;
            }
        );
        render.strUID=function(str) {
            return str.split("UID").join(UID);
        };
        render.menuEntry={
            //listEntry
            create: function(instance) {
                let container=document.createElement('div');
                container.classList.add(render.strUID("UID_menulistItem"))
                container.setAttribute("id", "_"+instance.index+"_UID_element");
                let str=`
                    <div class="UID_menulistHeader">
                        <div id="_`+instance.index+`_UID_header_index" class="UID_menulistHeaderNumber">
                            <p>`+(instance.index+1)+`</p>
                        </div>
                        <div id="_`+instance.index+`_UID_header_title" class="UID_menulistHeaderTitle">
                            <p>`+instance.properties.title.toUpperCase()+`</p>
                        </div>
                    </div>
                    <div id="_`+instance.index+`_UID_header_description" class="UID_menulistDescriptionBackground r_hidden">
                        <div class="UID_menulistDescription">
                            <div class="UID_menulistDescriptionText">
                                <p>`+instance.properties.description+`</p>
                            </div>
                            <div class="UID_menulistDescriptionProperties">
                                <div class="UID_menulistDescriptionPropertiesElement">
                                    <div class="UID_menulistDescriptionPropertiesElementIcon">
                                        <svg width="10.583mm" height="10.583mm" preserveAspectRatio="xMinYMin meet" version="1.1" viewBox="0 0 10.583 10.583" xmlns="http://www.w3.org/2000/svg">
                                            <g transform="translate(0 -286.42)">
                                                <path d="m3.1616 287.34a0.1323 0.1323 0 0 0-0.11885 0.13282v2.1172a0.1323 0.1323 0 0 0 0.03876 0.0915l2.0236 2.0236-2.0236 2.0237a0.1323 0.1323 0 0 0-0.03876 0.0935v2.1172a0.1323 0.1323 0 0 0 0.13282 0.13073h4.2323a0.1323 0.1323 0 0 0 0.13282-0.13073v-2.1172a0.1323 0.1323 0 0 0-0.03876-0.0935l-2.0236-2.0237 2.0236-2.0236a0.1323 0.1323 0 0 0 0.03876-0.0915v-2.1172a0.1323 0.1323 0 0 0-0.13282-0.13282h-4.2323a0.1323 0.1323 0 0 0-0.01402 0zm0.1447 0.26562h3.9688v1.9275l-1.9844 1.9844-1.9844-1.9844zm0.39791 1.4542v0.26459l1.5875 1.5875 1.5875-1.5875v-0.26459zm1.5865 2.8329 1.9844 1.9844v1.9296h-3.9688v-1.9296zm0 2.1942-0.52917 0.52916h-1.0583v0.79375h3.175v-0.79375h-1.0583z" style="color-rendering:auto;color:#000000;dominant-baseline:auto;fill:var(--svgColor);font-feature-settings:normal;font-variant-alternates:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-variant-numeric:normal;font-variant-position:normal;image-rendering:auto;isolation:auto;mix-blend-mode:normal;shape-padding:0;shape-rendering:auto;solid-color:#000000;text-decoration-color:#000000;text-decoration-line:none;text-decoration-style:solid;text-indent:0;text-orientation:mixed;text-transform:none;white-space:normal"/>
                                            </g>
                                        </svg>
                                    </div>
                                    <div class="UID_menulistDescriptionPropertiesElementValue">
                                        <p>`+instance.properties.duration+`<span class="UID_menulistDescriptionPropertiesElementValue-small">min</span></span></p>
                                    </div>
                                </div>
                                <div class="UID_menulistDescriptionPropertiesElement">
                                    <div class="UID_menulistDescriptionPropertiesElementIcon">
                                        <svg width="10.583mm" height="10.583mm" preserveAspectRatio="xMinYMin meet" version="1.1" viewBox="0 0 10.583 10.583" xmlns="http://www.w3.org/2000/svg">
                                            <g transform="translate(0 -286.42)">
                                                <path d="m5.424 288.86a0.94536 0.944 0 0 0-0.94517 0.94412 0.94536 0.944 0 0 0 0.94517 0.94361 0.94536 0.944 0 0 0 0.94517-0.94361 0.94536 0.944 0 0 0-0.94517-0.94412zm-2.2655 1.1395c-0.40849 5e-5 -0.7397 0.33054-0.73948 0.73845 0 0.37378 0.28046 0.68858 0.65214 0.73279v-0.23307c0-0.44151 0.19944-0.83643 0.51006-1.1048-0.12412-0.0866-0.27144-0.13319-0.42272-0.13332zm4.531 0c-0.15129 1.3e-4 -0.29922 0.0467-0.42323 0.13332 0.31059 0.26842 0.51057 0.66334 0.51057 1.1048v0.23307c0.37169-0.0442 0.65185-0.35901 0.65214-0.73279 2.117e-4 -0.40791-0.33099-0.7384-0.73948-0.73845zm-3.4696 0.44339c-0.34398 0.17192-0.58134 0.52268-0.58134 0.93429v2.3074c0 0.58108 0.46805 1.049 1.0501 1.049h1.4707c0.5819 0 1.0501-0.46797 1.0501-1.049v-2.3074c0-0.41161-0.23744-0.76237-0.58134-0.93429-0.23072 0.42992-0.68485 0.72501-1.2035 0.72501-0.51861 0-0.97348-0.29509-1.2046-0.72501zm-2.1032 0.93429c-0.2689 0.13449-0.35502 0.40926-0.35502 0.73123v1.8051c0 0.45453 0.36645 0.8201 0.82166 0.8201h0.93379c-0.2744-0.26731-0.44598-0.63939-0.44598-1.049v-1.7461c-0.36888-0.0305-0.78716-0.24934-0.95446-0.56121zm6.6146 0c-0.1674 0.31187-0.58566 0.53073-0.95446 0.56121v1.7461c0 0.40966-0.17166 0.78174-0.44598 1.049h0.93379c0.45511 0 0.82166-0.36557 0.82166-0.8201v-1.8051c0-0.32197-0.08612-0.59674-0.35502-0.73123z" style="fill:none;paint-order:markers fill stroke;stroke-linecap:round;stroke-width:.26458;stroke:var(--svgColor)"/>
                                            </g>
                                        </svg>
                                    </div>
                                    <div class="UID_menulistDescriptionPropertiesElementValue">
                                        <p>`+instance.properties.players.min+"-"+instance.properties.players.max+`</p>
                                    </div>
                                </div>
                                <div class="UID_menulistDescriptionPropertiesElement">
                                    <div class="UID_menulistDescriptionPropertiesElementIcon">
                                        <svg width="10.583mm" height="10.583mm" preserveAspectRatio="xMinYMin meet" version="1.1" viewBox="0 0 10.583 10.583" xmlns="http://www.w3.org/2000/svg">
                                            <g transform="translate(0 -286.42)">
                                                <path d="m2.9105 287.34a0.1323 0.1323 0 0 0-0.13282 0.13282v3.838c0 0.0912-0.018256 0.17767-0.051144 0.25633-2.116e-4 0 0 0 0 3e-3 -0.06694 0.15756-0.19312 0.28379-0.35086 0.35036-0.079349 0.0335-0.16656 0.0517-0.25839 0.0517-0.090699 0-0.1774 0.0188-0.25633 0.0522-0.03974 0.0169-0.077258 0.0376-0.11263 0.0615-0.17616 0.11928-0.2925 0.3207-0.2925 0.5483v3.0406h0.2662v-3.0417c0-0.0833 0.024342-0.16023 0.066649-0.22376 0.00265-4e-3 0.00609-7e-3 0.00873-0.0109 0.072152-0.0982 0.1883-0.16161 0.32144-0.16174 0.50988-8e-5 0.92604-0.41571 0.92604-0.92554v-1.4573h1.3214v1.4552c2.65e-5 0.0446 0.00714 0.0873 0.013494 0.1302 0.00265 0.0185 0.00265 0.0378 0.00556 0.0558 0.011377 0.0563 0.028813 0.11059 0.050112 0.16277 0.00265 3e-3 0.00265 7e-3 0.0037 0.0109 2.116e-4 0 0 0 0 3e-3 0.023283 0.0547 0.052229 0.10676 0.085275 0.15555 0.16674 0.24699 0.44916 0.41026 0.76843 0.41032 0.22201 2.3e-4 0.39584 0.17486 0.39584 0.39687v3.0406h0.26562v-3.0411c0-0.091-0.01905-0.1782-0.052705-0.25736-0.066966-0.15857-0.19365-0.28583-0.35192-0.35296-0.039238-0.0167-0.080354-0.0299-0.12298-0.0388v0c-0.042995-9e-3 -0.087313-0.0135-0.13282-0.0135-0.045482-3e-5 -0.089958-5e-3 -0.13282-0.0135v0c-0.042836-9e-3 -0.083635-0.0217-0.12298-0.0383-0.039555-0.0167-0.077549-0.0368-0.11266-0.0605v0c-0.034687-0.0233-0.066569-0.0502-0.096123-0.0796-0.11925-0.11912-0.19275-0.28424-0.19275-0.46768v-3.838a0.1323 0.1323 0 0 0-0.13851-0.13319zm3.8225 5.0271a0.1323 0.1323 0 0 0-0.11472 0.10541s-0.060987 0.28842-0.091996 0.63873c-0.030983 0.35028-0.042942 0.76055 0.10335 1.0526 0.29512 0.59052 0.88723 1.1886 1.5725 1.2666v0.24392h0.26562v-0.24132c0.4568-0.0401 0.87201-0.31422 1.1901-0.66559v-0.42944c-0.31972 0.45063-0.82037 0.83769-1.3053 0.83767-0.58862 0-1.2049-0.56851-1.4862-1.1312-0.093001-0.18624-0.10528-0.57767-0.075962-0.91001 0.024077-0.27459 0.055748-0.42833 0.069744-0.50178h2.7973v-0.26562h-2.9104a0.1323 0.1323 0 0 0-0.012965 0zm-4.6163 1.1906v2.1167h3.175v-2.1167z" style="color-rendering:auto;color:#000000;dominant-baseline:auto;fill:var(--svgColor);font-feature-settings:normal;font-variant-alternates:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-variant-numeric:normal;font-variant-position:normal;image-rendering:auto;isolation:auto;mix-blend-mode:normal;paint-order:markers fill stroke;shape-padding:0;shape-rendering:auto;solid-color:#000000;text-decoration-color:#000000;text-decoration-line:none;text-decoration-style:solid;text-indent:0;text-orientation:mixed;text-transform:none;white-space:normal"/>
                                            </g>
                                        </svg>
                                   
                                    </div>
                                    <div class="UID_menulistDescriptionPropertiesElementValue">
                                        <p>`+instance.properties.volume+`<span class="UID_menulistDescriptionPropertiesElementValue-small">%</span></span></p>
                                    </div>
                                </div>
                                <div class="UID_menulistDescriptionPropertiesElement">
                                    <div class="UID_menulistDescriptionPropertiesElementIcon">
                                        <svg width="10.583mm" height="10.583mm" preserveAspectRatio="xMinYMin meet" version="1.1" viewBox="0 0 10.583 10.583" xmlns="http://www.w3.org/2000/svg">
                                            <g transform="translate(0 -286.42)">
                                                <path d="m1.8531 288.53v6.2187c0 0.36415 0.29768 0.66199 0.66199 0.66199h3.174c0.36428 0 0.66196-0.29784 0.66196-0.66199v-6.2187h-0.26562v6.2187c0 0.22215-0.17407 0.39637-0.39635 0.39637h-3.174c-0.2223 0-0.39844-0.17422-0.39844-0.39637v-6.2187zm5.424 0.13333v0.26355h1.0583v-0.26355zm0 1.8516v0.26352h1.0583v-0.26352zm-4.7625 1.4547v2.6458h3.175v-2.6458zm4.7625 0.39687v0.26562h1.0583v-0.26562zm0 1.8516v0.26565h1.0583v-0.26565z" style="color-rendering:auto;color:#000000;dominant-baseline:auto;fill:var(--svgColor);font-feature-settings:normal;font-variant-alternates:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-variant-numeric:normal;font-variant-position:normal;image-rendering:auto;isolation:auto;mix-blend-mode:normal;paint-order:markers fill stroke;shape-padding:0;shape-rendering:auto;solid-color:#000000;text-decoration-color:#000000;text-decoration-line:none;text-decoration-style:solid;text-indent:0;text-orientation:mixed;text-transform:none;white-space:normal"/>
                                            </g>
                                        </svg>
                                   
                                    </div>
                                    <div class="UID_menulistDescriptionPropertiesElementValue">
                                        <p>`+instance.properties.condition+`<span class="UID_menulistDescriptionPropertiesElementValue-small">%</span></span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="_`+instance.index+`_UID_element_after" class="UID_element_after"></div>
                `;
                str.split("UID").join(UID);
                container.innerHTML=str;
                return(container);
            },
            activate: function(index) {
                index=String(index);
                document.getElementById("_"+index+render.strUID("_UID_header_index")).classList.add(render.strUID("UID_menulistHeaderActive"));
                document.getElementById("_"+index+render.strUID("_UID_header_title")).classList.add(render.strUID("UID_menulistHeaderActive"));
                document.getElementById("_"+index+render.strUID("_UID_header_description")).classList.remove(render.strUID("r_hidden"));
            },
            deactivate: function(index) {
                index=String(index);
                document.getElementById("_"+index+render.strUID("_UID_header_index")).classList.remove(render.strUID("UID_menulistHeaderActive"));
                document.getElementById("_"+index+render.strUID("_UID_header_title")).classList.remove(render.strUID("UID_menulistHeaderActive"));
                document.getElementById("_"+index+render.strUID("_UID_header_description")).classList.add(render.strUID("r_hidden"));
            }
        }
        system.screen.loadResource("/resources/css/gameSelectionMenu.css").then(
            (css)=>{
                //Render

                if(fileCSS) {
                    system.screen.loadCSStoDOM("resources/css/gameSelectionMenu.css");
                }
                else{
                    style.innerHTML=css;
                }
                
                
                //Create list
                let menuListContainer=document.createElement('div');
                menuListContainer.setAttribute("id", render.strUID("UID_menulistContainer"));
                context.appendChild(menuListContainer);

                let i=0;
                screenContent.gamefile.content.forEach((entry)=>{
                    entry.index=i;
                    i++;
                    menuListContainer.appendChild(render.menuEntry.create(entry));
                })
                screenContent.savefile.gameData.selectedGame=0;
                    render.menuEntry.activate(screenContent.savefile.gameData.selectedGame);
                return render.fade.in(context);
            }).then(
                ()=>{

                    controls.key.set('up', 0, ()=>{selectGame('-');}, insertText("9"));
                    controls.key.set('down', 0, ()=>{selectGame('+');}, insertText("10"));
                    controls.key.set('confirm', 1000, ()=>{end({type:"startGame"});}, insertText("11"));
                    controls.key.set('left', 0, ()=>{end({type:"settingsMenu"});}, insertText("12"));

                    const scroller = new SweetScroll();
                    
                    function selectGame(direction) {
                        render.menuEntry.deactivate(screenContent.savefile.gameData.selectedGame);
                        screenContent.savefile.gameData.selectedGame=calcNextIndex(
                            direction, 
                            screenContent.savefile.gameData.selectedGame, 
                            screenContent.gamefile.content.length
                        );
                        //document.getElementById(screenContent.savefile.gameData.selectedGame+render.strUID("_UID_header_title")).scrollIntoView();
                        
                        let elementId="_"+screenContent.savefile.gameData.selectedGame+render.strUID("_UID_element");
                        
                        
                        render.menuEntry.activate(screenContent.savefile.gameData.selectedGame);
                        scroller.to(
                            ("#"+elementId)
                        )
                        //render.forceRedraw(document.getElementById(render.strUID("UID_menulistContainer")));
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
                }
        );
        
        
        //Make a palette if there is none
        //do stuff
        return endpromise;
    }
}