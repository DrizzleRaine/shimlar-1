import { Test, TestFixture, Expect } from "alsatian";
import BattleCapable from '../src/lib/BattleCapable';
import Battle from '../src/lib/BattleStage';
import Random from '../src/util/Random';

@TestFixture("Simple Battle")
export class SetOfTests {

    @Test("Battle against a potted plant")
    public async asyncTest() {

      const Player = class extends BattleCapable {
        constructor() {
          super("Avarice", {
            health: 42,
            attack: +3,
            defence: +2,
            speed: +0
          });
        }
        async act(stage: Battle) {
          const target = Random.pick(stage.enemies())
          target.decideDamage(10, target.decideHit(Random.roll(20)))
        }
      }

      const PottedPlant = class extends BattleCapable {
        constructor() {
          super('Potted Plant', {
            health: 12,
            attack: +2,
            defence: +0,
            speed: +0
          });
        }
        async act(stage: Battle) {
          const target = Random.pick(stage.enemies())
          target.decideDamage(5, target.decideHit(Random.roll(15)))
        }
      }

      const player = new Player();
      const plant = new PottedPlant();
      const battle = new Battle({
        left: [ player ],
        right: [ plant ]
      })
      await battle.tick() // one round
      Expect(player.stats.health).toBeLessThan(42);
      Expect(plant.stats.health).toBeLessThan(12);
    }
}
