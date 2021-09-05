import Phaser from 'phaser';

//Phaser.GameObjects.GameObjectFactory.register('')

export class Missile extends Phaser.GameObjects.Image
{
	constructor(scene, x, y)
	{
		super(scene, x, y, 'fire')
		this.scene.physics.world.enable(this);
		this.setScale(0.1)
		this.depth = 200

		this.body.setCircle(48)
		this.body.setOffset(24, 56)
		this.body.setCollideWorldBounds(true);

		scene.physics.add.collider(this, scene.wallLayer, 
			(missile, wall) => {
				this.scene.physics.world.disable(missile);
				const tween = this.scene.tweens.add({
					targets: missile,
					scale: { value:0.2, duration:100 }
				})
				tween.on('complete', () => {missile.destroy()});
			});

		scene.physics.add.collider(this, scene.enemyGroup, 
			(missile, enemy) =>{
				this.scene.physics.world.disable(missile);
				const tween = this.scene.tweens.add({
					targets: missile,
					scale: { value:0.2, duration:100 }
				})
				tween.on('complete', () => {missile.destroy()});
				enemy.applyDamage(missile.damageAmount())
			})

		scene.physics.add.collider(this, scene.crystalGroup, 
			(missile, crystal) =>{
				this.scene.physics.world.disable(missile);
				const tween = this.scene.tweens.add({
					targets: missile,
					scale: { value:0.2, duration:100 }
				})
				tween.on('complete', () => {missile.destroy()});
				crystal.applyDamage(missile.damageAmount())
			})

		this.scene.add.existing(this);

	}

	damageAmount() { return 10 }
}