import Phaser from "phaser";

export interface ModalConfig {
    width?: number;
    height?: number;
    title?: string;
    message: string;
    buttons?: ModalButtonConfig[];
    onClickOutside?: () => void;
}

export interface ModalButtonConfig {
    text: string;
    callback: () => void;
}

export class Modal {
    private scene: Phaser.Scene;
    private container!: Phaser.GameObjects.Container;
    private overlay!: Phaser.GameObjects.Rectangle;
    private config: ModalConfig;

    constructor(scene: Phaser.Scene, config: ModalConfig) {
        this.scene = scene;
        this.config = config;
        this.create();
    }

    private create(): void {
        const width = this.config.width ?? 600;
        const height = this.config.height ?? 400;

        // Overlay
        this.overlay = this.scene.add
            .rectangle(
                0,
                0,
                this.scene.scale.width,
                this.scene.scale.height,
                0x000000,
                0.7,
            )
            .setOrigin(0)
            .setInteractive()
            .setScrollFactor(0)
            .setDepth(1000);

        if (this.config.onClickOutside) {
            this.overlay.on("pointerdown", this.config.onClickOutside);
        }

        // Container
        this.container = this.scene.add.container(
            this.scene.scale.width / 2,
            this.scene.scale.height / 2,
        );
        this.container.setScrollFactor(0).setDepth(1001);

        // Background
        const bg = this.scene.add.rectangle(
            0,
            0,
            width,
            height,
            0x222222,
            0.95,
        );
        bg.setStrokeStyle(4, 0xffffff);
        this.container.add(bg);

        // Title
        if (this.config.title) {
            const title = this.scene.add
                .text(0, -height / 2 + 40, this.config.title, {
                    fontSize: "32px",
                    color: "#ffff00",
                    fontStyle: "bold",
                })
                .setOrigin(0.5);
            this.container.add(title);
        }

        // Message
        const message = this.scene.add
            .text(0, 0, this.config.message, {
                fontSize: "24px",
                color: "#ffffff",
                wordWrap: { width: width - 80 },
                align: "center",
            })
            .setOrigin(0.5);
        this.container.add(message);

        // Buttons
        if (this.config.buttons) {
            let startY = height / 2 - 60;
            this.config.buttons.forEach((btn, index) => {
                const btnContainer = this.createButton(btn);
                btnContainer.y =
                    startY - (this.config.buttons!.length - 1 - index) * 60; // Stack from bottom
                this.container.add(btnContainer);
            });
        }

        this.container.setScale(0);
        this.scene.tweens.add({
            targets: this.container,
            scale: 1,
            duration: 300,
            ease: "Back.out",
        });
    }

    private createButton(
        config: ModalButtonConfig,
    ): Phaser.GameObjects.Container {
        const container = this.scene.add.container(0, 0);
        const bg = this.scene.add
            .rectangle(0, 0, 160, 50, 0x4444ff)
            .setInteractive({ useHandCursor: true })
            .setStrokeStyle(2, 0xffffff);
        const text = this.scene.add
            .text(0, 0, config.text, { fontSize: "20px" })
            .setOrigin(0.5);

        container.add([bg, text]);

        bg.on("pointerdown", () => {
            config.callback();
            this.close();
        });

        return container;
    }

    public close(): void {
        this.scene.tweens.add({
            targets: [this.container, this.overlay],
            alpha: 0,
            duration: 200,
            onComplete: () => this.destroy(),
        });
    }

    public destroy(): void {
        this.container.destroy();
        this.overlay.destroy();
    }
}
