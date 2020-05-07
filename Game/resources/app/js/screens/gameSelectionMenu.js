//Main menu screen to allow the user to select between games.
var screen_gameSelectionMenu={
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

        //Display the footer.
        render.footer.show();
        
        render.menuEntry={
            //The menu entry creation function to make an entry based on given data.
            create: function(instance) {

                //Make a container for the entry.
                let container=document.createElement('div');
                container.classList.add(render.insertUID("UID_menulistItem",UID))
                container.setAttribute("id", "_"+instance.index+"_UID_element");

                //Set correct data into the predefined string.
                let str=`
                    <div class="UID_menulistHeader">
                        <div id="_`+instance.index+`_UID_header_index" class="UID_menulistHeaderNumber">
                            <p>`+(instance.index+1)+`</p>
                        </div>
                        <div id="_`+instance.index+`_UID_header_title" class="UID_menulistHeaderTitle">
                            <p>`+instance.properties.title.toUpperCase()+`</p>
                        </div>
                    </div>
                    <div id="_`+instance.index+`_UID_header_description" class="UID_menulistDescriptionBackground r_hidden_animatable r_hidden_animatable_capable">
                        <div class="UID_menulistDescription">
                            <div class="UID_menulistDescriptionText">
                                <p>`+strToHTML(instance.properties.description)+`</p>
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
                                        <p>`+(parseFloat(instance.properties.duration).toFixed(0))+`<span class="UID_menulistDescriptionPropertiesElementValue-small">min</span></span></p>
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
                                        <p>`+getMinMaxStr(instance.properties.players.min,instance.properties.players.max)+`</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="_`+instance.index+`_UID_element_after" class="UID_element_after"></div>
                `;

                //Replace the placeholder UIDs with real UIDs and set the string into the container.
                str=render.insertUID(str,UID);
                container.innerHTML=str;

                return(container);
            },

            //The activate and deactivate functions to either activate or deactivate a menu entry by changing its CSS classes.
            activate: function(index) {
                index=String(index);
                document.getElementById("_"+index+render.insertUID("_UID_header_index",UID)).classList.add(render.insertUID("UID_menulistHeaderActive",UID));
                document.getElementById("_"+index+render.insertUID("_UID_header_title",UID)).classList.add(render.insertUID("UID_menulistHeaderActive",UID));
                document.getElementById("_"+index+render.insertUID("_UID_header_description",UID)).classList.remove(render.insertUID("r_hidden_animatable",UID));
            },
            deactivate: function(index) {
                index=String(index);
                document.getElementById("_"+index+render.insertUID("_UID_header_index",UID)).classList.remove(render.insertUID("UID_menulistHeaderActive",UID));
                document.getElementById("_"+index+render.insertUID("_UID_header_title",UID)).classList.remove(render.insertUID("UID_menulistHeaderActive",UID));
                document.getElementById("_"+index+render.insertUID("_UID_header_description",UID)).classList.add(render.insertUID("r_hidden_animatable",UID));
            }
        };


        function getMinMaxStr(min, max) {//The min-max string creation function to construct the suggested player amount for each game.
            if (min==max) {
                return min;
            }
            return min+"-"+max;
        }

        //Load the screen CSS to DOM or the style element.
        system.screen.loadResource("/resources/css/gameSelectionMenu.css").then((css)=>{
            if(fileCSS) {
                system.screen.loadCSStoDOM("resources/css/gameSelectionMenu.css");
            }
            else{
                style.innerHTML=css;
            }
                
                
            //Create list container.
            let menuListContainer=document.createElement('div');
            menuListContainer.setAttribute("id", render.insertUID("UID_menulistContainer",UID));
            context.appendChild(menuListContainer);

            //Fill the list with games.
            let i=0;
            screenContent.gamefile.content.forEach((entry)=>{
                entry.index=i;
                i++;
                menuListContainer.appendChild(render.menuEntry.create(entry));
            })

            //Set the scroller to the top of the screen and activate the first element.
            screenContent.savefile.gameData.selectedGame=0;
            render.menuEntry.activate(screenContent.savefile.gameData.selectedGame);

            const scroller = new SweetScroll();
            scroller.to("#_"+screenContent.savefile.gameData.selectedGame+render.insertUID("_UID_element",UID));
            

            //Fade in the screen.
            return render.fade.in(context).then(()=>{return scroller;});

            }).then((scroller)=>{
                //Set controls of the menu.
                controls.key.set('up', 0, ()=>{selectGame('-');}, insertText("9"),false,true);
                controls.key.set('down', 0, ()=>{selectGame('+');}, insertText("10"),false,true);
                controls.key.set('confirm', defaultHold, ()=>{end({type:"startGame"});}, insertText("11"),false,true);
                controls.key.set('left', 0, ()=>{end({type:"settingsMenu"});}, insertText("12"),false,true);
                controls.key.set('right', defaultHold, ()=>{end({type:"editorConnect"});}, insertText("46"),false,true);
                
                function selectGame(direction) {//Select game function to activate/deactivate menu entries and keep track of the currently selected entry.

                    render.menuEntry.deactivate(screenContent.savefile.gameData.selectedGame);

                    screenContent.savefile.gameData.selectedGame=calcNextIndex(
                        direction, 
                        screenContent.savefile.gameData.selectedGame, 
                        screenContent.gamefile.content.length
                    );
                    
                    let elementId="_"+screenContent.savefile.gameData.selectedGame+render.insertUID("_UID_element",UID);
                    
                    render.menuEntry.activate(screenContent.savefile.gameData.selectedGame);
                    scroller.to(
                        ("#"+elementId)
                    )
                    
                }

                function calcNextIndex(direction, data, size) {//The calculate next index function to allow selection of only valid entries.
                    
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
        return endpromise;
    }
}