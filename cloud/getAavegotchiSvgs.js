Moralis.Cloud.define("getAavegotchiSvgs", async(request) =>{

	const logger = Moralis.Cloud.getLogger();

	let web3 = Moralis.web3ByChain("polygon");

	const DIAMOND_CONTRACT_ADDRESS = "0x86935F11C86623deC8a25696E1C19a8659CbF95d";

	const DIAMOND_CONTRACT_ABI_FRAGMENT = [
		
		{
			"inputs": [
				{
				"internalType": "uint256",
				"name": "_hauntId",
				"type": "uint256"
				},
				{
				"internalType": "address",
				"name": "_collateralType",
				"type": "address"
				},
				{
				"internalType": "int16[6]",
				"name": "_numericTraits",
				"type": "int16[6]"
				},
				{
				"internalType": "uint16[16]",
				"name": "equippedWearables",
				"type": "uint16[16]"
				}
			],
			"name": "previewAavegotchi",
			"outputs": [
				{
				"internalType": "string",
				"name": "ag_",
				"type": "string"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		//side views
		{
			"inputs": [
			  { "internalType": "uint256", "name": "_hauntId", "type": "uint256" },
			  {
				"internalType": "address",
				"name": "_collateralType",
				"type": "address"
			  },
			  {
				"internalType": "int16[6]",
				"name": "_numericTraits",
				"type": "int16[6]"
			  },
			  {
				"internalType": "uint16[16]",
				"name": "equippedWearables",
				"type": "uint16[16]"
			  }
			],
			"name": "previewSideAavegotchi",
			"outputs": [
			  { "internalType": "string[]", "name": "ag_", "type": "string[]" }
			],
			"stateMutability": "view",
			"type": "function"
		  },
	];

	const contract = new web3.eth.Contract(DIAMOND_CONTRACT_ABI_FRAGMENT, DIAMOND_CONTRACT_ADDRESS);

	let hauntId = request.params.hauntId;
	let collateralType = request.params.collateralType;
	let numericTraits = request.params.numericTraits;
	let equippedWearables = request.params.equippedWearables;

	// const svgFront = await contract.methods.previewAavegotchi(
	// 	hauntId, 
	// 	collateralType, 
	// 	numericTraits, 
	// 	equippedWearables)
	// 	.call()
	// 	.catch((e)=>{logger.error(e)});

	const svgSides = await contract.methods.previewSideAavegotchi(
		hauntId, 
		collateralType, 
		numericTraits, 
		equippedWearables)
		.call()
		.catch((e)=>{logger.error(e)});

	//const svgViews = [svgFront]
	//svgViews.push(...svgSides)

	return svgSides;

})