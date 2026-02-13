import { BaseScene } from "../../core/BaseScene";
import { Button } from "../../core/ui/Button";

export default class TitleScene extends BaseScene {
    constructor() {
        super("TitleScene");
    }

    create() {
        super.create();

        const { width, height } = this.scale;

        // [TitleScene:create] タイトルシーンを初期化
        console.log("[TitleScene:create] タイトルシーンを初期化");

        // 背景グラデーション
        const graphics = this.add.graphics();
        graphics.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x16213e, 0x16213e, 1);
        graphics.fillRect(0, 0, width, height);

        // タイトルテキスト
        const title = this.add
            .text(width / 2, height / 3, "GAME TEMPLATE", {
                fontSize: "64px",
                color: "#0f4c75",
                fontStyle: "bold",
            })
            .setOrigin(0.5);

        // タイトルのパルスアニメーション
        this.tweens.add({
            targets: title,
            scale: { from: 1, to: 1.1 },
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
        });

        // サブタイトル
        this.add
            .text(width / 2, height / 3 + 80, "Phaser 3 + Electron Template", {
                fontSize: "24px",
                color: "#3282b8",
            })
            .setOrigin(0.5);

        // スタートボタン
        new Button(this, width / 2, height / 2 + 50, "START GAME", () => {
            console.log("[TitleScene:Button] ゲームシーンへ遷移");
            this.scene.start("GameScene");
        });

        // 操作説明
        this.add
            .text(
                width / 2,
                height - 50,
                "Click START to begin | Press SPACE to start",
                {
                    fontSize: "16px",
                    color: "#bbe1fa",
                },
            )
            .setOrigin(0.5);

        // スペースキーでもスタート可能
        this.input.keyboard?.once("keydown-SPACE", () => {
            console.log("[TitleScene:Keyboard] SPACEキーでゲーム開始");
            this.scene.start("GameScene");
        });
    }
}
