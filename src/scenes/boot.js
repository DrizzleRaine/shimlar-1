import Phaser from 'phaser'

export default class BootScene extends Phaser.Scene {

  constructor() {
    super({
      key: 'boot'
    })
    this.x = 50
    this.y = 50
  }

  create() {
    console.log("running scene");

    this.me = this.add.circle(100,100,50, 0xff0000)
    this.t = this.add
      .text(400, 300, "My Menu\n\n(play)", {
        align: "center",
        fill: 'red',
        fontFamily: "Fira Code",
        fontSize: 35
      })
    .setOrigin(0.5, 0);

    this.grid = this.add.grid(0, 0,
      800, 600,
      20, 20,
      0x000000, 0,
      0xa1a1a1, 1)
    .setDepth(-1)
    .setOrigin(0,0)

    console.log(JSON.stringify(this.t, null, 2));

    this.input.on(
      "pointerdown",
      function() {
        this.scene.start("play");
      },
      this
    );
  }

  update(time, delta) {
    this.me.x += 10 * (delta / 1000)
    this.t.setText(Math.round(1000/delta))
  }

}
