import defaultGameData from './sampleGameData.json';

export default class GameData {
  player: Player;

  private static _instance: GameData;

  private constructor() {
    this.player = new Player();
    Object.assign(this.player, defaultGameData.playerData)
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