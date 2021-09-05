import Moralis from 'moralis';
import { addresses } from '../utils/addresses';

export const getPlayerGotchis = async () =>
{
	console.log("getting player gotchis...")
	const options = {chain:'polygon'/*, address:"0x59480d300ad462d72988e47b42cfcef6db6e2251"*/};
	const nfts = await Moralis.Web3API.account.getNFTs(options);
	//console.log("nfts:", nfts)
	return nfts.result
		.filter((item) => item.token_address === addresses.diamond.toLowerCase())
		.map(x => x.token_id)

	//return ["1234"]
}


export const getGotchiStats = async (tokenId, overrides) => {
	console.log("Fetching Gotchi Stats for", tokenId)
	return await Moralis.Cloud.run("getAavegotchiData", {tokenId: tokenId})
}