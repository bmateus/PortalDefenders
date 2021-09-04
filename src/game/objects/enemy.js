import Phaser from 'phaser';

export class Enemy extends Phaser.GameObjects.Sprite 
{
	BASE_SPEED = 30

	constructor({ scene, x, y })
	{
		super(scene, x, y)

		this.setScale(0.5)

		this.scene.physics.world.enable(this);

		this.body.setCircle(16)
		this.body.setOffset(42, 70)
		this.body.setFriction(0);
		this.body.setCollideWorldBounds(true);

		this.anims.create({
			key: 'idle',
			frames: [{key: 'lick_idle'}]
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


		this.cursorKeys = scene.input.keyboard.createCursorKeys();

		this.scene.add.existing(this);

	}


	update() {


		this.anims.play('attack_right', true)

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
	}




}

