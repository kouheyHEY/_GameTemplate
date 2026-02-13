import Phaser from "phaser";
import { COLORS } from "../consts/Colors";
import { FONTS, FONT_SIZES } from "../consts/Styles";

export abstract class CorePreloadScene extends Phaser.Scene {
    private loadingBar!: Phaser.GameObjects.Graphics;
    private progressBar!: Phaser.GameObjects.Graphics;
    private percentText!: Phaser.GameObjects.Text;
    private loadingText!: Phaser.GameObjects.Text;

    constructor(key: string) {
        super({ key });
    }

    preload() {
        this.createLoadingUI();
        this.setupLoadingEvents();
        this.loadAssets();
    }

    /**
     * Override this method to load your game assets
     */
    abstract loadAssets(): void;

    /**
     * Override this method to specify the next scene to start
     */
    abstract getNextSceneKey(): string;

    private createLoadingUI() {
        const { width, height } = this.cameras.main;
        const centerX = width / 2;
        const centerY = height / 2;

        // Background for loading bar
        this.loadingBar = this.add.graphics();
        this.loadingBar.fillStyle(0x222222, 0.8);
        this.loadingBar.fillRect(centerX - 160, centerY + 30, 320, 30);

        // Progress bar
        this.progressBar = this.add.graphics();

        // Loading text
        this.loadingText = this.add
            .text(centerX, centerY - 50, "Loading...", {
                fontFamily: FONTS.DEFAULT,
                fontSize: FONT_SIZES.XL,
                color: COLORS.WHITE,
            })
            .setOrigin(0.5);

        // Percentage text
        this.percentText = this.add
            .text(centerX, centerY, "0%", {
                fontFamily: FONTS.DEFAULT,
                fontSize: FONT_SIZES.LG,
                color: COLORS.WHITE,
            })
            .setOrigin(0.5);
    }

    private setupLoadingEvents() {
        this.load.on("progress", (value: number) => {
            if (this.percentText && this.progressBar) {
                this.percentText.setText(`${Math.floor(value * 100)}%`);
                this.progressBar.clear();
                this.progressBar.fillStyle(0x00ff00, 1);
                this.progressBar.fillRect(
                    this.cameras.main.width / 2 - 150,
                    this.cameras.main.height / 2 + 35,
                    300 * value,
                    20,
                );
            }
        });

        this.load.on("complete", () => {
            this.progressBar.destroy();
            this.loadingBar.destroy();
            this.loadingText.destroy();
            this.percentText.destroy();

            this.scene.start(this.getNextSceneKey());
        });
    }
}
