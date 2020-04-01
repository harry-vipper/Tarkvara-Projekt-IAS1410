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
        render.strUID=function(str) {
            return str.split("UID").join(UID);
        };
        render.fade={
            fadeTime:300,
            in: function(element) {
                element.classList.remove("r_invis");
                return (delay(this.fadeTime, localTimerIds));
            },
            out: function(element) {
                element.classList.add("r_invis");
                return (delay(this.fadeTime, localTimerIds));
            }
        }
        render.menuEntry={
            //listEntry
            create: function(instance) {
                let container=document.createElement('div');
                container.classList.add(render.strUID("UID_menulistItem"))
                let str=`
                    <div class="UID_menulistHeader">
                        <div id="`+instance.index+`_UID_header_index" class="UID_menulistHeaderNumber">
                            <p>`+(instance.index+1)+`</p>
                        </div>
                        <div id="`+instance.index+`_UID_header_title" class="UID_menulistHeaderTitle">
                            <p>`+instance.properties.title+`</p>
                        </div>
                    </div>
                    <div id="`+instance.index+`_UID_header_description" class="UID_menulistDescriptionBackground r_hidden">
                        <div class="UID_menulistDescription">
                            <div class="UID_menulistDescriptionText">
                                <p>`+instance.properties.description+`</p>
                            </div>
                            <div class="UID_menulistDescriptionProperties">
                                <div class="UID_menulistDescriptionPropertiesElement">
                                    <div class="UID_menulistDescriptionPropertiesElementIcon">
                                        <svg></svg>
                                    </div>
                                    <div class="UID_menulistDescriptionPropertiesElementValue">
                                        <p>`+instance.properties.duration+`<span class="UID_menulistDescriptionPropertiesElementValue-small">min</span></span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                `;
                str.split("UID").join(UID);
                container.innerHTML=str;
                return(container);
            },
            activate: function(index) {
                index=String(index);
                document.getElementById(index+render.strUID("_UID_header_index")).classList.add(render.strUID("UID_menulistHeaderActive"));
                document.getElementById(index+render.strUID("_UID_header_title")).classList.add(render.strUID("UID_menulistHeaderActive"));
                document.getElementById(index+render.strUID("_UID_header_description")).classList.remove(render.strUID("r_hidden"));
            },
            deactivate: function(index) {
                index=String(index);
                console.log(index+render.strUID("_UID_header_index"));
                document.getElementById(index+render.strUID("_UID_header_index")).classList.remove(render.strUID("UID_menulistHeaderActive"));
                document.getElementById(index+render.strUID("_UID_header_title")).classList.remove(render.strUID("UID_menulistHeaderActive"));
                document.getElementById(index+render.strUID("_UID_header_description")).classList.add(render.strUID("r_hidden"));
            }
        },
        system.screen.loadResource("/resources/css/gameSelectionMenu.css").then(
            (css)=>{
                //Render


                style.innerHTML=css;
                
                //Create list
                let menuListContainer=document.createElement('div');
                menuListContainer.setAttribute("id", render.strUID("UID_menulistContainer"));
                context.appendChild(menuListContainer);

                let i=0;
                screenContent.gamefile.content.content.forEach((entry)=>{
                    entry.index=i;
                    i++;
                    menuListContainer.appendChild(render.menuEntry.create(entry));
                })
                screenContent.savefile.content.gameData.selectedGame=0;
                    render.menuEntry.activate(screenContent.savefile.content.gameData.selectedGame);
                return render.fade.in(context);
            }).then(
                ()=>{

                    controls.key.set('up', 0, /**/()=>{selectGame('-');}, "Eelmine");
                    controls.key.set('down', 0, /**/()=>{selectGame('+');}, "Järgmine");
                    controls.key.set('confirm', 0, /**/()=>{}, "Alusta");
                    
                    function selectGame(direction) {
                        render.menuEntry.deactivate(screenContent.savefile.content.gameData.selectedGame);
                        screenContent.savefile.content.gameData.selectedGame=calcNextIndex(
                            direction, 
                            screenContent.savefile.content.gameData.selectedGame, 
                            screenContent.gamefile.content.content.length
                        );
                        render.menuEntry.activate(screenContent.savefile.content.gameData.selectedGame);
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
        
        
        /*scroll:{

        }

        */
        
        //Make a palette if there is none
        //do stuff
        
    
    }
}