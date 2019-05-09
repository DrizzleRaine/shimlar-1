import * as Phaser from 'phaser'
import {Player} from "../data/gameData";

export default class BootScene extends Phaser.Scene {

    private statusKey: Phaser.Input.Keyboard.Key;
    private playerDebugText: Phaser.GameObjects.BitmapText;
    private playerName: Phaser.GameObjects.BitmapText;
    private playerHP: Phaser.GameObjects.BitmapText;
    private playerAttack: Phaser.GameObjects.BitmapText;
    private playerDefence: Phaser.GameObjects.BitmapText;
    private playerSpeed: Phaser.GameObjects.BitmapText;
    private playerStatPoints: Phaser.GameObjects.BitmapText;
    private debugNum: integer = 10;
    private rectangle: Phaser.GameObjects.Rectangle;
    private player: Player;

    constructor() {
        super({
            key: 'statusscreen'
        })
    }

    init(player: Player) {
        this.player = player;
    }

    create() {

        this.rectangle = this.add.rectangle(25, 25, +this.game.config.width - 50, +this.game.config.height - 50, 0x000).setOrigin(0, 0);
        this.playerName = this.add.bitmapText(30, 30, "script", this.player.name.toUpperCase());
        this.playerHP = this.add.bitmapText(30, 40, "script", "HP:" + this.player.stats.health + "/" + this.player.stats.maxHealth).setOrigin(0, 0);
        this.playerAttack = this.add.bitmapText(30, 50, "script", "ATK:" + this.player.stats.attack).setOrigin(0, 0);
        this.playerDefence = this.add.bitmapText(30, 60, "script", "DEF:" + this.player.stats.defence).setOrigin(0, 0);
        this.playerSpeed = this.add.bitmapText(30, 70, "script", "SPD:" + this.player.stats.speed).setOrigin(0, 0);
        this.playerStatPoints = this.add.bitmapText(30, 80, "script", "STAT POINTS:" + this.player.statPoints).setOrigin(0, 0);
        this.rectangle.setAlpha(.5);
        this.statusKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        console.info("A Test!");


        //this.playerDebugText = this.add.bitmapText(10, 10, 'script', "")
        //   .setOrigin(0, 0)
        // .setScrollFactor(0); // fix it to the top

        this.playerHP.setInteractive();
        this.playerHP.on('pointerdown', () => this.addStats(0));

        this.playerAttack.setInteractive();
        this.playerAttack.on('pointerdown', () => this.addStats(1));

        this.playerDefence.setInteractive();
        this.playerDefence.on('pointerdown', () => this.addStats(2));

        this.playerSpeed.setInteractive();
        this.playerSpeed.on('pointerdown', () => this.addStats(3))
    }

    update() {

        this.playerHP.setText("HP:" + this.player.stats.health + "/" + this.player.stats.maxHealth);
        this.playerAttack.setText("ATK:" + this.player.stats.attack);
        this.playerDefence.setText("DEF:" + this.player.stats.defence);
        this.playerSpeed.setText("SPD:" + this.player.stats.speed);
        this.playerStatPoints.setText(("STAT POINTS:" + this.player.statPoints));
        //this.playerDebugText.setText(`${this.debugNum}`);
        //this.debugNum++;

        if (Phaser.Input.Keyboard.JustDown(this.statusKey)) {
            this.scene.resume("boot");
            this.scene.stop();
        }

    }

    addStats(statSelected: integer) {
        if (this.player.statPoints > 0) {
            this.player.statPoints--;
            switch (statSelected) {
                case 0:
                    this.player.stats.maxHealth += 5;
                    break;
                case 1:
                    this.player.stats.attack++;
                    break;
                case 2:
                    this.player.stats.defence++;
                    break;
                case 3:
                    this.player.stats.speed++;
                    break;

            }

        }
    }


}
