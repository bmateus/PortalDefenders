import Phaser from 'phaser';
import { HealthBar } from './healthbar';

export class Enemy extends Phaser.Physics.Arcade.Sprite 
{
	BASE_SPEED = 30
	BASE_HEALTH = 100
	BASE_ATTACK = 30

	constructor({ scene, x, y })
	{
		super(scene, x, y)
		this.setScale(0.5)

		this.scene.physics.world.enable(this);
		this.body.setCircle(24)
		this.body.setOffset(50, 64)
		this.body.setFriction(0);
		this.body.setCollideWorldBounds(true);

		this.anims.create({
			key: 'idle',
			frames: [
				{key: 'lick_idle_0'},
				{key: 'lick_idle_1'},
				{key: 'lick_idle_2'},
				{key: 'lick_idle_3'}
			],
			frameRate: 2,
			repeat:-1
		});

		this.anims.create({
			key: 'left',
			frames: [{key: 'lick_left'}]
		});

		this.anims.create({
			key: 'right',
			frames: [{key: 'lick_right'}]
		});

		this.anims.create({
			key: 'up',
			frames: [{key: 'lick_up'}]
		});

		this.anims.create({
			key: 'attack_left',
			frames: [
				{key: 'lick_attack_left_1'},
				{key: 'lick_attack_left_2'},
				{key: 'lick_attack_left_3'},
				{key: 'lick_attack_left_4'},
			]
		})

		this.anims.create({
			key: 'attack_right',
			frames: [
				{key: 'lick_attack_right_1'},
				{key: 'lick_attack_right_2'},
				{key: 'lick_attack_right_3'},
				{key: 'lick_attack_right_4'},
			]
		})

		scene.physics.add.collider(this, scene.crystalGroup, 
			(enemy, crystal) =>{
				crystal.applyDamage(this.BASE_ATTACK)
				enemy.destroy()
			})
		
		scene.physics.add.collider(this, scene.enemyGroup)

		scene.physics.add.collider(this, scene.player, (enemy, player) =>{
			player.applyDamage(2)
		})

		this.initHealth();
		this.doSuperSmartAI();

		this.anims.play("idle")

		this.scene.add.existing(this);
	}

	async doSuperSmartAI()
	{
		//get a target
		if (!this.target)
		{
			//choose targets that have health remaining
			this.target = this.scene.crystals[Phaser.Math.Between(0, this.scene.crystals.length-1)]
			const path = await this.scene.pathfinder.pathTo(this, this.target);
			if (!!path)
			{
				var tweens = [];
				for(var i = 0; i < path.length-1; i++){
					var ex = path[i+1].x;
					var ey = path[i+1].y;
					tweens.push({
						targets: this,
						x: {value: ex*this.scene.map.tileWidth, duration: 800},
						y: {value: ey*this.scene.map.tileHeight, duration: 800},
					});
				}
		
				this.scene.tweens.timeline({
					tweens: tweens
				});
			}
		}
	}

	applyDamage(amount)
	{
		this.health -= amount;
		this.healthbar.setPercentage(this.health / this.BASE_HEALTH)
		if ( this.health <= 0 )
		{
			console.log("enemy died!")
			this.emit("EnemyDeath");
			this.destroy()
		}
	}

	update()
	{
		this.healthbar?.update()
	}

	initHealth() 
	{
		//add health bar
		this.health = this.BASE_HEALTH;
		this.healthbar = new HealthBar(this.scene);
		this.healthbar.setFollowTarget(this);
	}
}

