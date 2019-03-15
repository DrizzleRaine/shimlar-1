import BattleCapable from '../../src/lib/BattleCapable';
import BattleStage from '../../src/lib/BattleStage';
import Random from '../../src/util/Random';

export default class Goblin extends BattleCapable {
  constructor() {
    super("Avarice", {
      health: 12,
      attack: +3,
      defence: +2,
      speed: +0
    });
  }
  async act(stage: BattleStage) {
    const target = Random.pick(stage.enemies())
    target.decideDamage(10)
  }
}
