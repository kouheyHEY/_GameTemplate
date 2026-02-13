"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  sendMessage: (message) => electron.ipcRenderer.send("message", message),
  onReceiveMessage: (callback) => electron.ipcRenderer.on("reply", callback)
});
console.log("Preload script loaded");
