import { js as EasyStar } from 'easystarjs';

export class Pathfinder
{
	constructor({map, collisionLayer})
	{
		this.map = map
		this.easystar = new EasyStar();
		var grid = [];
		for(var y = 0; y < map.height; y++){
			var row = [];
			for(var x = 0; x < map.width; x++){
				var tile = collisionLayer.getTileAt(x,y)
				if (!!tile)
					row.push(tile.index);
				else 
					row.push(0)
			}
			grid.push(row);
		}
		this.easystar.setGrid(grid);
		this.easystar.setAcceptableTiles([0]);
		this.easystar.enableDiagonals();
		//easystar.enableCornerCutting();
	}

	pathTo = async (targetGameObject, to) =>
	{
		const toTile = this.map.worldToTileXY(to.x, to.y, true)
		const fromTile = this.map.worldToTileXY(targetGameObject.x, targetGameObject.y, true)
		const easystar = this.easystar
		return new Promise((resolve, reject) => {
			easystar.findPath(fromTile.x, fromTile.y, toTile.x, toTile.y, (path) => {
				if (path === null)
				{
					console.log("path not found!");
				}
				resolve(path);
			})
			easystar.calculate();
		})
	}
}

