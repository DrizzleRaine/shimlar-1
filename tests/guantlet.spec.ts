import { Test, TestFixture, Expect, Ignore } from "alsatian";
import BattleCapable from '../src/lib/BattleCapable';
import Battle from '../src/lib/BattleStage';
import Random from '../src/util/Random';
import PottedPlant from './entities/PottedPlant';
import Goblin from './entities/TestGoblin';

@TestFixture("Full Battle")
export class SetOfTests {

  @Test("To the death!")
  public async allTheWayTest() {
    const battle = new Battle({
      left: [ new Goblin ],
      right: [ new PottedPlant, new PottedPlant, new PottedPlant ]
    });
    let victors = await battle.getVictors();
    console.log("Victors: " + victors.join(", "))
    console.log(battle.battleLog.join("\n"))
  }
}
