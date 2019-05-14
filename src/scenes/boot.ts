import * as Phaser from 'phaser'
import MAP from '../../maps/fantasy.json'
import TILES from '../../maps/assets/rts.png'
import FONT from '../../maps/assets/gba.png'
import PLAYER from '../../maps/assets/player.png'
import GOBLIN from '../../maps/assets/goblin.png'
import ZOMBIE from '../../maps/assets/zombie.png'
import GREENDRAGON from '../../maps/assets/greendragon.png'
import GameData from '../data/gameData';
import Goblin from '../entities/Goblin';
import Zombie from '../entities/Zombie';
import GreenDragon from '../entities/GreenDragon';
import WORLDMAPMONSTER from '../../maps/assets/worldmapmonster.png'
import BattleStage from '../lib/BattleStage';
import Random from '../util/Random';
import BattleCapable from "../lib/BattleCapable";
import Between = Phaser.Math.Distance.Between;
import StaticTilemapLayer = Phaser.Tilemaps.StaticTilemapLayer;

const START_X: integer = 700;
const START_Y: integer = 700;

export default class BootScene extends Phaser.Scene {

    private map: Phaser.Tilemaps.Tilemap;
    private tileset: Phaser.Tilemaps.Tileset;
    private player: Phaser.GameObjects.GameObject;
    private keys: Phaser.Input.Keyboard.CursorKeys;
    private battleKey: Phaser.Input.Keyboard.Key;
    private statusKey: Phaser.Input.Keyboard.Key;
    private saveKey: Phaser.Input.Keyboard.Key;
    private saveTimeSeconds: integer = 0;
    private playerSpeed: integer = 300;
    private gameData: GameData;
    private playerGoldText: Phaser.GameObjects.BitmapText;
    private playerDebugText: Phaser.GameObjects.BitmapText;
    private mobs: Array<Phaser.GameObjects.GameObject> = new Array();
    private layer: Phaser.Tilemaps.StaticTilemapLayer;


    constructor() {
        super({
            key: 'boot'
        })
    }

    preload() {
        this.load.image('tiles', TILES);
        this.load.tilemapTiledJSON('map', MAP);
        this.load.image('font', FONT);
        this.load.spritesheet('player', PLAYER, {frameWidth: 18, frameHeight: 24});
        this.load.image('goblin', GOBLIN);
        this.load.image('zombie', ZOMBIE);
        this.load.image('greendragon', GREENDRAGON);
        this.load.image('worldmapmonster', WORLDMAPMONSTER);
    }


    create() {
        console.log("running scene");
        this.gameData = GameData.Instance();
        const config = {
            image: 'font',
            width: 8,
            height: 8,
            chars: ' !"©♥%◀\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ¿ab⬆⬇',
            charsPerRow: 80
        };
        //@ts-ignore the RetroFont.Parse function is incorrectly typed.
        this.cache.bitmapFont.add('script', Phaser.GameObjects.RetroFont.Parse(this, config));

        // Create the specifications for our map that matched the Tiled settings.
        this.map = this.make.tilemap({key: 'map', tileWidth: 126, tileHeight: 126});
        // Set the Ground layer in our map to the asset `tiles`, specifying the
        // size of  the tiles.
        this.tileset = this.map.addTilesetImage('rts', 'tiles')//, 126, 126, 65, 66);
        // Render a single static texture from layer 0 aka Ground
        this.layer = this.map.createStaticLayer(0, this.tileset, 0, 0);
        this.layer.setCollisionByProperty({collides: true});

        this.player = this.add.circle(START_X, START_Y, 8, 0xff0000);
        this.physics.add.existing(this.player);
        this.physics.add.collider(this.player, this.layer);
        // maybe don't use a statically defined size and dynamically figure it out
        this.player.body.collideWorldBounds = true;
        this.physics.world.setBounds(0, 0, 128 * 32, 128 * 32)

        // set the camera to stay within our map, when following the player.
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player);

        this.keys = this.input.keyboard.createCursorKeys();
        this.battleKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.statusKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.saveKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

        this.playerDebugText = this.add.bitmapText(10, 10, 'script', "")
            .setOrigin(0, 0)
            .setScrollFactor(0); // fix it to the top

