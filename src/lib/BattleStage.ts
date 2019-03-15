import BattleCapable from './BattleCapable'

export default class BattleStage {
  private current : BattleCapable;
  private queue : Array<BattleCapable> = [];
  private complete: boolean = false;
  // which side is active? (for team() and enemies())
  // false = left, true = right
  private side: boolean;

  constructor(public stage: BattleStageOptions) {}

  private aliveFilter: (actor: BattleCapable) => boolean =
    (actor) => actor.stats.health > 0;

  private ticklock = null;
  async tick() : Promise<void> {
    // check the state of the battle. Is it over?
    if(this.complete) return;
    if(this.stage.left.filter(this.aliveFilter).length === 0
                    || this.stage.right.filter(this.aliveFilter).length === 0) {
      this.complete = true;
      return;
    }

    // have a lock on this function, so it can't be called multiple times out of order.
    let tickcomplete;
    if(this.ticklock) {
      return await this.ticklock
    } else {
      this.ticklock = new Promise(res => tickcomplete = res)
    }

    // is the queue empty? If so, reroll inititive.
    if(this.queue.length === 0) {
      this.queue = [].concat(this.stage.left, this.stage.right)
                     .filter(this.aliveFilter)
                     .map(actor => {
                       // roll the dice
                       return [actor.inititive(), actor]
                     }).sort((a, b) => {
                       // sort by roll
                       return b[0] - a[0]
                     })// remove roll
                     .map(actor => {
                       //console.log(actor[1].toString(), actor[0])
                       return actor[1]
                     })
    }

    this.current = this.queue.shift();
    this.side = this.stage.left.includes(this.current) ? false : true;
    try {
      await this.current.act(this);
    } finally {
      this.ticklock = null;
      tickcomplete();
    }
  }

  enemies() : Array<BattleCapable> {
    // side denotes ACTIVE side. false => left, true => right so we want the opposite.
    let team = this.side ? this.stage.left : this.stage.right;
    return team.filter(this.aliveFilter);
  }
  team() : Array<BattleCapable> {
    // side denotes ACTIVE side. false => left, true => right we want the same team.
    let team = this.side ? this.stage.right : this.stage.left;
    return team.filter(this.aliveFilter);
  }
  currentActor(): BattleCapable {
    return this.current;
  }
  /**
   * A function to allow for "buff me for 3 turns".
   */
  in(_ticks: number) : Promise<BattleStage> {
    throw 'NotImplemented'
  }
  getTurnOrder() : Array<BattleCapable> {
    return this.queue;
  }
  /**
   * A way of overriding turn order in case of an event
   * that prevents an actor from doing their turn or in
   * the case of an actor having mulitple turns this round
   */
  setTurnOrder(newOrder: Array<BattleCapable>) : void {
    this.queue = newOrder;
  }

  haveActorLeaveBattle(actor: BattleCapable) : void {
    // for running away.
  }
  haveActorEnterBattle(actor: BattleCapable, team: string) : void {
    // for multiplayer.
  }

  hasVictor() : boolean {
    return this.complete;
  }
  async getVictors() : Promise<Array<BattleCapable>> {
    while(!this.complete) {
      await this.tick();
    }
    let leftSide = this.stage.left.filter(this.aliveFilter).length
    let rightSide = this.stage.right.filter(this.aliveFilter).length
    return [].concat(leftSide > 0 ? this.stage.left : [], rightSide > 0 ? this.stage.right : [])
  }
}

interface BattleStageOptions {
  left: Array<BattleCapable>;
  right: Array<BattleCapable>;
}
