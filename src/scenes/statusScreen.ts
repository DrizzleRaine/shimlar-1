import * as Phaser from 'phaser'
import {Player} from "../data/gameData";
import BSBUTTON from '../../maps/assets/bsbutton.png';
import TILES from "../../maps/assets/rts.png";
import Random from "../util/Random";

const START_X: integer = 10;
const START_Y: integer = 10;
const WIDTH: integer = 240 - 20;
const HEIGHT: integer = 160 - 20;

export default class BootScene extends Phaser.Scene {

    private statusKey: Phaser.Input.Keyboard.Key;
    private debugMouseKey: Phaser.Input.Keyboard.Key;
    private playerDebugText: Phaser.GameObjects.BitmapText;
    private playerName: Phaser.GameObjects.BitmapText;
    private playerHP: Phaser.GameObjects.BitmapText;
    private playerAttack: Phaser.GameObjects.BitmapText;
    private playerDefence: Phaser.GameObjects.BitmapText;
    private playerSpeed: Phaser.GameObjects.BitmapText;
    private playerStatPoints: Phaser.GameObjects.BitmapText;
    private swordName: Phaser.GameObjects.BitmapText;
    private swordAttack: Phaser.GameObjects.BitmapText;
    private swordDefense: Phaser.GameObjects.BitmapText;
    private swordSpeed: Phaser.GameObjects.BitmapText;
    private blacksmithSkill: Phaser.GameObjects.BitmapText;
    private blacksmithButton: Phaser.GameObjects.Image;
    private debugNum: integer = 10;
    private screen: Phaser.GameObjects.Rectangle;
    private player: Player;

    constructor() {
        super({
            key: 'statusscreen'
        })
    }

    preload() {
        this.load.image('bsbutton', BSBUTTON);
    }

    init(player: Player) {
        this.player = player;
    }

    create() {

        this.screen = this.add.rectangle(START_X, START_Y, +WIDTH, +HEIGHT, 0x000).setOrigin(0, 0);

        //Column 1
        this.playerName = this.add.bitmapText(START_X + 5, START_Y + 5, "script", this.player.name.toUpperCase());
        this.playerHP = this.add.bitmapText(START_X + 5, START_Y + 15, "script", "HP:" + this.player.stats.health + "/" + this.player.stats.maxHealth).setOrigin(0, 0);
        this.playerAttack = this.add.bitmapText(START_X + 5, START_Y + 25, "script", "ATK:" + this.player.stats.attack).setOrigin(0, 0);
        this.playerDefence = this.add.bitmapText(START_X + 5, START_Y + 35, "script", "DEF:" + this.player.stats.defence).setOrigin(0, 0);
        this.playerSpeed = this.add.bitmapText(START_X + 5, START_Y + 45, "script", "SPD:" + this.player.stats.speed).setOrigin(0, 0);
        this.playerStatPoints = this.add.bitmapText(START_X + 5, START_Y + 55, "script", "SP:" + this.player.statPoints).setOrigin(0, 0);

        //Column 2
        this.swordName = this.add.bitmapText(START_X + 90, START_Y + 5, "script", "EXCALIPOOR").setOrigin(0, 0);
        this.swordAttack = this.add.bitmapText(START_X + 90, START_Y + 15, "script", "SWD ATK:" + this.player.swordAtk).setOrigin(0, 0);
        this.swordDefense = this.add.bitmapText(START_X + 90, START_Y + 25, "script", "SWD DEF:" + this.player.swordDef).setOrigin(0, 0);
        this.swordSpeed = this.add.bitmapText(START_X + 90, START_Y + 35, "script", "SWD SPD:" + this.player.swordSpd).setOrigin(0, 0);
        this.blacksmithSkill = this.add.bitmapText(START_X + 90, START_Y + 45, "script", "SKILL:" + this.player.blacksmithSkill).setOrigin(0, 0);
        this.blacksmithButton = this.add.image(START_X + 90, START_Y + 55, 'bsbutton').setOrigin(0, 0);
        this.screen.setAlpha(.5);
        this.statusKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.debugMouseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
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

        this.blacksmithButton.setInteractive();
        this.blacksmithButton.on('pointerdown', () => this.smithSword());
    }

    update() {

        this.playerHP.setText("HP:" + this.player.stats.health + "/" + this.player.stats.maxHealth);
        this.playerAttack.setText("ATK:" + this.player.stats.attack);
        this.playerDefence.setText("DEF:" + this.player.stats.defence);
        this.playerSpeed.setText("SPD:" + this.player.stats.speed);
        this.playerStatPoints.setText(("SP:" + this.player.statPoints));
        //this.playerDebugText.setText(`${this.debugNum}`);
        //this.debugNum++;

        this.swordAttack.setText("SWD ATK:" + this.player.swordAtk)
        this.swordDefense.setText("SWD DEF:" + this.player.swordDef)
        this.swordSpeed.setText("SWD SPD:" + this.player.swordSpd)
        this.blacksmithSkill.setText("SKILL:" + this.player.blacksmithSkill)

        if (Phaser.Input.Keyboard.JustDown(this.statusKey)) {
            this.scene.resume("boot");
            this.scene.stop();
        }
        if (Phaser.Input.Keyboard.JustDown(this.debugMouseKey)) {
            console.info("X:" + this.input.activePointer.worldX + " Y:" + this.input.activePointer.worldY);
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

    smithSword() {
        this.player.gold -= 50;
        if (Random.roll(100) < this.player.blacksmithSkill) {
            this.player.swordAtk++;
        }
        if (Random.roll(100) < this.player.blacksmithSkill) {
            this.player.swordDef++;
        }
        if (Random.roll(100) < this.player.blacksmithSkill) {
            this.player.swordSpd++;
        }
        if (Random.roll(100) > this.player.blacksmithSkill) {
            this.player.blacksmithSkill++;
        }

    }


}
