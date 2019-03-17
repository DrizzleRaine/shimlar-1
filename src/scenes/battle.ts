import * as Phaser from 'phaser'
import { ShimlarKeys } from "../util/ShimlarKeys";
import GameData from "../data/gameData";
import BattleCapable from "../lib/BattleCapable";

export default class BootScene extends Phaser.Scene {

  private player: BattleCapable;
  private enemy: BattleCapable;
  private currentlySelectedMenuItem: number;

  private menuAttack: Phaser.GameObjects.BitmapText;
  private menuDefend: Phaser.GameObjects.BitmapText;
  private menuRun: Phaser.GameObjects.BitmapText;
  private menuItems: Array<Phaser.GameObjects.BitmapText>;
  private menuSelector: Phaser.GameObjects.BitmapText;

  private keys: ShimlarKeys;
  private enemyText: Phaser.GameObjects.BitmapText;
  private gameData: GameData;

  constructor() {
    super({
      key: 'battle'
    })
  }

  init({ player, enemy }) {
    this.player = player;
    this.enemy = enemy;
    this.currentlySelectedMenuItem = 0;
  }

  selectMenuItem(itemSelected: number) {
    if (itemSelected >= this.menuItems.length) {
      itemSelected = 0;
    } else if (itemSelected < 0) {
      itemSelected = this.menuItems.length - 1;
    }
    this.menuSelector.x = this.menuItems[itemSelected].x - 10;
    this.menuSelector.y = this.menuItems[itemSelected].y;
    this.currentlySelectedMenuItem = itemSelected;
  }

  create() {
    this.gameData = GameData.Instance();

    const textStyle = {
      fill: 'red',
      fontFamily: "Fira Code",
      fontSize: 35
    };

    this.add.rectangle(0,0, +this.game.config.width, +this.game.config.height, 0x1a1a1a)
    .setOrigin(0,0);

    this.menuAttack = this.add.bitmapText(20, 110, "script", "ATTACK").setOrigin(0, 0);
    this.menuDefend = this.add.bitmapText(20, 120, "script", "DEFEND").setOrigin(0.0, 0);
    this.menuRun    = this.add.bitmapText(20, 130, "script", "RUN").setOrigin(0, 0);
    this.menuSelector = this.add.bitmapText(10, 110, "script", "◀").setOrigin(0,0);

    this.menuItems = [this.menuAttack, this.menuDefend, this.menuRun];
    this.selectMenuItem(0);

    this.add.bitmapText(20, 20, "script", (this.player.name + " (" + this.player.stats.health + ")").toUpperCase()).setOrigin(0, 0);
    this.add.rectangle(30, 70, 20, 20, 0x00ff00);

    this.enemyText = this.add.bitmapText(280, 20, "script", this.getEnemyText()).setOrigin(1, 0);
    this.add.triangle(275, 70,
      0, 0, -12, 20, 12, 20,
      0xff0000);

    this.keys = new ShimlarKeys;
    this.keys.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.keys.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keys.down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.keys.s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keys.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.keys.up) || Phaser.Input.Keyboard.JustDown(this.keys.w)) {
      this.selectMenuItem(this.currentlySelectedMenuItem - 1);
    }
    if (Phaser.Input.Keyboard.JustDown(this.keys.down) || Phaser.Input.Keyboard.JustDown(this.keys.s)) {
      this.selectMenuItem(this.currentlySelectedMenuItem + 1);
    }
    if (Phaser.Input.Keyboard.JustDown(this.keys.enter)) {
      const menuItemText = this.menuItems[this.currentlySelectedMenuItem].text;
      console.log(menuItemText);
      if (menuItemText === "RUN") {
        this.switchToMainScene()
      } else if (menuItemText === "ATTACK") {
        this.enemy.stats.health -= 3;
        if (this.enemy.stats.health <= 0) {
          // Enemy dead! Do dead enemy things!...For now go to boot screen.
          this.gameData.player.gold += 7;
          this.switchToMainScene()
        } else {
          this.enemyText.setText(this.getEnemyText())
        }
      }
    }

  }

  private switchToMainScene() {
    this.scene.resume("boot");
    this.scene.stop();
  }

  private getEnemyText(): string {
    return (this.enemy.name + " (" + this.enemy.stats.health + ")").toUpperCase();
  }
}
