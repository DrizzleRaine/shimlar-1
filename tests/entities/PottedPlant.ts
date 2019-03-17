import BattleCapable from '../../src/lib/BattleCapable';
import BattleStage from '../../src/lib/BattleStage';
import Random from '../../src/util/Random';

export default class PottedPlant extends BattleCapable {
  constructor() {
    super('Potted Plant', {
       health: 12,
       attack: +2,
      defence: +0,
        speed: +0
    });
  }

  async act(stage: BattleStage) {
    const target = Random.pick(stage.enemies());
    stage.log(`${this} attacks ${target} for 5 damage.`)
    target.decideDamage(5);
  }
}
