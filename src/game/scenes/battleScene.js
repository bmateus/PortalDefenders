import { Enemy } from '../objects/enemy';
import { BaseScene } from './baseScene';

const sceneConfig = {
	active: false,
	visible: false,
	key: 'Battle',
  };

export class BattleScene extends BaseScene 
{
	ROOM_ID = 1
	BASE_SPEED = 90 	// px/sec
	playerInfos = {}
	creepSpawns = []
	crystalSpawns = []

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
		this.load.tilemapTiledJSON('battle_map', 'assets/maps/battle01.json');
		this.load.image('crystal', 'assets/images/alpha.png');

		this.load.svg('lick_idle', 'assets/svg/liquidators/Aavegotchi-Lickquidators-Gaame-Jaam-4-Front.svg')
		this.load.svg('lick_right', 'assets/svg/liquidators/Aavegotchi-Lickquidators-Gaame-Jaam-7-Right.svg')
		this.load.svg('lick_up', 'assets/svg/liquidators/Aavegotchi-Lickquidators-Gaame-Jaam-12-Back.svg')
		this.load.svg('lick_left', 'assets/svg/liquidators/Aavegotchi-Lickquidators-Gaame-Jaam-13-Left.svg')

		this.load.svg('lick_attack_right_1', 'assets/svg/liquidators/Aavegotchi-Lickquidators-Gaame-Jaam-8-Right-Tongue.svg')
		this.load.svg('lick_attack_right_2', 'assets/svg/liquidators/Aavegotchi-Lickquidators-Gaame-Jaam-9-Right-Tongue.svg')
		this.load.svg('lick_attack_right_3', 'assets/svg/liquidators/Aavegotchi-Lickquidators-Gaame-Jaam-10-Right-Tongue.svg')
		this.load.svg('lick_attack_right_4', 'assets/svg/liquidators/Aavegotchi-Lickquidators-Gaame-Jaam-11-Right-Tongue.svg')

		this.load.svg('lick_attack_left_1', 'assets/svg/liquidators/Aavegotchi-Lickquidators-Gaame-Jaam-14-Left-Tongue.svg')
		this.load.svg('lick_attack_left_2', 'assets/svg/liquidators/Aavegotchi-Lickquidators-Gaame-Jaam-15-Left-Tongue.svg')
		this.load.svg('lick_attack_left_3', 'assets/svg/liquidators/Aavegotchi-Lickquidators-Gaame-Jaam-16-Left-Tongue.svg')
		this.load.svg('lick_attack_left_4', 'assets/svg/liquidators/Aavegotchi-Lickquidators-Gaame-Jaam-17-Left-Tongue.svg')

	}

	create = () => {
		
		this.loadBattleMap()

		//set up camera
		this.cameras.main.setZoom(4);
		this.cameras.main.centerOn(0, 0);
		this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
		this.cameras.main.setDeadzone(32, 32)
		this.cameras.main.fadeOut(0x000000, 0)

		//set up world bounds
		this.physics.world.bounds.width = this.map.widthInPixels;
		this.physics.world.bounds.height = this.map.heightInPixels;

		this.events.once('playerSpawned', () => {
			this.cameras.main.fadeIn(0x000000, 2000)
		})

		this.loadPlayers()

		//init input
		this.cursors = this.input.keyboard.createCursorKeys()
		this.initPathfinding()

		this.enemy = new Enemy({scene:this, x:this.playerSpawn.x, y:this.playerSpawn.y})
		this.physics.add.collider(this.enemy, this.wallLayer);

		
	}

	update = async (time, delta) => {

		this.player?.update()

		this.enemy?.update()
	}

	loadBattleMap = () => {

		this.map = this.make.tilemap({key: 'battle_map'});
		const tileSet = this.map.addTilesetImage('raou_dungeon_tileset', 'raou_dungeon_tileset');
		this.baseLayer = this.map.createLayer('Layer01', tileSet, 0, 0);
		
		this.wallLayer = this.map.createLayer('Layer02', tileSet, 0, 0);
		this.wallLayer.setCollisionByExclusion(-1, true);

		const objects = this.map.getObjectLayer('Objects');
		objects.objects.forEach(object => {
			//console.log(object)
			
			if (object.name === 'CreepSpawn')
			{
				this.creepSpawns.push({x:object.x, y:object.y})
			}
			else if (object.name === 'CrystalSpawn')
			{
				this.crystalSpawns.push({x:object.x, y:object.y})
			}
			else if (object.name.startsWith("PortalSpawn"))
			{
				this.playerSpawn = {x:object.x, y:object.y}
				this.add.image(object.x, object.y, "portal")
					.setOrigin(0.5, 1)
					.setScale(0.25)
			}
		});
	}
}