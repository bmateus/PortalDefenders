import React, { useState, useEffect } from 'react'
import { useMoralis } from 'react-moralis';
import { IonPhaser } from '@ion-phaser/react';

//import diamondABI from '../abi/diamondABI.json'
//import { addresses } from '../utils/addresses'

import gameConfig from './gameConfig'

function Main() {

	const [initialize, setInitialize] = useState(false);
	const { isAuthenticated, 
		//web3, enableWeb3, isWeb3Enabled, isWeb3EnableLoading 
	} = useMoralis();

	//const contract = new web3.eth.Contract(diamondABI, addresses.diamond);

	useEffect(() => {
		if (isAuthenticated)
		{
		  setInitialize(true)
		}
	  }, [isAuthenticated])
	  

	// useEffect(()=>{

	// 	const test = async () => {

	// 		const aavegotchiData = await contract.methods.getAavegotchi(1234).call();
	
	// 		console.log(aavegotchiData.hauntId)
	// 		console.log(aavegotchiData.collateral)
	// 		console.log(aavegotchiData.equippedWearables)
	// 		console.log(aavegotchiData.numericTraits)
	// 	}

	// 	if (!isWeb3EnableLoading)
	// 	{
	// 		if (isWeb3Enabled)
	// 		{
	// 			console.log("testing...");
	// 			test()
	// 		}
	// 		else
	// 		{
	// 			enableWeb3()
	// 		}
	// 	}

	// },[isWeb3Enabled, isWeb3EnableLoading, enableWeb3])

	//console.log("isAuthenticated?", isAuthenticated)
	//console.log("initialized?", initialize)

	if (!isAuthenticated) {
	  return null;
	}

	return <IonPhaser game={gameConfig} initialize={initialize} id="phaser-app" />;

}

export default Main
