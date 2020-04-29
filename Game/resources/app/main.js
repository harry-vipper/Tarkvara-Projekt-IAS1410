const electron = require("electron");
const url = require("url");
const path = require("path");

const {app,BrowserWindow} = electron;
const DEBUG=false;

var mainWindow;
if(DEBUG){
    app.on("ready",function(){
        mainWindow = new BrowserWindow({
            width: 1240, 
            height: 1024, 
            frame: true,
            webPreferences: {
                nodeIntegration: true,
            }
        });
        mainWindow.webContents.openDevTools();
        mainWindow.on('closed', () => {
            app.exit(0);
        })
            
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname,"Game.html"),
            protocol:"file:",
            slashes: true
        }));
    });
}
else{
    app.on("ready",function(){
        mainWindow = new BrowserWindow({
            "fullscreen": true,
            width: 1240, 
            height: 1024, 
            frame: false,
            webPreferences: {
                nodeIntegration: true,
            }
        });
        mainWindow.on('closed', () => {
            app.exit(0);
        })
        mainWindow.setAutoHideMenuBar(true);
            
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname,"Game.html"),
            protocol:"file:",
            slashes: true
        }));
    });
}