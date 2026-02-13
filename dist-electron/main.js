"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
const require$$0 = require("electron");
const path = require("path");
const url = require("url");
const fs = require("fs");
var _documentCurrentScript = typeof document !== "undefined" ? document.currentScript : null;
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
const electron = require$$0;
if (typeof electron === "string") {
  throw new TypeError("Not running in an Electron environment!");
}
const isEnvSet = "ELECTRON_IS_DEV" in process.env;
const getFromEnv = Number.parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;
var electronIsDev = isEnvSet ? getFromEnv : !electron.app.isPackaged;
const isDev = /* @__PURE__ */ getDefaultExportFromCjs(electronIsDev);
const __filename$1 = url.fileURLToPath(typeof document === "undefined" ? require("url").pathToFileURL(__filename).href : _documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === "SCRIPT" && _documentCurrentScript.src || new URL("main.js", document.baseURI).href);
const __dirname$1 = path.dirname(__filename$1);
let mainWindow = null;
class RankingStorage {
  constructor() {
    __publicField(this, "filePath");
    const userDataPath = require$$0.app.getPath("userData");
    this.filePath = path.join(userDataPath, "rankings.json");
    console.log(`[RankingStorage] Data file path: ${this.filePath}`);
  }
  getRankings() {
    try {
      if (fs.existsSync(this.filePath)) {
        const data = fs.readFileSync(this.filePath, "utf-8");
        return JSON.parse(data);
      }
    } catch (error) {
      console.error("[RankingStorage] Failed to read rankings:", error);
    }
    return [];
  }
  setRankings(rankings) {
    try {
      fs.writeFileSync(
        this.filePath,
        JSON.stringify(rankings, null, 2),
        "utf-8"
      );
    } catch (error) {
      console.error("[RankingStorage] Failed to write rankings:", error);
    }
  }
  clearRankings() {
    try {
      if (fs.existsSync(this.filePath)) {
        fs.unlinkSync(this.filePath);
      }
    } catch (error) {
      console.error("[RankingStorage] Failed to clear rankings:", error);
    }
  }
}
let rankingStorage;
function createWindow() {
  const preloadPath = path.join(__dirname$1, "preload.js");
  mainWindow = new require$$0.BrowserWindow({
    width: 1280,
    height: 720,
    useContentSize: true,
    // コンテンツエリアのサイズを正確に指定
    resizable: true,
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  if (isDev) {
    const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"] || "http://localhost:5173";
    mainWindow.loadURL(VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname$1, "../dist/index.html"));
  }
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}
function setupIpcHandlers() {
  require$$0.ipcMain.handle("get-app-version", () => {
    return require$$0.app.getVersion();
  });
  require$$0.ipcMain.handle("ranking:get-all", () => {
    return rankingStorage.getRankings();
  });
  require$$0.ipcMain.handle("ranking:add-entry", (_event, entry) => {
    const rankings = rankingStorage.getRankings();
    rankings.push(entry);
    rankings.sort((a, b) => b.score - a.score);
    const MAX_RANKING_ENTRIES = 50;
    const topEntries = rankings.slice(0, MAX_RANKING_ENTRIES);
    rankingStorage.setRankings(topEntries);
    return topEntries;
  });
  require$$0.ipcMain.handle("ranking:clear", () => {
    rankingStorage.clearRankings();
    return true;
  });
}
require$$0.app.on("ready", () => {
  rankingStorage = new RankingStorage();
  setupIpcHandlers();
  createWindow();
});
require$$0.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    require$$0.app.quit();
  }
});
require$$0.app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
