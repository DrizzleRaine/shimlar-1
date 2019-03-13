import * as Phaser from 'phaser'
import MAP from '../../maps/fantasy.csv'
import TILES from '../../maps/assets/rts.png'
// import PLAYER from '../../maps/assets/player?.png'
import GameData from '../data/gameData';

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
  private playerGoldText: Phaser.GameObjects.Text;

  constructor() {
    super({
      key: 'boot'
    })
  }

  preload() {
    this.load.image('tiles', TILES);
    this.load.tilemapCSV('map', MAP);
    // this.load.image('player', PLAYER);
  }

  create() {
    console.log("running scene");
    this.gameData = GameData.Instance();

    // Create the specifications for our map that matched the Tiled settings.
    this.map = this.make.tilemap({key:'map', tileWidth: 126, tileHeight: 126});
    // Set the Ground layer in our map to the asset `tiles`, specifying the
    // size of  the tiles.
    this.tileset = this.map.addTilesetImage('Ground', 'tiles', 126, 126, 65, 66);
    // Render a single static texture from layer 0 aka Ground
    this.map.createStaticLayer(0, this.tileset, 0, 0);

    this.player = this.add.circle(this.x, this.y, 32, 0xff0000);
    this.physics.add.existing(this.player);

    // set the camera to stay within our map, when following the player.
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(this.player);

    this.keys = this.input.keyboard.createCursorKeys();
    this.battleKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.add.text(10, 10, "Arrow keys for movement.", {
      fill: 'white'
    }).setOrigin(0, 0)
    .setScrollFactor(0); // fix it to the top

    this.playerGoldText = this.add.text(10, 10, "Gold: " + this.gameData.player.gold, {
      fill: 'yellow'
    }).setOrigin(0, -1)
      .setScrollFactor(0, 0); // fix it to the top left
  }

  update() {
    // Probably shouldn't do this every frame...:P
    this.playerGoldText.setText("Gold: " + this.gameData.player.gold);
    if (Phaser.Input.Keyboard.JustDown(this.battleKey)) {
      const data = {
        player: { name: 'Evan', hp: 50 },
        enemy: { name: 'Adam', hp: 10 }
      };
      this.scene.launch("battle", data);
      this.scene.pause();
    }

    this.player.body.setVelocity(0);
    if(this.keys.left.isDown) {
      this.player.body.setVelocityX(-300)
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
