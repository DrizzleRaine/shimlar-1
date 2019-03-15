import { Test, TestFixture, Expect, Ignore } from "alsatian";
import BattleCapable from '../src/lib/BattleCapable';
import Battle from '../src/lib/BattleStage';
import Random from '../src/util/Random';
import PottedPlant from './entities/PottedPlant';
import Goblin from '../src/entities/Goblin';

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
    await battle.tick() // one turn
    Expect(plant.stats.health).toBeLessThan(oldHP);
  }

  @Test("Battles can be completed.")
  public async allTheWayTest() {
    const battle = new Battle({
      left: [ new Goblin() ],
      right: [ new PottedPlant() ]
    });
    do {
      await battle.tick();
    } while( !battle.hasVictor() )
    Expect(await battle.getVictors()).not.toBeNull();
  }
}
