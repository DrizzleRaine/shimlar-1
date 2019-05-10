import BattleCapable from '../../src/lib/BattleCapable';
import BattleStage from '../../src/lib/BattleStage';
import Random from '../../src/util/Random';

export default class Goblin extends BattleCapable {

  private container: Phaser.GameObjects.Container;
  private character: Phaser.GameObjects.Sprite;

  constructor() {
    super("Avarice", {
      maxHealth: 12,
      health: 12,
      attack: +3,
      defence: +2,
      speed: +0
    });
  }

  async act(stage: BattleStage) {
    await new Promise(res => setTimeout(res, 1500)) // fake animation time?
    const target = Random.pick(stage.enemies())
    const amount = Random.roll(4) + this.stats.attack

    stage.log(`${this} attacks ${target} for ${amount} damage.`)

    await target.decideDamage(amount)
  }

  getStagePresence(reference: Phaser.Scene) : Phaser.GameObjects.Sprite {
    return this.character = new Phaser.GameObjects.Sprite(reference, 50, 50, "goblin")
  }
}
