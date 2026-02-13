import Phaser from "phaser";

export class Button extends Phaser.GameObjects.Container {
    private background:
        | Phaser.GameObjects.Rectangle
        | Phaser.GameObjects.Sprite
        | Phaser.GameObjects.Image;
    private label: Phaser.GameObjects.Text;
    private callback: () => void;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        text: string,
        callback: () => void,
    ) {
        super(scene, x, y);

        this.callback = callback;

        // Default style
        this.background = scene.add
            .rectangle(0, 0, 200, 60, 0x444444)
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", this.onPointerDown, this)
            .on("pointerover", this.onPointerOver, this)
            .on("pointerout", this.onPointerOut, this);

        this.label = scene.add
            .text(0, 0, text, {
                fontSize: "24px",
                color: "#ffffff",
                fontFamily: "Arial",
            })
            .setOrigin(0.5);

        this.add(this.background);
        this.add(this.label);

        scene.add.existing(this);
    }

    private onPointerDown(): void {
        this.scene.tweens.add({
            targets: this,
            scaleX: 0.95,
            scaleY: 0.95,
            duration: 50,
            yoyo: true,
            onComplete: () => {
                this.callback();
            },
        });
    }

    private onPointerOver(): void {
        if (this.background instanceof Phaser.GameObjects.Rectangle) {
            this.background.setFillStyle(0x666666);
        }
    }

    private onPointerOut(): void {
        if (this.background instanceof Phaser.GameObjects.Rectangle) {
            this.background.setFillStyle(0x444444);
        }
    }
}
