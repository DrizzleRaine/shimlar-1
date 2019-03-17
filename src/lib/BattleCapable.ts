import BattleStats from './BattleStats';
import BattleStage from './BattleStage';
import Random from '../util/Random';
// import * as Phaser from 'phaser';

export default abstract class BattleCapable {

  constructor(public name: string, public stats: BattleStats) {}

  /**
   * Returns a unique name that can be used in the Battle Log.
   */
  toString() : string {
    return this.name;
  }

  /**
   * Get the base stat values for the individual
   */
  //stats(): BattleStats;

  /**
   * Returns a number that will dictate the order of play. Higher is better.
   */
  inititive() : number {
    return Random.roll(1, 20) + this.stats.speed;
  }

  /**
   * Called when it's the entity's turn. This is where you would perform
   * the individual's logic and animation.
   */
  abstract act( state: BattleStage ) : Promise<void>;

  /**
   * Notify the entity that it should take the given amount of damage. It is up
   * to the entity the exact amount it will take. For example, mayhaps you are
   * wearing a shield that halves all damage.
   * This also provides an opportunity for the actor to animate.
   */
  async decideDamage( amount: number ) : Promise<void> {
    this.stats.health -= amount; // maybe (amount - this.stats.defence) ?
  }

  /**
   * To allow for "half damage on miss", opportunities.
   */
  decideHit( amount: number ) : boolean {
    return amount > 10 + this.stats.defence;
  }

  // getStagePresence(reference: Phaser.Scene) : Phaser.GameObjects.Container {
  //   return new Phaser.GameObjects.Container(reference);
  // }
}
