import Moralis from 'moralis';
import { addresses } from '../utils/addresses';

export const getPlayerGotchis = async (userId) =>
{
	const options = {chain:'polygon', address:addresses.diamond};
	const nfts = await Moralis.Web3API.account.getNFTs(options);
	return nfts.result
		.filter((item) => item.contract_type === "ERC721")
		.map(x => x.token_id)

	//return ["1234"]
}


export const getGotchiStats = async (tokenId, overrides) => {
	console.log("Fetching Gotchi Stats for", tokenId)
	return await Moralis.Cloud.run("getAavegotchiData", {tokenId: tokenId})
}