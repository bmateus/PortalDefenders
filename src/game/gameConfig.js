import Phaser from 'phaser';
import { MainScene } from './scenes/mainScene'
import { BattleScene } from './scenes/battleScene'
import { UIScene } from './scenes/uiScene'

let width = window.innerWidth;
let height = width / 1.778;

if (height > window.innerHeight) {
	height = window.innerHeight;
	width = height * 1.778;
}

const gameConfig = {
	type: Phaser.AUTO,
	pixelArt: true,
	scale: {
		mode: Phaser.Scale.NONE,
		width,
		height
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y:0 },
			debug: process.env.NODE_ENV === "development",
		}
	},
	fps: {
		target: 60,
	},
	scene: [ MainScene, BattleScene, UIScene ]
}

export default gameConfig