        this.playerGoldText = this.add.bitmapText(10, 12, 'script', "Gold: " + this.gameData.player.gold)
            .setOrigin(0, -1)
            .setScrollFactor(0, 0); // fix it to the top left
        this.add.bitmapText(1194, 1389, 'script', "⬆ black bar happens because the rts.png tileset rows aren't evenly spaced.".toUpperCase())

        this.mobs.push(new Phaser.GameObjects.Sprite(this, START_X + 25, START_Y + 25, "worldmapmonster"));
        var timedEvent = this.time.addEvent({delay: 3000, callback: this.spawnMob, callbackScope: this, loop: true});
        this.spawnMob();


    }


    update() {
        // Probably shouldn't do this every frame...:P
        this.playerGoldText.setText(("Gold: " + this.gameData.player.gold.toFixed(0)).toUpperCase());
        this.playerDebugText.setText(`X:${this.player.body.x}  Y:${this.player.body.y}`);

        if (Phaser.Input.Keyboard.JustDown(this.saveKey)) {
            const currentTimeSeconds: integer = Math.floor(Date.now() / 1000);
            if (currentTimeSeconds - this.saveTimeSeconds > 5) {
                // SAVE
                this.saveTimeSeconds = currentTimeSeconds;
                this.gameData.saveDate();
            } else {
                // Don't save, we've saved in the last 5 seconds. Maybe we should output a message.
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.battleKey)) {
            this.startBattle();
        }

        if (Phaser.Input.Keyboard.JustDown(this.statusKey)) {
            this.scene.launch("statusscreen", this.gameData.player);
            this.scene.pause();
        }

        this.player.body.setVelocity(0);
        if (this.keys.left.isDown) {
            this.player.body.setVelocityX(-this.playerSpeed)
        }
        if (this.keys.right.isDown) {
            this.player.body.setVelocityX(this.playerSpeed)
        }
        if (this.keys.up.isDown) {
            this.player.body.setVelocityY(-this.playerSpeed)
        }
        if (this.keys.down.isDown) {
            this.player.body.setVelocityY(this.playerSpeed)
        }

        // this.player.body.velocity.normalize().scale(speed); // todo
    }

    startBattle() {
        this.eraseMobs();
        const enemies = this.createEnemyGroup();
        const battle = new BattleStage({
            left: [this.gameData.player],
            right: enemies
        });
        this.scene.launch("battle", battle);
        this.scene.pause();

        this.keys.down.reset();
        this.keys.left.reset();
        this.keys.right.reset();
        this.keys.up.reset();

    }

    createEnemyGroup(): BattleCapable[] {
        var numberOfEnemies = Random.roll(3);
        var distance: integer = Between(this.player.body.x, this.player.body.y, START_X, START_Y);

        console.log("Distance is:" + distance);

        console.log(numberOfEnemies + " Number of Enemies. Fighting:");

        var enemyArray = new Array();

        if (distance > 1000) {
            enemyArray.push(new GreenDragon());
            return enemyArray;
        }

        for (var i = 0; i < numberOfEnemies; i++) {
            if (Random.roll(1000) > distance) {
                enemyArray.push(new Goblin());
            } else {
                enemyArray.push(new Zombie());
            }
        }
        console.log(enemyArray);
        return enemyArray;
    }

    // TODO: Extremely bad way to do this. Much better would be reusing the same sprites just changing the count. More research needed.
    spawnMob() {
        this.eraseMobs();
        this.mobs = new Array();
        var enemyCount: integer = Random.roll(2) + 1;
        for (var i = 0; i < enemyCount; i++) {
            this.mobs.push(this.add.sprite(this.player.body.x + Random.roll(100) - 50, this.player.body.y + Random.roll(100) - 50, "worldmapmonster"));
            this.physics.add.existing(this.mobs[i]);
            this.physics.add.collider(this.mobs[i], this.layer);
            this.mobs[i].body.collideWorldBounds = true;
            this.physics.add.collider(this.player, this.mobs[i], this.startBattle, this.test, this); // todo I have no clue how the second callback in collider matters
            var x = Random.roll(2);
            var y = Random.roll(2);
            if (x == 2) {
                x = -1
            }
            if (y == 2) {
                y = -1
            }
            this.mobs[i].body.setVelocityX(x);
            this.mobs[i].body.setVelocityY(y);
        }
    }

    eraseMobs() {
        this.mobs.forEach(function (element) {
            element.destroy();
        });
    }

    test(): boolean {
        return true;
    }

}


