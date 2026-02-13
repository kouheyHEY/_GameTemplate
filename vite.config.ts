import { defineConfig } from "vite";
import electron from "vite-plugin-electron";
import electronRenderer from "vite-plugin-electron-renderer";

export default defineConfig(({ command, mode }) => {
    const isElectron = mode === "electron";

    return {
        base: "./",
        plugins: [
            isElectron &&
                electron([
                    {
                        entry: "electron/main.ts",
                        onstart(options) {
                            // Electronプロセスを起動
                            options.startup();
                        },
                        vite: {
                            build: {
                                outDir: "dist-electron",
                            },
                        },
                    },
                    {
                        entry: "electron/preload.ts",
                        onstart(options) {
                            // レンダラープロセスをリロード
                            options.reload();
                        },
                        vite: {
                            build: {
                                outDir: "dist-electron",
                            },
                        },
                    },
                ]),
            isElectron && electronRenderer(),
        ].filter(Boolean),
        build: {
            sourcemap: true,
            outDir: "dist",
            rollupOptions: {
                output: {
                    manualChunks: {
                        phaser: ["phaser"],
                    },
                },
            },
        },
        server: {
            port: 3000,
        },
    };
});
