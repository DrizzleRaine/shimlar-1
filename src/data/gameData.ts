// TODO I want to import the json file as default, but it's being a butthead and not recognizing it as a module. So let's just hardcode it here!
// import defaultGameData from './sampleGameData.json';

export default class GameData {
  player: Player;

  private static _instance: GameData;

  private constructor() {
    this.player = new Player();
    this.player.maxHp = 60;
    this.player.currentHp = 60;
    this.player.gold = 42;
  }

  public static Instance(): GameData {
    if (!this._instance) {
      this._instance = new GameData();
    }
    return this._instance;
  }
}

export class Player {
  currentHp: integer;
  maxHp: integer;
  gold: integer;
}