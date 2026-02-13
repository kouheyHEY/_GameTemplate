import { CorePreloadScene } from "../../core/scenes/CorePreloadScene";

export default class PreloadScene extends CorePreloadScene {
    constructor() {
        super("PreloadScene");
    }

    loadAssets(): void {
        // Load your game assets here
        // this.load.image('logo', 'assets/logo.png');
        // this.load.audio('bgm', 'assets/audio/bgm.mp3');
    }

    getNextSceneKey(): string {
        return "TitleScene";
    }
}
