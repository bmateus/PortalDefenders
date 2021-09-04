import { useEffect, useState } from "react";
import { loadingGif } from '../../assets/gifs';
import { convertInlineSVGToBlobURL, customiseSvg, CustomiseOptions} from '../../helpers/aavegotchi';
import Moralis from 'moralis';


// if token id is 0, use a default aavegotchi
export const GotchiSVG = ({ tokenId, numericTraits, equippedWearables }) => {
  
  const [svg, setSvg] = useState("");

  const fetchGotchiSvg = async (numericTraits, equippedWearables) => {
    try {
      const rawSVG = await Moralis.Cloud.run("getAavegotchiSvg", {tokenId: tokenId, numericTraits:numericTraits, equippedWearables:equippedWearables});
      const svgBlob = new Blob([rawSVG], {type:"image/svg+xml;charset=utf-8"});
      const url = URL.createObjectURL(svgBlob);
      setSvg(url);
    }
    catch (error) {
      console.log(error);
    }
  }

  // useEffect(() => {
  //   if (usersAavegotchis && (lazyloadIn === undefined || lazyloadIn)) {
  //     const gotchis = [...usersAavegotchis]
  //     const selectedGotchi = gotchis.find(gotchi => gotchi.id === tokenId);
  //     if (selectedGotchi?.svg) {
  //       setSvg(options ? customiseSvg(selectedGotchi.svg, options, selectedGotchi.equippedWearables) : selectedGotchi.svg);
  //     } else if (provider) {
  //       fetchGotchiSvg(tokenId, !!selectedGotchi, provider);
  //     }
  //   }
  // }, [usersAavegotchis, tokenId, lazyloadIn])

  return (
    <img src={svg ? svg : loadingGif} height="100%" width="100%" />
  )
}