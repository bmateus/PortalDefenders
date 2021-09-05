import Phaser from 'phaser';
import { HealthBar } from './healthbar';

export class Crystal extends Phaser.GameObjects.Image 
{
	BASE_HEALTH = 1000

	constructor(scene, x, y)
	{
		super(scene, x, y, 'crystal')
		this.setOrigin(0.5, 1)
		this.setScale(0.4)
		
		this.scene.physics.world.enable(this);
		this.body.setCircle(48)
		this.body.setOffset(30, 100)
		this.body.setImmovable(true)

		this.initHealth();
		this.scene.add.existing(this);
	}

	initHealth(maxHealth) 
	{
		//add health bar
		this.health = this.BASE_HEALTH;
		this.healthbar = new HealthBar(this.scene);
		this.healthbar.setFollowTarget(this);
		this.healthbar.update()
	}

	applyDamage(amount)
	{
		if ( this.health > 0)
		{
			this.health -= amount;
			this.healthbar.setPercentage(this.health / this.BASE_HEALTH)
			if ( this.health <= 0 )
			{
				console.log("crystal died!")
				this.setAlpha(0.5)
				this.healthbar.kill()
				this.scene.cameras.main.shake(500, 0.001)
				this.scene.physics.world.disable(this);
				this.emit("CrystalDeath");
			}
		}
	}

}