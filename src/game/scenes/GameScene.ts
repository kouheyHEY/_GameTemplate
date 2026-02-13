import { BaseScene } from "../../core/BaseScene";

export default class GameScene extends BaseScene {
    constructor() {
        super("GameScene");
    }

    create() {
        super.create();

        const { width, height } = this.scale;

        this.add
            .text(width / 2, height / 2, "GAMEPLAY", {
                fontSize: "32px",
                color: "#00ff00",
            })
            .setOrigin(0.5);
    }
}
