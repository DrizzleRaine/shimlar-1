import BattleCapable from '../../src/lib/BattleCapable';
import BattleStage from '../../src/lib/BattleStage';
import Random from '../../src/util/Random';

export default class Goblin extends BattleCapable {
  constructor() {
    super("Avarice", {
      health: 42,
      attack: +3,
      defence: +2,
      speed: +0
    });
  }
  inititive() {
    return 99;
  }
  async act(stage: BattleStage) {
    const target = Random.pick(stage.enemies())
    stage.log(`${this} attacks ${target} for 10 damage.`)
    target.decideDamage(10)
  }
}
