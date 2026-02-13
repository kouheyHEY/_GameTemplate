import Phaser from "phaser";
import { GameConfig } from "./config/GameConfig";
import PreloadScene from "./game/scenes/PreloadScene";
import TitleScene from "./game/scenes/TitleScene";
import GameScene from "./game/scenes/GameScene";
import { ServiceLocator } from "./core/ServiceLocator";
import { SoundManager } from "./core/services/SoundManager";

// Register Global Services
ServiceLocator.register("SoundManager", new SoundManager());

const config = {
    ...GameConfig,
    scene: [PreloadScene, TitleScene, GameScene],
};

new Phaser.Game(config);
