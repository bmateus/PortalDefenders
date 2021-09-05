import Phaser from 'phaser';
import Moralis from 'moralis';
import { customiseSvg, convertInlineSVGToBlobURL } from '../../utils/aavegotchi';
import { constructSpritesheet } from '../../utils/constructSpritesheet';
import { getGotchiStats } from '../fetchData';
import { Player } from '../objects/player';
import { Pathfinder } from '../pathfinding';

const PlayerPosition = Moralis.Object.extend("PlayerPosition");

export class BaseScene extends Phaser.Scene 
{
	remotePlayers = {}

	loadGotchi = async (userId, tokenId) => {
		
		console.log("Loading gotchi:", tokenId, "for user:", userId)

		const gotchiStats = await getGotchiStats(tokenId)

		const svg = await Moralis.Cloud.run("getAavegotchiSvgs",{
			hauntId:gotchiStats.hauntId,
			collateralType:gotchiStats.collateral,
			numericTraits:gotchiStats.numericTraits,
			equippedWearables:gotchiStats.equippedWearables
		})

		const spriteMatrix = [
			// Front
			[
				customiseSvg(svg[0], { removeBg: true }),
				customiseSvg(svg[0], {
					armsUp: true,
					eyes: "happy",
					float: true,
					removeBg: true,
				}),
			],
			// Left
			[
				customiseSvg(svg[1], { removeBg: true }),
			],
			// Right
			[
				customiseSvg(svg[2], { removeBg: true }),
			],
			// Right
			[
				customiseSvg(svg[3], { removeBg: true }),
			]
		];

		try {
		  const { src, dimensions } = await constructSpritesheet(spriteMatrix);
		  this.load.spritesheet(userId, src, {
			frameWidth: dimensions.width / dimensions.x,
			frameHeight: dimensions.height / dimensions.y,
		  });
		}
		catch(e)
		{
			console.log("constructSpritesheet:", e)
			const blobUrl = convertInlineSVGToBlobURL(customiseSvg(svg[0], { removeBg: true }));
			
			this.load.spritesheet(userId, blobUrl, {
				frameWidth: 150,
				frameHeight: 150,
			  });

		}

		this.load.once(Phaser.Loader.Events.COMPLETE, () =>{
			console.log("loading completed...");
			if ( userId === Moralis.User.current().id )
			{
				console.log("local player done loading");
				this.spawnPlayer()
			}
			else if (!!this.remotePlayers[userId])
			{
				console.log("remote player done loading", userId);
				this.remotePlayers[userId].player = this.add.image(
					this.remotePlayers[userId].x, 
					this.remotePlayers[userId].y, 
					userId)
					.setScale(0.25)
			}
		}, this);

		this.load.start()
	}

	loadPlayers = async () => {
		//load local player; try to reuse existing PlayerPosition
		{
			console.log("Loading gotchi for local player...")
			const localUserId = Moralis.User.current().id;
			const  query = new Moralis.Query('PlayerPosition')
				.equalTo('user_id', localUserId);
			this.playerPosition = await query.first();

			if (!this.playerPosition)
			{
				this.playerPosition = new PlayerPosition();
				this.playerPosition.set('user_id', Moralis.User.current().id)
			}

			this.playerPosition.set("room_id", this.ROOM_ID);
			this.loadGotchi(localUserId, this.tokenId || this.playerPosition.get("token_id"))
		}

		//load other players in the room
		{
			console.log("loading remote players")
			const  query = new Moralis.Query('PlayerPosition')
				.notEqualTo('user_id', Moralis.User.current().id)
				.equalTo('room_id', this.ROOM_ID)
				.lessThan('updatedAt', Date.now() - 60 * 1000)

			const otherPlayers = query.find();
			for (let i = 0; i < otherPlayers.length; i++) {
				const playerInfo = otherPlayers[i];
				const userId = playerInfo.get("user_id")
					this.remotePlayers[userId] = {
						x:playerInfo.get('x'),
						y:playerInfo.get('y'),
						facing:playerInfo.get('facing'),
					}
					console.log("creating remote player:", userId, " with tokenId:", playerInfo.get('token_id'))					
					this.loadGotchi(userId, playerInfo.get('token_id'))
			}
		}

		//set up subscription to new PlayerPosition events
		{
			console.log("subscribing to remote player events")
			const  query = new Moralis.Query('PlayerPosition')
				.notEqualTo("user_id", Moralis.User.current().id)
				.equalTo("room_id", this.ROOM_ID) //only get events for this room
		
			const subscription = await query.subscribe();
			subscription.on('update', event => {
				
				const userId = event.get("user_id")
				
				console.log("got remote event!")
				if (!this.remotePlayers[userId])
				{
					this.remotePlayers[userId] = {
						x:event.get('x'),
						y:event.get('y'),
						facing:event.get('facing'),
					}
					console.log("creating remote player:", userId, " with tokenId:", event.get('token_id'))
					this.loadGotchi(userId, event.get('token_id'))
				}
				else
				{
					this.remotePlayers[userId].x = event.get('x')
					this.remotePlayers[userId].y = event.get('y')
					
					if (!!this.remotePlayers[userId].player)
					{
						var a = event.get('x') - this.remotePlayers[userId].player.x
						var b = event.get('y') - this.remotePlayers[userId].player.y
						var t = (Math.sqrt(a*a+b*b)/this.BASE_SPEED)*1000

						this.tweens.add({
							targets: this.remotePlayers[userId].player,
							x: { value:event.get('x'), duration:t },
							y: { value:event.get('y'), duration:t }
						})
					}
				}
			});
		}
	}

	spawnPlayer = () => {
	
		console.log("spawning player")

		this.player = new Player({
			scene: this,
			playerPosition: this.playerPosition,
			key: Moralis.User.current().id
		  })

		this.player.x = this.playerSpawn.x;
		this.player.y = this.playerSpawn.y;
		this.player.facing = 0;

		this.playerPosition.set('x', this.playerSpawn.x)
		this.playerPosition.set('y', this.playerSpawn.y)
		this.playerPosition.set('facing', 0)
		this.playerPosition.set('token_id', this.tokenId)
		this.playerPosition.set('room_id', this.ROOM_ID)
		this.playerPosition.save()

		this.cameras.main.startFollow(this.player, false, 0.1, 0.1);

		this.physics.add.overlap(this.player, this.zoneGroup)

		this.events.emit('playerSpawned', {room:this.ROOM_ID});
	}

	//pathfinding ///////////////////////////////////////

	//kinda gross... but you dont get stuck when pathing
	moveGameObject = (targetGameObject, path) => {
		// Sets up a list of tweens, one for each tile to walk, that will be chained by the timeline
		var tweens = [];
		for(var i = 0; i < path.length-1; i++){
			var ex = path[i+1].x;
			var ey = path[i+1].y;
			tweens.push({
				targets: targetGameObject,
				x: {value: ex*this.map.tileWidth, duration: 200},
				y: {value: ey*this.map.tileHeight, duration: 200},
			});
		}

		this.tweens.timeline({
			tweens: tweens
		});
	};

	initPathfinding = () => {

		this.pathfinder = new Pathfinder({
			map: this.map,
			collisionLayer: this.wallLayer
		});

		// this.input.on('pointerdown', async (pointer) => {
			
		// 	if (!!this.player )
		// 	{
		// 		//this.sound.play('click') //test sound
		// 		const path = await this.pathfinder.pathTo(this.player, {x:pointer.worldX, y:pointer.worldY})
		// 		if (!!path)
		// 		{
		// 			this.moveGameObject(this.player, path)
		// 		}
		// 	}
		// })
	}


}