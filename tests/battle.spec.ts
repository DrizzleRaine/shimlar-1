import { Test, TestFixture, Expect, Ignore } from "alsatian";
import BattleCapable from '../src/lib/BattleCapable';
import Battle from '../src/lib/BattleStage';
import Random from '../src/util/Random';
import PottedPlant from './entities/PottedPlant';
import Goblin from './entities/TestGoblin';

@TestFixture("Simple Battle")
export class SetOfTests {

  @Test("Battles have turns.")
  public async basicTest() {
    const battle = new Battle({
      left: [ new Goblin() ],
      right: [ new PottedPlant() ]
    });
    const previousActor = battle.currentActor();
    await battle.tick(); // one turn
    Expect(battle.currentActor()).not.toBe(previousActor);
  }

  @Test("Entities get damaged.")
  public async damageTest() {
    const plant = new PottedPlant();
    const battle = new Battle({
      left: [ new Goblin() ],
      right: [ plant ]
    });
    const oldHP = plant.stats.health;
    await battle.tick(); // one turn
    Expect(plant.stats.health).toBeLessThan(oldHP);
  }

  @Test("Battles can be completed.")
  public async allTheWayTest() {
    const goblin = new Goblin();
    const plant = new PottedPlant();
    const battle = new Battle({
      left: [ goblin ],
      right: [ plant ]
    });
    do {
      await battle.tick();
    } while (!battle.hasVictor());
    let victors = await battle.getVictors();
    Expect(victors).not.toBeNull();
    Expect(victors).toContain(goblin);
    Expect(victors).not.toContain(plant);
  }
}
