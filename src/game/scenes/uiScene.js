import Phaser from 'phaser';
import { getGameWidth, getGameHeight, getRelative } from '../../helpers';

const sceneConfig = {
	active: true,
	visible: true,
	key: 'UIScene',
  };

export class UIScene extends Phaser.Scene {

	constructor() {
		super(sceneConfig)
	}

	preload = () => 
	{
		//this.load.image('fire', process.env.PUBLIC_URL + '/assets/svg/130.svg');
	}

	create = () => {

		//this.createUIButton()

		this.text = this.add.text(
			getGameWidth(this)/2, 
			getGameHeight(this) - 160, 
			'The Great Portal', 
				{
					fontFamily: '32x Pixelate', 
					fill: '#ffffff',
					boundsAlignH: "center",
					boundsAlignV: 'middle'
				}).setScale(4);

		this.text.alpha = 0

		const game = this.scene.get('Game')
		game.events.on('playerSpawned', () => {
			//fade text in and then out
			this.tweens.add({
				targets: this.text,
				alpha: 1,
				ease: 'Quad.easeIn',
				delay: 500,
				duration: 1000,
				yoyo: true,
				repeat: 0,
				hold: 3000
			})
		}, this)
	}

	showMessage(message)
	{
		this.text.text = message
		this.text.alpha = 0
		this.tweens.add({
			targets: this.text,
			alpha: 1,
			ease: 'Quad.easeIn',
			delay: 500,
			duration: 1000,
			yoyo: true,
			repeat: 0,
			hold: 3000
		})
	}

	// createUIButton = () => {
	// 	this.add
	// 	  .image(getRelative(64, this), getRelative(960, this), 'fire')
	// 	  .setOrigin(0)
	// 	  .setInteractive({ useHandCursor: true })
	// 	  .setDisplaySize(getRelative(64, this), getRelative(64, this))
	// 	  .on('pointerdown', () => {
	// 		this.back?.play();
	// 		window.history.back();
	// 	  });
	//   };


}