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
                    },
                    {
                        entry: "electron/preload.ts",
                        onstart(options) {
                            options.reload();
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
