import Phaser from "phaser";

export interface SoundManagerConfig {
    defaultBgmVolume?: number;
    defaultSeVolume?: number;
    defaultFadeDuration?: number;
}

const DEFAULT_CONFIG = {
    defaultBgmVolume: 0.3,
    defaultSeVolume: 0.3,
    defaultFadeDuration: 1000,
} as const;

export class SoundManager {
    private scene: Phaser.Scene | null = null;
    private bgmVolume: number;
    private seVolume: number;
    private defaultFadeDuration: number;
    private currentBgm: Phaser.Sound.BaseSound | null = null;

    constructor(config: SoundManagerConfig = {}) {
        this.bgmVolume =
            config.defaultBgmVolume ?? DEFAULT_CONFIG.defaultBgmVolume;
        this.seVolume =
            config.defaultSeVolume ?? DEFAULT_CONFIG.defaultSeVolume;
        this.defaultFadeDuration =
            config.defaultFadeDuration ?? DEFAULT_CONFIG.defaultFadeDuration;
    }

    public setScene(scene: Phaser.Scene): void {
        this.scene = scene;
    }

    public playBgm(key: string, loop: boolean = true): void {
        if (!this.scene) return;
        this.stopBgm();

        this.currentBgm = this.scene.sound.add(key, {
            volume: this.bgmVolume,
            loop: loop,
        });
        this.currentBgm.play();
    }

    public stopBgm(): void {
        if (this.currentBgm) {
            this.currentBgm.stop();
            this.currentBgm.destroy();
            this.currentBgm = null;
        }
    }

    public fadeOutBgm(duration?: number): void {
        if (!this.scene || !this.currentBgm) return;

        const fadeDuration = duration ?? this.defaultFadeDuration;
        this.scene.tweens.add({
            targets: this.currentBgm,
            volume: 0,
            duration: fadeDuration,
            onComplete: () => {
                this.stopBgm();
            },
        });
    }

    public setBgmVolume(volume: number): void {
        this.bgmVolume = Math.max(0, Math.min(1, volume));
        if (this.currentBgm && (this.currentBgm as any).setVolume) {
            (this.currentBgm as any).setVolume(this.bgmVolume);
        }
    }

    public playSe(key: string, volume?: number): void {
        if (!this.scene) return;
        const seVolume = volume ?? this.seVolume;
        if (!this.scene.cache.audio.exists(key)) {
            console.warn(`[SoundManager] Sound key "${key}" not found.`);
            return;
        }
        this.scene.sound.play(key, { volume: seVolume });
    }

    public setSeVolume(volume: number): void {
        this.seVolume = Math.max(0, Math.min(1, volume));
    }

    public stopAll(): void {
        this.stopBgm();
        this.scene?.sound.stopAll();
    }
}
