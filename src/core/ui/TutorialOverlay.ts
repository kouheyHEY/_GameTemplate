import Phaser from "phaser";

export type SpotlightShape = "circle" | "rectangle";

export interface SpotlightArea {
    x: number;
    y: number;
    width: number;
    height: number;
    shape: SpotlightShape;
}

export class TutorialOverlay extends Phaser.GameObjects.Graphics {
    private overlayColor: number = 0x000000;
    private overlayAlpha: number = 0.7;

    constructor(scene: Phaser.Scene) {
        super(scene);
        scene.add.existing(this);
        this.setDepth(2000); // 常に最前面に表示
        this.setScrollFactor(0);
    }

    /**
     * 指定されたエリアにスポットライトを当てる
     */
    public showSpotlight(area: SpotlightArea): void {
        this.clear();
        
        const { width: sceneWidth, height: sceneHeight } = this.scene.scale;

        // 全体を塗りつぶす
        this.fillStyle(this.overlayColor, this.overlayAlpha);
        this.beginPath();
        this.moveTo(0, 0);
        this.lineTo(sceneWidth, 0);
        this.lineTo(sceneWidth, sceneHeight);
        this.lineTo(0, sceneHeight);
        this.closePath();
        this.fillPath();

        // スポットライト部分を「穴」として描画
        // PhaserのGraphicsでは直接「穴」を開けるのが難しいため、
        // ブレンドモードを使用して切り抜く方法を採ります。
        this.setBlendMode(Phaser.BlendModes.ERASE);
        
        this.fillStyle(0xffffff, 1);
        if (area.shape === "circle") {
            this.fillCircle(area.x, area.y, area.width / 2);
        } else {
            this.fillRect(
                area.x - area.width / 2, 
                area.y - area.height / 2, 
                area.width, 
                area.height
            );
        }

        // ブレンドモードを戻す
        this.setBlendMode(Phaser.BlendModes.NORMAL);

        // 描画をレンダリングテクスチャに反映させるなどの工夫が必要な場合がありますが、
        // 簡易的な実装として、ここでは「ERASE」を用いた方法を示します。
        // ※ERASEはシーン全体の描画に影響するため、通常はRenderTexture等と組み合わせて使用します。
    }

    /**
     * オーバーレイを非表示にする
     */
    public hide(): void {
        this.clear();
    }
}
