import {
    AptosWalletName,
    MartianWalletName,
    PontemWalletName,
    SpikaWalletName,
    FewchaWalletName,
    HippoExtensionWalletName,
    HippoWalletName,
} from "@manahippo/aptos-wallet-adapter"
import {useWallet as useAptosWallet} from "@manahippo/aptos-wallet-adapter/dist/WalletProviders/useWallet";
import {useRecoilState} from "recoil";
import {addressAtom, modalAtom, nftsAtoms} from "../atoms/atoms";
import {useEffect, useState} from "react";
import {fetchWalletNfts} from "../utils/nftHelper";
import {MaybeHexString} from "aptos";

const WalletSelector = () => {
    const aptosContext = useAptosWallet();
    const [address, setAddress] = useRecoilState(addressAtom);
    const [modal, setModal] = useRecoilState(modalAtom);
    const [nfts, setNfts] = useRecoilState(nftsAtoms);
    const [hidden, setHidden] = useState<string>("hidden");

    const wallets = [
        AptosWalletName,
        MartianWalletName,
        PontemWalletName,
        SpikaWalletName,
        FewchaWalletName,
        HippoExtensionWalletName,
        HippoWalletName,
    ]

    useEffect(() => {
        if (modal.open) {
            setHidden("");
        } else {
            setHidden("hidden");
        }
    }, [modal])

    useEffect(() => {
        (async () => {
            if (aptosContext.connected) {
                aptosContext.account?.address && setAddress(aptosContext.account?.address as string);
                setModal({open: false})
            }
        })()
    }, [aptosContext.connected])

    useEffect(() => {
        (async () => {
            address && setNfts(await fetchWalletNfts(address as MaybeHexString))
        })()
    }, [address])

    useEffect(() => {
        console.log("nfts", nfts)
    }, [nfts])

    return (
        <div>
            <div id="crypto-modal" tabIndex={-1} aria-hidden="true"
                 className={"overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full justify-center items-center " +  hidden}>
                <div className="relative p-4 w-full max-w-md h-full md:h-auto">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <button type="button"
                                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                                data-modal-toggle="crypto-modal">
                            <svg
                                onClick={() => setModal({open: false })}
                                aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd"
                                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                      clipRule="evenodd">
                                </path>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                        <div className="py-4 px-6 rounded-t border-b dark:border-gray-600">
                            <h3 className="text-base font-semibold text-gray-900 lg:text-xl dark:text-white">
                                Connect wallet
                            </h3>
                        </div>
                        <div className="p-6">
                            <p className="text-sm font-normal text-gray-500 dark:text-gray-400">Connect with one of the available wallet providers.</p>
                            <ul className="my-4 space-y-3">
                                {wallets.map((wallet, index) => <li key={index}>
                                    <span
                                        onClick={async () => {
                                            console.log(wallet)
                                            aptosContext.select(wallet);
                                            await aptosContext.connect(wallet.toString())
                                        }}
                                       className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                                        <span className="flex-1 ml-3 whitespace-nowrap">{wallet.toString()} Wallet</span>
                                    </span>
                                    </li>
                                    )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WalletSelector;