import Phaser from 'phaser';
import { HealthBar } from './healthbar';
import { Missile } from './missile';

export class Player extends Phaser.GameObjects.Sprite 
{
	BASE_SPEED = 90 // px/sec
	
	constructor({ scene, playerPosition, key }) {
		super(scene, playerPosition.get('x'), playerPosition.get('y'), key);

		this.playerPosition = playerPosition
		this.lastX = playerPosition.get('x')
		this.lastY = playerPosition.get('y')
		this.facing = playerPosition.get('facing')

		// physics
		this.scene.physics.world.enable(this);
		
		this.setOrigin(0.5, 0.75)
		this.setScale(0.25)
		this.setSize(78, 32)
		
		this.body.setCircle(32)
		this.body.setOffset(42, 70)
		this.body.setFriction(0);
		this.body.setCollideWorldBounds(true);

		this.scene.physics.add.collider(this, this.scene.wallLayer);
		this.scene.physics.add.collider(this, this.scene.crystalGroup);
		
		if ( this.texture.frameTotal > 2) //base and 0
		{
			console.log("adding side anims")

			// Add animations
			this.anims.create({
				key: 'idle',
				frames: this.anims.generateFrameNumbers(key || '', { start: 0, end: 1 }),
				frameRate: 2,
				repeat: -1,
			});

			this.anims.create({
				key: 'left',
				frames: this.anims.generateFrameNumbers(key || '', { frames: [ 2 ]}),
			});

			this.anims.create({
				key: 'right',
				frames: this.anims.generateFrameNumbers(key || '', { frames: [ 4 ]}),
			});

			this.anims.create({
				key: 'up',
				frames: this.anims.generateFrameNumbers(key || '', { frames: [ 6 ]}),
			});
		}
		else
		{
			console.log("doing bad side anim workaround")

			const frames = this.anims.generateFrameNumbers(key || '', { frames: [ 0 ] })
			console.log("frames", frames)

			this.anims.create({
				key: 'idle',
				frames: frames,
			});

			this.anims.create({
				key: 'left',
				frames: frames,
			});

			this.anims.create({
				key: 'right',
				frames: frames
			});

			this.anims.create({
				key: 'up',
				frames: frames
			});
		}

		// input
		this.cursorKeys = scene.input.keyboard.createCursorKeys();

		this.scene.add.existing(this);

	}

	async update() {
		
		const velocity = new Phaser.Math.Vector2(0, 0);
		
		if (this.cursorKeys?.left.isDown)
		{
			velocity.x = -1;
			this.facing = 3;
			
		}
		else if (this.cursorKeys?.right.isDown)
		{
			velocity.x = 1;
			this.facing = 2;
		}

		if (this.cursorKeys?.up.isDown)
		{
			velocity.y = -1;
			this.facing = 1;
		}
		else if (this.cursorKeys?.down.isDown)
		{
			velocity.y = 1;
			this.facing = 0
		}
		
		const normalizedVelocity = velocity.normalize();
		this.body.setVelocity(
			normalizedVelocity.x * this.BASE_SPEED, 
			normalizedVelocity.y * this.BASE_SPEED
		);

		switch(this.facing)
		{
			case 1:
				this.anims.play('up', true);
				break;
			case 2: 
				this.anims.play('right', true);
				break;
			case 3: 
				this.anims.play('left', true);
				break;
			default:
				this.anims.play('idle', true);
				break;
		}

		//decide if we should send a position update
		const lastPos = {x: Math.floor(this.lastX), y: Math.floor(this.lastY)}
		const currPos = {x: Math.floor(this.x), y: Math.floor(this.y)}
		var a = lastPos.x - currPos.x
		var b = lastPos.y - currPos.y
		var dist = Math.sqrt(a*a + b*b)
		if (dist > 16)
		{
			 this.lastX = currPos.x;
			 this.lastY = currPos.y;
			
			 this.playerPosition.set('x', currPos.x)
			 this.playerPosition.set('y', currPos.y)
			 this.playerPosition.set('facing', this.facing)
			 await this.playerPosition.save()
		}

		this.healthbar?.update()

	}

	initHealth(maxHealth) 
	{
		//add health bar
		this.maxHealth = maxHealth;
		this.currentHealth = maxHealth;
		this.healthbar = new HealthBar(this.scene);
		this.healthbar.setFollowTarget(this);
	}

	resetHealth()
	{
		this.currentHealth = this.maxHealth;
		this.healthbar.setPercentage(1)
	}

	applyDamage(damageAmount) 
	{
		if (this.currentHealth > 0)
		{
			this.currentHealth -= damageAmount
			this.healthbar.setPercentage(this.currentHealth / this.maxHealth)
			this.scene.cameras.main.shake(100, 0.001)
			if (this.currentHealth <= 0 )
			{
				console.log("Player Died!!!!")
				this.scene.events.emit("playerDied");
			}
		}
	}

	doRangedAttack(x, y)
	{
		//launch a missile at the target
		console.log("do ranged attack")

		let offsetX = 0
		let offsetY = 0
		switch(this.facing)
		{
			case 0: offsetX = -14; offsetY = -8; break;
			case 1: offsetX = 14; offsetY = -8; break;
			case 2: offsetX = 4; offsetY = -6; break;
			case 3: offsetX = -4; offsetY = -6;break;
			default: break;
		}
		let px = this.x + offsetX;
		let py = this.y + offsetY;
		const missile = new Missile(this.scene, px, py)
		const angle = Phaser.Math.Angle.BetweenPoints({x:this.x, y:this.y}, {x:x, y:y});
		missile.setAngle(-90 + Phaser.Math.RadToDeg(angle));
		this.scene.physics.velocityFromRotation(angle, 150, missile.body.velocity);
		
		
	}

}