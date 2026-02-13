import Phaser from "phaser";

export class InputManager {
    private scene: Phaser.Scene;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
    private keys: Record<string, Phaser.Input.Keyboard.Key> = {};

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        if (this.scene.input.keyboard) {
            this.cursors = this.scene.input.keyboard.createCursorKeys();
        }
    }

    public addKey(
        keyName: string,
        keyCode: number,
    ): Phaser.Input.Keyboard.Key | null {
        if (!this.scene.input.keyboard) return null;
        if (this.keys[keyName]) return this.keys[keyName];

        const key = this.scene.input.keyboard.addKey(keyCode);
        this.keys[keyName] = key;
        return key;
    }

    public isKeyPressed(keyName: string): boolean {
        const key =
            this.keys[keyName] ||
            this.cursors?.[
                keyName as keyof Phaser.Types.Input.Keyboard.CursorKeys
            ];
        return key ? key.isDown : false;
    }

    public isKeyJustPressed(keyName: string): boolean {
        const key =
            this.keys[keyName] ||
            this.cursors?.[
                keyName as keyof Phaser.Types.Input.Keyboard.CursorKeys
            ];
        return key ? Phaser.Input.Keyboard.JustDown(key) : false;
    }

    public getCursors(): Phaser.Types.Input.Keyboard.CursorKeys | null {
        return this.cursors;
    }

    public destroy(): void {
        // Cleanup if needed
    }
}
