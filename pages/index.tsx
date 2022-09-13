import type { NextPage } from "next";
import { useWallet as useAptosWallet } from "@manahippo/aptos-wallet-adapter";
import AppNavBar from "../components/AppNavBar";
import WalletSelector from "../components/WalletSelector";
import {useEffect} from "react";
import {useRecoilValue} from "recoil";
import {nftsAtoms} from "../atoms/atoms";
import NftCard from "../components/NftCard";

const Home: NextPage = () => {
    const aptosContext = useAptosWallet();
    const nfts  = useRecoilValue(nftsAtoms);

    useEffect(() => {
        console.log("connected", aptosContext.connected);
        console.log("account", aptosContext.account);
    }, [aptosContext.connected]);

    return (
        <div className={"bg-gray-800"}>
            <AppNavBar/>
            <div className="container mx-auto">
                <WalletSelector/>
                <div className={"flex"}>
                    {nfts.map((nft, index) => <div key={index} className={"sm:w-1/2 md:w-1/3 lg:w-1/4"}>
                            <NftCard token={nft}/>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
