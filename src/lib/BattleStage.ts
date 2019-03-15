import BattleCapable from './BattleCapable'

export default class BattleStage {
  constructor(public stage: BattleStageOptions) {}
  async tick() : Promise<void> {
    throw 'NotImplemented'
  }
  enemies() : Array<BattleCapable> {
    throw 'NotImplemented'
  }
  team() : Array<BattleCapable> {
    throw 'NotImplemented'
  }
  currentActor(): BattleCapable {
    throw 'NotImplemented'
  }
  /**
   * A function to allow for "buff me for 3 turns".
   */
  in(_ticks: number) : Promise<BattleStage> {
    throw 'NotImplemented'
  }
  getTurnOrder() : Array<BattleCapable> {
    throw 'NotImplemented'
  }
  /**
   * A way of overriding turn order in case of an event
   * that prevents an actor from doing their turn or in
   * the case of an actor having mulitple turns this round
   */
  setTurnOrder(_newOrder: Array<BattleCapable>) : void {
    throw 'NotImplemented'
  }
  hasVictor() : boolean {
    throw 'NotImplemented'
  }
  async getVictors() : Promise<Array<BattleCapable>> {
    throw 'NotImplemented'
  }
}

interface BattleStageOptions {
  left: Array<BattleCapable>;
  right: Array<BattleCapable>;
}
