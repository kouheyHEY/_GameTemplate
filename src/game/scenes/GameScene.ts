import { BaseScene } from "../../core/BaseScene";
import { Button } from "../../core/ui/Button";

export default class GameScene extends BaseScene {
    private score: number = 0;
    private scoreText!: Phaser.GameObjects.Text;

    constructor() {
        super("GameScene");
    }

    create() {
        super.create();

        const { width, height } = this.scale;

        // [GameScene:create] ゲームシーンを初期化
        console.log("[GameScene:create] ゲームシーンを初期化");

        // 背景グラデーション
        const graphics = this.add.graphics();
        // fillGradientStyle(topLeft, topRight, bottomLeft, bottomRight, alpha)
        graphics.fillGradientStyle(0x0f3460, 0x0f3460, 0x16213e, 0x16213e, 1);
        graphics.fillRect(0, 0, width, height);

        // タイトル
        this.add
            .text(width / 2, 50, "GAME SCENE", {
                fontSize: "48px",
                color: "#ffffff",
                fontStyle: "bold",
            })
            .setOrigin(0.5);

        // スコア表示
        this.scoreText = this.add
            .text(width / 2, 120, `Score: ${this.score}`, {
                fontSize: "32px",
                color: "#ffffff",
            })
            .setOrigin(0.5);

        // インタラクティブな円を作成
        this.createInteractiveCircles(width, height);

        // 説明文
        this.add
            .text(
                width / 2,
                height - 100,
                "Click the circles to increase score!",
                {
                    fontSize: "20px",
                    color: "#ffffff",
                },
            )
            .setOrigin(0.5);

        // タイトルに戻るボタン
        new Button(this, width / 2, height - 50, "BACK TO TITLE", () => {
            console.log("[GameScene:Button] タイトルシーンへ戻る");
            this.scene.start("TitleScene");
        });
    }

    /**
     * クリック可能な円を作成
     */
    private createInteractiveCircles(width: number, height: number): void {
        const CIRCLE_COUNT = 5;
        const CIRCLE_RADIUS = 40;
        const colors = [0xe94560, 0x0f4c75, 0x3282b8, 0xbbe1fa, 0x1a1a2e];

        for (let i = 0; i < CIRCLE_COUNT; i++) {
            const x = (width / (CIRCLE_COUNT + 1)) * (i + 1);
            const y = height / 2;

            const circle = this.add.circle(x, y, CIRCLE_RADIUS, colors[i]);
            circle.setInteractive({ useHandCursor: true });

            // ホバーエフェクト
            circle.on("pointerover", () => {
                this.tweens.add({
                    targets: circle,
                    scale: 1.2,
                    duration: 200,
                    ease: "Back.easeOut",
                });
            });

            circle.on("pointerout", () => {
                this.tweens.add({
                    targets: circle,
                    scale: 1,
                    duration: 200,
                });
            });

            // クリックでスコア増加
            circle.on("pointerdown", () => {
                this.score += 10;
                this.scoreText.setText(`Score: ${this.score}`);
                console.log(`[GameScene:Circle] スコア: ${this.score}`);

                // クリックエフェクト
                this.tweens.add({
                    targets: circle,
                    alpha: 0.5,
                    yoyo: true,
                    duration: 100,
                });
            });

            // 浮遊アニメーション
            this.tweens.add({
                targets: circle,
                y: y - 20,
                duration: 1000 + i * 200,
                yoyo: true,
                repeat: -1,
                ease: "Sine.easeInOut",
            });
        }
    }
}
