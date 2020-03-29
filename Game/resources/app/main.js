const electron = require("electron");
const url = require("url");
const path = require("path");

const {app,BrowserWindow} = electron;

let mainWindow;

app.on("ready",function(){
    mainWindow = new BrowserWindow({
        "fullscreen": true,
        //frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.setAutoHideMenuBar(true);
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname,"Game.html"),
        protocol:"file:",
        slashes: true
    }));
});