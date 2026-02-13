import Phaser from "phaser";
import { ServiceLocator } from "./ServiceLocator";
import { SoundManager } from "./services/SoundManager";
import { InputManager } from "./services/InputManager";

/**
 * Base Scene Class
 * Handles common lifecycle events and provides utility methods.
 */
export abstract class BaseScene extends Phaser.Scene {
    protected inputManager!: InputManager;

    constructor(key: string) {
        super({ key });
    }

    protected init(data?: any): void {
        console.log(`[Scene] Init: ${this.scene.key}`, data);
    }

    protected create(): void {
        console.log(`[Scene] Create: ${this.scene.key}`);

        // Initialize Input Manager
        this.inputManager = new InputManager(this);

        // Update SoundManager's scene reference
        try {
            const soundManager =
                ServiceLocator.get<SoundManager>("SoundManager");
            soundManager.setScene(this);
        } catch (e) {
            console.warn("SoundManager not registered in ServiceLocator");
        }

        this.events.on(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);
    }

    /**
     * Helper to transition to another scene with a fade effect.
     */
    protected transitionTo(
        targetScene: string,
        data?: any,
        duration: number = 500,
    ): void {
        this.cameras.main.fadeOut(duration, 0, 0, 0);
        this.cameras.main.once(
            Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
            () => {
                this.scene.start(targetScene, data);
            },
        );
    }

    protected shutdown(): void {
        console.log(`[Scene] Shutdown: ${this.scene.key}`);
        this.inputManager?.destroy();
        this.events.off(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);
    }

    protected get soundManager(): SoundManager {
        return ServiceLocator.get<SoundManager>("SoundManager");
    }
}
