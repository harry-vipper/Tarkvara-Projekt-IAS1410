const electron = require("electron");
const url = require("url");
const path = require("path");

const {app,BrowserWindow} = electron;


var mainWindow;

app.on("ready",function(){
    mainWindow = new BrowserWindow({
        "fullscreen": false,
        //frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.webContents.openDevTools();
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