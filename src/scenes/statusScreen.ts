import * as Phaser from 'phaser'

export default class BootScene extends Phaser.Scene {

    private statusKey: Phaser.Input.Keyboard.Key;
    private playerDebugText: Phaser.GameObjects.BitmapText;
    private debugNum: integer = 10;

    constructor() {
        super({
            key: 'statusscreen'
        })
    }

    create() {
        this.add.rectangle(50, 50, +this.game.config.width-50, +this.game.config.height-50, 0x000).setOrigin(0, 0);
        this.statusKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        console.info("A Test!");

        this.playerDebugText = this.add.bitmapText(10, 10, 'script', "")
            .setOrigin(0, 0)
            .setScrollFactor(0); // fix it to the top


    }

    update() {

        this.playerDebugText.setText(`${this.debugNum}`);
        this.debugNum++;

        if (Phaser.Input.Keyboard.JustDown(this.statusKey)) {
            this.scene.resume("boot");
            this.scene.stop();
        }

    }

}
