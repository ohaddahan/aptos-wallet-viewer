import "../styles/globals.css";
import type { AppProps } from "next/app";


import {
  AptosWalletAdapter,
  MartianWalletAdapter,
  PontemWalletAdapter,
  SpikaWalletAdapter,
  FewchaWalletAdapter,
  HippoExtensionWalletAdapter,
  HippoWalletAdapter,
  WalletProvider as AptosWalletProvider,
} from "@manahippo/aptos-wallet-adapter";


import {RecoilRoot} from "recoil";


function MyApp({ Component, pageProps }: AppProps) {

  const aptosWallets = [
    new AptosWalletAdapter(),
    new PontemWalletAdapter(),
    new MartianWalletAdapter(),
    new SpikaWalletAdapter(),
    new FewchaWalletAdapter(),
    new HippoExtensionWalletAdapter(),
    new HippoWalletAdapter()
  ];

  return <div>
    <RecoilRoot>
      <AptosWalletProvider
          wallets={aptosWallets}
          onError={(error: Error) => {
            console.log("Handle Error Message", error);
          }}
      >
        <div className="bg-gray-800 flex flex-col h-screen">
          <Component {...pageProps} />
        </div>
      </AptosWalletProvider>
    </RecoilRoot>
  </div>
}

export default MyApp;
