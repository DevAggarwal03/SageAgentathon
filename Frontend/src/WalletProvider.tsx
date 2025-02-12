import '@rainbow-me/rainbowkit/styles.css';
import {
  darkTheme,
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
// import { HardhatNetwork } from './ChainConfig';
import { arbitrum, arbitrumSepolia, hardhat } from 'viem/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import React from 'react';


const config = getDefaultConfig({
  appName: 'Dex',
  projectId: '1',
  chains: [arbitrum, arbitrumSepolia, hardhat],
  ssr: false,
});

const queryClient = new QueryClient();
export const WalletProvider = ({children} : {children : React.ReactNode}) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({borderRadius: 'small',accentColor: '#7b3fe4',overlayBlur: 'small',})}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};