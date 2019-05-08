import * as Phaser from 'phaser'

import bootScene from './scenes/boot'
import battleScene from './scenes/battle'
import gameOverScene from './scenes/gameOver'
import statusScreen from './scenes/statusScreen'

function newGame () {
  if (game) return;
  game = new Phaser.Game({
    width: 240,
    height: 160,
    fps: {
      target: 30
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      // zoom: Phaser.Scale.ZOOM_2X
    },
    render: {
      pixelArt: true,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    title: 'Phaser 3 with Parcel 📦',
    url: 'https://github.com/samme/phaser-parcel',
    scene: [bootScene, battleScene, gameOverScene, statusScreen]
  });
}

function destroyGame () {
  if (!game) return;
  game.destroy(true);
  game.runDestroy(); // shouldn't need to be called, but does?
  game = null;
}

let game: Phaser.Game;

if (module.hot) {
  module.hot.dispose(destroyGame);
  module.hot.accept(newGame);
}

if (!game) newGame();
