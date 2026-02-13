import { contextBridge, ipcRenderer } from "electron";

// ランキングエントリーの型定義
interface RankingEntry {
    score: number;
    date: string;
    playerName?: string;
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electronAPI", {
    // アプリバージョン取得
    getAppVersion: (): Promise<string> => ipcRenderer.invoke("get-app-version"),

    // ランキング関連API
    ranking: {
        getAll: (): Promise<RankingEntry[]> =>
            ipcRenderer.invoke("ranking:get-all"),
        addEntry: (entry: RankingEntry): Promise<RankingEntry[]> =>
            ipcRenderer.invoke("ranking:add-entry", entry),
        clear: (): Promise<boolean> => ipcRenderer.invoke("ranking:clear"),
    },
});

console.log("[Preload] Preload script loaded");
