import { contextBridge, ipcRenderer } from "electron";

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electronAPI", {
    sendMessage: (message: string) => ipcRenderer.send("message", message),
    onReceiveMessage: (callback: (event: any, message: string) => void) =>
        ipcRenderer.on("reply", callback),
});

console.log("Preload script loaded");
