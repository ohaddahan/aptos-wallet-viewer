import type { NextPage } from "next";
import { useWallet as useAptosWallet } from "@manahippo/aptos-wallet-adapter";
import AppNavBar from "../components/AppNavBar";
import InputWallet from "../components/InputWallet";
import WalletSelector from "../components/WalletSelector";
import {useEffect} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
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
                <InputWallet/>
                {nfts.map((nft, index) => <div key={index}>
                        <NftCard token={nft}/>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
