import defaultGameData from './sampleGameData.json';
import BattleCapable from '../lib/BattleCapable';
import BattleStage from '../lib/BattleStage';
import Random from '../util/Random';

export default class GameData {
  player: Player;

  private static PLAYER_DATA_KEY = "game_data";
  private static _instance: GameData;

  private constructor() {
    this.player = new Player();

    const loadedPlayerData = localStorage.getItem(GameData.PLAYER_DATA_KEY);
    if (loadedPlayerData == null) {
      Object.assign(this.player, defaultGameData.playerData)
    } else {
      console.log('Loading saved data');
      Object.assign(this.player, JSON.parse(loadedPlayerData));
    }
  }

  public static Instance(): GameData {
    if (!this._instance) {
      this._instance = new GameData();
    }
    return this._instance;
  }

  public saveDate() {
    console.log('SAVING DATA');
    localStorage.setItem(GameData.PLAYER_DATA_KEY, JSON.stringify(this.player));
  }
}

export class Player extends BattleCapable {
  public gold: integer;
  private character: Phaser.GameObjects.Sprite;

  constructor() {
    super('Evan', {
      maxHealth: 42,
      health: 42,
      attack: +3,
      defence: +0,
      speed: +0
    })
    // you can set the name of player after-the-fact with `player.name = 'new Name'`
  }

  async doAttack(stage: BattleStage, preSelectedTarget?: BattleCapable) {
    this.readyToParry = null;
    const target = preSelectedTarget || Random.pick(stage.enemies());
    const amount = Random.roll(10) + this.stats.attack
    stage.log(`${this} attacks ${target} for ${amount} damage.`)
    await target.decideDamage(amount);
  }


  async doRest(stage: BattleStage, self?: BattleCapable) {
    stage.log(`${this} rests for a moment.`)
    self.stats.health+=self.stats.maxHealth*.5;
    if (self.stats.health>=self.stats.maxHealth) {
      self.stats.health=self.stats.maxHealth;
    }
  }

  // HACK, maybe include the BattleStage as a parameter to this function? Or maybe
  //   upon begining of battle, have the stage call "setStage" and expect each actor
  //   to save it locally.
  private readyToParry: BattleStage = null;
  async setupDefence(stage: BattleStage) {
    this.readyToParry = stage;
    stage.getVictors().then(_ => this.readyToParry = null)
    stage.log(`${this} lowers his stance.`)
  }
  // this function should probabyl have a ref to BattleStage
  async decideDamage(amount: number) {
    if(this.readyToParry) {
      // attempt to parry
      const roll = Random.roll(1, 3)
      if(roll === 3) {
        this.readyToParry.log(`${this} parries!`)
        const stage = this.readyToParry
        const target = this.readyToParry.currentActor()
        await this.doAttack(stage, target);
        await this.doAttack(stage, target);
      } else {
        this.readyToParry.log(`${this} is unable to parry!`)
        this.stats.health -= amount;
      }
      this.readyToParry = null
    } else {
      this.stats.health -= amount;
    }
  }

  getStagePresence(reference: Phaser.Scene) : Phaser.GameObjects.Sprite {
    this.character = new Phaser.GameObjects.Sprite(reference, 0, 0, "player", 11)
    reference.anims.create({
      key: 'walk',
      frames: reference.anims.generateFrameNumbers('player', { start: 1, end: 4 }),
      frameRate: 2,
      repeat: Infinity
    });
    this.character.anims.play("walk")
    return this.character;
  }

  /**
   * This function is called by the BattleStage, but we need a way of allowing
   * us to show a menu while it's our turn. So we'll implement another function
   * to let us know when it's our turn, and allow us to set our action
   * synchronously in the update loop.
   *
   * You shouldn't call this.
   */
  async act( stage: BattleStage ) {
    this.ourTriggerPromise = new Promise(res => this.ourTriggerResolver = res);
    this.readyToAct = true;
    const callback = await this.ourTriggerPromise;
    await callback(stage); // do passed in action
  }

  get isReadyToAct() : boolean { return this.readyToAct; }
  private readyToAct: boolean = false;
  private ourTriggerPromise: Promise<(stage: BattleStage) => Promise<void>>
  private ourTriggerResolver: any // unsure of how to type this.
  setAction(callback: (stage: BattleStage) => Promise<void>) : void {
    this.readyToAct = false;
    this.ourTriggerResolver(callback);
  }


}
