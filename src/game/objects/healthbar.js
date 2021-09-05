import Phaser from 'phaser';

export class HealthBar
{
	WIDTH = 32
	HEIGHT = 4
	OFFSET_Y = 36

	constructor(scene)
	{	
		this.bar = new Phaser.GameObjects.Graphics(scene)
		this.bar.depth = 200
		this.percentage = 1;
		this.draw();
		scene.add.existing(this.bar);
	}

	kill()
	{
		this.bar.destroy();
	}

	draw()
	{
		this.bar.clear()
		this.bar.fillStyle(0x000000, 1);
		this.bar.fillRect(this.x, this.y, this.WIDTH, this.HEIGHT)

		this.bar.fillStyle(0xffffff, 1);
		this.bar.fillRect(this.x+1, this.y+1, this.WIDTH-2, this.HEIGHT-2)

		if (this.percentage > 0.3)
		{
			this.bar.fillStyle(0x00ff00, 1);
		}
		else
		{
			this.bar.fillStyle(0xff0000, 1);
		}

		const v = Math.floor(this.percentage*(this.WIDTH-2))
		this.bar.fillRect(this.x+1, this.y+1, v, this.HEIGHT-2)
	}

	setPercentage(percentage)
	{
		this.percentage = percentage
		this.draw()
	}

	setFollowTarget(target)
	{
		this.target = target
	}

	update()
	{
		if (!!this.target)
		{
			this.x = this.target.x - (this.WIDTH * 0.5)
			this.y = this.target.y - this.OFFSET_Y;
			this.draw()
		}
	}

}