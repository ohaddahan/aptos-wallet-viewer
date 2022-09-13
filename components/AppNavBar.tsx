import Image from "next/image";
import {useRecoilState} from "recoil";
import {addressAtom, modalAtom, nftsAtoms} from "../atoms/atoms";
import {Case, Default, Switch} from "react-if";
import {useWallet as useAptosWallet} from "@manahippo/aptos-wallet-adapter/dist/WalletProviders/useWallet";
import {shortAddress} from "../utils/helpers";
import InputWallet from "./InputWallet";

const AppNavBar = () => {
    const [_modal, setModal] = useRecoilState(modalAtom);
    const [_nfts, setNfts] = useRecoilState(nftsAtoms);
    const [address, setAddress] = useRecoilState(addressAtom);
    const aptosContext = useAptosWallet();

    return (
        <nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 dark:bg-gray-900 mb-2">
            <div className="container flex flex-wrap justify-between items-center mx-auto">
                <a href={"https://www.chapterx.world/"} target={'_blank'} rel={"noreferrer"}  className="flex items-center">
                    <Image src={"/chapterx-logo.webp"} width={125} height={30} alt={"ChapterX Logo"}/>
                </a>
                <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                    <ul className="flex flex-col p-4 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 dark:border-gray-700">
                        <li>
                            <InputWallet/>
                        </li>
                        <li>
                            <Switch>
                                <Case condition={address !== undefined}>
                                    <button
                                        onClick={async () => {
                                            await aptosContext.disconnect()
                                            setNfts([]);
                                            setAddress(undefined);
                                        }}
                                        className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-white to-black group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                                    >
                                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                    <svg aria-hidden="true" className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                                    </svg>
                                    <span>
                                        {shortAddress(address || "")}
                                    </span>
                                </span>
                                    </button>
                                </Case>
                                <Default>
                                    <button
                                        onClick={() => setModal({ open: true })}
                                        className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-white to-black group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                                    >
                                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                    <svg aria-hidden="true" className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                                    </svg>
                                    Connect wallet
                                </span>
                                    </button>
                                </Default>
                            </Switch>
                        </li>
                        <li>
                            <a href={"https://aptos.dev/"} target={'_blank'} rel={"noreferrer"}  className="flex items-center">
                                <Image src={"/aptos_word_dark.svg"} width={125} height={30} alt={"Aptos Logo"}/>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default AppNavBar;
