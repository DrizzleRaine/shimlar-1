import * as Phaser from 'phaser'

export default class BootScene extends Phaser.Scene {

  constructor() {
    super({
      key: 'gameover'
    })
  }

  create() {
    this.add.rectangle(0,0, +this.game.config.width, +this.game.config.height, 0x000).setOrigin(0,0);
    const text = this.add.bitmapText(+this.game.config.width / 2, +this.game.config.height / 2, "script", "GAME OVER")
      .setOrigin(0.5, 0.5);
    setTimeout(_ =>
      this.add.bitmapText((+this.game.config.width / 2)+text.width / 2, +this.game.config.height / 2, "script", "?")
      .setOrigin(0, 0.5)
    , 2000)
  }

}
