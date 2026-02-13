import { BaseScene } from "../../core/BaseScene";
import { Button } from "../../core/ui/Button";

export default class TitleScene extends BaseScene {
    constructor() {
        super("TitleScene");
    }

    create() {
        super.create();

        const { width, height } = this.scale;

        this.add
            .text(width / 2, height / 3, "MY GAME TITLE", {
                fontSize: "48px",
                color: "#ffffff",
            })
            .setOrigin(0.5);

        new Button(this, width / 2, height / 2, "START", () => {
            this.scene.start("GameScene");
        });
    }
}
