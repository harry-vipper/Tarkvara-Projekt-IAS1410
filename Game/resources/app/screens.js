var screens = [
    {
        screenObject: {
            type: "task",
            initialiser: task_handler, //(divObject,)
            contentElementObject:{
                str:"Task1 sisu mida iganes"
            },//Jupp JSONist ainult mis vaja on kuidas see siia saada veel vaatab
            settings: {//tühi, need täidab mingi funktsioon startupil
                colors: color,
                duration: 180,
                jne:0

            }
        }

    },
    {   
        screenObject: {
            type: "question",
            initialiser: question_handler, 
            contentElementObject:{
                str:"Question1 sisu mida iganes"
            },
            settings: {
                colors: color,
                duration: 180,
                jne:0

            }
        }
    },
    {
        screenObject:{
            type: "minigame",
            initialiser: minigame_handler,
            contentElementObject:{
            
            },
            settings: {
                colors: color,

            }
        }
    },
    {
        screenObject: {
            type: "gameMenu",
            initialiser: gameMenu_handler, 
            prototypeElementObject:{   
                "title": "",
                "duration": 0,
                "description": "",
                "players":
                {
                    "min": 0,
                    "max": 0
                },           
                "volume": 0,
                "condition": 0
            },
            contentElementObject:[
            ],
            settings: {
                colors: color,

            }
        }
    },
    {
        screenObject:{
            type: "settingsMenu",
            initialiser: settingsMenu_handler,
            contentElementObject:{
                str:"Mdea"
            },
            settings: {
                colors: color,
                duration: 180,
                jne:0

            }
        }
    },
    {
        screenObject:{
            type: "splash",
            initialiser: splash_handler,
            contentElementObject:{
                topBox:"Mdea",
                bottomBox:"Mdea"
            },
            settings: {
                colors: color,
                jne:0

            }
        }
    },
    {
        screenObject:{
            type: "save",
            initialiser: save_handler,
            contentElementObject:{
            },
            settings: {
                colors: color,
            }
        }
    }
]