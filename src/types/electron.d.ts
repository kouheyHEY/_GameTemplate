// Electron APIの型定義

interface RankingEntry {
    score: number;
    date: string;
    playerName?: string;
}

interface ElectronAPI {
    getAppVersion: () => Promise<string>;
    ranking: {
        getAll: () => Promise<RankingEntry[]>;
        addEntry: (entry: RankingEntry) => Promise<RankingEntry[]>;
        clear: () => Promise<boolean>;
    };
}

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}

export {};
