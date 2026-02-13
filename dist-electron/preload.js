"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  // アプリバージョン取得
  getAppVersion: () => electron.ipcRenderer.invoke("get-app-version"),
  // ランキング関連API
  ranking: {
    getAll: () => electron.ipcRenderer.invoke("ranking:get-all"),
    addEntry: (entry) => electron.ipcRenderer.invoke("ranking:add-entry", entry),
    clear: () => electron.ipcRenderer.invoke("ranking:clear")
  }
});
console.log("[Preload] Preload script loaded");
