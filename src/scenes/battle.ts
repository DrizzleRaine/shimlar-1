import * as Phaser from 'phaser'
import { ShimlarKeys } from "../util/ShimlarKeys";
import GameData from "../data/gameData";
import BattleCapable from "../lib/BattleCapable";
import BattleStage from '../lib/BattleStage';
import Random from '../util/Random';

export default class BootScene extends Phaser.Scene {

  private battle: BattleStage;
  private currentlySelectedMenuItem: number;

  private menuAttack: Phaser.GameObjects.BitmapText;
  private menuDefend: Phaser.GameObjects.BitmapText;
  private menuRest: Phaser.GameObjects.BitmapText;
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

  init(battle: BattleStage) {
    this.battle = battle;
    this.battle.getVictors().then(alive => {
      console.log("battle complete. survivors: ", alive)
      if (alive.includes(this.gameData.player)) {
        const bodyCount =
          [ ...this.battle.stage.left, ...this.battle.stage.right ]
            .filter(body =>
              body != this.gameData.player && body.stats.health <= 0
            ).length;
        const goldAmt = Random.roll(0, 10 * bodyCount) + 1 * bodyCount
        this.gameData.player.gold += goldAmt;
        console.log("gold aquired: ", goldAmt);
        if (bodyCount == this.battle.stage.right.length) {
          this.gameData.player.statPoints++;
          console.log("1 stat point acquired.");
        }

        this.switchToMainScene();
      } else {
        this.switchToGameOver();
      }
    });

    this.currentlySelectedMenuItem = 0;
  }

  selectMenuItem(itemSelected: number) {
    if (itemSelected >= this.menuItems.length) {
      itemSelected = 0;
    } else if (itemSelected < 0) {
      itemSelected = this.menuItems.length - 1;
    }
    this.menuSelector.x = this.menuItems[ itemSelected ].x - 10;
    this.menuSelector.y = this.menuItems[ itemSelected ].y;
    this.currentlySelectedMenuItem = itemSelected;
  }

  create() {
    this.gameData = GameData.Instance();

    this.add.rectangle(0, 0, +this.game.config.width, +this.game.config.height, 0x1a1a1a)
      .setOrigin(0, 0);

    this.menuAttack = this.add.bitmapText(20, 120, "script", "ATTACK").setOrigin(0, 0);
    this.menuDefend = this.add.bitmapText(20, 130, "script", "DEFEND").setOrigin(0.0, 0);
    this.menuRest = this.add.bitmapText(20,140,"script","REST").setOrigin(0,0);
    this.menuRun = this.add.bitmapText(20, 150, "script", "RUN").setOrigin(0, 0);
    this.menuSelector = this.add.bitmapText(10, 110, "script", "◀").setOrigin(0, 0);

    this.menuItems = [ this.menuAttack, this.menuDefend, this.menuRest, this.menuRun ];
    this.selectMenuItem(0);

    this.setupBattleSpace(this.battle.stage.left, true);
    this.setupBattleSpace(this.battle.stage.right, false);

    this.keys = new ShimlarKeys;
    this.keys.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.keys.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keys.down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.keys.s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keys.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  }

  private allLabels: Array<Array<any>> = [] // HACK: I would have liked a Map<Actors,BitmapText> but typescript doesn't like it.
  setupBattleSpace(actors: Array<BattleCapable>, alignLeft: boolean): void {
    const max = 160;
    const min = 0;
    for (let i = 0; i < actors.length; i++) {
        const entity = actors[i].getStagePresence(this);
        const yPosition = (max - min) / (actors.length + 1) * (i + 1);
        const xPosition = alignLeft ? 10 : 230;
        if(entity != null) {
          entity.setX(xPosition);
          entity.setY(yPosition);
          entity.setFlipX(alignLeft);
          entity.setOrigin(alignLeft?0:1, 1)
          this.add.existing(entity)
        }
        this.allLabels.push([
          actors[i],
          this.add.bitmapText(alignLeft ? 10 : 230, yPosition + 1, 'script', '')
          .setOrigin(alignLeft ? 0 : 1, 0)
      ]);
    }
  }

  private renderLabels() {
    for (let i = 0; i < this.allLabels.length; i++) {
      const [ actor, label ] = this.allLabels[ i ];
      label.setText(`${actor} (${actor.stats.health}♥)`.toUpperCase())
        .setAlpha(this.battle.currentActor() === actor ? 1 : 0.3)
    }
  }

  update() {

    // this should probably only run after a battle tick?
    this.renderLabels();

    if (!this.battle.hasVictor() && this.battle.currentActor() === this.gameData.player) {
      // it's our turn.
      this.menuSelector.clearAlpha()
      if (Phaser.Input.Keyboard.JustDown(this.keys.up) || Phaser.Input.Keyboard.JustDown(this.keys.w)) {
        this.selectMenuItem(this.currentlySelectedMenuItem - 1);
      }
      if (Phaser.Input.Keyboard.JustDown(this.keys.down) || Phaser.Input.Keyboard.JustDown(this.keys.s)) {
        this.selectMenuItem(this.currentlySelectedMenuItem + 1);
      }
      if (Phaser.Input.Keyboard.JustDown(this.keys.enter)) {
        const menuItemText = this.menuItems[ this.currentlySelectedMenuItem ].text;
        this.menuSelector.setAlpha(0)
        if (menuItemText === this.menuRun.text) {
          this.gameData.player.setAction(async (stage) => {
            stage.complete = true;
          })
        } else if (menuItemText === this.menuAttack.text) {
          this.gameData.player.setAction(async (stage) => {
            this.gameData.player.doAttack(stage)
          })
        } else if (menuItemText === this.menuRest.text) {
          this.gameData.player.setAction(async (stage) => {
            this.gameData.player.doRest(stage,this.battle.currentActor())
          })
        } else if (menuItemText === this.menuDefend.text) {
          this.gameData.player.setAction(async (stage) => {
            this.gameData.player.setupDefence(stage);
          })
        }
      }
    } else {
      this.menuSelector.setAlpha(0)
    }

  }

  private switchToMainScene() {
    this.scene.resume("boot");
    this.scene.stop();
  }

  private switchToGameOver(): any {
    this.scene.start("gameover");
  }
}
