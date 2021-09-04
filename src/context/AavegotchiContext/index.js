import React, { createContext, useContext, useState } from "react";

import { addresses } from '../../utils/addresses';
import Moralis from 'moralis';

//todo: fix!

const AavegotchiContext = createContext();

const updateAavegotchis = async (owner) => {
	//get user's aavegotchis using moralis
	console.log("updating aavegotchis")
	const options = {chain:'polygon', address:addresses.diamond};
	const nfts = await Moralis.Web3API.getNFTs(options);
    const erc721 = nfts.filter((item) => item.contract_type === "ERC721");
	console.log("got NFTs:", erc721)
}

const AavegotchiProvider = ({ children }) => {

	const [state, setState] = useState({
		userAavegotchis:[],
		selectedAavegotchiIndex:0
	});

	return (
	  <AavegotchiContext.Provider>
		{children}
	  </AavegotchiContext.Provider>
	);
  };
  
  const useAavegotchi = () => useContext(AavegotchiContext);
  
  export default AavegotchiProvider;

  export { useAavegotchi, updateAavegotchis };