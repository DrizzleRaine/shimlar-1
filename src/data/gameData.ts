import defaultGameData from './sampleGameData.json';
import BattleCapable from '../lib/BattleCapable';
import BattleStage from '../lib/BattleStage';

export default class GameData {
  player: Player;

  private static _instance: GameData;

  private constructor() {
    this.player = new Player();
    Object.assign(this.player, defaultGameData.playerData)
  }

  public static Instance(): GameData {
    if (!this._instance) {
      this._instance = new GameData();
    }
    return this._instance;
  }
}

export class Player extends BattleCapable {
  public gold: integer;
  constructor() {
    super('Evan', {
      health: 42,
      attack: +0,
      defence: +0,
      speed: +0
    })
    // you can set the name of player after-the-fact with `player.name = 'new Name'`
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
