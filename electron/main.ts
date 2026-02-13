import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import isDev from "electron-is-dev";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;

// ランキングエントリーの型定義
interface RankingEntry {
    score: number;
    date: string;
    playerName?: string;
}

// ランキングデータストレージクラス
class RankingStorage {
    private filePath: string;

    constructor() {
        const userDataPath = app.getPath("userData");
        this.filePath = path.join(userDataPath, "rankings.json");
        console.log(`[RankingStorage] Data file path: ${this.filePath}`);
    }

    getRankings(): RankingEntry[] {
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

    setRankings(rankings: RankingEntry[]): void {
        try {
            fs.writeFileSync(
                this.filePath,
                JSON.stringify(rankings, null, 2),
                "utf-8",
            );
        } catch (error) {
            console.error("[RankingStorage] Failed to write rankings:", error);
        }
    }

    clearRankings(): void {
        try {
            if (fs.existsSync(this.filePath)) {
                fs.unlinkSync(this.filePath);
            }
        } catch (error) {
            console.error("[RankingStorage] Failed to clear rankings:", error);
        }
    }
}

let rankingStorage: RankingStorage;

function createWindow() {
    // プリロードスクリプトのパス
    const preloadPath = path.join(__dirname, "preload.js");

    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        useContentSize: true, // コンテンツエリアのサイズを正確に指定
        resizable: true,
        webPreferences: {
            preload: preloadPath,
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    if (isDev) {
        // 開発モード: Vite開発サーバーに接続
        const VITE_DEV_SERVER_URL =
            process.env["VITE_DEV_SERVER_URL"] || "http://localhost:5173";
        mainWindow.loadURL(VITE_DEV_SERVER_URL);
        mainWindow.webContents.openDevTools();
    } else {
        // 本番モード: ビルド済みファイルを読み込み
        mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
    }

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

// IPCハンドラーを設定
function setupIpcHandlers() {
    // アプリバージョン取得
    ipcMain.handle("get-app-version", () => {
        return app.getVersion();
    });

    // ランキング関連のIPCハンドラー
    ipcMain.handle("ranking:get-all", () => {
        return rankingStorage.getRankings();
    });

    ipcMain.handle("ranking:add-entry", (_event, entry: RankingEntry) => {
        const rankings = rankingStorage.getRankings();
        rankings.push(entry);
        // スコア順にソート（降順）
        rankings.sort((a, b) => b.score - a.score);
        // 上位50件のみ保持
        const MAX_RANKING_ENTRIES = 50;
        const topEntries = rankings.slice(0, MAX_RANKING_ENTRIES);
        rankingStorage.setRankings(topEntries);
        return topEntries;
    });

    ipcMain.handle("ranking:clear", () => {
        rankingStorage.clearRankings();
        return true;
    });
}

app.on("ready", () => {
    rankingStorage = new RankingStorage();
    setupIpcHandlers();
    createWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});
