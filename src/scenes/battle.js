import Phaser from 'phaser'

export default class BootScene extends Phaser.Scene {

  constructor() {
    super({
      key: 'battle'
    })
  }

  init({ player, enemy }) {
    this.player = player || 'N/A';
    this.enemy = enemy || 'enemy';
    this.currentlySelectedMenuItem = 0;
  }

  selectMenuItem(itemSelected) {
    if (itemSelected >= this.menuItems.length) {
      itemSelected = 0;
    } else if (itemSelected < 0) {
      itemSelected = this.menuItems.length - 1;
    }
    this.menuItems[this.currentlySelectedMenuItem].setColor('grey');
    this.menuItems[itemSelected].setColor('white');
    this.currentlySelectedMenuItem = itemSelected;
  }

  create() {
    const textStyle = {
      fill: 'red',
      fontFamily: "Fira Code",
      fontSize: 35
    };

    this.menuAttack = this.add.text(400, 350, "Attack", {
      ...textStyle,
      fill: 'grey',
      fontSize: 28
    }).setOrigin(0.5, 0);

    this.menuDefend = this.add.text(400, 385, "Defend", {
      ...textStyle,
      fill: 'grey',
      fontSize: 28
    }).setOrigin(0.5, 0);

    this.menuRun = this.add.text(400, 420, "Run", {
      ...textStyle,
      fill: 'grey',
      fontSize: 28
    }).setOrigin(0.5, 0);

    this.menuItems = [this.menuAttack, this.menuDefend, this.menuRun];
    this.selectMenuItem(0);

    this.add.text(400, 50, "Battle", {
      ...textStyle,
      fill: 'white'
    }).setOrigin(0.5, 0);

    this.playerText = this.add.text(200, 200, this.player, {
      ...textStyle,
      fill: 'green'
    }).setOrigin(0.5, 0);
    this.add.rectangle(200, 300, 50, 50, 0x00ff00)

    this.add.text(600, 200, this.enemy, textStyle)
      .setOrigin(0.5, 0);
    this.add.triangle(630, 300,
      0, 0, -30, 50, 30, 50,
      0xff0000)

    this.key_up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.key_w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.key_down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.key_s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.key_enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  }

  update(time, delta) {
    if (Phaser.Input.Keyboard.JustDown(this.key_up) || Phaser.Input.Keyboard.JustDown(this.key_w)) {
      this.selectMenuItem(this.currentlySelectedMenuItem - 1);
    }
    if (Phaser.Input.Keyboard.JustDown(this.key_down) || Phaser.Input.Keyboard.JustDown(this.key_s)) {
      this.selectMenuItem(this.currentlySelectedMenuItem + 1);
    }
    if (Phaser.Input.Keyboard.JustDown(this.key_enter)) {
      const menuItemText = this.menuItems[this.currentlySelectedMenuItem].text;
      console.log(menuItemText);
      if (menuItemText === "Run") {
        this.scene.start("boot");
      }
    }

  }

}
