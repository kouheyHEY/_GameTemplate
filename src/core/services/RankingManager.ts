import { ServiceLocator } from "../ServiceLocator";

/**
 * ランキングエントリーの型定義
 */
export interface RankingEntry {
    score: number;
    date: string;
    playerName?: string;
}

/**
 * ElectronのランキングAPIをラップするサービス
 */
export class RankingManager {
    constructor() {
        console.log("[RankingManager] Initialized");
    }

    /**
     * ランキング全データを取得
     */
    public async getAll(): Promise<RankingEntry[]> {
        if (window.electronAPI && window.electronAPI.ranking) {
            try {
                return await window.electronAPI.ranking.getAll();
            } catch (error) {
                console.error("[RankingManager:getAll] Failed to fetch rankings:", error);
                return [];
            }
        }
        console.warn("[RankingManager:getAll] Electron API not available. Returning empty array.");
        return [];
    }

    /**
     * スコアをランキングに追加
     */
    public async addEntry(score: number, playerName?: string): Promise<RankingEntry[]> {
        const entry: RankingEntry = {
            score,
            date: new Date().toISOString(),
            playerName: playerName || "PLAYER",
        };

        if (window.electronAPI && window.electronAPI.ranking) {
            try {
                return await window.electronAPI.ranking.addEntry(entry);
            } catch (error) {
                console.error("[RankingManager:addEntry] Failed to add ranking entry:", error);
                return [];
            }
        }
        console.warn("[RankingManager:addEntry] Electron API not available.");
        return [];
    }

    /**
     * ランキングをクリア
     */
    public async clear(): Promise<boolean> {
        if (window.electronAPI && window.electronAPI.ranking) {
            try {
                return await window.electronAPI.ranking.clear();
            } catch (error) {
                console.error("[RankingManager:clear] Failed to clear rankings:", error);
                return false;
            }
        }
        return false;
    }
}
