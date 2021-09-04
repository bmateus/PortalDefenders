Moralis.Cloud.job("spawnPortal", (request)=>{

	const SpawnPortal = Moralis.Object.extend("SpawnPortal")
	const spawnPortal = new SpawnPortal({portal:1, secs:30})
	spawnPortal.save()
		
})