import * as Phaser from 'phaser'
import {Player} from "../data/gameData";


export default class BootScene extends Phaser.Scene {

    private expReward: integer;
    private goldReward: integer;
    private player: Player;
    private screen: Phaser.GameObjects.Rectangle;

    constructor() {
        super({
            key: 'victoryscene'
        })
    }

    preload() {
    }

    init(data) {
        this.expReward = data.expReward;
        this.goldReward = data.goldReward;
        this.player = data.player;
    }

    create() {
        this.screen = this.add.rectangle(0, 0, +this.game.config.width, +this.game.config.height, 0x000).setOrigin(0, 0);
        this.add.bitmapText(+this.game.config.width / 2 - 60, +this.game.config.height / 2 - 5, "script", "EXP GAINED:" + this.expReward).setOrigin(0, 0);
        this.add.bitmapText(+this.game.config.width / 2 - 60, +this.game.config.height / 2 + 5, "script", "GOLD GAINED:" + this.goldReward).setOrigin(0, 0);
        this.player.gold += this.goldReward;
        this.player.experience += this.expReward;
        this.levelUpCheck();

        this.screen.setInteractive();
        this.screen.on('pointerdown', () => this.switchToMain());

    }

    update() {


    }

    levelUpCheck() {
        if (this.player.experience > 100) {
            this.add.bitmapText(+this.game.config.width / 2 - 60, +this.game.config.height / 2 + 15, "script", "STAT POINT GAINED").setOrigin(0, 0)
            this.player.experience -= 100;
            this.player.statPoints++;
        }
    }

    switchToMain() {
        console.log("Closed");
        this.scene.resume("boot");
        this.scene.stop();
    }

}
