import { BaseScene } from './baseScene';
import Moralis from 'moralis';
import { getPlayerGotchis } from '../fetchData';

const sceneConfig = {
	active: true,
	visible: true,
	key: 'Game',
  };

export class MainScene extends BaseScene {

	ROOM_ID = 0
	BASE_SPEED = 90 	// px/sec
	
	selectedTokenId = 1234; // TODO: get this from aavegotchi context

	playerSpawn = {x:0, y:0}

	portals = []

	//temp to select a random gotchi from player's collection
	selectRandomGotchi = async () => {
		console.log("Selecting Random Gotchi from current user's collection", Moralis.User.current().id)
		const gotchis = await getPlayerGotchis(Moralis.User.current().id)
		if (gotchis.length > 0)
		{
			this.tokenId = gotchis[Math.floor(Math.random() * gotchis.length)]
			console.log("Selected Random Gotchi:", this.tokenId);
		}
		//this.tokenId = "4479" //has bad gotchi sides
	}

	loadMap = () => {

		this.zoneGroup = this.physics.add.group({key:'zones'})

		this.anims.create({
			key: 'idle',
			frames: this.anims.generateFrameNumbers('flame', {start: 0, end: 3}),
			frameRate: 8,
			repeat: -1
		})
	
		this.map = this.make.tilemap({key: 'main_map'});
		const tileSet = this.map.addTilesetImage('raou_dungeon_tileset', 'raou_dungeon_tileset');
		this.baseLayer = this.map.createLayer('Layer01', tileSet, 0, 0);
		
		this.wallLayer = this.map.createLayer('Layer02', tileSet, 0, 0);
		this.wallLayer.setCollisionByExclusion(-1, true);

		this.overlayLayer = this.add.layer()
		this.overlayLayer.add(this.map.createLayer('Layer03', tileSet, 0, 0));
		this.overlayLayer.depth = 100;

		const objects = this.map.getObjectLayer('Objects');
		objects.objects.forEach(object => {
			//console.log(object)
			if (object.name === 'Bartender')
			{
				//create NPC
				const bartender = this.add.image(object.x, object.y, 'bartender')
				.setOrigin(0.5, 0.75)
				.setScale(0.25)
				bartender.depth = 50

				this.tweens.add({
					targets: bartender,
					y: { value: object.y + 4, duration:1000 },
					ease: 'Sine.easeInOut',
					yoyo: true,
					repeat: -1
				})
			}
			else if (object.name === 'Great Portal')
			{
				this.add.image(object.x, object.y, 'portal')
					.setOrigin(0.5, 1)
					.setScale(0.75)
				this.playerSpawn = {x:object.x, y:object.y}
			}
			else if (object.name === 'Flame')
			{
				const flame = this.add.sprite(object.x, object.y, 'flame')
				flame.depth = 120;
				this.anims.play('idle', flame)
				
			}
			else if (object.name.startsWith("Portal"))
			{
				const portalSprite = this.add.image(object.x, object.y, "portal")
					.setOrigin(0.5, 1)
					.setScale(0.25)
				//this.portals.add()

				const zone = this.add.zone(object.x, object.y).setSize(32, 32);
				this.physics.world.enable(zone);
				zone.body.setAllowGravity(false);
				zone.body.moves = false;

				this.zoneGroup.add(zone)

				this.portals.push({sprite:portalSprite, zone:zone})
			}
		});
	}

	///////////////////////////

	constructor() 
	{
		super(sceneConfig)
		console.log("load room", this.ROOM_ID)
	}

	init = () => {
		console.log("init");
  	}

  	preload = () => {
		console.log("preload");
		//this.load.image('bg', 'assets/images/BG.png');
		this.load.image('raou_dungeon_tileset', 'assets/images/raou_dungeon_tileset.png');
		this.load.tilemapTiledJSON('main_map', 'assets/maps/main.json');
		this.load.spritesheet('flame', 'assets/images/spr_fire.png', {frameWidth:32, frameHeight:48})

		this.load.svg('bartender', 'assets/svg/sets/Aavegotchi-Gaame-Jaam-4.svg');
		this.load.svg('portal', 'assets/svg/h1_open.svg');

		this.load.svg('fire', '/assets/svg/130.svg');

		//this.load.audioSprite()
		this.load.audio('sending', 'assets/sounds/sending.mp3')
		this.load.audio('click', 'assets/sounds/click.mp3')
  	}
	
	create = async () => {
		console.log("create");

		console.log("localPlayer:", Moralis.User.current())
		
		// this.music = this.sound.add('assets/sounds/thegreatportal.mp3');
		// this.music.setLoop(true);
		// this.music.play();

		// this.add.image(getGameWidth(this)/2, getGameHeight(this)/2, 'bg')
		// 	.setDisplaySize({width:getGameWidth(this), height:getGameHeight(this)})

		this.loadMap()

		this.playerLayer = this.add.layer();
		this.playerLayer.depth = 50;
		
		this.initPathfinding()

		//this.scale.on('resize', this.resize, this)

		this.cameras.main.setZoom(4);
		this.cameras.main.centerOn(0, 0);
		this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
		this.cameras.main.setDeadzone(32, 32)

		this.physics.world.bounds.width = this.map.widthInPixels;
		this.physics.world.bounds.height = this.map.heightInPixels;

		//this.cameras.resize(800, 600);

		await this.selectRandomGotchi()

		this.events.on('playerSpawned', () => {
			//this.player.initHealth(300) //for testing health bar
		})

		this.input.on('pointerdown', async (pointer) => {
			this.player?.doRangedAttack(pointer.worldX, pointer.worldY)
		})

		await this.loadPlayers()

		//listen for portal spawns
		{
			const query = new Moralis.Query('SpawnPortal');
			const subscription = await query.subscribe();
			subscription.on('create', event =>{
				const ui = this.scene.get('UIScene')
				ui.showMessage("A portal was spawned!")
				console.log("A portal was spawned!", event.get('portal'), event.get('secs'))
			})
		}
	}


	update = async (time, delta) => {

		this.player?.update()

		//check for interactions with portal
		for (let i = 0; i < this.portals.length; ++i)
		{
			const portal = this.portals[i]
			//if (portal.isActive...)
			const zone = portal.zone;

			if ( !!zone.body && !zone.body.touching.none && zone.body.wasTouching.none )
			{
				console.log("touched:", zone.body.touching)
				//teleport to battle
				this.scene.start('Battle');
				break;
			}
		}
	}


	


}
