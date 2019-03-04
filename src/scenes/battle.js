import Phaser from 'phaser'

export default class BootScene extends Phaser.Scene {

  constructor() {
    super({
      key: 'battle'
    })
  }

  init({player, enemy}) {
    this.player = player || 'N/A'
    this.enemy = enemy || 'enemy'
  }

  create() {
    const textStyle = {
      fill: 'red',
      fontFamily: "Fira Code",
      fontSize: 35
    }

    this.add.text(400, 50, "Battle", textStyle)
      .setOrigin(0.5, 0);

    this.add.text(200, 200, this.player, {
      ...textStyle,
      fill: 'green'
    }).setOrigin(0.5, 0);
    this.add.rectangle(200, 300, 50, 50, 0x00ff00)

    this.add.text(600, 200, this.enemy, textStyle)
      .setOrigin(0.5, 0);
    this.add.triangle(630, 300,
      0, 0, -30, 50, 30, 50,
    0xff0000)
  }
  //
  // update(time, delta) {
  //
  // }

}
