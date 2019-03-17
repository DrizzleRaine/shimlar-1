import * as Phaser from 'phaser'
import MAP from '../../maps/fantasy.csv'
import TILES from '../../maps/assets/rts.png'
import FONT from '../../maps/assets/gba.png'
// import PLAYER from '../../maps/assets/player?.png'
import GameData from '../data/gameData';
import Goblin from '../entities/Goblin';

export default class BootScene extends Phaser.Scene {

  private x: integer = 700;
  private y: integer = 700;
  private map: Phaser.Tilemaps.Tilemap;
  private tileset: Phaser.Tilemaps.Tileset;
  private player: Phaser.GameObjects.GameObject;
  private keys: Phaser.Input.Keyboard.CursorKeys;
  private battleKey: Phaser.Input.Keyboard.Key;
  private playerSpeed: integer = 300;
  private gameData: GameData;
  private playerGoldText: Phaser.GameObjects.BitmapText;
  private playerDebugText: Phaser.GameObjects.BitmapText;

  constructor() {
    super({
      key: 'boot'
    })
  }

  preload() {
    this.load.image('tiles', TILES);
    this.load.tilemapCSV('map', MAP);
    this.load.image('font', FONT);
    // this.load.image('player', PLAYER);
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
    this.map = this.make.tilemap({key:'map', tileWidth: 126, tileHeight: 126});
    // Set the Ground layer in our map to the asset `tiles`, specifying the
    // size of  the tiles.
    this.tileset = this.map.addTilesetImage('Ground', 'tiles', 126, 126, 65, 66);
    // Render a single static texture from layer 0 aka Ground
    this.map.createStaticLayer(0, this.tileset, 0, 0);

    this.player = this.add.circle(this.x, this.y, 12, 0xff0000);
    this.physics.add.existing(this.player);

    // set the camera to stay within our map, when following the player.
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(this.player);

    this.keys = this.input.keyboard.createCursorKeys();
    this.battleKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.playerDebugText = this.add.bitmapText(10, 10, 'script', "")
    .setOrigin(0, 0)
    .setScrollFactor(0); // fix it to the top

    this.playerGoldText = this.add.bitmapText(10, 12, 'script', "Gold: " + this.gameData.player.gold)
      .setOrigin(0, -1)
      .setScrollFactor(0, 0); // fix it to the top left
    this.add.bitmapText(1194, 1389, 'script', "⬆ black bar happens because the rts.png tileset rows aren't evenly spaced.".toUpperCase())
  }

  update() {
    // Probably shouldn't do this every frame...:P
    this.playerGoldText.setText(("Gold: " + this.gameData.player.gold.toFixed(0)).toUpperCase());
    this.playerDebugText.setText(`X:${this.player.body.x}  Y:${this.player.body.y}`);
    this.gameData.player.gold += 0.001
    if (Phaser.Input.Keyboard.JustDown(this.battleKey)) {
      const data = {
        player: this.gameData.player,
        enemy: new Goblin()
      };
      this.scene.launch("battle", data);
      this.scene.pause();
    }

    this.player.body.setVelocity(0);
    if(this.keys.left.isDown) {
      this.player.body.setVelocityX(-this.playerSpeed)
    }
    if(this.keys.right.isDown) {
      this.player.body.setVelocityX(this.playerSpeed)
    }
    if(this.keys.up.isDown) {
      this.player.body.setVelocityY(-this.playerSpeed)
    }
    if(this.keys.down.isDown) {
      this.player.body.setVelocityY(this.playerSpeed)
    }
  }

}
