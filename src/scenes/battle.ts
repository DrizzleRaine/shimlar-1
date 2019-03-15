import * as Phaser from 'phaser'
import { ShimlarKeys } from "../util/ShimlarKeys";
import GameData from "../data/gameData";
import BattleCapable from "../lib/BattleCapable";

export default class BootScene extends Phaser.Scene {

  private player: BattleCapable;
  private enemy: BattleCapable;
  private currentlySelectedMenuItem: number;

  private menuAttack: Phaser.GameObjects.Text;
  private menuDefend: Phaser.GameObjects.Text;
  private menuRun: Phaser.GameObjects.Text;
  private menuItems: Array<Phaser.GameObjects.Text>;

  private keys: ShimlarKeys;
  private enemyText: Phaser.GameObjects.Text;
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
    this.menuItems[this.currentlySelectedMenuItem].setColor('grey');
    this.menuItems[itemSelected].setColor('white');
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

    this.menuAttack = this.add.text(400, 350, "Attack", {
      ...textStyle,
      fill: 'grey',
      fontSize: 28
    }).setOrigin(0.5, 0);

    this.menuDefend = this.add.text(400, 385, "Defend", {
      ...textStyle,
      fill: 'grey',
      fontSize: 28
    }).setOrigin(0.5, 0);

    this.menuRun = this.add.text(400, 420, "Run", {
      ...textStyle,
      fill: 'grey',
      fontSize: 28
    }).setOrigin(0.5, 0);

    this.menuItems = [this.menuAttack, this.menuDefend, this.menuRun];
    this.selectMenuItem(0);

    this.add.text(400, 50, "Battle", {
      ...textStyle,
      fill: 'white'
    }).setOrigin(0.5, 0);

    this.add.text(200, 200, this.player.name + " (" + this.player.stats.health + ")", {
      ...textStyle,
      fill: 'green'
    }).setOrigin(0.5, 0);
    this.add.rectangle(200, 300, 50, 50, 0x00ff00);

    this.enemyText = this.add.text(600, 200, this.getEnemyText(), textStyle)
      .setOrigin(0.5, 0);
    this.add.triangle(630, 300,
      0, 0, -30, 50, 30, 50,
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
      if (menuItemText === "Run") {
        this.switchToMainScene()
      } else if (menuItemText === "Attack") {
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
    return this.enemy.name + " (" + this.enemy.stats.health + ")";
  }
}
