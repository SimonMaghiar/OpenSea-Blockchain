import {useEffect, useMemo, useState} from 'react'
import Header from '../../components/Header'
import { useWeb3 } from '@3rdweb/hooks'
import { ThirdwebSDK } from "@thirdweb-dev/sdk"
import { useRouter } from 'next/router'
import NFTImage from '../../components/nft/NFTImage'
import GeneralDetails from '../../components/nft/GeneralDetails'
import ItemActivity from '../../components/nft/ItemActivity'
import Purchase from '../../components/nft/Purchase'


const style = {
    wrapper: `flex flex-col items-center container-lg text-[#e5e8eb]`,
    container: `container p-6`,
    topContent: `flex`,
    nftImgContainer: `flex-1 mr-4`,
    detailsContainer: `flex-[2] ml-4`,
  }
  

const Nft = () => {

  const { provider } = useWeb3();
  const [selectedNft, setSelectedNft] = useState();
  const [listings, setListings] = useState([]);
  const router = useRouter();

  const nftModule = useMemo(() => {
    if(!provider) return;

    const sdk = new ThirdwebSDK("goerli");
    return sdk.getNFTCollection("0x4e3696ce41fc66F7Fe0c96525Dc26600d3B42189");
  },[provider])

  // get all NFTs in the collection
  useEffect(() => {
    if(!nftModule) return;

    const getNFTs = async () => {
        const nfts = await nftModule.getAll();
        const selectNftArray = nfts.filter((nft) => nft.metadata.id._hex === router.query.nftid)
        setSelectedNft(selectNftArray[0]);
    }
    getNFTs();
  },[nftModule])

  const marketPlaceModule = useMemo(() => {
    if(!provider) return;

    const sdk = new ThirdwebSDK(
        provider.getSigner(),
        'https://eth-goerli.g.alchemy.com/v2/Xe72_GPOjIjQMpp5QIhJ1MRAVJzjvva1'
      );
    return sdk.getMarketplace("0xDAA18f596FD2b364fC698D5eA727a1B3A8fF6519");

  }, [provider])

  useEffect(()=> {
    if(!marketPlaceModule) return;
    const getListings = async () => {

        setListings(await marketPlaceModule.getAllListings());
    }
    getListings();
  },[marketPlaceModule])

  return <div>
        <Header />
        <div className={style.wrapper}>
            <div className={style.container}>
                <div className={style.topContent}>
                    <div className={style.nftImgContainer}>
                        <NFTImage selectedNft={selectedNft} />
                    </div>
                    <div className={style.detailsContainer}>
                        <GeneralDetails selectedNft={selectedNft}/>
                        <Purchase
                        isListed={router.query.isListed}
                        selectedNft={selectedNft}
                        listings={listings}
                        marketPlaceModule={marketPlaceModule}                        
                        />
                    </div>
                </div>
                <ItemActivity/>

            </div>
        </div>
  </div> 
}

export default Nft