import { app, BrowserWindow } from "electron";
import path from "path"; //helps cross-platform
import { isDev } from "./util.js";

//waiting for event on the app
app.on("ready", () => {
  const mainWindow = new BrowserWindow({});
  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html")); //app.getAppPath accounts for not knowing where the user will place the app
  }
});
